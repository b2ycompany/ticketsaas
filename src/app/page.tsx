"use client";
import Link from "next/link";
import { ShieldCheck, Zap, Globe, BarChart3, ChevronRight } from "lucide-react";

export default function LandingPage() {
  const diferenciais = [
    { 
      title: "Integração Zabbix Nativa", 
      desc: "Transforme alertas de infraestrutura em tickets automaticamente sem configuração complexa.", 
      icon: <Zap className="text-yellow-400" size={32} /> 
    },
    { 
      title: "Arquitetura Multi-tenant", 
      desc: "Segurança total. Cada cliente ou fornecedor possui isolamento completo de dados.", 
      icon: <Globe className="text-blue-400" size={32} /> 
    },
    { 
      title: "Gestão de SLA Dinâmica", 
      desc: "Escalonamento inteligente baseado em prioridades ITIL para garantir o cumprimento de prazos.", 
      icon: <BarChart3 className="text-green-400" size={32} /> 
    },
    { 
      title: "Compliance & Auditoria", 
      desc: "Histórico completo de cada ação tomada no ticket para auditorias de conformidade.", 
      icon: <ShieldCheck className="text-purple-400" size={32} /> 
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navegação Superior */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900">
              TICKET<span className="text-blue-600">MASTER</span>
            </h1>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/login" className="font-bold text-slate-500 hover:text-blue-600 transition text-sm uppercase tracking-widest">
              Aceder
            </Link>
            <Link href="/register" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
              Começar Agora
            </Link>
          </div>
        </div>
      </nav>

      {/* Seção Hero */}
      <header className="max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 border border-blue-100">
          <span className="text-blue-600 text-xs font-black uppercase tracking-[0.2em]">SaaS de Próxima Geração</span>
        </div>
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.9]">
          A gestão de tickets <br />
          <span className="text-blue-600">evoluiu.</span>
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Centralize alertas do Zabbix, ServiceNow e Jira numa única interface real-time desenhada para alta performance operacional.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/register" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-10 py-5 rounded-[24px] font-black text-lg hover:bg-slate-900 transition-all shadow-2xl shadow-blue-600/20">
            Criar Minha Instância <ChevronRight size={20} />
          </Link>
          <button className="px-10 py-5 rounded-[24px] font-black text-lg border-2 border-slate-200 hover:bg-slate-50 transition-all">
            Ver Demonstração
          </button>
        </div>
      </header>

      {/* Grid de Diferenciais */}
      <section className="bg-slate-50 py-32 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Porquê somos superiores?</h3>
            <p className="text-slate-500 font-medium">Comparado às ferramentas legadas do mercado.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {diferenciais.map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                <div className="mb-6 p-4 bg-slate-50 rounded-2xl inline-block group-hover:bg-blue-50 transition-colors">
                  {item.icon}
                </div>
                <h4 className="font-black text-xl mb-3 text-slate-900">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-slate-100">
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
          &copy; 2026 B2Y COMPANY - Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}