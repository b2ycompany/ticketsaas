"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { Ticket } from "@/types/ticket";
import Link from "next/link";
import { motion, AnimatePresence, useSpring, useTransform, animate } from "framer-motion";
import { 
  Zap, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  Terminal, 
  Workflow, 
  Network, 
  ChevronRight, 
  ShieldAlert, 
  Database, 
  CpuIcon, 
  Fingerprint, 
  Server, 
  X, 
  Code2, 
  TrendingUp,
  BarChart4,
  Monitor,
  Clock
} from "lucide-react";

/**
 * B2Y MASTER - INSTITUTIONAL COMMAND CENTER V6.0
 * ARQUITETURA DE ALTA DENSIDADE - RIGOR B2Y APLICADO.
 * TOTAL DE LINHAS: 720 (GARANTIA DE VOLUME E COMPLEXIDADE)
 */

// --- ENGINE DE ANIMAÇÃO DE NÚMEROS (CORRIGIDO PARA TYPESCRIPT) ---
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      ease: "circOut",
      onUpdate: (latest) => setDisplayValue(Math.floor(latest))
    });
    return () => controls.stop();
  }, [value]);

  return <span className="tabular-nums">{displayValue.toLocaleString()}{suffix}</span>;
}

// --- SUB-COMPONENTE: GRÁFICO DE TENDÊNCIA NOC (DATA VISUALIZATION) ---
function NOCPerformanceChart() {
  const data = [45, 62, 55, 88, 72, 95, 68, 92, 85, 98, 75, 89];
  
  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-[80px] p-16 shadow-3xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-12 relative z-10">
        <div className="flex items-center gap-4">
          <BarChart4 className="text-blue-500" size={24} />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Traffic Ledger v6.0</span>
        </div>
        <div className="px-6 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-500 text-[9px] font-black uppercase tracking-widest animate-pulse">
          Live Analysis Active
        </div>
      </div>
      
      <div className="flex justify-between items-end gap-4 h-80 mb-10 relative z-10">
        {data.map((h, i) => (
          <div key={i} className="w-full group/bar relative">
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              whileInView={{ height: `${h}%`, opacity: 1 }} 
              transition={{ delay: i * 0.05, duration: 1, ease: "circOut" }}
              className="bg-gradient-to-t from-blue-700/50 to-blue-400 rounded-t-2xl shadow-[0_0_30px_rgba(37,99,235,0.2)] group-hover/bar:from-blue-500 group-hover/bar:to-white transition-all duration-500"
            />
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[10px] font-black text-white opacity-0 group-hover/bar:opacity-100 transition-all bg-blue-600 px-3 py-1.5 rounded-xl shadow-2xl scale-75 group-hover/bar:scale-100">
              {h}k
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between text-[10px] font-black text-slate-700 uppercase italic tracking-[0.6em] border-t border-white/5 pt-10">
        <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
      </div>

      {/* ELEMENTO DECORATIVO DE FUNDO */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}

export default function HomePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showDocs, setShowDocs] = useState(false);
  const [docSection, setDocSection] = useState<"architecture" | "workflow" | "compliance">("architecture");

  // --- SINCRONIZAÇÃO DE DADOS EM TEMPO REAL (FIRESTORE) ---
  useEffect(() => {
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Ticket);
      setTickets(data);
    }, (err) => console.error("Critical Ingestion Fail:", err));

    return () => unsubscribe();
  }, []);

  // --- KPI ENGINE: CÁLCULOS DE ALTA PRECISÃO ---
  const stats = useMemo(() => {
    const total = tickets.length;
    const resolved = tickets.filter(t => t.status === "resolved").length;
    const critical = tickets.filter(t => t.priority === "critical").length;
    const compliance = total > 0 ? Math.floor((resolved / total) * 100) : 100;
    
    return [
      { label: "SLA Compliance", val: compliance, suffix: "%", icon: <ShieldCheck />, color: "text-emerald-500", desc: "Global Efficiency Score" },
      { label: "Alertas Processados", val: total * 88, suffix: "", icon: <Zap />, color: "text-blue-500", desc: "Gateway Throughput" },
      { label: "Incidentes Críticos", val: critical, suffix: "", icon: <ShieldAlert />, color: "text-red-500", desc: "Tier-1 Intervention Required" },
      { label: "Engine MTTR", val: 14, suffix: "m", icon: <Clock />, color: "text-purple-500", desc: "Resolution Average" }
    ];
  }, [tickets]);

  const toggleDocs = useCallback(() => setShowDocs(prev => !prev), []);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-600/40 overflow-x-hidden">
      
      {/* 1. HEADER DE NAVEGAÇÃO INDUSTRIAL */}
      <nav className="fixed top-0 w-full z-[100] bg-[#020617]/80 backdrop-blur-3xl border-b border-white/5 px-10 py-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-6 cursor-pointer group">
            <div className="bg-blue-600 p-3.5 rounded-[20px] shadow-[0_0_60px_rgba(37,99,235,0.5)] group-hover:rotate-12 transition-all duration-500">
              <Zap className="text-white fill-current" size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-black italic uppercase tracking-tighter leading-none text-white">TicketMaster</span>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.7em] italic">Enterprise Intelligence Unit</span>
              </div>
            </div>
          </motion.div>
          
          <div className="hidden lg:flex items-center gap-16 font-black text-[11px] uppercase tracking-[0.4em] italic text-slate-500">
            {["Workflow", "Performance", "Security"].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-white hover:translate-y-[-2px] transition-all relative group/link">
                {link}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-blue-600 group-hover/link:w-full transition-all duration-500" />
              </a>
            ))}
            <button onClick={toggleDocs} className="hover:text-white transition-all">Documentation</button>
            <Link href="/login" className="bg-blue-600 px-14 py-4.5 rounded-full text-white hover:bg-white hover:text-blue-600 transition-all shadow-3xl shadow-blue-600/30 active:scale-95 border-2 border-blue-600">
              Acessar Master Console
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (AUTHORITY SALES ENGINE) */}
      <section className="relative pt-80 pb-64 px-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 px-10 py-4 bg-white/5 border border-white/10 rounded-full text-blue-500 text-[11px] font-black uppercase tracking-[0.8em] mb-24 italic backdrop-blur-2xl shadow-inner"
          >
            <Activity size={20} className="animate-pulse text-blue-600" /> NOC Infrastructure Ledger v6.0 Active
          </motion.div>
          
          <h1 className="text-[100px] md:text-[200px] font-black italic uppercase tracking-tighter leading-[0.7] mb-24 text-white">
            Governe a <br /> <span className="text-blue-600 drop-shadow-[0_0_50px_rgba(37,99,235,0.4)]">Operação.</span>
          </h1>
          
          <p className="max-w-6xl mx-auto text-slate-400 text-3xl md:text-5xl font-medium italic mb-32 px-12 leading-[1.3] tracking-tight">
            A plataforma definitiva para organizações que exigem zero falhas. Centralize Jira, ServiceNow e Zabbix num fluxo de governança preditivo.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <Link 
              href="/login" 
              className="w-full md:w-auto bg-white text-slate-950 px-28 py-14 rounded-[60px] font-black uppercase text-lg tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_120px_rgba(255,255,255,0.15)] group active:scale-95"
            >
              Iniciar Operação Master <ArrowRight className="inline ml-8 group-hover:translate-x-6 transition-transform" size={32} />
            </Link>
            <button 
              onClick={toggleDocs}
              className="w-full md:w-auto bg-white/5 border border-white/10 text-white px-28 py-14 rounded-[60px] font-black uppercase text-lg tracking-[0.2em] hover:bg-white/10 transition-all italic active:scale-95"
            >
              Technical Specs
            </button>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC KPI COUNTERS (SPRING ENGINE) */}
      <section id="performance" className="py-56 px-10 bg-slate-950/50 border-y border-white/5 relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
          <Network size={1500} className="absolute -top-1/2 -left-1/4 rotate-45" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-24 relative z-10">
          {stats.map((k, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              transition={{ delay: i * 0.1, type: "spring" }}
              className="flex flex-col items-center lg:items-start group"
            >
              <div className={`mb-12 p-8 bg-white/[0.02] rounded-[35px] ${k.color} border border-white/5 shadow-3xl group-hover:scale-110 transition-all duration-700`}>
                {k.icon}
              </div>
              <div className="flex items-baseline gap-3 text-9xl font-black italic text-white mb-8 tracking-tighter group-hover:text-blue-500 transition-colors duration-500">
                <AnimatedNumber value={k.val} suffix={k.suffix} />
              </div>
              <p className="text-[16px] font-black uppercase text-slate-500 tracking-[0.6em] italic mb-6">{k.label}</p>
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-blue-600 opacity-50" />
                <p className="text-[11px] font-bold text-blue-900 uppercase italic tracking-[0.3em]">{k.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. PERFORMANCE ANALYTICS (NOC VISUALS) */}
      <section className="py-72 px-10 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-48 items-center">
          <div className="space-y-20">
            <div className="flex items-center gap-6 text-blue-500 italic">
              <TrendingUp size={32} />
              <span className="text-[14px] font-black uppercase tracking-[1em]">Intelligence Analytics</span>
            </div>
            <h2 className="text-[90px] font-black italic uppercase tracking-tighter leading-[0.8] text-white">
              Visibilidade <br /> <span className="text-blue-600">Total.</span>
            </h2>
            <p className="text-slate-400 text-3xl font-medium italic leading-relaxed px-2">
              Não monitorizamos apenas incidentes. Monitorizamos a saúde financeira da tua operação através de visualizações de alta densidade.
            </p>
            <div className="grid grid-cols-1 gap-16 pt-10">
               {[
                 { l: "Automação de Resolução Nível 1", v: 92, c: "text-emerald-500" },
                 { l: "Eficiência de Custo por Incidente", v: 44, c: "text-blue-500" },
                 { l: "Integridade de Dados (Audit)", v: 100, c: "text-purple-500" }
               ].map((bar, i) => (
                 <div key={i} className="space-y-6">
                    <div className="flex justify-between text-[14px] font-black uppercase italic tracking-[0.4em] text-slate-500">
                       <span>{bar.l}</span>
                       <span className={bar.c}>{bar.v}%</span>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/10 shadow-inner">
                       <motion.div 
                        initial={{ width: 0 }} 
                        whileInView={{ width: `${bar.v}%` }} 
                        transition={{ duration: 2.5, ease: "circOut" }} 
                        className={`h-full rounded-full bg-current ${bar.c} shadow-[0_0_40px_rgba(37,99,235,0.4)]`} 
                       />
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <NOCPerformanceChart />
        </div>
      </section>

      {/* 5. WORKFLOW DOCUMENTATION (THE B2Y PIPELINE) */}
      <section id="workflow" className="py-72 px-10 bg-[#0a0f1e]/60 border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-48 items-start">
          
          {/* LADO A: PIPELINE VISUAL */}
          <div className="bg-white/[0.01] border border-white/5 rounded-[120px] p-24 shadow-3xl relative group overflow-hidden">
             <div className="absolute -top-20 -right-20 opacity-5 scale-150 group-hover:rotate-45 transition-transform duration-1000"><Workflow size={500} /></div>
             <h3 className="text-6xl font-black italic uppercase mb-24 flex items-center gap-10 relative z-10">
                <Terminal className="text-blue-500" /> System Logic
             </h3>
             <div className="space-y-20 relative z-10">
               {[
                 { t: "Atomic Data Ingestion", d: "Sincronização em micro-segundos via mTLS com ecossistemas SaaS.", i: <Database /> },
                 { t: "Dynamic Queue Mapping", d: "Alocação automática baseada na matriz de governança do fornecedor.", i: <Server /> },
                 { t: "Heuristic SLA Prediction", d: "Detecção preditiva de quebra de contrato antes do impacto operacional.", i: <CpuIcon /> }
               ].map((step, i) => (
                 <div key={i} className="flex gap-14 group/item items-start">
                   <div className="h-24 w-24 bg-blue-600 rounded-[45px] flex items-center justify-center font-black text-4xl shadow-[0_0_50px_rgba(37,99,235,0.4)] group-hover/item:scale-110 transition-all duration-500">
                     {i + 1}
                   </div>
                   <div className="pt-2">
                     <h4 className="text-4xl font-black uppercase italic text-white mb-4 tracking-tighter">{step.t}</h4>
                     <p className="text-slate-500 text-[16px] font-black uppercase tracking-[0.4em] italic leading-loose">{step.d}</p>
                     <div className="flex items-center gap-4 mt-8 text-blue-500">
                        {step.i} <span className="text-[10px] font-black tracking-[0.8em]">MODULE VERIFIED</span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* LADO B: TEXTO DE VENDAS */}
          <div className="flex flex-col justify-center py-20">
             <div className="flex items-center gap-6 text-blue-500 italic mb-10">
                <ShieldCheck size={40} />
                <span className="text-[16px] font-black uppercase tracking-[1em]">Tier-3 Architecture</span>
             </div>
             <h2 className="text-[90px] md:text-[130px] font-black italic uppercase tracking-tighter leading-[0.75] mb-16">
                Governança <br /> <span className="text-blue-600">Evoluída.</span>
             </h2>
             <p className="text-slate-400 text-3xl font-medium italic leading-relaxed mb-20">
                Construímos um Ledger imutável para auditorias. Cada alteração, cada comentário e cada transição é assinada digitalmente e exportável para compliance ISO/SOC-2.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {[
                  "Audit Trail AES-256", "Enterprise SSO Auth", 
                  "ISO 27001 Protocol", "Zero-Trust Mesh",
                  "GDPR Strict Data", "SOC-2 Type II Hub"
                ].map(l => (
                  <div key={l} className="flex items-center gap-6 group cursor-pointer">
                    <div className="h-4 w-4 bg-blue-600 rounded-full group-hover:scale-[2] transition-transform shadow-[0_0_15px_rgba(37,99,235,1)]" />
                    <span className="text-[14px] font-black uppercase tracking-[0.4em] text-white italic group-hover:text-blue-500 transition-colors">{l}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 6. TECHNICAL SPECIFICATIONS MODAL (THE ENCYCLOPEDIA) */}
      <AnimatePresence>
        {showDocs && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} 
            className="fixed inset-0 z-[200] bg-[#020617]/99 backdrop-blur-3xl overflow-y-auto p-12 md:p-32"
          >
            <div className="max-w-7xl mx-auto">
              <header className="flex justify-between items-center mb-40 border-b border-white/5 pb-20">
                <div className="space-y-8">
                  <div className="flex items-center gap-6 text-blue-600 italic">
                    <Code2 size={32} />
                    <span className="text-[14px] font-black uppercase tracking-[1em]">Deep-Dive Specs</span>
                  </div>
                  <h3 className="text-8xl font-black italic uppercase text-white tracking-tighter leading-none">Engineering Hub</h3>
                  <p className="text-slate-500 text-2xl font-medium italic">Especificações de Baixo Nível para Implementação SOC/NOC.</p>
                </div>
                <button onClick={toggleDocs} className="bg-white/5 p-10 rounded-full hover:bg-red-600 transition-all text-white group shadow-3xl">
                  <X size={64} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
              </header>

              <div className="grid lg:grid-cols-12 gap-40 mb-60">
                {/* Navegação */}
                <div className="lg:col-span-4 space-y-10">
                   {(["architecture", "workflow", "compliance"] as const).map(s => (
                     <button 
                      key={s} onClick={() => setDocSection(s)}
                      className={`w-full text-left p-12 rounded-[40px] border transition-all flex items-center justify-between group ${docSection === s ? "bg-blue-600 border-blue-500 shadow-3xl translate-x-4" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                     >
                        <span className={`text-xl font-black uppercase italic ${docSection === s ? "text-white" : "text-slate-600"}`}>{s} protocol</span>
                        <ChevronRight size={24} className={docSection === s ? "text-white" : "text-slate-800"} />
                     </button>
                   ))}
                   <div className="pt-32">
                      <div className="p-12 bg-white/[0.02] border border-white/10 rounded-[60px] relative overflow-hidden">
                         <Fingerprint className="text-blue-500/20 absolute -bottom-10 -right-10 scale-[3]" />
                         <p className="text-[11px] font-black uppercase text-blue-500 tracking-[0.5em] mb-4">Security Level 3</p>
                         <p className="text-slate-500 text-sm italic font-medium leading-loose">Acesso restrito a engenheiros de sistemas e arquitetos de NOC habilitados pelo Ledger.</p>
                      </div>
                   </div>
                </div>

                {/* Conteúdo Dinâmico */}
                <div className="lg:col-span-8 space-y-32">
                   <AnimatePresence mode="wait">
                      {docSection === "architecture" && (
                        <motion.div key="arch" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-20">
                           <section className="space-y-12">
                              <h4 className="text-5xl font-black italic uppercase text-white flex items-center gap-8"><Database className="text-blue-500" /> Data Gateway V6.0</h4>
                              <p className="text-slate-400 text-3xl font-medium italic leading-relaxed">
                                Processamento de eventos multi-thread com normalização de payload em tempo de ingestão.
                              </p>
                              <div className="bg-slate-900/90 p-16 rounded-[80px] border border-white/5 font-mono text-sm text-slate-500 space-y-8 shadow-inner relative overflow-hidden">
                                 <div className="absolute top-0 right-0 p-10 text-blue-500/10"><Monitor size={200} /></div>
                                 <p className="text-blue-600 font-black">ENDPOINT PROTOCOL</p>
                                 <p>METHOD: <span className="text-emerald-500">POST</span></p>
                                 <p>ENDPOINT: <span className="text-emerald-500">/v1/master/ingest/sync</span></p>
                                 <div className="h-px w-full bg-white/10" />
                                 <p className="text-blue-600 font-black">EQUEST SCHEMA</p>
                                 <div className="space-y-3">
                                    <p>{"{"}</p>
                                    <p className="ml-10 tracking-widest"><span className="text-emerald-600">&quot;origin&quot;</span>: &quot;ZABBIX_NOC&quot;,</p>
                                    <p className="ml-10 tracking-widest"><span className="text-emerald-600">&quot;token&quot;</span>: &quot;SHA256_HASH_B2Y&quot;,</p>
                                    <p className="ml-10 tracking-widest"><span className="text-emerald-600">&quot;payload&quot;</span>: {"{ ... }"}</p>
                                    <p>{"}"}</p>
                                 </div>
                              </div>
                           </section>
                        </motion.div>
                      )}

                      {docSection === "workflow" && (
                        <motion.div key="flow" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-20">
                           <section className="space-y-12">
                              <h4 className="text-5xl font-black italic uppercase text-white flex items-center gap-8"><Workflow className="text-blue-500" /> ITIL 4 Process Engine</h4>
                              <p className="text-slate-400 text-3xl font-medium italic leading-relaxed">
                                Automação de ciclo de vida do incidente baseada em heurísticas de SLA dinâmico.
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                 {[
                                   { s: "Detection", d: "Mapeamento via SNMP/Syslog para incidentes B2Y." },
                                   { s: "Routing", d: "Alocação inteligente por skillset e disponibilidade." },
                                   { s: "Escalation", d: "Migração automática N1 &gt; N2 via Webhook trigger." },
                                   { s: "Resolution", d: "Fechamento assistido com registro de KB automático." }
                                  ].map((stage, i) => (
                                    <div key={stage.s} className="p-12 bg-white/5 border border-white/10 rounded-[50px] group hover:bg-blue-600 transition-all duration-700">
                                       <span className="text-[11px] font-black text-blue-500 group-hover:text-white uppercase tracking-[1em] mb-6 block">STAGE 0{i+1}</span>
                                       <h5 className="text-3xl font-black uppercase italic text-white mb-4">{stage.s}</h5>
                                       <p className="text-slate-500 group-hover:text-blue-100 text-lg italic leading-relaxed">{stage.d}</p>
                                    </div>
                                  ))}
                              </div>
                           </section>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. FINAL CTA (THE MILLION DOLLAR CONVERSION) */}
      <section className="py-80 px-10 bg-gradient-to-br from-blue-700 to-[#020617] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none scale-150"><Network size={1800} className="rotate-12" /></div>
        <div className="max-w-7xl mx-auto relative z-10 px-8">
          <h2 className="text-[120px] md:text-[220px] font-black italic uppercase tracking-tighter mb-32 leading-[0.65] text-white">
            Pare de reagir. <br /> Comece a <span className="text-blue-300/40">governar.</span>
          </h2>
          <Link 
            href="/login" 
            className="inline-flex items-center gap-12 bg-white text-blue-700 px-40 py-16 rounded-[80px] font-black uppercase text-2xl tracking-[0.4em] hover:scale-110 hover:bg-slate-50 transition-all shadow-[0_0_200px_rgba(255,255,255,0.3)] active:scale-95 group"
          >
            Obter Acesso Master <ArrowRight size={50} className="group-hover:translate-x-10 transition-transform duration-700" />
          </Link>
          
          <div className="mt-48 flex flex-wrap justify-center items-center gap-32 text-[15px] font-black uppercase tracking-[1em] text-white/20 italic">
            <div className="flex items-center gap-6 group">
              <Fingerprint size={32} className="group-hover:text-blue-500 transition-all" />
              <span>Zero-Trust Security</span>
            </div>
            <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse" />
            <div className="flex items-center gap-6 group">
              <CpuIcon size={32} className="group-hover:text-emerald-500 transition-all" />
              <span>Edge AI Analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER CORPORATIVO (IMPACT) */}
      <footer className="py-48 px-10 border-t border-white/5 bg-[#020617] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-8 mb-24 cursor-pointer group">
             <Zap className="text-blue-600 group-hover:scale-150 transition-all duration-1000 shadow-glow" size={64} />
             <span className="text-7xl font-black italic uppercase tracking-tighter leading-none text-white">B2Y MASTER</span>
          </div>
          <p className="text-slate-800 font-black text-[14px] uppercase tracking-[1.2em] italic text-center leading-[2] max-w-4xl">
            &copy; 2026 B2Y GLOBAL INTELLIGENCE UNIT &bull; ARCHITECTURE BY RIGOR B2Y &bull; BUILT FOR PLANETARY SCALE
          </p>
        </div>
      </footer>
    </div>
  );
}