"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, FileText, Activity, ShieldCheck, Loader2, Search, UserMinus } from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  const [users, setUsers] = useState<{id: string; email: string; role: string; resumeCount: number; created_at: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalResumes: 0 });

  // Simple admin check
  const isAdmin = session?.user?.email === "akshayaakshu2383@gmail.com";

  useEffect(() => {
    if (status === "authenticated" && !isAdmin) {
      redirect("/dashboard");
    }
    if (isAdmin) {
      fetchAdminData();
    }
  }, [status, isAdmin]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { count: resumeCount } = await supabase.from("resumes").select("*", { count: "exact", head: true });
      
      setStats({ 
        totalUsers: userCount || 0, 
        totalResumes: resumeCount || 0 
      });

      // Fetch users and their resume counts
      // Note: In a real app with 1000s of users, we'd use a more efficient query or a Postgres function
      const { data: profiles, error: pError } = await supabase.from("profiles").select("*");
      if (pError) throw pError;

      const { data: resumes, error: rError } = await supabase.from("resumes").select("user_id");
      if (rError) throw rError;

      const userList = profiles.map(p => ({
        ...p,
        resumeCount: resumes.filter(r => r.user_id === p.id).length
      }));

      setUsers(userList);
    } catch (error) {
      console.error("Error fetching admin data:", error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-slate-400 font-medium">Securing admin access...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white">Admin Control Center</h1>
          <p className="text-slate-400">Manage users and monitor system activity.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-400" />
            <span className="text-xs font-bold px-2 py-1 rounded bg-blue-400/10 text-blue-400 uppercase tracking-wider">Total Users</span>
          </div>
          <p className="text-5xl font-extrabold text-white">{stats.totalUsers}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8 text-emerald-400" />
            <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-400/10 text-emerald-400 uppercase tracking-wider">Total Resumes</span>
          </div>
          <p className="text-5xl font-extrabold text-white">{stats.totalResumes}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-purple-400" />
            <span className="text-xs font-bold px-2 py-1 rounded bg-purple-400/10 text-purple-400 uppercase tracking-wider">Avg Resumes/User</span>
          </div>
          <p className="text-5xl font-extrabold text-white">
            {stats.totalUsers > 0 ? (stats.totalResumes / stats.totalUsers).toFixed(1) : 0}
          </p>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">User Directory</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="px-8 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-8 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-8 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider text-center">Resumes</th>
                <th className="px-8 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Joined</th>
                <th className="px-8 py-4 text-sm font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="px-8 py-6 font-medium text-slate-200">{user.email}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center font-bold text-white">{user.resumeCount}</td>
                  <td className="px-8 py-6 text-slate-400 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <UserMinus className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
