"use client";
import Link from "next/link";
import { Zap, Shield, BarChart, Globe, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Navbar Fixa */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg">
              <Zap className="text-white fill-current" size={20} />
            </div>
            <span className="text-2xl font-black tracking-tighter italic uppercase">TicketMaster</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-blue-600 transition tracking-widest">LOGIN</Link>
            <Link href="/register" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl">START NOW</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section Principal */}
      <section className="pt-44 pb-32 px-8 text-center max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
          <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">SaaS Operational Platform</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] text-slate-900">
          Monitor. Manage. <br />
          <span className="text-blue-600">Resolve.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
          Plataforma de tickets de alta performance integrada com Zabbix, Jira e ServiceNow. O futuro da sua operação começa aqui.
        </p>
        <div className="flex flex-col md:flex-row gap-5 justify-center">
          <Link href="/register" className="bg-blue-600 text-white px-12 py-6 rounded-[30px] font-black text-xl flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-2xl group">
            Começar Agora <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Grid de Diferenciais */}
      <section className="bg-slate-50 py-32 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100">
            <div className="mb-8 p-5 bg-blue-50 rounded-3xl inline-block text-blue-600"><Zap size={32} /></div>
            <h3 className="text-2xl font-black mb-4">Zabbix Gateway</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">Integração nativa para transformar alertas de rede em tickets automáticos.</p>
          </div>
          <div className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100">
            <div className="mb-8 p-5 bg-emerald-50 rounded-3xl inline-block text-emerald-600"><Shield size={32} /></div>
            <h3 className="text-2xl font-black mb-4">Multi-Tenant</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">Isolamento completo de dados entre fornecedores e clientes finais.</p>
          </div>
          <div className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100">
            <div className="mb-8 p-5 bg-purple-50 rounded-3xl inline-block text-purple-600"><BarChart size={32} /></div>
            <h3 className="text-2xl font-black mb-4">SLA Engine</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">Motor de cálculo de prazos em tempo real com alertas visuais de expiração.</p>
          </div>
        </div>
      </section>

      <footer className="py-20 text-center text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">
        &copy; 2026 B2Y Company Solutions
      </footer>
    </div>
  );
}