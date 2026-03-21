"use client";

import { useState, useEffect } from "react";
import ResumeForm from "@/components/resume/ResumeForm";
import ResumePreview from "@/components/resume/ResumePreview";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Save, Loader2, CheckCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function EditResume() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = useParams();
  
  const [data, setData] = useState<any>(null);
  const [template, setTemplate] = useState("minimalist");
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user && id) {
      fetchResume();
    }
  }, [session, id]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/resumes/${id}`);
      const resume = await response.json();

      if (!response.ok) throw new Error(resume.error || "Failed to fetch resume");
      
      setData(resume.content);
      setTemplate(resume.template_id);
      setTitle(resume.title);
    } catch (error) {
      console.error("Error fetching resume:", error);
      alert("Failed to load resume");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data) {
        updateResume(true); // true means silent auto-save
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [data, title, template]);

  const updateResume = async (isAutoSave = false) => {
    if (!session?.user) return;

    try {
      if (!isAutoSave) setIsSaving(true);
      const response = await fetch(`/api/resumes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: data,
          template_id: template,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update");
      }
      
      if (!isAutoSave) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Save error:", error);
      if (!isAutoSave) alert("Failed to save resume");
    } finally {
      if (!isAutoSave) setIsSaving(false);
    }
  };

  if (loading) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-slate-950">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-slate-400 font-medium">Loading your draft...</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Action Bar */}
      <div className="sticky top-20 z-40 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </Link>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-none text-xl font-bold focus:outline-none text-white focus:ring-1 focus:ring-indigo-500 rounded px-2"
              placeholder="Resume Title"
            />
          </div>
          <div className="flex items-center gap-4">
            {isSaving && (
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                Auto-saving...
              </div>
            )}
            <button
              onClick={() => updateResume(false)}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-500/20"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : saveSuccess ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saveSuccess ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
          {/* Left: Form */}
          <ResumeForm
            data={data}
            onChange={setData}
            currentStep={step}
            onStepChange={setStep}
          />

          {/* Right: Preview */}
          <ResumePreview
            data={data}
            template={template}
            onTemplateChange={setTemplate}
          />
        </div>
      </div>
    </div>
  );
}
