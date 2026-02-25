import { CheckCircle, Download, RefreshCw, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StepSuccess({ downloadUrl, onRestart }) {
  return (
    <div className="flex-grow w-full flex flex-col items-center justify-center p-8 md:p-12 text-center">
      
      {/* Animated Glowing Icon */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-green-400 blur-[30px] opacity-20 rounded-full"></div>
        <div className="bg-gradient-to-br from-green-100 to-green-50 text-green-600 p-5 rounded-[2rem] shadow-sm relative z-10 border border-green-100">
          <CheckCircle size={56} strokeWidth={2} />
        </div>
      </motion.div>
      
      {/* Heading Text */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-4xl font-extrabold text-blue-950 mb-4 tracking-tight">
          Success! It's Ready.
        </h2>
        <p className="text-blue-900/60 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Your new resume is perfectly aligned with the job description and packed with top ATS keywords.
        </p>
      </motion.div>

      {/* Action Area */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm flex flex-col gap-4"
      >
        {/* Sleek File Info Badge */}
        <div className="flex items-center p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 group hover:border-blue-200 transition-colors text-left">
          <div className="bg-white text-blue-600 p-3 rounded-xl mr-4 shadow-sm border border-blue-50 flex-shrink-0">
            <FileText size={28} strokeWidth={1.5} />
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-blue-950 truncate text-lg">Tailored_Resume.docx</p>
            <p className="text-sm text-blue-500 font-medium flex items-center mt-0.5">
              <Sparkles size={14} className="mr-1.5" /> ATS Optimized
            </p>
          </div>
        </div>

        {/* Premium Download Button */}
        <a 
          href={downloadUrl} 
          download="Tailored_Resume.docx"
          className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-lg rounded-2xl shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_8px_40px_rgb(59,130,246,0.4)] hover:-translate-y-1 transition-all duration-300 w-full"
        >
          <Download size={22} className="mr-2" /> 
          Download Resume
        </a>
        
        {/* Ghost Restart Button */}
        <button 
          onClick={onRestart}
          className="flex items-center justify-center px-8 py-3.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-bold rounded-2xl transition-all duration-300 w-full mt-2"
        >
          <RefreshCw size={18} className="mr-2" /> 
          Tailor Another Job
        </button>
      </motion.div>

    </div>
  );
}