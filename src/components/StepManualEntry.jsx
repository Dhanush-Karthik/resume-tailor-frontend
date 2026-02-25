import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, GraduationCap, Code, Award,
  ArrowLeft, ArrowRight, Plus, Trash2, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function StepManualEntry({ onNext, onBack, setFile }) {
  const [subStep, setSubStep] = useState(1);
  const [errors, setErrors] = useState({});
  
  // Expanded state to include optional Certs and Awards
  const [data, setData] = useState({
    personal: { firstName: '', lastName: '', email: '', phone: '', linkedin: '', github: '', portfolio: '', leetcode: '' },
    experience: [{ id: Date.now(), company: '', role: '', startDate: '', endDate: '', current: false, description: '' }],
    education: [{ id: Date.now(), institution: '', degree: '', startDate: '', endDate: '', current: false }],
    certificates: [{ id: Date.now(), name: '', issuer: '', date: '' }],
    awards: [{ id: Date.now(), title: '', issuer: '', date: '' }],
    skills: ''
  });

  const today = new Date();
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  const getInputClasses = (hasError) => 
    `w-full p-3.5 border-2 rounded-xl focus:bg-blue-50/10 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800 ${
      hasError ? 'border-red-400 focus:border-red-500 bg-red-50/30' : 'border-slate-200 focus:border-blue-500'
    }`;

  // --- Handlers ---
  const handlePersonalChange = (e) => {
    setData({ ...data, personal: { ...data.personal, [e.target.name]: e.target.value } });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSkillsChange = (e) => setData({ ...data, skills: e.target.value });

  const handleArrayChange = (type, id, field, value) => {
    setData({
      ...data,
      [type]: data[type].map(item => item.id === id ? { ...item, [field]: value } : item)
    });
    const errorKey = `${type}_${field}_${id}`;
    if (errors[errorKey]) setErrors({ ...errors, [errorKey]: null });
  };

  const addItem = (type) => {
    const defaultItems = {
      experience: { id: Date.now(), company: '', role: '', startDate: '', endDate: '', current: false, description: '' },
      education: { id: Date.now(), institution: '', degree: '', startDate: '', endDate: '', current: false },
      certificates: { id: Date.now(), name: '', issuer: '', date: '' },
      awards: { id: Date.now(), title: '', issuer: '', date: '' }
    };
    setData({ ...data, [type]: [...data[type], defaultItems[type]] });
  };

  const removeItem = (type, id) => {
    if (data[type].length > 1) {
      setData({ ...data, [type]: data[type].filter(item => item.id !== id) });
    }
  };

  // --- STRICT VALIDATION ENGINE ---
  const validateCurrentStep = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)([\/\w\-]*)*\/?$/i;

    if (subStep === 1) {
      if (!data.personal.firstName.trim()) newErrors.firstName = "Required";
      if (!data.personal.lastName.trim()) newErrors.lastName = "Required";
      if (!data.personal.email.trim() || !emailRegex.test(data.personal.email)) newErrors.email = "Valid email required";
      
      ['linkedin', 'github', 'portfolio', 'leetcode'].forEach(field => {
        if (data.personal[field].trim() && !urlRegex.test(data.personal[field])) {
          newErrors[field] = "Invalid URL";
        }
      });
    } 
    else if (subStep === 2) {
      data.experience.forEach((exp) => {
        if (!exp.role.trim()) newErrors[`experience_role_${exp.id}`] = "Required";
        if (!exp.company.trim()) newErrors[`experience_company_${exp.id}`] = "Required";
        if (!exp.startDate) newErrors[`experience_startDate_${exp.id}`] = "Required";
        if (!exp.current && !exp.endDate) newErrors[`experience_endDate_${exp.id}`] = "Required";
        if (!exp.current && exp.startDate && exp.endDate && exp.startDate > exp.endDate) {
          newErrors[`experience_endDate_${exp.id}`] = "Cannot be before start date";
        }
      });
    }
    else if (subStep === 3) {
      data.education.forEach((edu) => {
        if (!edu.degree.trim()) newErrors[`education_degree_${edu.id}`] = "Required";
        if (!edu.institution.trim()) newErrors[`education_institution_${edu.id}`] = "Required";
        if (!edu.startDate) newErrors[`education_startDate_${edu.id}`] = "Required";
        if (!edu.current && !edu.endDate) newErrors[`education_endDate_${edu.id}`] = "Required";
        if (!edu.current && edu.startDate && edu.endDate && edu.startDate > edu.endDate) {
          newErrors[`education_endDate_${edu.id}`] = "Cannot be before start date";
        }
      });
    }
    // Step 4 (Awards/Certs) is completely optional, no strict validation needed.

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  // --- FORM SUBMISSION HANDLER ---
  const handleSubmit = (e) => {
    if (subStep < 5) {
      e.preventDefault(); // Stop native submission during wizard navigation
      if (validateCurrentStep()) {
        setSubStep(prev => prev + 1);
      }
    } else {
      // ON FINAL STEP: We DO NOT prevent default. 
      // The form will submit to the hidden iframe, forcing the browser to save autofill data!
      handleCompileAndContinue();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month, 10) - 1]} ${year}`; 
  };

  const handleCompileAndContinue = () => {
    let compiled = `PERSONAL DETAILS:\nName: ${data.personal.firstName} ${data.personal.lastName}\nEmail: ${data.personal.email}\nPhone: ${data.personal.phone}\nLinkedIn: ${data.personal.linkedin}\nGitHub: ${data.personal.github}\nPortfolio: ${data.personal.portfolio}\nLeetCode: ${data.personal.leetcode}\n\n`;
    
    compiled += `WORK EXPERIENCE:\n`;
    data.experience.forEach(exp => {
      const start = formatDate(exp.startDate);
      const end = exp.current ? 'Present' : formatDate(exp.endDate);
      compiled += `- ${exp.role} at ${exp.company} (${start} to ${end})\n  Description: ${exp.description}\n`;
    });

    const validCerts = data.certificates.filter(c => c.name.trim());
    if (validCerts.length > 0) {
      compiled += `\nCERTIFICATIONS:\n`;
      validCerts.forEach(c => {
        compiled += `- ${c.name} from ${c.issuer} (${formatDate(c.date)})\n`;
      });
    }

    const validAwards = data.awards.filter(a => a.title.trim());
    if (validAwards.length > 0) {
      compiled += `\nACHIEVEMENTS:\n`;
      validAwards.forEach(a => {
        compiled += `- **${a.title}** from ${a.issuer} (${formatDate(a.date)})\n`;
      });
    }

    compiled += `\nEDUCATION:\n`;
    data.education.forEach(edu => {
      const start = formatDate(edu.startDate);
      const end = edu.current ? 'Present' : formatDate(edu.endDate);
      compiled += `- ${edu.degree} from ${edu.institution} (${start} to ${end})\n`;
    });

    compiled += `\nSKILLS:\n${data.skills}`;

    const blob = new Blob([compiled], { type: 'text/plain' });
    const file = new File([blob], "manual_resume.txt", { type: "text/plain" });
    setFile(file);
    onNext(); // Proceed to next React state
  };

  const ErrorMsg = ({ msg }) => msg ? (
    <span className="text-red-500 text-xs font-bold flex items-center mt-1 ml-1 absolute -bottom-5">
      <AlertCircle size={12} className="mr-1" /> {msg}
    </span>
  ) : null;

  // --- Sub-Step UI Renderers ---
  const renderPersonal = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-4">
        {/* Added explicit 'id' attributes to help browser autofill heuristics */}
        <div className="relative">
          <input id="firstName" name="firstName" autoComplete="given-name" value={data.personal.firstName} onChange={handlePersonalChange} placeholder="First Name *" className={getInputClasses(errors.firstName)} />
          <ErrorMsg msg={errors.firstName} />
        </div>
        <div className="relative">
          <input id="lastName" name="lastName" autoComplete="family-name" value={data.personal.lastName} onChange={handlePersonalChange} placeholder="Last Name *" className={getInputClasses(errors.lastName)} />
          <ErrorMsg msg={errors.lastName} />
        </div>
        <div className="relative">
          <input id="email" name="email" type="email" autoComplete="email" value={data.personal.email} onChange={handlePersonalChange} placeholder="Email Address *" className={getInputClasses(errors.email)} />
          <ErrorMsg msg={errors.email} />
        </div>
        <div className="relative">
          <input id="phone" name="phone" type="tel" autoComplete="tel" value={data.personal.phone} onChange={handlePersonalChange} placeholder="Phone Number" className={getInputClasses(errors.phone)} />
        </div>
        <div className="relative">
          <input id="linkedin" name="linkedin" type="url" autoComplete="url" value={data.personal.linkedin} onChange={handlePersonalChange} placeholder="LinkedIn URL" className={getInputClasses(errors.linkedin)} />
          <ErrorMsg msg={errors.linkedin} />
        </div>
        <div className="relative">
          <input id="github" name="github" type="url" autoComplete="url" value={data.personal.github} onChange={handlePersonalChange} placeholder="GitHub URL" className={getInputClasses(errors.github)} />
          <ErrorMsg msg={errors.github} />
        </div>
        <div className="relative">
          <input id="portfolio" name="portfolio" type="url" autoComplete="url" value={data.personal.portfolio} onChange={handlePersonalChange} placeholder="Portfolio Website URL" className={getInputClasses(errors.portfolio)} />
          <ErrorMsg msg={errors.portfolio} />
        </div>
        <div className="relative">
          <input id="leetcode" name="leetcode" type="url" autoComplete="url" value={data.personal.leetcode} onChange={handlePersonalChange} placeholder="LeetCode / HackerRank URL" className={getInputClasses(errors.leetcode)} />
          <ErrorMsg msg={errors.leetcode} />
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      {data.experience.map((exp, index) => (
        <div key={exp.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl relative group">
          {data.experience.length > 1 && (
            <button type="button" onClick={() => removeItem('experience', exp.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          )}
          <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
            Role {index + 1}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-4 mb-8">
            <div className="relative">
              <input value={exp.role} autoComplete="organization-title" onChange={(e) => handleArrayChange('experience', exp.id, 'role', e.target.value)} placeholder="Job Title *" className={getInputClasses(errors[`experience_role_${exp.id}`])} />
              <ErrorMsg msg={errors[`experience_role_${exp.id}`]} />
            </div>
            <div className="relative">
              <input value={exp.company} autoComplete="organization" onChange={(e) => handleArrayChange('experience', exp.id, 'company', e.target.value)} placeholder="Company Name *" className={getInputClasses(errors[`experience_company_${exp.id}`])} />
              <ErrorMsg msg={errors[`experience_company_${exp.id}`]} />
            </div>
            <div className="relative">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Start Date *</label>
              <input type="month" max={currentMonthStr} value={exp.startDate} onChange={(e) => handleArrayChange('experience', exp.id, 'startDate', e.target.value)} className={`${getInputClasses(errors[`experience_startDate_${exp.id}`])} text-slate-500`} />
              <ErrorMsg msg={errors[`experience_startDate_${exp.id}`]} />
            </div>
            <div className="relative flex flex-col gap-2">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">End Date *</label>
                <input type="month" max={currentMonthStr} disabled={exp.current} value={exp.current ? '' : exp.endDate} onChange={(e) => handleArrayChange('experience', exp.id, 'endDate', e.target.value)} className={`${getInputClasses(errors[`experience_endDate_${exp.id}`])} text-slate-500 disabled:bg-slate-100 disabled:opacity-50`} />
                <ErrorMsg msg={errors[`experience_endDate_${exp.id}`]} />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer pl-1 mt-1">
                <input type="checkbox" checked={exp.current} onChange={(e) => { handleArrayChange('experience', exp.id, 'current', e.target.checked); if(e.target.checked) setErrors({...errors, [`experience_endDate_${exp.id}`]: null}); }} className="rounded border-2 border-slate-300 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer" />
                I currently work here
              </label>
            </div>
          </div>
          <textarea value={exp.description} onChange={(e) => handleArrayChange('experience', exp.id, 'description', e.target.value)} placeholder="Describe your responsibilities and achievements..." className={`${getInputClasses()} h-24 resize-none`} />
        </div>
      ))}
      <button type="button" onClick={() => addItem('experience')} className="flex items-center text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors px-2">
        <Plus size={16} className="mr-1" /> Add Another Role
      </button>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {data.education.map((edu, index) => (
        <div key={edu.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl relative group">
          {data.education.length > 1 && (
            <button type="button" onClick={() => removeItem('education', edu.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-4">
            <div className="relative sm:col-span-2">
              <input value={edu.degree} onChange={(e) => handleArrayChange('education', edu.id, 'degree', e.target.value)} placeholder="Degree (e.g., B.Tech Computer Science) *" className={getInputClasses(errors[`education_degree_${edu.id}`])} />
              <ErrorMsg msg={errors[`education_degree_${edu.id}`]} />
            </div>
            <div className="relative sm:col-span-2">
              <input value={edu.institution} onChange={(e) => handleArrayChange('education', edu.id, 'institution', e.target.value)} placeholder="University / Institution Name *" className={getInputClasses(errors[`education_institution_${edu.id}`])} />
              <ErrorMsg msg={errors[`education_institution_${edu.id}`]} />
            </div>
            <div className="relative">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Start Date *</label>
              <input type="month" max={currentMonthStr} value={edu.startDate} onChange={(e) => handleArrayChange('education', edu.id, 'startDate', e.target.value)} className={`${getInputClasses(errors[`education_startDate_${edu.id}`])} text-slate-500`} />
              <ErrorMsg msg={errors[`education_startDate_${edu.id}`]} />
            </div>
            <div className="relative flex flex-col gap-2">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">End Date *</label>
                <input type="month" max={currentMonthStr} disabled={edu.current} value={edu.current ? '' : edu.endDate} onChange={(e) => handleArrayChange('education', edu.id, 'endDate', e.target.value)} className={`${getInputClasses(errors[`education_endDate_${edu.id}`])} text-slate-500 disabled:bg-slate-100 disabled:opacity-50`} />
                <ErrorMsg msg={errors[`education_endDate_${edu.id}`]} />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer pl-1 mt-1">
                <input type="checkbox" checked={edu.current} onChange={(e) => { handleArrayChange('education', edu.id, 'current', e.target.checked); if(e.target.checked) setErrors({...errors, [`education_endDate_${edu.id}`]: null}); }} className="rounded border-2 border-slate-300 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer" />
                Currently studying here
              </label>
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => addItem('education')} className="flex items-center text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors px-2">
        <Plus size={16} className="mr-1" /> Add Another Degree
      </button>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-8">
      {/* Certifications Section */}
      <div>
        <h3 className="text-lg font-black text-blue-950 mb-4 flex items-center">Certifications <span className="text-xs text-slate-400 font-medium ml-2">(Optional)</span></h3>
        <div className="space-y-4">
          {data.certificates.map((cert) => (
            <div key={cert.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative">
              {data.certificates.length > 1 && (
                <button type="button" onClick={() => removeItem('certificates', cert.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input value={cert.name} onChange={(e) => handleArrayChange('certificates', cert.id, 'name', e.target.value)} placeholder="Certificate Name (e.g., AWS Developer)" className={getInputClasses()} />
                <input value={cert.issuer} onChange={(e) => handleArrayChange('certificates', cert.id, 'issuer', e.target.value)} placeholder="Issuing Organization" className={getInputClasses()} />
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Issue Date</label>
                  <input type="month" max={currentMonthStr} value={cert.date} onChange={(e) => handleArrayChange('certificates', cert.id, 'date', e.target.value)} className={`${getInputClasses()} text-slate-500`} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addItem('certificates')} className="flex items-center text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors px-2">
            <Plus size={16} className="mr-1" /> Add Certificate
          </button>
        </div>
      </div>

      {/* Awards Section */}
      <div>
        <h3 className="text-lg font-black text-blue-950 mb-4 flex items-center">Awards & Honors <span className="text-xs text-slate-400 font-medium ml-2">(Optional)</span></h3>
        <div className="space-y-4">
          {data.awards.map((award) => (
            <div key={award.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative">
              {data.awards.length > 1 && (
                <button type="button" onClick={() => removeItem('awards', award.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input value={award.title} onChange={(e) => handleArrayChange('awards', award.id, 'title', e.target.value)} placeholder="Award Title (e.g., Employee of the Month)" className={getInputClasses()} />
                <input value={award.issuer} onChange={(e) => handleArrayChange('awards', award.id, 'issuer', e.target.value)} placeholder="Organization / Event" className={getInputClasses()} />
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Date Received</label>
                  <input type="month" max={currentMonthStr} value={award.date} onChange={(e) => handleArrayChange('awards', award.id, 'date', e.target.value)} className={`${getInputClasses()} text-slate-500`} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addItem('awards')} className="flex items-center text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors px-2">
            <Plus size={16} className="mr-1" /> Add Award
          </button>
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
        <p className="text-sm text-slate-500 mb-3 font-medium">List your technical and soft skills, separated by commas.</p>
        <textarea 
          value={data.skills} 
          onChange={handleSkillsChange} 
          placeholder="e.g., Java, React, Microservices, Team Leadership, Problem Solving..." 
          className={`${getInputClasses()} h-40 resize-none leading-relaxed`} 
        />
      </div>
    </div>
  );

  const steps = [
    { id: 1, title: 'Basics', icon: User, render: renderPersonal },
    { id: 2, title: 'Experience', icon: Briefcase, render: renderExperience },
    { id: 3, title: 'Education', icon: GraduationCap, render: renderEducation },
    { id: 4, title: 'Extras', icon: Award, render: renderAchievements },
    { id: 5, title: 'Skills', icon: Code, render: renderSkills },
  ];

  return (
    <div className="flex-1 w-full flex flex-col p-6 sm:p-10 max-h-[75vh] sm:max-h-full overflow-hidden">
      
      {/* Wizard Progress Header */}
      <div className="flex justify-between items-center mb-8 relative px-2 sm:px-4">
        <div className="absolute left-6 right-6 top-5 h-1 bg-slate-100 -z-10 rounded-full"></div>
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = subStep === step.id;
          const isPast = subStep > step.id;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                isActive ? 'border-blue-600 bg-blue-50 text-blue-600' : 
                isPast ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-300'
              }`}>
                {isPast ? <CheckCircle2 size={20} /> : <Icon size={18} />}
              </div>
              <span className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider hidden sm:block ${isActive ? 'text-blue-900' : isPast ? 'text-blue-600' : 'text-slate-400'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* SDE HACK: Hidden Iframe to force browser autofill saving without leaving the React app */}
      <iframe name="autofill_saver" id="autofill_saver" style={{ display: 'none' }} title="Autofill Saver" />
      
      {/* Target the hidden iframe for the final submission */}
      <form action="/" method="GET" target="autofill_saver" onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
        
        {/* Main Form Content Area */}
        <div className="flex-1 overflow-y-auto px-1 no-scrollbar pb-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={subStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {steps.find(s => s.id === subStep)?.render()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Controls */}
        <div className="flex justify-between items-center mt-4 pt-6 border-t border-slate-100">
          <button 
            type="button" 
            onClick={() => subStep === 1 ? onBack() : setSubStep(prev => prev - 1)} 
            className="flex items-center text-slate-500 hover:text-slate-800 font-bold px-4 py-2 transition-all"
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </button>
          
          {subStep < 5 ? (
            <button
              type="submit" 
              disabled={subStep === 1 && (!data.personal.firstName || !data.personal.lastName || !data.personal.email)}
              className="flex items-center px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step <ArrowRight size={18} className="ml-2" />
            </button>
          ) : (
            <button
              type="submit" 
              disabled={!data.skills.trim()}
              className="flex items-center px-6 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save & Continue <CheckCircle2 size={18} className="ml-2" />
            </button>
          )}
        </div>
      </form>

    </div>
  );
}