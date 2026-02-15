"use client";
import Link from "next/link";
import { Zap, Shield, BarChart, Globe, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
              <Zap className="text-white" size={20} />
            </div>
            <span className="text-2xl font-black tracking-tighter">TICKETMASTER</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition">LOGIN</Link>
            <Link href="/register" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">START FREE</Link>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 border border-blue-100">
            <span className="text-blue-600 text-xs font-black uppercase tracking-widest text-[10px]">Next-Gen Ticketing SaaS</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85]">
            Manage tickets <br />
            <span className="text-blue-600">at light speed.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium">
            The only platform integrated with Zabbix, ServiceNow, and Jira. Built for high-performance infrastructure teams.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-blue-600 text-white px-10 py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-2xl shadow-blue-500/20">
              Create Your Instance <ChevronRight size={20} />
            </Link>
          </div>
        </section>

        <section className="bg-slate-50 py-32 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
              <Zap className="text-blue-600 mb-6" size={40} />
              <h3 className="text-2xl font-black mb-4">Zabbix Native</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Automatic ticket creation from infrastructure alerts with zero latency.</p>
            </div>
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
              <Shield className="text-purple-600 mb-6" size={40} />
              <h3 className="text-2xl font-black mb-4">Multi-Tenant</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Enterprise-grade security with total data isolation for your clients.</p>
            </div>
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
              <BarChart className="text-emerald-600 mb-6" size={40} />
              <h3 className="text-2xl font-black mb-4">Real-time SLA</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Visual countdowns and automatic escalation for critical incidents.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 text-center border-t border-slate-100">
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">&copy; 2026 B2Y COMPANY - SaaS DIVISION</p>
      </footer>
    </div>
  );
}