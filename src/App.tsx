import { useState } from "react";
import { Header } from "./components/Header";
import { InputSection } from "./components/InputSection";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { analyzeMatch } from "./services/gemini";
import { AnalysisResult } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle } from "lucide-react";

export default function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (resume: string, jd: string) => {
    if (!resume.trim() || !jd.trim()) {
      setError("Please provide both a resume and a job description.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeMatch(resume, jd);
      setResult(data);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze. Please try again or check your input.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-3 shadow-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-rose-400 hover:text-rose-600"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          {!result ? (
            <InputSection key="input" onAnalyze={handleAnalyze} isLoading={isLoading} />
          ) : (
            <ResultsDashboard key="results" result={result} onReset={handleReset} />
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 mt-12 bg-white">
        <p>© {new Date().getFullYear()} CareerMatch AI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
}
