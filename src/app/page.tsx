import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, ClipboardList, Youtube, Search, CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Notes Saver",
      desc: "Securely store and manage your thoughts with our cloud-synced markdown editor.",
      icon: ClipboardList,
      color: "from-emerald-500 to-teal-600",
      link: "/notes",
    },
    {
      title: "YouTube Summariser",
      desc: "Save hours by getting instant AI-powered summaries of any YouTube video.",
      icon: Youtube,
      color: "from-red-500 to-rose-600",
      link: "/youtube",
    },
    {
      title: "AI Job Search",
      desc: "Find your dream role faster with Firecrawl-powered scraping and AI matching.",
      icon: Search,
      color: "from-amber-500 to-orange-600",
      link: "/jobs",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Everything you need,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Powered by AI.
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Boost your productivity with a suite of AI-driven tools. From job hunting to content consumption, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/resume"
              className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-lg font-bold transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-lg font-bold transition-all flex items-center justify-center"
            >
              View Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <Link
              key={idx}
              href={feature.link}
              className="group relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-100">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed mb-6 group-hover:text-slate-300 transition-colors">
                {feature.desc}
              </p>
              <div className="flex items-center text-indigo-400 font-semibold text-sm">
                Explore Tool <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Social Proof/Stats (Optional) */}
      <section className="pb-24 px-4 text-center border-t border-slate-900/50 pt-16">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> AI-Generated Content</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-purple-500" /> Secure Cloud Storage</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-pink-500" /> 10x Productivity</span>
        </div>
      </section>
    </div>
  );
}
