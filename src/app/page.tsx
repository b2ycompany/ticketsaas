"use client";

import { useState, useMemo, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { Ticket } from "@/types/ticket";
import Link from "next/link";
import { motion, AnimatePresence, animate } from "framer-motion";
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  FileText, 
  Workflow, 
  Network, 
  ChevronRight, 
  ShieldAlert, 
  LayoutGrid, 
  Database, 
  Layers, 
  CpuIcon, 
  Fingerprint, 
  BarChart3, 
  Server, 
  X, 
  Code2, 
  Globe,
  Lock,
  MessageSquare,
  Search,
  BellRing,
  History,
  AlertTriangle
} from "lucide-react";

/**
 * B2Y MASTER - INSTITUTIONAL COMMAND CENTER V3.0
 * ENGINE DE VENDAS COM DOCUMENTAÇÃO TÉCNICA INTEGRADA E KPIS REATIVOS.
 * ARQUITETURA DE ALTA DENSIDADE - BENCHMARK INDUSTRIAL.
 */

// --- COMPONENTE AUXILIAR DE RELÓGIO ---
function ClockIcon({ size }: { size: number }) {
  return <Activity size={size} />;
}

// --- ENGINE DE CONTADOR ANIMADO (CORREÇÃO DE TIPAGEM REACTNODE) ---
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2.5,
      ease: "circOut",
      onUpdate: (latest) => setDisplayValue(Math.floor(latest))
    });
    return () => controls.stop();
  }, [value]);

  return <span className="tabular-nums">{displayValue.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showDocs, setShowDocs] = useState(false);
  const [activeDocSection, setActiveDocSection] = useState<"api" | "itil" | "security">("api");

  // --- SINCRONIZAÇÃO DE DADOS EM TEMPO REAL (KPI ENGINE) ---
  useEffect(() => {
    const q = query(collection(db, "tickets"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as Ticket);
      setTickets(data);
    }, (error) => {
      console.error("KPI Sync Error:", error);
    });
    return () => unsubscribe();
  }, []);

  // --- MATRIZ DE INDICADORES DINÂMICOS ---
  const stats = useMemo(() => {
    const total = tickets.length;
    const resolved = tickets.filter(t => t.status === "resolved").length;
    const critical = tickets.filter(t => t.priority === "critical").length;
    const compliance = total > 0 ? Math.floor((resolved / total) * 100) : 100;
    
    return [
      { label: "SLA Efficiency", val: compliance, suffix: "%", sub: "Compliance Global", icon: <ShieldCheck size={14} /> },
      { label: "Incidentes Ativos", val: total, suffix: "", sub: "Live Ledger Sync", icon: <Activity size={14} /> },
      { label: "Alertas Críticos", val: critical, suffix: "", sub: "Tier 1 Priority", icon: <ShieldAlert size={14} /> },
      { label: "Engine MTTR", val: 14, suffix: "m", sub: "Mean Time to Resolve", icon: <ClockIcon size={14} /> }
    ];
  }, [tickets]);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-600/40 overflow-x-hidden">
      
      {/* NAVBAR CORPORATIVA - GLASSMORPHISM UI */}
      <nav className="fixed top-0 w-full z-[100] bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5 px-10 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5 group cursor-pointer">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.4)] group-hover:rotate-12 transition-all duration-500">
              <Zap className="text-white fill-current" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black italic uppercase tracking-tighter leading-none">TicketMaster</span>
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em] mt-1 italic">Enterprise Suite</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-14">
            {["Metodologia", "Integrações", "Documentação", "Segurança"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all hover:tracking-[0.2em] italic"
              >
                {item}
              </a>
            ))}
            <Link 
              href="/login" 
              className="bg-blue-600 px-12 py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all shadow-3xl shadow-blue-600/20 active:scale-95"
            >
              Acessar Terminal
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - O IMPACTO DE AUTORIDADE */}
      <section className="relative pt-64 pb-48 px-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent -z-10" />
        
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-blue-500 text-[10px] font-black uppercase tracking-[0.6em] mb-16 italic backdrop-blur-md"
          >
            <Activity size={16} className="animate-pulse text-blue-600" /> System Architecture v3.0 Alpha Active
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            className="text-8xl md:text-[150px] font-black italic uppercase tracking-tighter leading-[0.8] mb-20 text-white"
          >
            Governe o <br /> <span className="text-blue-600 text-shadow-glow">Impossível.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed mb-24 px-6"
          >
            A infraestrutura definitiva para organizações de missão crítica. Centralize Jira, ServiceNow e Zabbix num ecossistema de governança imutável.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-10"
          >
            <Link 
              href="/login" 
              className="w-full md:w-auto bg-white text-slate-950 px-20 py-10 rounded-[40px] font-black uppercase text-sm tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_80px_rgba(255,255,255,0.1)] active:scale-95 group"
            >
              Iniciar Operação Master <ArrowRight className="inline ml-6 group-hover:translate-x-3 transition-transform" size={24} />
            </Link>
            <button 
              onClick={() => setShowDocs(true)}
              className="w-full md:w-auto bg-white/5 border border-white/10 text-white px-20 py-10 rounded-[40px] font-black uppercase text-sm tracking-[0.2em] hover:bg-white/10 transition-all italic active:scale-95"
            >
              Technical Specs
            </button>
          </motion.div>
        </div>
      </section>

      {/* KPI GRID - INDICADORES REATIVOS (CONTADORES VIVOS) */}
      <section className="py-40 px-10 bg-slate-950/50 border-y border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <LayoutGrid size={800} className="translate-x-1/2" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-20 relative z-10">
          {stats.map((k, i) => (
            <div key={i} className="flex flex-col items-center lg:items-start group">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-blue-500 bg-blue-500/10 p-2 rounded-lg">{k.icon}</div>
                <div className="h-px w-12 bg-blue-600 opacity-30" />
              </div>
              <p className="text-7xl md:text-8xl font-black italic text-white mb-4 tracking-tighter group-hover:text-blue-500 transition-colors">
                <AnimatedNumber value={k.val} suffix={k.suffix} />
              </p>
              <p className="text-[12px] font-black uppercase text-slate-500 tracking-[0.4em] italic">{k.label}</p>
              <p className="text-[10px] font-bold text-blue-900 uppercase italic mt-3 tracking-widest">{k.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO: METODOLOGIA B2Y INTELLIGENCE (ITSM ELITE) */}
      <section id="metodologia" className="py-60 px-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-40">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-5 text-blue-500 mb-10 italic">
                <ShieldCheck size={28} />
                <span className="text-[14px] font-black uppercase tracking-[0.7em]">ITSM Framework v4.0</span>
              </div>
              <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85] mb-16 text-white">
                O Fim da <br /> <span className="text-blue-600">Reatividade.</span>
              </h2>
              <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed mb-20 px-2">
                Nossa engine não apenas processa incidentes. Ela antecipa violações de SLA através de um modelo preditivo baseado em janelas de resolução configuráveis por fornecedor.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {[
                  { t: "Dynamic Matrix", d: "Cálculo atómico de SLAs por prioridade e criticidade do serviço.", i: <Layers size={24} /> },
                  { t: "NOC Automation", d: "Trigger de Webhooks para escalação imediata via Slack ou Teams.", i: <Zap size={24} /> },
                  { t: "Audit Ledger", d: "Rastreabilidade absoluta de cada transição de estado no Kanban.", i: <History size={24} /> },
                  { t: "Vendor Portal", d: "Interface dedicada para fornecedores externos gerirem seus tickets.", i: <Globe size={24} /> }
                ].map((item, i) => (
                  <div key={i} className="group">
                    <div className="flex items-center gap-5 text-blue-600 mb-4 transition-transform group-hover:translate-x-2">
                      <div className="bg-white/5 p-3 rounded-2xl border border-white/5">{item.i}</div>
                      <span className="text-sm font-black uppercase tracking-widest text-white italic">{item.t}</span>
                    </div>
                    <p className="text-slate-500 text-lg italic leading-relaxed font-medium pl-16">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* PIPELINE VISUAL - DOCUMENTAÇÃO DE FLUXO INDUSTRIAL */}
            <div className="lg:w-1/2 bg-white/[0.02] border border-white/10 rounded-[100px] p-20 shadow-3xl relative group overflow-hidden">
              <div className="absolute -top-40 -right-40 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-all duration-1000">
                <Workflow size={600} />
              </div>
              <h3 className="text-4xl font-black italic uppercase mb-20 flex items-center gap-8 relative z-10">
                <Terminal className="text-blue-500" /> Operational Pipeline
              </h3>
              
              <div className="space-y-16 relative z-10">
                {[
                  { n: "01", t: "Ingestão Unificada", d: "Recebimento via Webhook Seguro (TLS 1.3 + RSA 2048)", icon: <Database /> },
                  { n: "02", t: "Workflow Processor", d: "Mapeamento dinâmico em filas customizadas por Vendor", icon: <Workflow /> },
                  { n: "03", t: "Governance Ledger", d: "Registro em sistema imutável para auditoria ISO 27001", icon: <ShieldCheck /> }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-12 group/step items-start">
                    <div className="flex flex-col items-center">
                      <div className="h-20 w-20 bg-blue-600 rounded-[35px] flex items-center justify-center font-black text-3xl shadow-2xl group-hover/step:scale-110 transition-all duration-500 text-white">
                        {step.n}
                      </div>
                      {idx !== 2 && <div className="h-24 w-px bg-white/10 my-4" />}
                    </div>
                    <div className="pt-4">
                      <h4 className="text-2xl font-black uppercase italic text-white mb-3 tracking-tighter">{step.t}</h4>
                      <p className="text-slate-500 font-black text-[11px] uppercase tracking-[0.4em] italic leading-loose">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE DIFERENCIAIS: O BENCHMARK DO MERCADO */}
      <section className="py-60 px-10 bg-[#0a0f1e]/40 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-40">
            <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter mb-10 leading-none">Diferenciais Elite.</h2>
            <div className="flex items-center justify-center gap-6 italic">
              <span className="h-px w-20 bg-blue-600" />
              <p className="text-slate-500 font-black text-[14px] uppercase tracking-[0.8em]">Performance vs Mercado</p>
              <span className="h-px w-20 bg-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { 
                t: "Multi-Vendor ESM", 
                d: "Gerencie múltiplos parceiros (Tailwind, AWS, Google) em um único dashboard unificado, eliminando silos operacionais.", 
                i: <Network size={40} />, 
                c: "text-blue-500" 
              },
              { 
                t: "Pre-SLA Predictive", 
                d: "Alertas preventivos disparados aos 80% do tempo de resolução, permitindo intervenção pró-ativa antes da falha.", 
                i: <Zap size={40} />, 
                c: "text-emerald-500" 
              },
              { 
                t: "Atomic Gateway API", 
                d: "Infraestrutura API-First desenhada para receber milhares de alertas de monitoramento por segundo com zero latência.", 
                i: <Cpu size={40} />, 
                c: "text-purple-500" 
              }
            ].map((card, i) => (
              <div key={i} className="bg-slate-950 border border-white/5 p-20 rounded-[80px] shadow-3xl hover:border-blue-600/50 transition-all group relative overflow-hidden">
                <div className="absolute -right-20 -bottom-20 opacity-[0.03] scale-[4] group-hover:rotate-12 transition-transform duration-1000">{card.i}</div>
                <div className={`${card.c} mb-12 group-hover:scale-110 transition-transform duration-500`}>{card.i}</div>
                <h4 className="text-4xl font-black italic uppercase mb-10 leading-none tracking-tighter text-white">{card.t}</h4>
                <p className="text-slate-400 text-xl font-medium italic leading-relaxed">{card.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCUMENTAÇÃO TÉCNICA (O MANUAL DO CTO) */}
      <section id="documentação" className="py-60 px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-start">
          <div className="sticky top-60">
            <div className="flex items-center gap-6 text-blue-500 mb-10 italic">
               <Code2 size={24} />
               <span className="text-[12px] font-black uppercase tracking-[0.8em]">Documentation Portal</span>
            </div>
            <h2 className="text-7xl font-black italic uppercase tracking-tighter mb-12 leading-[0.85]">Technical <br /> Trust Center.</h2>
            <p className="text-slate-500 font-medium text-2xl italic mb-20 leading-relaxed">
              Desenvolvido com arquitetura **Zero-Trust**. Nossa documentação técnica detalha todos os endpoints e fluxos de segurança para integração imediata.
            </p>
            <div className="space-y-8">
              {[
                { title: "API Endpoint Reference", desc: "Mapeamento JSON para integração externa Jira/Zabbix." },
                { title: "SLA Matrix Logic", desc: "Algoritmos de cálculo de penalidades e conformidade ITIL." },
                { title: "Governance Ledger", desc: "Estrutura de logs imutáveis e rastreabilidade Firebase." }
              ].map((doc, i) => (
                <div key={i} onClick={() => setShowDocs(true)} className="flex items-center justify-between p-10 bg-white/5 rounded-[50px] border border-white/10 hover:bg-blue-600 hover:border-blue-500 transition-all cursor-pointer group shadow-2xl">
                  <div className="flex items-center gap-8">
                    <FileText className="text-blue-500 group-hover:text-white" size={32} />
                    <span className="text-[14px] font-black uppercase tracking-widest italic text-white">{doc.title}</span>
                  </div>
                  <ChevronRight size={24} className="text-slate-800 group-hover:text-white transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* SIMULADOR DE PAYLOAD API (UI INDUSTRIAL) */}
          <div className="bg-[#0a0f1e] border border-white/10 rounded-[100px] p-20 font-mono text-[13px] shadow-3xl relative overflow-hidden group">
            <div className="absolute top-10 right-14 flex gap-4">
              <div className="h-4 w-4 rounded-full bg-red-500/40" />
              <div className="h-4 w-4 rounded-full bg-orange-500/40" />
              <div className="h-4 w-4 rounded-full bg-green-500/40" />
            </div>
            <div className="text-blue-500 mb-16 font-black uppercase tracking-[0.5em] italic flex items-center gap-6">
              <Terminal size={24} /> 
            </div>
            <p className="text-slate-600 mb-10 italic"># POST /api/webhooks/ingest - Payload Specification</p>
            <div className="text-slate-300 leading-relaxed space-y-3 select-none">
              <p className="text-blue-900">{"{"}</p>
              <p className="ml-10 tracking-widest"><span className="text-emerald-600">&quot;provider&quot;</span>: <span className="text-blue-400">&quot;ZABBIX_NOC&quot;</span>,</p>
              <p className="ml-10 tracking-widest"><span className="text-emerald-600">&quot;auth_token&quot;</span>: <span className="text-blue-400">&quot;B2Y_MASTER_HASH_XXX&quot;</span>,</p>
              <p className="ml-10 tracking-widest"><span className="text-emerald-600">&quot;payload&quot;</span>: {"{"}</p>
              <p className="ml-20 tracking-widest"><span className="text-emerald-600">&quot;id&quot;</span>: <span className="text-blue-400">&quot;EV-8821&quot;</span>,</p>
              <p className="ml-20 tracking-widest"><span className="text-emerald-600">&quot;impact&quot;</span>: <span className="text-red-500">&quot;CRITICAL_OUTAGE&quot;</span>,</p>
              <p className="ml-20 tracking-widest"><span className="text-emerald-600">&quot;details&quot;</span>: <span className="text-blue-400">&quot;Core Link Failure detected at SP-DATA&quot;</span></p>
              <p className="ml-10">{"}"}</p>
              <p className="text-blue-900">{"}"}</p>
            </div>
            
            <div className="mt-20 p-12 bg-blue-600/10 border border-blue-600/20 rounded-[60px] shadow-inner">
              <div className="flex items-center gap-5 mb-6">
                <Activity size={18} className="text-blue-500 animate-pulse" />
                <p className="text-blue-500 font-black italic uppercase text-[11px] tracking-[0.5em] leading-none">Gateway Response:</p>
              </div>
              <p className="text-emerald-500 font-black text-sm leading-relaxed italic tracking-widest">HTTP 201: INCIDENT_CREATED &bull; QUEUE_ASSIGNED: TRIA_N1</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL - O FECHO DA VENDA MILIONÁRIA */}
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

      {/* MODAL DE TECHNICAL SPECS (ENCICLOPÉDIA TÉCNICA) */}
      <AnimatePresence>
        {showDocs && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-3xl overflow-y-auto p-12 md:p-32"
          >
            <div className="max-w-7xl mx-auto">
              <header className="flex justify-between items-center mb-32 border-b border-white/5 pb-16">
                <div>
                  <h3 className="text-6xl font-black italic uppercase text-white leading-none tracking-tighter">Technical Encyclopedia</h3>
                  <div className="flex items-center gap-6 mt-6 italic">
                    <span className="h-px w-16 bg-blue-600" />
                    <p className="text-blue-500 font-black text-[12px] uppercase tracking-[0.7em]">Deep-Dive Architecture & Security</p>
                  </div>
                </div>
                <button onClick={() => setShowDocs(false)} className="bg-white/5 p-6 rounded-full hover:bg-blue-600 transition-all text-white group shadow-2xl">
                  <X size={40} className="group-hover:rotate-90 transition-transform" />
                </button>
              </header>

              <div className="grid lg:grid-cols-3 gap-24 mb-32">
                {/* COLUNA 01: ARQUITETURA API */}
                <div className="space-y-20">
                  <section>
                    <h4 className="flex items-center gap-6 text-2xl font-black uppercase italic text-white mb-10 border-l-4 border-blue-600 pl-6">
                       Core API Logic
                    </h4>
                    <p className="text-slate-400 text-lg leading-relaxed mb-10 italic font-medium">
                      O motor de ingestão B2Y opera em modo síncrono para validação de origem (Vendor Handshake) e assíncrono para processamento de filas, garantindo 100% de disponibilidade.
                    </p>
                    <div className="bg-slate-900/50 p-10 rounded-[40px] border border-white/5 font-mono text-[11px] text-slate-300 space-y-4">
                      <p className="text-blue-500 font-black">Endpoint Schema</p>
                      <p>URL: <span className="text-emerald-500">POST /v1/gateway/ingest</span></p>
                      <p>Auth: <span className="text-emerald-500">X-B2Y-Auth (RSA-2048)</span></p>
                      <p>Mime: <span className="text-emerald-500">application/json</span></p>
                    </div>
                  </section>
                </div>

                {/* COLUNA 02: WORKFLOW & ITIL */}
                <div className="space-y-20">
                  <section>
                    <h4 className="flex items-center gap-6 text-2xl font-black uppercase italic text-white mb-10 border-l-4 border-blue-600 pl-6">
                       ITSM Workflow
                    </h4>
                    <div className="space-y-10">
                      {[
                        { s: "Discovery", d: "Alertas monitorados via Zabbix/Prometheus." },
                        { s: "Normalization", d: "Mapeamento de severidade para prioridade B2Y." },
                        { s: "Routing", d: "Alocação automática na fila do fornecedor." },
                        { s: "Escalation", d: "Trigger de alerta preventivo aos 80% do SLA." }
                      ].map((step, i) => (
                        <div key={i} className="flex gap-8 items-start group">
                          <div className="h-10 w-10 bg-white/5 rounded-2xl flex items-center justify-center text-[12px] font-black shrink-0 group-hover:bg-blue-600 transition-colors">{i+1}</div>
                          <div>
                            <p className="text-sm font-black uppercase text-white italic mb-2 tracking-tighter">{step.s}</p>
                            <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{step.d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* COLUNA 03: SECURITY & AUDIT */}
                <div className="space-y-20">
                  <section>
                    <h4 className="flex items-center gap-6 text-2xl font-black uppercase italic text-white mb-10 border-l-4 border-blue-600 pl-6">
                       Security Ledger
                    </h4>
                    <div className="bg-white/5 p-12 rounded-[50px] border border-white/5 relative overflow-hidden">
                       <Fingerprint className="absolute -bottom-10 -right-10 opacity-5 scale-[3]" size={100} />
                       <p className="text-slate-400 text-lg italic leading-relaxed mb-8 relative z-10">
                         Todo movimento no sistema é assinado digitalmente. A auditoria é imutável e exportável em formato PDF com checksum de integridade.
                       </p>
                       <ul className="space-y-6 relative z-10">
                         {["Audit Trail AES-256", "OAuth 2.0 / SAML", "GDPR Compliance", "ISO 27001 Ready"].map(l => (
                           <li key={l} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                             <CheckCircle2 size={16} /> {l}
                           </li>
                         ))}
                       </ul>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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