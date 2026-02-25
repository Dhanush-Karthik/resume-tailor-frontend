import { FileUp, PenTool, ChevronRight, ShieldCheck, Target, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StepWelcome({ onNext }) {
  return (
    <div className="flex-1 w-full flex flex-col p-6 sm:p-10">
      
      {/* 1. Value Proposition Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-8 sm:mb-10 max-w-xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Sparkles size={14} /> Stop Sending Generic Resumes
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-black text-blue-950 mb-4 tracking-tight leading-[1.1]">
            Tailor your resume for <span className="text-blue-600">any job</span> in 30 seconds.
          </h2>
          
          <p className="text-blue-900/60 text-base sm:text-lg leading-relaxed">
            Upload your base CV and a job link. Our AI re-engineers your experience to match the JD perfectly and pass the ATS.
          </p>
        </div>

        {/* 2. Main Interaction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl">
          <button
            onClick={onNext}
            className="group relative flex flex-row md:flex-col items-center md:items-start p-6 bg-white border-2 border-blue-100 rounded-2xl text-left hover:border-blue-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="bg-blue-600 text-white p-3 rounded-xl mr-4 md:mr-0 md:mb-6 shadow-lg shadow-blue-200">
              <FileUp size={24} className="md:w-7 md:h-7" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-950 text-lg sm:text-xl mb-1">Start with PDF</h3>
              <p className="text-slate-500 text-sm leading-snug">
                I have a resume, just tailor it for a new job.
              </p>
            </div>
            <ChevronRight className="md:hidden text-blue-400 group-hover:text-blue-600 transition-colors" />
          </button>

          <button
            className="group relative flex flex-row md:flex-col items-center md:items-start p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-left opacity-60 cursor-not-allowed"
          >
            <div className="absolute top-3 right-3 bg-slate-200 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
              Dev Mode
            </div>
            <div className="bg-slate-200 text-slate-400 p-3 rounded-xl mr-4 md:mr-0 md:mb-6">
              <PenTool size={24} className="md:w-7 md:h-7" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-600 text-lg sm:text-xl mb-1">Manual Input</h3>
              <p className="text-slate-400 text-sm leading-snug">
                I don't have a resume yet, help me build one.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. The "How it Works" Footer (Integrated) */}
      <div className="mt-10 pt-8 border-t border-blue-50/50">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 sm:flex-col sm:text-center">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
              1
            </div>
            <div>
              <p className="font-bold text-blue-950 text-xs uppercase tracking-tight">Scrape JD</p>
              <p className="text-[10px] text-slate-400 uppercase font-medium">Automatic keyword extraction</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:flex-col sm:text-center">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
              2
            </div>
            <div>
              <p className="font-bold text-blue-950 text-xs uppercase tracking-tight">AI Rewriting</p>
              <p className="text-[10px] text-slate-400 uppercase font-medium">Gemini-powered alignment</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:flex-col sm:text-center">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
              3
            </div>
            <div>
              <p className="font-bold text-blue-950 text-xs uppercase tracking-tight">ATS Export</p>
              <p className="text-[10px] text-slate-400 uppercase font-medium">Clean .DOCX ready for upload</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}