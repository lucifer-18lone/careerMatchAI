import React from 'react';
import { motion } from "motion/react";
import { AnalysisResult } from "../types";
import { RadarChartComponent } from "./RadarChartComponent";
import { CheckCircle, AlertTriangle, XCircle, ArrowRight, BookOpen, Target, BarChart2, ListChecks } from "lucide-react";
import { cn } from "../lib/utils";

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onReset }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      
      {/* Navigation / Actions */}
      <div className="flex justify-between items-center">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          New Analysis
        </motion.button>
        <div className="text-sm text-slate-400">Analysis generated just now</div>
      </div>

      {/* Top Summary Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Match Score Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${result.matchScore}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={cn("h-full", getProgressColor(result.matchScore))}
            />
          </div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Match Score</h3>
          <div className="flex items-baseline">
            <span className={cn("text-6xl font-bold tracking-tighter", getScoreColor(result.matchScore).split(" ")[0])}>
              {result.matchScore}
            </span>
            <span className="text-2xl text-slate-400 font-medium">%</span>
          </div>
          <p className="text-sm text-slate-400 mt-2 text-center px-4">{result.summary}</p>
        </div>

        {/* Readiness Level Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Readiness Level</h3>
          <div className={cn(
            "px-6 py-3 rounded-full text-xl font-bold border-2 flex items-center gap-2",
            result.readinessLevel === "High" ? "border-emerald-200 text-emerald-700 bg-emerald-50" :
            result.readinessLevel === "Medium" ? "border-amber-200 text-amber-700 bg-amber-50" :
            "border-rose-200 text-rose-700 bg-rose-50"
          )}>
            {result.readinessLevel === "High" && <CheckCircle className="w-6 h-6" />}
            {result.readinessLevel === "Medium" && <AlertTriangle className="w-6 h-6" />}
            {result.readinessLevel === "Low" && <XCircle className="w-6 h-6" />}
            {result.readinessLevel}
          </div>
        </div>

        {/* Quick Stats / Radar Chart Preview */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col">
           <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
             <BarChart2 className="w-4 h-4" /> Skill Coverage
           </h3>
           <div className="flex-1 min-h-[150px]">
             <RadarChartComponent data={result.skillCoverage} className="w-full h-[200px]" />
           </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Missing Skills & Roadmap */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Missing Skills */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-slate-800">Gap Analysis</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                {result.missingSkills.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2 shadow-sm",
                      item.priority === "High" ? "bg-rose-50 text-rose-700 border-rose-200" :
                      item.priority === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-slate-50 text-slate-600 border-slate-200"
                    )}
                  >
                    {item.priority === "High" && <AlertTriangle className="w-3 h-3" />}
                    {item.skill}
                  </motion.div>
                ))}
                {result.missingSkills.length === 0 && (
                  <div className="text-emerald-600 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>No critical skills missing! Great job.</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Roadmap */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-800">Recommended Roadmap</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {result.roadmap.map((step, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">
                      {index + 1}
                    </div>
                    <div className="pt-1">
                      <p className="text-slate-700 leading-relaxed">{step}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Detailed Chart & Tips */}
        <div className="space-y-8">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
           >
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
               <BookOpen className="w-5 h-5 text-emerald-500" />
               <h3 className="font-bold text-slate-800">Detailed Coverage</h3>
             </div>
             <div className="p-6">
                <RadarChartComponent data={result.skillCoverage} />
                <div className="mt-4 text-xs text-slate-400 text-center">
                  Comparison of your profile vs. job requirements across key categories.
                </div>
             </div>
           </motion.div>
           
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20">
             <h4 className="font-bold text-lg mb-2">Pro Tip</h4>
             <p className="text-indigo-100 text-sm leading-relaxed">
               Tailoring your resume keywords to match the job description can increase your ATS score by up to 40%. Focus on the "High Priority" missing skills first.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
}
