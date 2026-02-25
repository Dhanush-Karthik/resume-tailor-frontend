import { Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StepLoading() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
      <div className="relative z-10 p-8 rounded-3xl">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="text-blue-600 mb-6 inline-block p-5 bg-blue-50 rounded-full shadow-inner"
        >
          <Loader2 size={48} strokeWidth={2.5} />
        </motion.div>
        
        <h2 className="text-3xl font-extrabold text-blue-950 mb-3 tracking-tight">
          Crafting Your Resume
        </h2>
        <p className="text-blue-900/70 text-lg max-w-md mx-auto leading-relaxed mb-8">
          Our AI is analyzing the job description, aligning your skills, and formatting a perfect ATS-friendly document.
        </p>
        
        <div className="flex justify-center items-center space-x-3">
          <Sparkles size={18} className="text-blue-400 animate-pulse" />
          <span className="text-blue-600 font-bold">This may take 15-30 seconds...</span>
          <Sparkles size={18} className="text-blue-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}