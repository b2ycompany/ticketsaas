"use client";
import Link from "next/link";
import { ShieldCheck, Zap, Globe, BarChart3 } from "lucide-react";

export default function LandingPage() {
  const diferenciais = [
    { title: "Zero Latência", desc: "Integração nativa com Zabbix via Webhooks ultrarrápidos.", icon: <Zap className="text-yellow-400" /> },
    { title: "Multi-tenant Real", desc: "Isolamento total de dados entre os seus clientes e fornecedores.", icon: <Globe className="text-blue-400" /> },
    { title: "SLA Inteligente", desc: "Escalonamento automático baseado em criticidade ITIL.", icon: <BarChart3 className="text-green-400" /> },
    { title: "Pronto para Enterprise", desc: "Preparado para ServiceNow e Jira na fase de implantação.", icon: <ShieldCheck className="text-purple-400" /> }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-black tracking-tighter text-blue-600">TICKETMASTER <span className="text-slate-400 text-sm">v1.0</span></h1>
        <div className="space-x-4">
          <Link href="/login" className="font-bold text-slate-600 hover:text-blue-600 transition">Entrar</Link>
          <Link href="/register" className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/30 transition">Começar Agora</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-8 py-20 text-center">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
          A plataforma de tickets <br />
          <span className="text-blue-600 underline">redefinida.</span>
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          Mais rápido que o Jira, mais simples que o ServiceNow. Gestão de infraestrutura e sistemas com automação Zabbix integrada.
        </p>
      </header>

      {/* Diferenciais */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {diferenciais.map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:scale-105 transition-transform">
              <div className="mb-4">{item.icon}</div>
              <h3 className="font-black text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}