import { Link, ArrowLeft, Zap, AlertCircle } from 'lucide-react';

export default function StepJD({ onBack, jdUrl, setJdUrl, onSubmit, error }) {
  return (
    <div className="flex-1 w-full flex flex-col p-10">
      <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-950 mb-3">Target Job Description</h2>
          <p className="text-blue-900/70 text-lg leading-relaxed">
            Paste the URL of the job you're applying for. We'll analyze it to tailor your resume perfectly.
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300 group-focus-within:text-blue-600 transition-colors">
              <Link size={22} />
            </div>
            <input
              type="url"
              value={jdUrl}
              onChange={(e) => setJdUrl(e.target.value)}
              placeholder="https://www.linkedin.com/jobs/view/..."
              className="w-full pl-12 pr-4 py-4 border-2 border-blue-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-blue-950 font-medium bg-white text-lg placeholder:text-blue-200 shadow-sm"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-start p-5 bg-red-50 text-red-700 rounded-2xl text-sm border border-red-100">
              <AlertCircle size={20} className="mr-3 flex-shrink-0 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto pt-8 border-t border-blue-50">
        <button onClick={onBack} className="flex items-center text-blue-900/60 hover:text-blue-900 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all">
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!jdUrl}
          className={`flex items-center px-8 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg ${
            jdUrl ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:shadow-blue-500/25 hover:-translate-y-0.5' : 'bg-slate-300 cursor-not-allowed opacity-70 shadow-none'
          }`}
        >
          <Zap size={20} className="mr-2 fill-current" /> Generate Resume
        </button>
      </div>
    </div>
  );
}