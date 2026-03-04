import React, { useState, ChangeEvent, useRef } from "react";
import { motion } from "motion/react";
import { SAMPLE_DATA } from "../data/sampleData";
import { Spinner } from "./Spinner";
import { FileText, Briefcase, ChevronDown, Sparkles, Upload } from "lucide-react";
import { parseFile } from "../lib/fileParser";

interface InputSectionProps {
  onAnalyze: (resume: string, jd: string) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [selectedSample, setSelectedSample] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isParsingJd, setIsParsingJd] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jdFileInputRef = useRef<HTMLInputElement>(null);

  const handleSampleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const sample = SAMPLE_DATA.find((s) => s.label === e.target.value);
    if (sample) {
      setResume(sample.resume);
      setJd(sample.jd);
      setSelectedSample(sample.label);
    } else {
      setResume("");
      setJd("");
      setSelectedSample("");
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      const text = await parseFile(file);
      setResume(text);
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Failed to read file. Please try again or paste the content manually.");
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleJdFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingJd(true);
    try {
      const text = await parseFile(file);
      setJd(text);
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Failed to read file. Please try again or paste the content manually.");
    } finally {
      setIsParsingJd(false);
      if (jdFileInputRef.current) {
        jdFileInputRef.current.value = "";
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto p-6 md:p-10"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Start Analysis</h2>
            <p className="text-sm text-slate-500">Upload details to get instant feedback</p>
          </div>
          
          <div className="relative group">
            <select
              value={selectedSample}
              onChange={handleSampleChange}
              className="appearance-none bg-white border border-indigo-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors"
            >
              <option value="">Load Sample Data...</option>
              {SAMPLE_DATA.map((sample) => (
                <option key={sample.label} value={sample.label}>
                  {sample.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none w-4 h-4" />
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resume Input */}
          <div className="space-y-3 relative">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                <FileText className="w-4 h-4 text-indigo-500" />
                Student Resume
              </label>
              <div className="flex items-center gap-3">
                {isParsing && (
                  <span className="text-xs font-medium text-indigo-600 animate-pulse flex items-center gap-1.5">
                    <Spinner className="w-3 h-3" />
                    Reading resume...
                  </span>
                )}
                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.docx,.txt,.md"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isParsing}
                    className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="w-3 h-3" />
                    Upload File
                  </button>
                </div>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste resume content here or upload a file..."
                className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm text-slate-700 placeholder:text-slate-400 font-mono leading-relaxed"
              />
              {isParsing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10 border border-indigo-100">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-white rounded-full shadow-lg shadow-indigo-100">
                      <Spinner className="text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-indigo-600 animate-pulse">Reading file...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* JD Input */}
          <div className="space-y-3 relative">
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                <Briefcase className="w-4 h-4 text-emerald-500" />
                Job Description
              </label>
              <div className="flex items-center gap-3">
                {isParsingJd && (
                  <span className="text-xs font-medium text-emerald-600 animate-pulse flex items-center gap-1.5">
                    <Spinner className="w-3 h-3" />
                    Reading job description...
                  </span>
                )}
                <div className="relative">
                  <input
                    type="file"
                    ref={jdFileInputRef}
                    onChange={handleJdFileUpload}
                    accept=".pdf,.docx,.txt,.md"
                    className="hidden"
                  />
                  <button
                    onClick={() => jdFileInputRef.current?.click()}
                    disabled={isParsingJd}
                    className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="w-3 h-3" />
                    Upload File
                  </button>
                </div>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste job description here or upload a file..."
                className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-sm text-slate-700 placeholder:text-slate-400 font-mono leading-relaxed"
              />
              {isParsingJd && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10 border border-emerald-100">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-white rounded-full shadow-lg shadow-emerald-100">
                      <Spinner className="text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-emerald-600 animate-pulse">Reading file...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnalyze(resume, jd)}
            disabled={isLoading || !resume.trim() || !jd.trim()}
            className={`
              relative overflow-hidden px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/30 flex items-center gap-3 transition-all
              ${isLoading || !resume.trim() || !jd.trim() ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-indigo-500/50'}
            `}
          >
            {isLoading ? (
              <>
                <Spinner />
                <span>Processing Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze Match</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
