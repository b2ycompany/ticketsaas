"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { 
  Zap, Shield, BarChart3, Globe, ChevronRight, CheckCircle2, 
  MessageCircle, Phone, ArrowRight, Cog, HardDrive, Users, Send,
  Layers, Cpu, Activity, MousePointer2, Database
} from "lucide-react";

// --- COMPONENTE DE CONTADOR ANIMADO (EFEITO ODÓMETRO) ---
function Counter({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    motionValue.set(value);
    return springValue.on("change", (latest) => setDisplay(Math.round(latest)));
  }, [value, motionValue, springValue]);

  return <span>{display.toLocaleString()}</span>;
}

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const stats = [
    { label: "Tickets Gerados/Mês", value: 1250400, icon: <Database className="text-blue-500" /> },
    { label: "Uptime da Operação", value: 99, suffix: ".99%", icon: <Activity className="text-emerald-500" /> },
    { label: "Economia de OPEX", value: 45, suffix: "%", icon: <BarChart3 className="text-purple-500" /> },
    { label: "Integrações Ativas", value: 850, icon: <Layers className="text-orange-500" /> }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* 1. NAVEGAÇÃO PREMIUM */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-2xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.1 }} className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/40 cursor-pointer">
              <Zap className="text-white fill-current" size={20} />
            </motion.div>
            <span className="text-2xl font-black tracking-tighter italic uppercase text-slate-950">
              Ticket<span className="text-blue-600">Master</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {["Soluções", "Estatísticas", "Fluxo", "Consultoria"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition tracking-[0.3em] uppercase">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-[10px] font-black text-slate-400 hover:text-slate-900 transition tracking-widest uppercase">Login</Link>
            <Link href="https://wa.me/SEUNUMERO" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-xl uppercase flex items-center gap-2">
              <MessageCircle size={16} /> Comercial
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION DINÂMICA */}
      <header className="relative pt-52 pb-40 px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-40 left-20 w-96 h-96 bg-blue-400 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-400 rounded-full blur-[180px]"></div>
        </div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900 text-white mb-10 shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">The New Era of IT Governance</span>
          </div>
          
          <h1 className="text-7xl md:text-[130px] font-black tracking-tighter mb-12 leading-[0.75] text-slate-950">
            A infraestrutura <br />
            <span className="text-blue-600 italic">sob controlo total.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto mb-20 font-medium leading-relaxed">
            Substitua a complexidade do ServiceNow e a lentidão do Jira por uma plataforma agnóstica. 
            Conecte o seu monitoramento ao atendimento em milissegundos.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/register" className="bg-blue-600 text-white px-14 py-8 rounded-[35px] font-black text-2xl flex items-center justify-center gap-4 hover:bg-slate-900 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.4)] group">
                Iniciar Transformação <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </header>

      {/* 3. NÚMEROS E INDICADORES (ESTATÍSTICAS) */}
      <section id="estatísticas" className="py-24 border-y border-slate-50 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {stats.map((s, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} className="text-center group"
              >
                <div className="inline-flex p-4 rounded-2xl bg-white shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <p className="text-6xl font-black text-slate-900 tracking-tighter">
                  <Counter value={s.value} />{s.suffix}
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 leading-relaxed">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FLUXO DE ATENDIMENTO VISUAL */}
      <section id="fluxo" className="py-40 bg-slate-950 text-white rounded-[80px] mx-4 md:mx-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-32">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">Fluxo de <span className="text-blue-500 italic">Alta Performance</span></h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              O segredo das maiores operações do mundo agora disponível para a sua empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {[
              { title: "Monitorização", desc: "Captura inteligente de eventos e alertas críticos.", icon: <HardDrive /> },
              { title: "Motor de Regras", desc: "Triagem instantânea baseada em regras de negócio.", icon: <Cog /> },
              { title: "Help Desk", desc: "Atendimento unificado para técnicos e fornecedores.", icon: <Users /> },
              { title: "Resolução", desc: "Fecho de tickets com análise de causa raiz e IA.", icon: <CheckCircle2 /> }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05 }}
                className="relative bg-slate-900/50 backdrop-blur-md p-12 rounded-[50px] border border-slate-800 group overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 text-9xl font-black text-white/[0.03] italic">{i + 1}</div>
                <div className="text-blue-500 mb-8 p-4 bg-blue-500/10 rounded-2xl inline-block">{item.icon}</div>
                <h4 className="text-2xl font-black mb-4 group-hover:text-blue-400 transition-colors">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FORMULÁRIO DE PROJETOS E CONSULTORIA COMERCIAL */}
      <section id="consultoria" className="py-48 max-w-7xl mx-auto px-8">
        <div className="bg-slate-50 rounded-[80px] p-12 md:p-24 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <span className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-6 block italic underline">Business & Projects</span>
            <h2 className="text-6xl md:text-7xl font-black tracking-tighter mb-10 leading-none text-slate-950">
              Engrandeça sua <br /> <span className="text-blue-600 italic">operação hoje.</span>
            </h2>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed font-medium">
              Não somos uma plataforma de prateleira. Somos arquitetos de processos. 
              Fale com o nosso time técnico-comercial para um projeto personalizado.
            </p>
            
            <div className="grid grid-cols-1 gap-6">
              {[
                "Redução imediata de 40% em falsos-positivos",
                "Faturamento por Projeto ou Tenant (sem custo por técnico)",
                "Implementação completa em até 48 horas úteis"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-800 font-bold text-lg">
                  <div className="bg-green-100 text-green-600 p-1 rounded-full"><CheckCircle2 size={20} /></div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-12 rounded-[60px] shadow-[0_50px_100px_rgba(0,0,0,0.05)] border border-slate-100 relative">
            <div className="absolute -top-6 -right-6 bg-blue-600 text-white p-6 rounded-3xl shadow-xl rotate-12 hidden md:block">
              <Phone size={24} />
            </div>
            
            <form className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Dados do Consultor Responsável</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Seu Nome" className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all" />
                  <input type="text" placeholder="Sua Empresa" className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all" />
                </div>
              </div>
              <input type="email" placeholder="E-mail Corporativo" className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all" />
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Escopo do Projeto</label>
                 <textarea placeholder="Ex: Integração Zabbix + NOC 24/7 para 500 servidores." className="w-full p-6 bg-slate-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 h-32 transition-all resize-none"></textarea>
              </div>
              <button className="group w-full bg-slate-900 text-white py-8 rounded-[30px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-blue-600 transition-all shadow-2xl">
                <Send size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                Solicitar Proposta Técnica
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 border-t border-slate-50 bg-white">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="flex justify-center gap-12 mb-16">
            <Link href="https://wa.me/SEUNUMERO" className="text-slate-400 hover:text-green-500 transition-colors"><MessageCircle size={32} /></Link>
            <Link href="tel:+SEUNUMERO" className="text-slate-400 hover:text-blue-500 transition-colors"><Phone size={32} /></Link>
          </div>
          <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.6em] mb-4">The Future of ITSM is here</p>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">&copy; 2026 B2Y Company Solutions - TicketMaster v1.0.4</p>
        </div>
      </footer>
    </div>
  );
}