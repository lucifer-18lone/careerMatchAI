import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set worker source for PDF.js
// Using unpkg with .mjs extension which is required for newer versions of pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export async function parseFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return parsePdf(file);
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    fileName.endsWith('.docx')
  ) {
    return parseDocx(file);
  } else if (fileType.startsWith('text/') || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
    return parseText(file);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
  }
}

async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    text += strings.join(' ') + '\n';
  }

  return text;
}

async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

function parseText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string || '');
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}
