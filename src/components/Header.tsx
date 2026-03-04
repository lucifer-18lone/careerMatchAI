import { motion } from "motion/react";
import { Briefcase, GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/30">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">CareerMatch AI</h1>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Student Career Success Platform</p>
        </div>
      </motion.div>
      
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          System Online
        </div>
      </div>
    </header>
  );
}
