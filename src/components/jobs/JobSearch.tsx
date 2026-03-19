"use client";

import { useState } from "react";
import { Search, Briefcase, MapPin, ExternalLink, Loader2, Sparkles, Filter } from "lucide-react";

export default function JobSearch() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setJobs([]);
    setError("");
    try {
      const res = await fetch("/api/job-search", {
        method: "POST",
        body: JSON.stringify({ query, location }),
      });
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      } else {
        setError(data.error || "Search failed. Check your Firecrawl API key.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-center font-bold">
          ⚠️ {error}
        </div>
      )}
      {/* Search Bar */}
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm shadow-2xl mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-indigo-500 transition-all font-medium"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Location (City, Country, or Remote)"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-indigo-500 transition-all font-medium"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !query}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-500/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {loading ? "Hunting for Jobs..." : "Find AI-Matched Jobs"}
        </button>
      </div>

      {/* Results Header */}
      {jobs.length > 0 && (
        <div className="flex justify-between items-center mb-8 px-2">
            <h2 className="text-2xl font-black flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-indigo-500" /> Recommended for You
            </h2>
            <div className="text-sm text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <Filter className="w-4 h-4" /> Best Match
            </div>
        </div>
      )}

      {/* Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job, idx) => (
          <div key={idx} className="group p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" />
            <h3 className="text-2xl font-bold text-slate-100 mb-2 truncate pr-8">{job.title}</h3>
            <p className="text-xl font-semibold text-indigo-400 mb-4">{job.company}</p>
            
            <div className="flex items-center gap-4 text-slate-400 text-sm mb-8">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location || "Not Specified"}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="uppercase font-extrabold tracking-tighter text-[10px] px-2 py-1 rounded bg-slate-800">Fresh Post</span>
            </div>

            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold transition-all w-full justify-center group/btn"
            >
              Apply Now
              <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </a>
          </div>
        ))}
      </div>

      {/* Loading & Empty States */}
      {loading && (
          <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin mb-6" />
              <h3 className="text-xl font-bold">Scanning Web...</h3>
              <p className="text-slate-500">Firecrawl is scraping the latest listings for your criteria.</p>
          </div>
      )}

      {!loading && query && jobs.length === 0 && (
          <div className="text-center py-20 px-8 border-2 border-dashed border-slate-800 rounded-3xl opacity-50">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-700" />
              <h3 className="text-xl font-bold">No jobs found yet</h3>
              <p className="mt-2">Try a broader search or different location.</p>
          </div>
      )}
    </div>
  );
}
