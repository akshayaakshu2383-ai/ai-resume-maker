"use client";

import { useState } from "react";
import { FileText, Sparkles, Loader2, Download, Copy } from "lucide-react";

export default function CoverLetterGenerator() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [resumeData, setResumeData] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const generateCoverLetter = async () => {
    if (!jobTitle || !company || !resumeData) return;
    setLoading(true);
    try {
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cover-letter",
          data: { jobTitle, company, resumeData }
        })
      });
      const data = await response.json();
      if (data.success) {
        setCoverLetter(data.content.rawText || data.content);
      } else {
        alert("Failed to generate cover letter");
      }
    } catch {
      alert("Error generating cover letter");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    alert("Copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-4">AI Cover Letter Generator</h1>
        <p className="text-slate-400 text-lg">Generate personalized cover letters tailored to your dream job</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
              placeholder="e.g., Software Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Company Name</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
              placeholder="e.g., Google"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Your Resume Content</label>
            <textarea
              value={resumeData}
              onChange={(e) => setResumeData(e.target.value)}
              rows={8}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
              placeholder="Paste your resume content or key achievements here..."
            />
          </div>

          <button
            onClick={generateCoverLetter}
            disabled={loading || !jobTitle || !company || !resumeData}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Generate Cover Letter
          </button>
        </div>

        {/* Output */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Generated Cover Letter</h2>
            {coverLetter && (
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Download as text"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 min-h-[400px]">
            {coverLetter ? (
              <pre className="text-slate-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {coverLetter}
              </pre>
            ) : (
              <div className="text-center text-slate-500 py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Your generated cover letter will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}