import { FileUp, PenTool, ChevronRight } from 'lucide-react';

export default function StepWelcome({ onNext }) {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-10 text-center">
      <h2 className="text-3xl font-bold text-blue-950 mb-3">Let's Get Started</h2>
      <p className="text-blue-900/70 mb-10 text-lg max-w-md leading-relaxed">
        Choose how you want to provide your base resume information.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button
          onClick={onNext}
          className="group relative flex flex-col items-start p-8 bg-white border-2 border-blue-100 rounded-2xl text-left hover:border-blue-500 hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300"
        >
          <div className="bg-blue-50 text-blue-600 p-4 rounded-xl mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shadow-sm">
            <FileUp size={32} strokeWidth={1.5} />
          </div>
          <h3 className="font-bold text-blue-950 text-xl mb-2">Upload PDF</h3>
          <p className="text-slate-500 text-base leading-relaxed">
            Quickly tailor an existing resume. We'll extract the content for you.
          </p>
          <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
            <span>Select</span> <ChevronRight size={20} className="ml-1" />
          </div>
        </button>

        <button
          onClick={() => alert("The guided manual builder is coming in V2! Let's use the PDF upload for now.")}
          className="group relative flex flex-col items-start p-8 bg-slate-50 border-2 border-slate-100 rounded-2xl text-left overflow-hidden cursor-not-allowed opacity-80"
        >
          <div className="absolute top-4 right-4 bg-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full">
            Coming Soon
          </div>
          <div className="bg-slate-200 text-slate-500 p-4 rounded-xl mb-6">
            <PenTool size={32} strokeWidth={1.5} />
          </div>
          <h3 className="font-bold text-slate-800 text-xl mb-2">Build Manually</h3>
          <p className="text-slate-500 text-base leading-relaxed">
            Start from scratch with our guided, step-by-step resume builder form.
          </p>
        </button>
      </div>
    </div>
  );
}