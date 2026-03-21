"use client";

import { useRef } from "react";
import { Download, Layout, Palette, FileText, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface ResumePreviewProps {
  data: any;
  template: string;
  onTemplateChange: (template: string) => void;
}

export default function ResumePreview({ data, template, onTemplateChange }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: data.personalInfo.fullName || "Resume",
  });

  const exportPDF = () => {
    try {
      handlePrint();
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Failed to export PDF. Please try again.");
    }
  };

  const templates = [
    { id: "minimalist", name: "Minimalist", icon: FileText },
    { id: "modern", name: "Modern", icon: Palette },
    { id: "professional", name: "Professional", icon: Layout },
    { id: "creative", name: "Creative", icon: Sparkles },
    { id: "executive", name: "Executive", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Select Template</h3>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onTemplateChange(t.id)}
              className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                template === t.id 
                  ? "bg-indigo-600/10 border-indigo-600 shadow-lg shadow-indigo-500/20" 
                  : "bg-slate-950 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className={`w-full aspect-[3/4] rounded-lg mb-2 overflow-hidden border transition-transform group-hover:scale-105 duration-300 ${
                template === t.id ? "border-indigo-400" : "border-slate-800"
              }`}>
                {/* Mock Thumbnail using CSS */}
                <div className={`w-full h-full p-2 flex flex-col gap-1 bg-white ${t.id === 'modern' ? 'flex-row' : ''}`}>
                    <div className={`${t.id === 'modern' ? 'w-1/3' : 'w-full'} h-2 bg-slate-200 rounded`}></div>
                    <div className="flex-1 space-y-1">
                        <div className="w-full h-1 bg-slate-100 rounded"></div>
                        <div className="w-2/3 h-1 bg-slate-100 rounded"></div>
                        <div className="w-full h-1 bg-slate-100 rounded"></div>
                    </div>
                </div>
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${
                template === t.id ? "text-indigo-400" : "text-slate-500"
              }`}>
                {t.name}
              </span>
              {template === t.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={exportPDF}
          className="w-full max-w-[794px] flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-lg rounded-2xl transition-all shadow-2xl shadow-emerald-500/30 transform hover:-translate-y-1 active:scale-95"
        >
          <Download className="w-6 h-6" />
          Export Final PDF
        </button>
      </div>

      {/* Resume Container */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden min-h-[1122px] w-full max-w-[794px] mx-auto text-slate-900 origin-top transform transition-transform duration-500">
        <div ref={resumeRef} className="p-12 h-full">
          {/* Template Logic */}
          {template === "minimalist" && (
             <div className="flex flex-col gap-10">
                <header className="border-b-2 border-slate-100 pb-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight uppercase mb-2">{data.personalInfo.fullName || "Your Name"}</h1>
                    <div className="flex justify-center gap-4 text-sm text-slate-500">
                        <span>{data.personalInfo.email}</span>
                        <span>•</span>
                        <span>{data.personalInfo.phone}</span>
                        <span>•</span>
                        <span>{data.personalInfo.location}</span>
                    </div>
                </header>
                
                <section>
                    <h2 className="text-lg font-bold uppercase tracking-widest text-indigo-600 mb-4">Summary</h2>
                    <p className="text-slate-600 leading-relaxed">{data.personalInfo.summary || "Professional summary goes here..."}</p>
                </section>

                 <div className="grid grid-cols-2 gap-12">
                      <section>
                         <h2 className="text-lg font-bold uppercase tracking-widest text-indigo-600 mb-6">Experience</h2>
                         <div className="space-y-8">
                             {data.experience.map((exp: any, i: number) => (
                                 <div key={i} className="relative">
                                     <div className="flex justify-between items-baseline mb-2">
                                         <h3 className="text-xl font-bold">{exp.role}</h3>
                                         <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">{exp.duration}</span>
                                     </div>
                                     <p className="text-indigo-500 font-semibold mb-3">{exp.company}</p>
                                     <ul className="list-disc list-outside ml-5 space-y-2 text-slate-600">
                                         {(exp.bulletPoints?.length > 0 ? exp.bulletPoints : [exp.description]).map((p: string, j: number) => (
                                             <li key={j}>{p}</li>
                                         ))}
                                     </ul>
                                 </div>
                             ))}
                         </div>
                     </section>
 
                     {data.projects?.length > 0 && data.projects[0].name && (
                         <section>
                             <h2 className="text-lg font-bold uppercase tracking-widest text-indigo-600 mb-6">Projects</h2>
                             <div className="space-y-8">
                                 {data.projects.map((proj: any, i: number) => (
                                     <div key={i}>
                                         <div className="flex justify-between items-baseline mb-1">
                                             <h3 className="text-lg font-bold">{proj.name}</h3>
                                             {proj.link && <span className="text-xs text-indigo-500 lowercase">{proj.link}</span>}
                                         </div>
                                         <ul className="list-disc list-outside ml-5 space-y-1 text-slate-600 text-sm">
                                             {(proj.bulletPoints?.length > 0 ? proj.bulletPoints : [proj.description]).map((p: string, j: number) => (
                                                 <li key={j}>{p}</li>
                                             ))}
                                         </ul>
                                     </div>
                                 ))}
                             </div>
                         </section>
                     )}
                 </div>
 
                 <div className="grid grid-cols-3 gap-12 border-t pt-10">
                      <section>
                         <h2 className="text-lg font-bold uppercase tracking-widest text-indigo-600 mb-4">Education</h2>
                         <div className="space-y-4">
                             {data.education.map((edu: any, i: number) => (
                                 <div key={i}>
                                     <h3 className="font-bold">{edu.degree}</h3>
                                     <p className="text-slate-500 text-sm">{edu.school} • {edu.year}</p>
                                 </div>
                             ))}
                         </div>
                     </section>
                     <section>
                         <h2 className="text-lg font-bold uppercase tracking-widest text-indigo-600 mb-4">Skills</h2>
                         <div className="flex flex-wrap gap-2">
                             {data.skills.map((s: string, i: number) => (
                                 <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-600 font-medium">{s}</span>
                             ))}
                         </div>
                     </section>
                     {(data.certifications?.length > 0 || data.languages?.length > 0) && (
                        <section className="space-y-6">
                            {data.certifications?.[0]?.name && (
                                <div>
                                    <h2 className="text-lg font-bold uppercase tracking-widest text-indigo-600 mb-4">Certifications</h2>
                                    <div className="space-y-2">
                                        {data.certifications.map((c: any, i: number) => (
                                            <p key={i} className="text-sm text-slate-600"><span className="font-bold">{c.name}</span> — {c.issuer}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data.languages?.[0]?.name && (
                                <div>
                                    <h2 className="text-lg font-bold uppercase tracking-widest text-indigo-600 mb-4">Languages</h2>
                                    <p className="text-sm text-slate-600">{data.languages.map((l: any) => `${l.name} (${l.level})`).join(", ")}</p>
                                </div>
                            )}
                        </section>
                     )}
                 </div>
              </div>
          )}

          {template === "modern" && (
             <div className="flex gap-12 h-full">
                {/* Sidebar */}
                <div className="w-1/3 bg-slate-50 -m-12 p-12 flex flex-col gap-12">
                     <div className="w-full h-1 bg-indigo-500 mb-4"></div>
                     <section>
                        <h2 className="text-lg font-bold mb-6 text-slate-900">Contact</h2>
                        <div className="space-y-4 text-sm text-slate-600">
                             <p>{data.personalInfo.email}</p>
                             <p>{data.personalInfo.phone}</p>
                             <p>{data.personalInfo.location}</p>
                        </div>
                     </section>
                     <section>
                        <h2 className="text-lg font-bold mb-6 text-slate-900">Education</h2>
                        {data.education.map((edu: any, i: number) => (
                            <div key={i} className="mb-4">
                                <h3 className="font-bold text-sm">{edu.degree}</h3>
                                <p className="text-slate-500 text-xs">{edu.school}</p>
                                <p className="text-indigo-500 text-xs mt-1">{edu.year}</p>
                            </div>
                        ))}
                     </section>
                     <section>
                        <h2 className="text-lg font-bold mb-6 text-slate-900">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                             {data.skills.map((s: string, i: number) => (
                                 <div key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 shadow-sm">
                                     {s}
                                 </div>
                             ))}
                        </div>
                     </section>
                     {data.certifications?.[0]?.name && (
                         <section>
                            <h2 className="text-lg font-bold mb-4 text-slate-900">Certifications</h2>
                            <div className="space-y-4">
                                {data.certifications.map((c: any, i: number) => (
                                    <div key={i} className="text-slate-600">
                                        <p className="font-bold text-xs">{c.name}</p>
                                        <p className="text-[10px]">{c.issuer}</p>
                                    </div>
                                ))}
                            </div>
                         </section>
                     )}
                     {data.languages?.[0]?.name && (
                         <section>
                            <h2 className="text-lg font-bold mb-4 text-slate-900">Languages</h2>
                            <div className="space-y-2">
                                {data.languages.map((l: any, i: number) => (
                                    <div key={i} className="flex justify-between text-xs">
                                        <span className="text-slate-600">{l.name}</span>
                                        <span className="text-indigo-500 font-bold">{l.level}</span>
                                    </div>
                                ))}
                            </div>
                         </section>
                     )}
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-12">
                     <header>
                        <h1 className="text-5xl font-black text-slate-900 mb-4">{data.personalInfo.fullName}</h1>
                        <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm">Professional Summary</p>
                        <p className="mt-4 text-slate-600 leading-relaxed italic">{data.personalInfo.summary}</p>
                     </header>

                      <section>
                        <h2 className="text-2xl font-bold text-slate-900 border-b-4 border-indigo-500 w-fit pb-1 mb-8">Experience</h2>
                        <div className="space-y-10">
                             {data.experience.map((exp: any, i: number) => (
                                 <div key={i}>
                                     <h3 className="text-xl font-extrabold">{exp.role}</h3>
                                     <p className="text-indigo-600 font-bold flex justify-between items-center mt-1">
                                         {exp.company}
                                         <span className="text-slate-400 text-xs bg-slate-100 px-3 py-1 rounded-full">{exp.duration}</span>
                                     </p>
                                     <ul className="mt-5 space-y-3 text-slate-600">
                                         {(exp.bulletPoints?.length > 0 ? exp.bulletPoints : [exp.description]).map((p: string, j: number) => (
                                             <li key={j} className="flex gap-3">
                                                 <span className="text-indigo-400 font-bold mt-1">•</span>
                                                 {p}
                                             </li>
                                         ))}
                                     </ul>
                                 </div>
                             ))}
                        </div>
                     </section>

                     {data.projects?.[0]?.name && (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 border-b-4 border-indigo-500 w-fit pb-1 mb-8">Featured Projects</h2>
                            <div className="grid grid-cols-1 gap-8">
                                {data.projects.map((proj: any, i: number) => (
                                    <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-bold">{proj.name}</h3>
                                            {proj.link && <span className="text-xs font-bold text-indigo-500">{proj.link}</span>}
                                        </div>
                                        <ul className="space-y-2 text-slate-600 text-sm">
                                            {(proj.bulletPoints?.length > 0 ? proj.bulletPoints : [proj.description]).map((p: string, j: number) => (
                                                <li key={j} className="flex gap-2">
                                                    <span className="text-indigo-400 font-bold">›</span>
                                                    {p}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                     )}
                </div>
             </div>
          )}

          {template === "professional" && (
             <div className="space-y-10">
                <header className="text-center border-b pb-8">
                    <h1 className="text-5xl font-bold text-slate-800 tracking-tight">{data.personalInfo.fullName}</h1>
                    <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
                        <span>{data.personalInfo.email}</span>
                        <span>{data.personalInfo.phone}</span>
                        <span>{data.personalInfo.location}</span>
                    </div>
                </header>

                <section>
                    <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-6">Professional Summary</h2>
                    <p className="text-slate-700 leading-normal">{data.personalInfo.summary}</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-6">Work Experience</h2>
                    <div className="space-y-8">
                         {data.experience.map((exp: any, i: number) => (
                             <div key={i} className="pl-4 border-l-2 border-slate-100">
                                 <div className="flex justify-between font-bold text-lg mb-1">
                                     <span>{exp.role}</span>
                                     <span className="text-slate-500">{exp.duration}</span>
                                 </div>
                                 <p className="text-slate-700 italic font-medium mb-3">{exp.company}</p>
                                 <ul className="list-disc list-outside ml-4 space-y-1.5 text-slate-700 text-sm">
                                      {(exp.bulletPoints?.length > 0 ? exp.bulletPoints : [exp.description]).map((p: string, j: number) => (
                                          <li key={j}>{p}</li>
                                      ))}
                                 </ul>
                             </div>
                         ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-6">Education</h2>
                    <div className="space-y-4">
                         {data.education.map((edu: any, i: number) => (
                             <div key={i} className="flex justify-between items-baseline">
                                 <div>
                                     <span className="font-bold">{edu.school}</span>, {edu.degree}
                                 </div>
                                 <span className="font-bold text-slate-500">{edu.year}</span>
                             </div>
                         ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-6">Technical Skills</h2>
                    <p className="text-slate-700 font-medium">
                         {data.skills.join(" • ")}
                    </p>
                </section>

                {data.projects?.[0]?.name && (
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-6">Key Projects</h2>
                        <div className="space-y-6">
                            {data.projects.map((proj: any, i: number) => (
                                <div key={i} className="pl-4 border-l-2 border-slate-100">
                                    <div className="flex justify-between font-bold mb-1">
                                        <span>{proj.name}</span>
                                        {proj.link && <span className="text-slate-400 text-xs font-normal">{proj.link}</span>}
                                    </div>
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
                                        {(proj.bulletPoints?.length > 0 ? proj.bulletPoints : [proj.description]).map((p: string, j: number) => (
                                            <li key={j}>{p}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-2 gap-10">
                    {data.certifications?.[0]?.name && (
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-4">Certifications</h2>
                            <div className="space-y-2">
                                {data.certifications.map((c: any, i: number) => (
                                    <div key={i} className="text-sm">
                                        <span className="font-bold">{c.name}</span> <span className="text-slate-500">— {c.issuer}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {data.languages?.[0]?.name && (
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-4">Languages</h2>
                            <p className="text-sm text-slate-700">
                                {data.languages.map((l: any) => `${l.name} (${l.level})`).join(", ")}
                            </p>
                        </section>
                    )}
                </div>
             </div>
          )}

          {template === "creative" && (
             <div className="flex flex-col h-full bg-slate-50 -m-12">
                <header className="bg-indigo-600 text-white p-12 pb-20">
                    <h1 className="text-6xl font-black tracking-tighter mb-4">{data.personalInfo.fullName}</h1>
                    <div className="flex gap-6 text-indigo-100 font-medium">
                        <span>{data.personalInfo.email}</span>
                        <span>{data.personalInfo.phone}</span>
                        <span>{data.personalInfo.location}</span>
                    </div>
                </header>
                <div className="flex-1 p-12 -mt-12 bg-white rounded-t-[3rem] shadow-sm flex gap-12">
                    <div className="w-1/3 space-y-10">
                         <section>
                            <h2 className="text-xl font-black text-slate-900 border-l-4 border-indigo-600 pl-4 mb-6">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((s: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold">{s}</span>
                                ))}
                            </div>
                         </section>
                         {data.certifications?.[0]?.name && (
                            <section>
                                <h2 className="text-xl font-black text-slate-900 border-l-4 border-indigo-600 pl-4 mb-6">Certifications</h2>
                                <div className="space-y-4">
                                    {data.certifications.map((c: any, i: number) => (
                                        <div key={i}>
                                            <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                                            <p className="text-slate-500 text-xs">{c.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                         )}
                         {data.languages?.[0]?.name && (
                            <section>
                                <h2 className="text-xl font-black text-slate-900 border-l-4 border-indigo-600 pl-4 mb-6">Languages</h2>
                                <div className="flex flex-wrap gap-2">
                                    {data.languages.map((l: any, i: number) => (
                                        <span key={i} className="px-3 py-1 border-2 border-indigo-100 rounded-full text-xs font-black text-indigo-500">{l.name} ({l.level})</span>
                                    ))}
                                </div>
                            </section>
                         )}
                         <section>
                            <h2 className="text-xl font-black text-slate-900 border-l-4 border-indigo-600 pl-4 mb-6">Education</h2>
                            {data.education.map((edu: any, i: number) => (
                                <div key={i} className="mb-4">
                                    <h3 className="font-bold text-slate-800">{edu.degree}</h3>
                                    <p className="text-slate-500 text-sm">{edu.school}</p>
                                    <p className="text-indigo-600 text-xs font-bold mt-1">{edu.year}</p>
                                </div>
                            ))}
                         </section>
                    </div>
                    <div className="flex-1 space-y-10">
                         <section>
                            <h2 className="text-xl font-black text-slate-900 mb-6">Summary</h2>
                            <p className="text-slate-600 leading-relaxed font-medium">{data.personalInfo.summary}</p>
                         </section>
                         <section>
                            <h2 className="text-xl font-black text-slate-900 mb-6 font-bold">Experience</h2>
                            <div className="space-y-8">
                                 {data.experience.map((exp: any, i: number) => (
                                     <div key={i} className="group">
                                         <div className="flex justify-between items-baseline">
                                             <h3 className="text-xl font-bold text-slate-800">{exp.role}</h3>
                                             <span className="text-xs font-black text-indigo-500 uppercase">{exp.duration}</span>
                                         </div>
                                         <p className="text-slate-500 font-bold mb-3">{exp.company}</p>
                                         <ul className="space-y-2 text-slate-600 text-sm">
                                              {(exp.bulletPoints?.length > 0 ? exp.bulletPoints : [exp.description]).map((p: string, j: number) => (
                                                  <li key={j} className="flex gap-2">
                                                      <span className="text-indigo-400">⚡</span>
                                                      {p}
                                                  </li>
                                              ))}
                                         </ul>
                                     </div>
                                 ))}
                            </div>
                         </section>

                          {data.projects?.[0]?.name && (
                             <section>
                                <h2 className="text-xl font-black text-slate-900 mb-6">Selected Projects</h2>
                                <div className="space-y-10">
                                    {data.projects.map((proj: any, i: number) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-lg font-bold text-indigo-600">{proj.name}</h3>
                                                {proj.link && <span className="text-[10px] font-black uppercase text-slate-400">{proj.link}</span>}
                                            </div>
                                            <ul className="space-y-2 text-slate-600 text-sm">
                                                {(proj.bulletPoints?.length > 0 ? proj.bulletPoints : [proj.description]).map((p: string, j: number) => (
                                                    <li key={j} className="flex gap-2">
                                                        <span className="text-indigo-300">★</span>
                                                        {p}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                             </section>
                          )}
                    </div>
                </div>
             </div>
          )}

          {template === "executive" && (
             <div className="space-y-12">
                <header className="flex justify-between items-end border-b-4 border-slate-900 pb-8">
                    <div>
                        <h1 className="text-5xl font-serif font-black text-slate-900 leading-tight">{data.personalInfo.fullName}</h1>
                        <p className="text-lg text-slate-500 font-medium italic mt-2">{data.personalInfo.location}</p>
                    </div>
                    <div className="text-right text-sm text-slate-600 font-serif space-y-1">
                        <p>{data.personalInfo.email}</p>
                        <p>{data.personalInfo.phone}</p>
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-12">
                    <div className="col-span-8 space-y-12">
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Professional Profile</h2>
                            <p className="text-lg text-slate-800 leading-relaxed font-serif">{data.personalInfo.summary}</p>
                        </section>

                         <section>
                             <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 border-b pb-2">Career History</h2>
                             <div className="space-y-10">
                                  {data.experience.map((exp: any, i: number) => (
                                      <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-slate-900 before:rounded-full">
                                          <div className="flex justify-between font-serif text-xl mb-1">
                                              <span className="font-bold">{exp.role}</span>
                                              <span className="text-slate-400 italic text-sm">{exp.duration}</span>
                                          </div>
                                          <p className="text-slate-900 font-bold uppercase tracking-widest text-xs mb-4">{exp.company}</p>
                                          <ul className="list-disc list-outside ml-4 space-y-2 text-slate-700 text-sm leading-relaxed">
                                               {(exp.bulletPoints?.length > 0 ? exp.bulletPoints : [exp.description]).map((p: string, j: number) => (
                                                   <li key={j}>{p}</li>
                                               ))}
                                          </ul>
                                      </div>
                                  ))}
                             </div>
                         </section>

                         {data.projects?.[0]?.name && (
                            <section>
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 border-b pb-2">Key Initiatives</h2>
                                <div className="space-y-10">
                                    {data.projects.map((proj: any, i: number) => (
                                        <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-slate-900 before:rounded-full">
                                            <div className="flex justify-between font-serif text-lg mb-1 italic">
                                                <span className="font-bold">{proj.name}</span>
                                                {proj.link && <span className="text-slate-400 text-[10px] font-sans uppercase font-black">{proj.link}</span>}
                                            </div>
                                            <ul className="list-disc list-outside ml-4 space-y-2 text-slate-700 text-sm">
                                                 {(proj.bulletPoints?.length > 0 ? proj.bulletPoints : [proj.description]).map((p: string, j: number) => (
                                                     <li key={j}>{p}</li>
                                                 ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>
                         )}
                    </div>
                    <div className="col-span-4 space-y-12">
                         <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Expertise</h2>
                            <div className="grid grid-cols-1 gap-y-3">
                                {data.skills.map((s: string, i: number) => (
                                    <div key={i} className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex justify-between">
                                        {s}
                                        <div className="flex gap-1">
                                            {[1,2,3,4,5].map(dot => (
                                                <div key={dot} className={`w-1 h-1 rounded-full ${dot <= 4 ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </section>

                         <section className="bg-slate-950 text-white p-6 rounded-2xl">
                             <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Education</h2>
                             {data.education.map((edu: any, i: number) => (
                                 <div key={i} className="mb-6 last:mb-0">
                                     <h3 className="font-serif font-bold text-white text-sm">{edu.degree}</h3>
                                     <p className="text-slate-400 text-xs mt-1">{edu.school}</p>
                                     <p className="text-indigo-400 text-[10px] font-black uppercase mt-2">{edu.year}</p>
                                 </div>
                             ))}
                          </section>

                          {data.certifications?.[0]?.name && (
                             <section className="p-6 border-2 border-slate-100 rounded-2xl">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Credentials</h2>
                                <div className="space-y-4">
                                    {data.certifications.map((c: any, i: number) => (
                                        <div key={i}>
                                            <p className="text-xs font-black uppercase text-slate-900">{c.name}</p>
                                            <p className="text-[10px] text-slate-500 italic mt-0.5">{c.issuer}</p>
                                        </div>
                                    ))}
                                </div>
                             </section>
                          )}

                          {data.languages?.[0]?.name && (
                             <section className="px-6">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Linguistics</h2>
                                <div className="space-y-2">
                                    {data.languages.map((l: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-900">{l.name}</span>
                                            <span className="text-slate-400 italic">{l.level}</span>
                                        </div>
                                    ))}
                                </div>
                             </section>
                          )}
                    </div>
                </div>
             </div>
          )}
        </div>
      </div>

      <div className="text-center p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl">
          <p className="text-indigo-400 font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Live Preview: Your updates are reflected instantly!
          </p>
      </div>
    </div>
  );
}
