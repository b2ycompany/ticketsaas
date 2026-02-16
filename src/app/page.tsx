"use client";
import Link from "next/link";
import { 
  Zap, Shield, BarChart3, Globe, ChevronRight, CheckCircle2, 
  Users, Server, Activity, ArrowUpRight, Cpu, Layers 
} from "lucide-react";

export default function LandingPage() {
  const stats = [
    { label: "Tickets Gerados/Mês", value: "+1.2M", icon: <TicketIcon /> },
    { label: "Uptime da Plataforma", value: "99.99%", icon: <Activity size={20} /> },
    { label: "Resolução via IA/Automação", value: "65%", icon: <Cpu size={20} /> },
    { label: "Integrações Ativas", value: "450+", icon: <Layers size={20} /> }
  ];

  const partners = ["Microsoft", "AWS", "Zabbix Certified", "Cisco", "Google Cloud", "RedHat"];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/40">
              <Zap className="text-white fill-current" size={20} />
            </div>
            <span className="text-2xl font-black tracking-tighter italic uppercase text-slate-900">
              Ticket<span className="text-blue-600">Master</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {["Soluções", "Diferenciais", "Números", "Preços"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-black text-slate-400 hover:text-blue-600 transition tracking-widest uppercase">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:block text-xs font-black text-slate-900 hover:text-blue-600 transition tracking-widest uppercase">Login</Link>
            <Link href="/register" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 uppercase">
              Agendar Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="relative pt-48 pb-32 px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-40 left-20 w-72 h-72 bg-blue-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900 text-white mb-10 shadow-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live v1.0 - Ready for Zabbix 7.0</span>
          </div>
          
          <h1 className="text-7xl md:text-[120px] font-black tracking-tighter mb-10 leading-[0.8] text-slate-950">
            A IA que resolve, <br />
            <span className="text-blue-600 italic">não apenas regista.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
            Desenvolvido pela <span className="text-slate-900 font-bold">B2Y Company</span> para substituir ferramentas lentas. 
            Integração nativa com infraestrutura e gestão de SLA em milissegundos.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register" className="bg-blue-600 text-white px-12 py-7 rounded-[32px] font-black text-xl flex items-center justify-center gap-4 hover:bg-slate-900 transition-all shadow-2xl shadow-blue-500/40 group">
              Começar Teste Grátis <ChevronRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <div className="flex items-center gap-4 px-8 py-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => <div key={i} className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white"></div>)}
              </div>
              <p className="text-xs font-bold text-slate-500 tracking-tight text-left">
                <span className="text-slate-900 block font-black">+500 empresas</span> já migraram este mês.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 3. SOCIAL PROOF (Parcerias) */}
      <section className="py-20 border-y border-slate-50 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12">Trusted by Infrastructure Leaders</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all">
            {partners.map(p => (
              <span key={p} className="text-2xl font-black tracking-tighter text-slate-900">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. KEY METRICS (Indicadores) */}
      <section id="números" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="p-10 rounded-[48px] bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="text-blue-600 mb-6">{s.icon}</div>
                <h4 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{s.value}</h4>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NOSSO DIFERENCIAL (O que vende) */}
      <section id="diferenciais" className="py-32 bg-slate-950 text-white rounded-[60px] mx-4 md:mx-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-32"></div>
        <div className="max-w-7xl mx-auto px-12 relative z-10">
          <div className="max-w-2xl mb-24">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">
              Porquê escolher o <br /> <span className="text-blue-500 italic">TicketMaster?</span>
            </h2>
            <p className="text-slate-400 text-xl font-medium">Não somos apenas um formulário. Somos o cérebro da sua operação de TI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="h-14 w-14 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500 shrink-0">
                  <Zap size={28} />
                </div>
                <div>
                  <h4 className="text-2xl font-black mb-3">Automação de Infraestrutura</h4>
                  <p className="text-slate-400 leading-relaxed font-medium text-lg">
                    Detectamos falhas via Zabbix e abrimos o ticket antes do seu cliente perceber. 
                    Reduzimos o MTTR em até 45%.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="h-14 w-14 rounded-2xl bg-emerald-600/20 flex items-center justify-center text-emerald-500 shrink-0">
                  <Shield size={28} />
                </div>
                <div>
                  <h4 className="text-2xl font-black mb-3">Multi-Tenancy SaaS 2.0</h4>
                  <p className="text-slate-400 leading-relaxed font-medium text-lg">
                    Gerencie múltiplos clientes e fornecedores com total isolamento de dados e dashboards customizados.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 p-12 rounded-[50px] border border-slate-800 backdrop-blur-md">
              <h4 className="text-xl font-black mb-8 flex items-center gap-3 italic">
                <BarChart3 className="text-blue-500" /> Comparativo de Mercado
              </h4>
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Setup inicial</span>
                  <span className="font-black text-emerald-400 italic">5 Minutos</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Preço por Agente</span>
                  <span className="font-black text-emerald-400 italic">Preço Fixo SaaS</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Zabbix Sync</span>
                  <span className="font-black text-emerald-400 italic">Nativo (Real-time)</span>
                </div>
              </div>
              <Link href="/register" className="mt-12 w-full bg-white text-slate-900 py-6 rounded-3xl font-black text-center block hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest text-xs">
                Migrar do Jira Agora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FINAL */}
      <section className="py-40 text-center max-w-5xl mx-auto px-8">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 text-slate-950">
          Pronto para o <br /> <span className="text-blue-600 underline underline-offset-8">Próximo Nível?</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2 font-bold text-slate-400">
            <CheckCircle2 className="text-green-500" size={18} /> Sem Cartão de Crédito
          </div>
          <div className="flex items-center gap-2 font-bold text-slate-400">
            <CheckCircle2 className="text-green-500" size={18} /> Setup em 5 Minutos
          </div>
          <div className="flex items-center gap-2 font-bold text-slate-400">
            <CheckCircle2 className="text-green-500" size={18} /> Suporte Enterprise 24/7
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-left">
             <span className="text-xl font-black italic">TICKET<span className="text-blue-600">MASTER</span></span>
             <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest tracking-widest">By B2Y Company Solutions &copy; 2026</p>
          </div>
          <div className="flex gap-10">
            {["Termos", "Privacidade", "Status", "API"].map(link => (
              <a key={link} className="text-xs font-black text-slate-400 hover:text-blue-600 transition uppercase tracking-widest cursor-pointer">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-componente iconográfico
function TicketIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
      <path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>
    </svg>
  );
}