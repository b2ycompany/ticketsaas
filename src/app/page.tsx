"use client";
import Link from "next/link";
import { Zap, Shield, BarChart, Globe, ChevronRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const features = [
    { title: "Zabbix Native", desc: "Integração instantânea com monitorização de infraestrutura.", icon: <Zap className="text-yellow-500" /> },
    { title: "SLA Control", desc: "Gestão rigorosa de prazos com escalonamento automático.", icon: <BarChart className="text-blue-500" /> },
    { title: "Multi-Tenant", desc: "Isolamento total de dados para múltiplos clientes e fornecedores.", icon: <Shield className="text-emerald-500" /> },
    { title: "Enterprise Ready", desc: "Preparado para fluxos complexos de Help Desk e Service Desk.", icon: <Globe className="text-purple-500" /> }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Menu Superior */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
              <Zap className="text-white fill-current" size={20} />
            </div>
            <span className="text-2xl font-black tracking-tighter italic">TICKET<span className="text-blue-600">MASTER</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <Link href="#features" className="text-xs font-bold text-slate-500 hover:text-blue-600 transition tracking-widest">FUNCIONALIDADES</Link>
            <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-blue-600 transition tracking-widest">LOGIN</Link>
            <Link href="/register" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">START NOW</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-44 pb-32 px-8 text-center max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
          <CheckCircle2 size={14} className="text-blue-600" />
          <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">High Performance Ticketing SaaS</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] text-slate-900">
          Simplify your <br />
          <span className="text-blue-600">Operations.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
          A plataforma definitiva para gerir incidentes de infraestrutura e sistemas. Integração nativa com Zabbix, Jira e ServiceNow.
        </p>
        <div className="flex flex-col md:flex-row gap-5 justify-center">
          <Link href="/register" className="bg-blue-600 text-white px-12 py-6 rounded-[30px] font-black text-xl flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-2xl shadow-blue-500/30 group">
            Começar Grátis <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-12 py-6 rounded-[30px] font-black text-xl border-2 border-slate-200 hover:bg-slate-50 transition-all text-slate-700">
            Agendar Demo
          </button>
        </div>
      </section>

      {/* Grid de Features */}
      <section id="features" className="bg-slate-50 py-32 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group">
              <div className="mb-8 p-5 bg-slate-50 rounded-3xl inline-block group-hover:bg-blue-50 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{f.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center">
        <div className="flex justify-center gap-2 mb-6">
           <div className="h-2 w-2 rounded-full bg-blue-600"></div>
           <div className="h-2 w-2 rounded-full bg-slate-200"></div>
           <div className="h-2 w-2 rounded-full bg-slate-200"></div>
        </div>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">&copy; 2026 B2Y COMPANY SOLUTIONS</p>
      </footer>
    </div>
  );
}