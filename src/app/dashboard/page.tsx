"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { 
  Zap, Shield, BarChart3, Globe, ChevronRight, CheckCircle2, 
  MessageCircle, Phone, ArrowRight, Cog, HardDrive, Users, Send,
  Layers, Cpu, Activity, Database
} from "lucide-react";

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
  const stats = [
    { label: "Tickets Gerados/Mês", value: 1250400, icon: <Database className="text-blue-500" /> },
    { label: "Uptime da Operação", value: 99, suffix: ".99%", icon: <Activity className="text-emerald-500" /> },
    { label: "Economia de OPEX", value: 45, suffix: "%", icon: <BarChart3 className="text-purple-500" /> },
    { label: "Integrações Ativas", value: 850, icon: <Layers className="text-orange-500" /> }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden scroll-smooth">
      
      {/* 1. NAVEGAÇÃO COM LINKS CORRIGIDOS */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-2xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/40">
              <Zap className="text-white fill-current" size={20} />
            </div>
            <span className="text-2xl font-black tracking-tighter italic uppercase text-slate-950 font-bold">
              Ticket<span className="text-blue-600">Master</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {/* Href corrigido para bater com os IDs das seções */}
            <a href="#soluções" className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition tracking-[0.3em] uppercase">Soluções</a>
            <a href="#estatísticas" className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition tracking-[0.3em] uppercase">Estatísticas</a>
            <a href="#fluxo" className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition tracking-[0.3em] uppercase">Fluxo</a>
            <a href="#consultoria" className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition tracking-[0.3em] uppercase">Consultoria</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-xl uppercase">
              Login Operador
            </Link>
          </div>
        </div>
      </nav>

      <header className="relative pt-52 pb-40 px-8">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-7xl mx-auto text-center">
          <h1 className="text-7xl md:text-[130px] font-black tracking-tighter mb-12 leading-[0.75] text-slate-950">
            Governança em <br /> <span className="text-blue-600 italic">Tempo Real.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto mb-20 font-medium">
            Integre qualquer ferramenta de monitorização à sua central de serviços em minutos.
          </p>
          <Link href="/register" className="bg-blue-600 text-white px-14 py-8 rounded-[35px] font-black text-2xl inline-flex items-center gap-4 hover:bg-slate-900 transition-all shadow-2xl">
            Provisionar Agora <ChevronRight size={24} />
          </Link>
        </motion.div>
      </header>

      {/* SEÇÃO SOLUÇÕES (ID ADICIONADO) */}
      <section id="soluções" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-12 bg-slate-50 rounded-[50px] border border-slate-100">
            <Cpu className="text-blue-600 mb-6" size={40} />
            <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase">NOC Integration</h3>
            <p className="text-slate-500 font-medium leading-relaxed italic">Sincronismo direto com Zabbix e Nagios para abertura de incidentes críticos.</p>
          </div>
          <div className="p-12 bg-slate-50 rounded-[50px] border border-slate-100">
            <Shield className="text-blue-600 mb-6" size={40} />
            <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase">Zero Trust Security</h3>
            <p className="text-slate-500 font-medium leading-relaxed italic">Autenticação robusta e isolamento total de dados entre diferentes empresas.</p>
          </div>
          <div className="p-12 bg-slate-50 rounded-[50px] border border-slate-100">
            <Globe className="text-blue-600 mb-6" size={40} />
            <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase">Universal Gateway</h3>
            <p className="text-slate-500 font-medium leading-relaxed italic">Receba alertas de qualquer ferramenta via Webhook JSON universal.</p>
          </div>
        </div>
      </section>

      {/* SEÇÃO ESTATÍSTICAS (ID ADICIONADO) */}
      <section id="estatísticas" className="py-24 border-y border-slate-50 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-6xl font-black text-slate-900 tracking-tighter">
                <Counter value={s.value} />{s.suffix}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 italic">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO FLUXO (ID ADICIONADO) */}
      <section id="fluxo" className="py-40 bg-slate-950 text-white rounded-[80px] mx-4 md:mx-8">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-6xl font-black mb-20 tracking-tighter uppercase italic">O Fluxo da <span className="text-blue-500">B2Y</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            <div className="p-10 bg-slate-900 rounded-[40px] border border-slate-800">
              <span className="text-blue-500 font-black text-4xl">01</span>
              <h4 className="text-xl font-black mt-4 uppercase italic">Alerta</h4>
            </div>
            <div className="p-10 bg-slate-900 rounded-[40px] border border-slate-800">
              <span className="text-blue-500 font-black text-4xl">02</span>
              <h4 className="text-xl font-black mt-4 uppercase italic">Triagem</h4>
            </div>
            <div className="p-10 bg-slate-900 rounded-[40px] border border-slate-100/10">
              <span className="text-blue-500 font-black text-4xl">03</span>
              <h4 className="text-xl font-black mt-4 uppercase italic">Execução</h4>
            </div>
            <div className="p-10 bg-slate-900 rounded-[40px] border border-slate-800">
              <span className="text-blue-500 font-black text-4xl">04</span>
              <h4 className="text-xl font-black mt-4 uppercase italic">SLA Close</h4>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO CONSULTORIA (ID ADICIONADO) */}
      <section id="consultoria" className="py-48 max-w-7xl mx-auto px-8">
        <div className="bg-blue-600 rounded-[60px] p-24 text-white grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-7xl font-black tracking-tighter mb-8 italic">Pronto para o Próximo Nível?</h2>
            <p className="text-blue-100 text-xl font-medium mb-12 italic">Fale com o nosso time de engenharia de projetos comerciais.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-lg font-bold"><CheckCircle2 /> Atendimento Humano 24/7</div>
              <div className="flex items-center gap-4 text-lg font-bold"><CheckCircle2 /> Implantação sem Taxa de Setup</div>
            </div>
          </div>
          <div className="bg-white p-12 rounded-[50px] shadow-2xl">
            <form className="space-y-6">
              <input type="text" placeholder="Nome" className="w-full p-5 bg-slate-50 rounded-3xl border-none font-bold text-slate-900" />
              <input type="email" placeholder="E-mail Corporativo" className="w-full p-5 bg-slate-50 rounded-3xl border-none font-bold text-slate-900" />
              <textarea placeholder="Seu Desafio" className="w-full p-5 bg-slate-50 rounded-3xl border-none font-bold text-slate-900 h-32"></textarea>
              <button className="w-full bg-slate-900 py-6 rounded-3xl font-black uppercase tracking-widest text-xs">Enviar Proposta</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="py-20 text-center border-t border-slate-50">
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] italic">&copy; 2026 B2Y COMPANY - PLATAFORMA DE OPERAÇÕES CRÍTICAS</p>
      </footer>
    </div>
  );
}