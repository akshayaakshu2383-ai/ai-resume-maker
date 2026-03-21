"use client";

import { useState } from "react";
import { Youtube, Sparkles, Loader2, Play, CheckCircle2, ChevronRight } from "lucide-react";

export default function YoutubeSummarizer() {
  const [url, setUrl] = useState("");
  const [manualTranscript, setManualTranscript] = useState("");
  const [useManual, setUseManual] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!url && !manualTranscript) return;
    setLoading(true);
    setSummary(null);
    try {
      const res = await fetch("/api/summarize-youtube", {
        method: "POST",
        body: JSON.stringify({ url, manualTranscript }),
      });
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
      } else {
        alert(data.error || "Failed to summarize video. Check if the video has transcripts enabled.");
      }
    } catch (err) {
      alert("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Input Section */}
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm shadow-2xl mb-12">
        <label className="block text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">YouTube Video URL</label>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Youtube className="h-5 w-5 text-red-500" />
            </div>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-red-500/50 transition-all text-lg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button
            onClick={handleSummarize}
            disabled={loading || (!url && !manualTranscript)}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-red-500/20 whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? "Summarizing..." : "Get AI Summary"}
          </button>
        </div>
        
        <div className="mt-6">
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={useManual}
              onChange={(e) => setUseManual(e.target.checked)}
              className="rounded"
            />
            Or paste transcript manually (if auto-fetch fails)
          </label>
          {useManual && (
            <textarea
              placeholder="Paste the video transcript here..."
              className="w-full mt-4 bg-slate-800/50 border border-slate-700 rounded-2xl p-4 focus:outline-none focus:border-red-500/50 transition-all text-lg min-h-[200px]"
              value={manualTranscript}
              onChange={(e) => setManualTranscript(e.target.value)}
            />
          )}
        </div>
        
        <p className="mt-4 text-xs text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3" /> Works best with educational, tech, and long-form videos.
        </p>
      </div>

      {/* Result Section */}
      {summary && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Overview */}
            <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <Play className="w-6 h-6 text-indigo-500 fill-indigo-500" /> Executive Overview
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg mb-8">
                {summary.overview}
              </p>
              
              <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Conclusion</h3>
                <p className="text-slate-400 italic">"{summary.conclusion}"</p>
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-3xl backdrop-blur-sm">
                <h2 className="text-xl font-bold mb-6 text-indigo-400 flex items-center gap-2">
                   <ChevronRight className="w-5 h-5" /> Key Takeaways
                </h2>
                <ul className="space-y-4">
                    {summary.bulletPoints?.map((point: string, idx: number) => (
                        <li key={idx} className="flex gap-3 text-slate-300">
                            <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">{idx + 1}</span>
                            <span className="text-sm leading-relaxed">{point}</span>
                        </li>
                    ))}
                </ul>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Youtube className="w-10 h-10 text-red-500 animate-pulse" />
                </div>
            </div>
            <h3 className="mt-8 text-xl font-bold text-slate-200">Analyzing Transcript...</h3>
            <p className="text-slate-500 mt-2">Our AI is reading through the video content for you.</p>
        </div>
      )}
    </div>
  );
}
