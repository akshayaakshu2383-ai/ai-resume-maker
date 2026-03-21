"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, ClipboardList, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function NotesSaver() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<{ id: string; title: string; content: string; created_at: string }[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (session) fetchNotes();
  }, [session]);

  const fetchNotes = async () => {
    setError("");
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch notes");
      setNotes(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setFetching(false);
    }
  };

  const saveNote = async () => {
    if (!title || !content) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (res.ok) {
        setTitle("");
        setContent("");
        fetchNotes();
      } else {
        throw new Error(data.error || "Failed to save note");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to delete note", err);
      alert("Failed to delete note");
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ClipboardList className="w-16 h-16 text-slate-700 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Login to Save Notes</h2>
        <p className="text-slate-400">Your notes are securely stored in the cloud.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-center font-bold">
          ⚠️ {error}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm shadow-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-indigo-500" /> New Note
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Note Title"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 focus:outline-none focus:border-indigo-500 font-bold text-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Start typing your thoughts..."
                className="w-full h-64 bg-slate-800/50 border border-slate-700 rounded-xl p-4 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button
                onClick={saveNote}
                disabled={loading || !title || !content}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-500/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Note
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar / List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold px-2">Your Saved Notes</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {fetching ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-slate-700" /></div>
            ) : notes.length === 0 ? (
              <p className="text-slate-500 text-center py-12 border-2 border-dashed border-slate-800 rounded-3xl">No notes yet. Create your first one!</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="absolute top-4 right-4 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h3 className="font-bold text-slate-100 mb-2 pr-6">{note.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{note.content}</p>
                  <div className="mt-4 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                    {new Date(note.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
