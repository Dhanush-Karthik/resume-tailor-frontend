import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, UploadCloud, X, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function StepUpload({ onNext, onBack, setFile, file }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) setFile(acceptedFiles[0]);
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1
  });

  return (
    <div className="flex-1 w-full flex flex-col p-10">
      <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-950 mb-3">Upload Your Resume</h2>
          <p className="text-blue-900/70 text-lg">
            Please upload your current resume in <span className="font-semibold text-blue-900">PDF format</span>.
          </p>
        </div>

        {!file ? (
          <div
            {...getRootProps()}
            className={`group border-3 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className={`p-5 rounded-full mb-5 transition-transform group-hover:scale-110 ${isDragActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
              <UploadCloud size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-blue-950 mb-2">
              {isDragActive ? "Drop it right here!" : "Drag & drop your PDF here"}
            </h3>
            <p className="text-blue-800/60 text-base font-medium">or click to browse your files</p>
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur opacity-20 transition duration-500"></div>
            <div className="relative border-2 border-blue-100 bg-white rounded-2xl p-6 flex items-center justify-between shadow-lg">
              <div className="flex items-center space-x-5 overflow-hidden">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white flex-shrink-0 shadow-inner">
                  <FileText size={32} strokeWidth={1.5} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-blue-950 font-bold text-lg truncate mb-1">{file.name}</p>
                  <p className="text-blue-600 text-sm flex items-center font-medium">
                    <CheckCircle2 size={16} className="text-blue-500 mr-1.5" />
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to process
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all p-3 rounded-xl flex-shrink-0 ml-4"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-auto pt-8 border-t border-blue-50">
        <button onClick={onBack} className="flex items-center text-blue-900/60 hover:text-blue-900 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all">
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!file}
          className={`flex items-center px-8 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg ${
            file ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:shadow-blue-500/25 hover:-translate-y-0.5' : 'bg-slate-300 cursor-not-allowed opacity-70 shadow-none'
          }`}
        >
          Continue <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
}