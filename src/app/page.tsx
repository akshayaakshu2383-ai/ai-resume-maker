import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles, Layout, Download } from "lucide-react";

export default function Home() {
  const benefits = [
    {
      title: "AI-Powered Writing",
      desc: "Our advanced AI rewrites your raw bullet points into professional, high-impact statements.",
      icon: Sparkles,
      color: "from-indigo-500 to-purple-600",
    },
    {
      title: "Modern Templates",
      desc: "Choose from 5+ designer-crafted templates that are ATS-friendly and visually stunning.",
      icon: Layout,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Instant PDF Export",
      desc: "Download your polished resume in seconds with perfect formatting every time.",
      icon: Download,
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="relative overflow-hidden min-h-screen bg-slate-950 text-white">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Career Growth</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
            Build a Resume that{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Gets You Hired.
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop struggling with formatting and wording. Let our AI craft a professional resume that highlights your strengths and matches top industry standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/dashboard"
              className="px-10 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-xl font-bold transition-all shadow-2xl shadow-indigo-500/40 flex items-center justify-center gap-3 group"
            >
              Start Building Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features/Benefits Grid */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="group relative p-10 rounded-3xl bg-slate-900/40 border border-slate-800/50 hover:border-indigo-500/50 transition-all duration-500 backdrop-blur-xl"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-8 shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-100">{benefit.title}</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof/Footer Section */}
      <section className="pb-32 px-4 text-center">
        <div className="flex flex-wrap justify-center gap-12 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="flex items-center gap-3 text-lg"><CheckCircle2 className="w-6 h-6 text-indigo-500" /> ATS-Optimized</span>
            <span className="flex items-center gap-3 text-lg"><CheckCircle2 className="w-6 h-6 text-purple-500" /> Professional Templates</span>
            <span className="flex items-center gap-3 text-lg"><CheckCircle2 className="w-6 h-6 text-pink-500" /> AI Rewriting</span>
        </div>
      </section>
    </div>
  );
}
