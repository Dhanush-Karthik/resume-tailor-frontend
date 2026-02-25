import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import StepWelcome from './components/StepWelcome';
import StepUpload from './components/StepUpload';
import StepJD from './components/StepJD';
import StepLoading from './components/StepLoading';
import StepSuccess from './components/StepSuccess';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [jdUrl, setJdUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);

  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -20, scale: 0.98 }
  };

  const pageTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 30
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleTailorResume = async () => {
    setCurrentStep(4);
    setError(null);

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jd_url', jdUrl);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

      const response = await fetch(`${API_BASE_URL}/api/tailor-resume`, {
          method: 'POST',
          body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate resume');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      setCurrentStep(5);

    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
      setCurrentStep(3);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepWelcome onNext={handleNext} />;
      case 2: return <StepUpload onNext={handleNext} onBack={handleBack} setFile={setResumeFile} file={resumeFile} />;
      case 3: return <StepJD onBack={handleBack} jdUrl={jdUrl} setJdUrl={setJdUrl} onSubmit={handleTailorResume} error={error} />;
      case 4: return <StepLoading />;
      case 5: return <StepSuccess downloadUrl={downloadUrl} onRestart={() => { setCurrentStep(1); setResumeFile(null); setJdUrl(''); setDownloadUrl(null); }} />;
      default: return <StepWelcome onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 antialiased relative overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse"></div>

      {/* App Header */}
      <div className="mb-10 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <h1 className="text-5xl font-extrabold text-blue-950 tracking-tight flex items-center justify-center gap-3">
            <Sparkles className="text-blue-500 h-10 w-10 fill-blue-500/20" />
            AI Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Tailor</span>
          </h1>
          <p className="text-lg text-blue-800/80 mt-3 font-medium max-w-md mx-auto leading-relaxed">
            Beat the ATS with a perfectly aligned resume, crafted in seconds.
          </p>
        </motion.div>
      </div>

      {/* Main Card Container - Now uses flex-col to grow naturally */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
        className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(37,99,235,0.15)] border border-blue-100 w-full max-w-3xl overflow-hidden min-h-[500px] flex flex-col relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep} 
            initial="initial" 
            animate="in" 
            exit="out" 
            variants={pageVariants} 
            transition={pageTransition} 
            className="w-full flex-grow flex flex-col"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <p className="text-blue-700/50 text-sm mt-8 relative z-10 font-medium">
        Powered by Google Gemini & Playwright
      </p>
    </div>
  );
}

export default App;