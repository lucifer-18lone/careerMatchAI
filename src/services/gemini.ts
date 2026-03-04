import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeMatch(resumeText: string, jobDescription: string): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze the following Resume and Job Description to determine the fit.
    
    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
    
    Provide a detailed analysis in JSON format with the following structure:
    - matchScore: A number between 0 and 100 representing the match percentage.
    - readinessLevel: A string indicating readiness (e.g., "High", "Medium", "Low").
    - missingSkills: An array of objects with "skill" (string) and "priority" ("High", "Medium", "Low").
    - skillCoverage: An array of objects representing skill categories (e.g., "Technical", "Soft Skills", "Experience", "Education", "Tools"). Each object should have "category" (string), "studentScore" (0-100 based on resume), and "requiredScore" (usually 100 or based on JD importance).
    - roadmap: An array of strings representing a step-by-step guide to improve the match.
    - summary: A brief summary of the analysis (max 2 sentences).
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER },
            readinessLevel: { type: Type.STRING },
            missingSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                },
                required: ["skill", "priority"],
              },
            },
            skillCoverage: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  studentScore: { type: Type.NUMBER },
                  requiredScore: { type: Type.NUMBER },
                },
                required: ["category", "studentScore", "requiredScore"],
              },
            },
            roadmap: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            summary: { type: Type.STRING },
          },
          required: ["matchScore", "readinessLevel", "missingSkills", "skillCoverage", "roadmap", "summary"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini API");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing match:", error);
    throw error;
  }
}
