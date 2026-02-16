"use client";
import Link from "next/link";
import { Zap, Shield, BarChart, Globe, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
              <Zap className="text-white fill-current" size={20} />
            </div>
            <span className="text-2xl font-black tracking-tighter italic uppercase text-slate-900">
              Ticket<span className="text-blue-600">Master</span>
            </span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-blue-600 transition tracking-widest uppercase">Login</Link>
            <Link href="/register" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 uppercase">Start Now</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-44 pb-32 px-8 text-center max-w-7xl mx-auto">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 border border-blue-100">
          <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen Ticketing SaaS</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] text-slate-900">
          Simplify your <br />
          <span className="text-blue-600 italic">Operations.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
          A plataforma definitiva para gerir incidentes de infraestrutura. Integração nativa com Zabbix, Jira e ServiceNow.
        </p>
        <div className="flex justify-center">
          <Link href="/register" className="bg-blue-600 text-white px-12 py-6 rounded-[30px] font-black text-xl flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-2xl shadow-blue-500/20 group">
            Começar Agora <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      {/* Diferenciais */}
      <section className="bg-white py-32 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-slate-50 p-10 rounded-[45px] border border-slate-100 hover:scale-105 transition-transform">
            <div className="mb-6 p-4 bg-white rounded-2xl inline-block text-blue-600 shadow-sm"><Zap /></div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Zabbix Native</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">Alertas automáticos transformados em tickets em tempo real.</p>
          </div>
          <div className="bg-slate-50 p-10 rounded-[45px] border border-slate-100 hover:scale-105 transition-transform">
            <div className="mb-6 p-4 bg-white rounded-2xl inline-block text-emerald-600 shadow-sm"><Shield /></div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Multi-Tenant</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">Isolamento total de dados entre clientes e fornecedores.</p>
          </div>
          <div className="bg-slate-50 p-10 rounded-[45px] border border-slate-100 hover:scale-105 transition-transform">
            <div className="mb-6 p-4 bg-white rounded-2xl inline-block text-purple-600 shadow-sm"><BarChart /></div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">SLA Real-time</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">Gestão e controle de prazos com indicadores visuais.</p>
          </div>
        </div>
      </section>

      <footer className="py-20 text-center text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">
        &copy; 2026 B2Y Company Solutions
      </footer>
    </div>
  );
}