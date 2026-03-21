"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FileText, Trash2, Edit3, Loader2, Sparkles, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchResumes();
    }
  }, [session]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/resumes");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch resumes");
      }
      setResumes(data || []);
    } catch (error: any) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to delete");
      }
      
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete resume");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-slate-400 font-medium">Loading your career highlights...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">My Resumes</h1>
          <p className="text-slate-400">Manage and create professional resumes with AI power.</p>
        </div>
        <Link
          href="/resume/new"
          className="flex items-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Create New Resume
        </Link>
      </div>

      {resumes.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl p-16 text-center backdrop-blur-sm"
        >
          <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No resumes found</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            You haven't created any resumes yet. Start building your professional future today!
          </p>
          <Link
            href="/resume/new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all border border-slate-700"
          >
            Get Started <ChevronRight className="w-4 h-4 text-indigo-400" />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resumes.map((resume, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              key={resume.id}
              className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/resume/edit/${resume.id}`}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-300"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteResume(resume.id)}
                    className="p-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors text-slate-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 truncate">{resume.title || "Untitled Resume"}</h3>
              
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                <Clock className="w-4 h-4" />
                Updated {new Date(resume.updated_at).toLocaleDateString()}
              </div>

              <Link
                href={`/resume/edit/${resume.id}`}
                className="w-full py-3 rounded-xl bg-slate-800 group-hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 text-white font-semibold"
              >
                <span>Edit Resume</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Stats/Tip */}
      <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex flex-col md:flex-row items-center gap-6">
        <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-white mb-1">Pro Tip: Use AI to Rewrite</h4>
          <p className="text-slate-400">Our AI can turn simple bullet points into high-impact professional achievement statements. Try it in the editor!</p>
        </div>
      </div>
    </div>
  );
}
