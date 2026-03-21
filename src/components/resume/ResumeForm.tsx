"use client";

import { useState } from "react";
import { Sparkles, User, Briefcase, GraduationCap, Code, Plus, Trash2, ArrowRight, ArrowLeft, Loader2, Layout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ResumeFormProps {
  data: any;
  onChange: (newData: any) => void;
  onStepChange: (step: number) => void;
  currentStep: number;
}

export default function ResumeForm({ data, onChange, onStepChange, currentStep }: ResumeFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = [
    { title: "Personal", icon: User },
    { title: "Experience", icon: Briefcase },
    { title: "Projects", icon: Layout },
    { title: "Education", icon: GraduationCap },
    { title: "Skills", icon: Code },
    { title: "Misc.", icon: Sparkles },
  ];

  const handleInputChange = (section: string, field: string, value: any, index?: number) => {
    const newData = { ...data };
    if (index !== undefined) {
      newData[section][index][field] = value;
    } else {
      if (section) {
        newData[section][field] = value;
      } else {
        newData[field] = value;
      }
    }
    onChange(newData);
  };

  const addItem = (section: string, template: any) => {
    const newData = { ...data };
    newData[section] = [...newData[section], template];
    onChange(newData);
  };

  const removeItem = (section: string, index: number) => {
    const newData = { ...data };
    newData[section] = newData[section].filter((_: any, i: number) => i !== index);
    onChange(newData);
  };

  const generateAIContent = async (index: number, type: string = "resume") => {
    try {
      setIsGenerating(true);
      let bodyData = {};
      
      if (type === "resume") {
        const experience = data.experience[index];
        bodyData = { type, data: { role: experience.role, company: experience.company, description: experience.description } };
      } else if (type === "projects") {
        const project = data.projects[index];
        bodyData = { type, data: { name: project.name, description: project.description } };
      } else if (type === "summary") {
        bodyData = { type, data: { role: data.experience[0]?.role || "Professional", experience: data.experience, skills: data.skills } };
      }

      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });

      const resData = await response.json();

      if (resData.success) {
        if (type === "resume") {
          const aiPoints = resData.content.experience?.[0]?.bulletPoints || [];
          handleInputChange("experience", "bulletPoints", aiPoints.length > 0 ? aiPoints : resData.content.rawText?.split("\n").filter((p: string) => p.trim()) || [], index);
        } else if (type === "projects") {
          const aiPoints = Array.isArray(resData.content) ? resData.content : resData.content.rawText?.split("\n").filter((p: string) => p.trim()) || [];
          handleInputChange("projects", "bulletPoints", aiPoints, index);
        } else if (type === "summary") {
          handleInputChange("personalInfo", "summary", resData.content.rawText || resData.content);
        }
      }
    } catch (error: any) {
      console.error("AI Generation failed:", error.message);
      alert("AI Rewriting failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl sticky top-24">
      {/* Progress Steps */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 -z-10" />
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => onStepChange(idx)}
            className={`flex flex-col items-center gap-2 transition-all duration-300 ${
              currentStep >= idx ? "text-indigo-400" : "text-slate-500"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
              currentStep === idx ? "bg-indigo-600 border-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/20" : 
              currentStep > idx ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-400" : "bg-slate-950 border-slate-800 text-slate-500"
            }`}>
              <step.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">{step.title}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          {/* STEP 1: PERSONAL INFO */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">Full Name</label>
                <input
                  type="text"
                  value={data.personalInfo.fullName}
                  onChange={(e) => handleInputChange("personalInfo", "fullName", e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">Email Address</label>
                <input
                  type="email"
                  value={data.personalInfo.email}
                  onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">Phone Number</label>
                <input
                  type="text"
                  value={data.personalInfo.phone}
                  onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">Location</label>
                <input
                  type="text"
                  value={data.personalInfo.location}
                  onChange={(e) => handleInputChange("personalInfo", "location", e.target.value)}
                  placeholder="New York, NY"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-400">Professional Summary</label>
                    <button
                        onClick={() => generateAIContent(0, "summary")}
                        disabled={isGenerating || !data.experience[0]?.role}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all text-xs font-bold disabled:opacity-50"
                    >
                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        Generate with AI
                    </button>
                </div>
                <textarea
                  value={data.personalInfo.summary}
                  onChange={(e) => handleInputChange("personalInfo", "summary", e.target.value)}
                  placeholder="Briefly describe your career goals and key achievements..."
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: EXPERIENCE */}
          {currentStep === 1 && (
            <div className="space-y-8">
              {data.experience.map((exp: any, idx: number) => (
                <div key={idx} className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl relative group">
                  <button
                    onClick={() => removeItem("experience", idx)}
                    className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Role (e.g. Senior Developer)"
                      value={exp.role}
                      onChange={(e) => handleInputChange("experience", "role", e.target.value, idx)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-indigo-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => handleInputChange("experience", "company", e.target.value, idx)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-indigo-500 outline-none"
                    />
                    <div className="sm:col-span-2">
                       <textarea
                        placeholder="Key responsibilities (Raw bullet points or paragraph)..."
                        value={exp.description}
                        onChange={(e) => handleInputChange("experience", "description", e.target.value, idx)}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-indigo-500 outline-none mb-3"
                      />
                      <button
                        onClick={() => generateAIContent(idx, "resume")}
                        disabled={isGenerating || !exp.description}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all text-sm font-bold disabled:opacity-50"
                      >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Rewrite with AI
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addItem("experience", { role: "", company: "", duration: "", description: "", bulletPoints: [] })}
                className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Experience
              </button>
            </div>
          )}

          {/* STEP 3: PROJECTS */}
          {currentStep === 2 && (
            <div className="space-y-8">
              {data.projects?.map((proj: any, idx: number) => (
                <div key={idx} className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl relative group">
                  <button
                    onClick={() => removeItem("projects", idx)}
                    className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={proj.name}
                      onChange={(e) => handleInputChange("projects", "name", e.target.value, idx)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-indigo-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Project Link (Optional)"
                      value={proj.link}
                      onChange={(e) => handleInputChange("projects", "link", e.target.value, idx)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-indigo-500 outline-none"
                    />
                    <div className="sm:col-span-2">
                       <textarea
                        placeholder="Project description..."
                        value={proj.description}
                        onChange={(e) => handleInputChange("projects", "description", e.target.value, idx)}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-indigo-500 outline-none mb-3"
                      />
                      <button
                        onClick={() => generateAIContent(idx, "projects")}
                        disabled={isGenerating || !proj.description}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all text-sm font-bold disabled:opacity-50"
                      >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Generate Points with AI
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addItem("projects", { name: "", link: "", duration: "", description: "", bulletPoints: [] })}
                className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Project
              </button>
            </div>
          )}

          {/* STEP 4: EDUCATION */}
          {currentStep === 3 && (
            <div className="space-y-8">
              {data.education.map((edu: any, idx: number) => (
                <div key={idx} className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl relative group">
                  <button
                    onClick={() => removeItem("education", idx)}
                    className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Degree (e.g. B.S. in Computer Science)"
                      value={edu.degree}
                      onChange={(e) => handleInputChange("education", "degree", e.target.value, idx)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-indigo-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="School/University"
                      value={edu.school}
                      onChange={(e) => handleInputChange("education", "school", e.target.value, idx)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => addItem("education", { degree: "", school: "", year: "" })}
                className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Education
              </button>
            </div>
          )}

          {/* STEP 5: SKILLS */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Skills</h3>
                {data.experience[0]?.role && (
                  <button
                    onClick={async () => {
                      try {
                        setIsGenerating(true);
                        const response = await fetch("/api/generate-resume", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            type: "skills",
                            data: { role: data.experience[0].role }
                          })
                        });
                        const res = await response.json();
                        if (res.success && Array.isArray(res.content)) {
                          const uniqueSkills = Array.from(new Set([...data.skills, ...res.content]));
                          onChange({ ...data, skills: uniqueSkills });
                        }
                      } catch (err) {
                        console.error("Skill suggestion failed:", err);
                      } finally {
                        setIsGenerating(false);
                      }
                    }}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all text-sm font-bold disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Suggest for "{data.experience[0].role}"
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3">
                <AnimatePresence>
                  {data.skills.map((skill: string, idx: number) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      key={idx} 
                      className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-indigo-300 hover:border-indigo-500/50 transition-all cursor-default group"
                    >
                      <span className="text-sm font-medium">{skill}</span>
                      <button 
                        onClick={() => {
                          const newSkills = data.skills.filter((_: any, i: number) => i !== idx);
                          onChange({ ...data, skills: newSkills });
                        }}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Add a skill and press Enter..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition-all shadow-inner"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val && !data.skills.includes(val)) {
                        onChange({ ...data, skills: [...data.skills, val] });
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 uppercase tracking-widest pointer-events-none">
                  Press Enter
                </div>
              </div>
            </div>
          )}
          {/* STEP 6: MISC (CERTIFICATIONS & LANGUAGES) */}
          {currentStep === 5 && (
            <div className="space-y-10">
              {/* Certifications */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" /> Certifications
                </h3>
                <div className="space-y-4">
                  {data.certifications?.map((cert: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-950/50 border border-slate-800 rounded-xl relative group">
                      <button
                        onClick={() => removeItem("certifications", idx)}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="text"
                        placeholder="Certification Name"
                        value={cert.name}
                        onChange={(e) => handleInputChange("certifications", "name", e.target.value, idx)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-indigo-500 outline-none sm:col-span-1"
                      />
                      <input
                        type="text"
                        placeholder="Issuer"
                        value={cert.issuer}
                        onChange={(e) => handleInputChange("certifications", "issuer", e.target.value, idx)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-indigo-500 outline-none sm:col-span-1"
                      />
                      <input
                        type="text"
                        placeholder="Year"
                        value={cert.year}
                        onChange={(e) => handleInputChange("certifications", "year", e.target.value, idx)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-indigo-500 outline-none sm:col-span-1"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addItem("certifications", { name: "", issuer: "", year: "" })}
                    className="w-full py-3 border border-dashed border-slate-800 rounded-xl text-slate-500 hover:text-indigo-400 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Certification
                  </button>
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layout className="w-5 h-5 text-indigo-400" /> Languages
                </h3>
                <div className="flex flex-wrap gap-4">
                  {data.languages?.map((lang: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-950 border border-slate-800 p-3 rounded-xl group">
                      <input
                        type="text"
                        placeholder="Language"
                        value={lang.name}
                        onChange={(e) => handleInputChange("languages", "name", e.target.value, idx)}
                        className="bg-transparent border-none text-white focus:ring-0 w-24 text-sm font-bold"
                      />
                      <select
                        value={lang.level}
                        onChange={(e) => handleInputChange("languages", "level", e.target.value, idx)}
                        className="bg-slate-900 border-none text-xs text-indigo-400 rounded-lg focus:ring-0 cursor-pointer p-1"
                      >
                        <option value="Native">Native</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Professional">Professional</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Basic">Basic</option>
                      </select>
                      <button
                        onClick={() => removeItem("languages", idx)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addItem("languages", { name: "", level: "Native" })}
                    className="p-3 border border-dashed border-slate-800 rounded-xl text-slate-500 hover:text-indigo-400 transition-all flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Language
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-12 pt-8 border-t border-slate-800">
        <button
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-6 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-30"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        {currentStep < 5 ? (
          <button
            onClick={() => onStepChange(currentStep + 1)}
            className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            Next Step
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            Finish & Preview
          </button>
        )}
      </div>
    </div>
  );
}

const X = ({ className, onClick }: any) => (
    <svg onClick={onClick} className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
