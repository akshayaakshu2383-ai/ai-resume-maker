"use client";

import { useState, useEffect } from "react";
import ResumeForm from "@/components/resume/ResumeForm";
import ResumePreview from "@/components/resume/ResumePreview";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Save, Loader2, CheckCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";

const initialData = {
    personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
    },
    experience: [
        { role: "", company: "", duration: "", description: "", bulletPoints: [] },
    ],
    education: [
        { degree: "", school: "", year: "" },
    ],
    skills: [],
    projects: [
        { name: "", link: "", duration: "", description: "", bulletPoints: [] },
    ],
    certifications: [
        { name: "", issuer: "", year: "" },
    ],
    languages: [
        { name: "", level: "Native" },
    ],
};

export default function NewResume() {
    const { data: session } = useSession();
    const router = useRouter();
    const [data, setData] = useState(initialData);
    const [template, setTemplate] = useState("minimalist");
    const [step, setStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [title, setTitle] = useState("Untitled Resume");

    useEffect(() => {
        const timer = setTimeout(() => {
            if (data !== initialData || title !== "Untitled Resume") {
                autoSave();
            }
        }, 2000); // 2 second debounce

        return () => clearTimeout(timer);
    }, [data, title, template]);

    const autoSave = async () => {
        if (!session?.user || isSaving || saveSuccess) return;

        // Check if there's enough data to justify an auto-save
        const hasInitialData = data.personalInfo.fullName || title !== "Untitled Resume";
        if (!hasInitialData) return;

        try {
            setIsSaving(true);
            const response = await fetch("/api/resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content: data,
                    template_id: template,
                }),
            });

            const newResume = await response.json();

            if (!response.ok) throw new Error(newResume.error || "Auto-save failed");

            if (newResume && newResume.id) {
                setSaveSuccess(true);
                // Redirect to edit page for this new resume so future auto-saves use the update logic
                router.push(`/resume/edit/${newResume.id}`);
            }
        } catch (error) {
            console.error("Auto-save error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const saveResume = async () => {
        if (!session?.user) return alert("Please sign in to save");

        try {
            setIsSaving(true);
            const response = await fetch("/api/resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content: data,
                    template_id: template,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Failed to save");
            }

            setSaveSuccess(true);
            setTimeout(() => {
                setSaveSuccess(false);
                router.push("/dashboard");
            }, 2000);
        } catch (error: any) {
            console.error("Save error:", error);
            alert(error.message || "Failed to save resume");
        } finally {
            setIsSaving(false);
        }
    };

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
                    <button
                        onClick={saveResume}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-500/20"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : saveSuccess ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                        {saveSuccess ? "Saved!" : "Save Resume"}
                    </button>
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
