"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  Server
} from "lucide-react";

/**
 * B2Y MASTER - INSTITUTIONAL COMMAND CENTER V2.5
 * Engine de Vendas por Autoridade Técnica e Governança Industrial.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/40 overflow-x-hidden">
      
      {/* NAVBAR DE ALTA PERFORMANCE (BENCHMARK) */}
      <nav className="fixed top-0 w-full z-[100] bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-10 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.4)] group-hover:rotate-12 transition-transform duration-500">
              <Zap className="text-white fill-current" size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black italic uppercase tracking-tighter leading-none text-white">TicketMaster</span>
              <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] mt-1">Enterprise Service Management</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-12">
            {["Metodologia", "Integrações", "Governança", "Compliance"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all italic hover:tracking-[0.2em]">
                {item}
              </a>
            ))}
            <Link href="/login" className="bg-blue-600 px-10 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all shadow-2xl shadow-blue-600/30 active:scale-95">
              Acessar Terminal
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - O IMPACTO CORPORATIVO */}
      <section className="relative pt-52 pb-40 px-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent -z-10" />
        
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-blue-500 text-[10px] font-black uppercase tracking-[0.5em] mb-14 italic backdrop-blur-md"
          >
            <ShieldAlert size={14} className="animate-pulse text-blue-600" /> B2Y Master Intelligence Framework v2.5 Active
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-7xl md:text-[140px] font-black italic uppercase tracking-tighter leading-[0.8] mb-16 text-white"
          >
            Governe o <br /> <span className="text-blue-600">Impossível.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-slate-400 text-xl md:text-2xl font-medium italic leading-relaxed mb-20 px-4"
          >
            A infraestrutura definitiva para organizações Tier-1. Centralize Jira, ServiceNow e Zabbix em um Ledger de auditoria imutável e preditivo.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8"
          >
            <Link href="/login" className="w-full md:w-auto bg-white text-slate-950 px-16 py-8 rounded-[30px] font-black uppercase text-sm tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_60px_rgba(255,255,255,0.15)] group">
              Iniciar Operação Master <ArrowRight className="inline ml-4 group-hover:translate-x-2 transition-transform" />
            </Link>
            <a href="#documentação" className="w-full md:w-auto bg-white/5 border border-white/10 text-white px-16 py-8 rounded-[30px] font-black uppercase text-sm tracking-widest hover:bg-white/10 transition-all italic">
              Technical Specs
            </a>
          </motion.div>
        </div>
      </section>

      {/* MÉTRICAS DE AUTORIDADE (BENCHMARK) */}
      <section className="py-32 px-10 bg-slate-950/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-16">
          {[
            { label: "SLA Efficiency", val: "99.98%", sub: "Industrial Grade" },
            { label: "MTTR System", val: "12m", sub: "Latency Benchmark" },
            { label: "Atomic Ingest", val: "4ms", sub: "Gateway Response" },
            { label: "Trust Score", val: "100%", sub: "Zero-Trust Architecture" }
          ].map((k, i) => (
            <div key={i} className="flex flex-col items-center lg:items-start group cursor-default">
              <p className="text-6xl font-black italic text-white mb-3 tracking-tighter group-hover:text-blue-500 transition-colors">{k.val}</p>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-blue-600" />
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">{k.label}</p>
              </div>
              <p className="text-[9px] font-bold text-blue-900 uppercase italic mt-2 tracking-widest">{k.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO: METODOLOGIA B2Y GOVERNANCE */}
      <section id="metodologia" className="py-48 px-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-32">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 text-blue-500 mb-8 italic">
                <ShieldCheck size={24} />
                <span className="text-[12px] font-black uppercase tracking-[0.6em]">Enterprise Framework v2.5</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] mb-12">
                Governança <br /> <span className="text-blue-600">Invisível.</span>
              </h2>
              <p className="text-slate-400 text-2xl font-medium italic leading-relaxed mb-16">
                Nossa metodologia de **SLA Predictive Alerting** analisa a volumetria e matriz de resposta para intervir nos fornecedores antes da falha. Reduza multas contratuais com automação inteligente.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                  { t: "Dynamic Matrix", d: "Configuração de SLAs por Tiers de Prioridade (ITIL 4)." },
                  { t: "Vendor ESM", d: "Gestão centralizada de múltiplos parceiros externos." },
                  { t: "Immutable Logs", d: "Rastreio auditável de cada transição de estado." },
                  { t: "Pre-SLA Trigger", d: "Alertas via Webhook disparados em 80% da meta." }
                ].map((item, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex items-center gap-4 text-blue-600">
                      <CheckCircle2 size={20} />
                      <span className="text-sm font-black uppercase tracking-widest text-white italic">{item.t}</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium italic leading-relaxed">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* PIPELINE OPERACIONAL VISUAL (DOCUMENTAÇÃO) */}
            <div className="lg:w-1/2 bg-white/[0.02] border border-white/10 rounded-[80px] p-16 shadow-3xl relative group overflow-hidden">
              <div className="absolute -top-20 -right-20 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000"><Workflow size={400} /></div>
              <h3 className="text-3xl font-black italic uppercase mb-16 flex items-center gap-6 relative z-10">
                <Terminal className="text-blue-500" /> Operational Ledger
              </h3>
              
              <div className="space-y-12 relative z-10">
                {[
                  { n: "01", t: "API Data Ingestion", d: "Sync bidirecional com Jira/Zabbix/ServiceNow.", icon: <Database /> },
                  { n: "02", t: "Workflow Processor", d: "Mapeamento dinâmico em filas de atendimento.", icon: <Layers /> },
                  { n: "03", t: "Audit Compliance", d: "Geração de Relatórios Executivos em PDF.", icon: <ShieldCheck /> }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-10 group/step">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 bg-blue-600 rounded-3xl flex items-center justify-center font-black text-2xl shadow-2xl group-hover/step:scale-110 transition-transform">
                        {step.n}
                      </div>
                      {idx !== 2 && <div className="h-20 w-px bg-white/10 my-4" />}
                    </div>
                    <div className="pt-3">
                      <h4 className="text-xl font-black uppercase italic text-white mb-2">{step.t}</h4>
                      <p className="text-slate-500 font-bold text-[11px] uppercase tracking-[0.3em] italic">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS DE MERCADO (O VALOR DO NEGÓCIO) */}
      <section id="integrações" className="py-48 px-10 bg-[#0a0f1e]/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-none">Diferenciais Elite</h2>
            <p className="text-slate-500 font-black text-[12px] uppercase tracking-[0.8em] italic">O que separa a B2Y do suporte comum</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                t: "Unified Integration Hub", 
                d: "Centralize chaves de API e Webhooks em um único console. Reduza a complexidade de integração para segundos.", 
                i: <Network />, 
                c: "text-blue-500" 
              },
              { 
                t: "Industrial SLA Matrix", 
                d: "Controle MTTR e Response Time por parceiro. Nossa matriz é baseada na engenharia das maiores plataformas ESM.", 
                i: <BarChart3 />, 
                c: "text-emerald-500" 
              },
              { 
                t: "AI-Ready Gateway", 
                d: "Pronto para automação de Nível 1. Deixe que nossos Webhooks gerenciem a triagem pesada da sua infraestrutura.", 
                i: <Cpu />, 
                c: "text-purple-500" 
              }
            ].map((card, i) => (
              <div key={i} className="bg-slate-950 border border-white/5 p-16 rounded-[70px] shadow-3xl hover:border-blue-600/40 transition-all group relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 opacity-[0.02] scale-[3] group-hover:scale-[3.5] transition-transform duration-700">{card.i}</div>
                <div className={`${card.c} mb-12 group-hover:scale-110 transition-transform duration-500`}>{card.i}</div>
                <h4 className="text-3xl font-black italic uppercase mb-8 leading-none tracking-tighter text-white">{card.t}</h4>
                <p className="text-slate-400 text-lg font-medium italic leading-relaxed">{card.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCUMENTAÇÃO TÉCNICA E SEGURANÇA (TRUST CENTER) */}
      <section id="governança" className="py-48 px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
          <div className="sticky top-48">
            <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-10 leading-[0.9]">Trust Center <br /> & Dev Portal.</h2>
            <p className="text-slate-500 font-medium text-xl italic mb-16 leading-relaxed">
              Desenvolvido com padrões militares de segurança. Seguimos rigorosamente **ISO 27001**, **SOC-2 Type II** e protocolos de redundância Tier-3.
            </p>
            <div className="space-y-6">
              {[
                { title: "API Endpoint Reference", desc: "Mapeamento JSON para integração externa." },
                { title: "SLA Matrix Logic", desc: "Algoritmos de cálculo de penalidades e conformidade." },
                { title: "Governance Ledger", desc: "Logs de transação imutáveis baseados em Firebase." }
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-8 bg-white/5 rounded-[40px] border border-white/10 hover:bg-blue-600 hover:border-blue-500 transition-all cursor-pointer group shadow-xl">
                  <div className="flex items-center gap-6">
                    <FileText className="text-blue-500 group-hover:text-white" size={24} />
                    <span className="text-[12px] font-black uppercase tracking-widest italic text-white">{doc.title}</span>
                  </div>
                  <ChevronRight size={20} className="text-slate-700 group-hover:text-white transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* SIMULADOR DE PAYLOAD CORRIGIDO (ZERO ANY, ZERO ERROR) */}
          <div className="bg-[#0a0f1e] border border-white/10 rounded-[80px] p-16 font-mono text-[12px] shadow-3xl relative overflow-hidden group">
            <div className="absolute top-8 right-12 flex gap-3">
              <div className="h-3 w-3 rounded-full bg-red-500/30" />
              <div className="h-3 w-3 rounded-full bg-orange-500/30" />
              <div className="h-3 w-3 rounded-full bg-green-500/30" />
            </div>
            <div className="text-blue-500 mb-12 font-black uppercase tracking-widest italic flex items-center gap-4">
              <Terminal size={20} /> 
              
            </div>
            <p className="text-slate-600 mb-8 italic"># POST /api/webhooks/ingest - Auth: Bearer B2Y_SECURE_HASH</p>
            <div className="text-slate-300 leading-relaxed space-y-2 select-none">
              <p className="text-blue-900">{"{"}</p>
              <p className="ml-8 tracking-widest"><span className="text-emerald-600">&quot;provider&quot;</span>: <span className="text-blue-400">&quot;ZABBIX_NOC&quot;</span>,</p>
              <p className="ml-8 tracking-widest"><span className="text-emerald-600">&quot;timestamp&quot;</span>: <span className="text-blue-400">&quot;{new Date().toISOString()}&quot;</span>,</p>
              <p className="ml-8 tracking-widest"><span className="text-emerald-600">&quot;payload&quot;</span>: {"{"}</p>
              <p className="ml-16 tracking-widest"><span className="text-emerald-600">&quot;id&quot;</span>: <span className="text-blue-400">&quot;ALERT-8821&quot;</span>,</p>
              <p className="ml-16 tracking-widest"><span className="text-emerald-600">&quot;impact&quot;</span>: <span className="text-red-500">&quot;CRITICAL_OUTAGE&quot;</span>,</p>
              <p className="ml-16 tracking-widest"><span className="text-emerald-600">&quot;trigger&quot;</span>: <span className="text-blue-400">&quot;Packet loss &gt; 25% on Core-SW-01&quot;</span></p>
              <p className="ml-8">{"}"}</p>
              <p className="text-blue-900">{"}"}</p>
            </div>
            
            <div className="mt-16 p-10 bg-blue-600/10 border border-blue-600/20 rounded-[45px] shadow-inner">
              <div className="flex items-center gap-4 mb-4">
                <Activity size={14} className="text-blue-500 animate-pulse" />
                <p className="text-blue-500 font-black italic uppercase text-[10px] tracking-widest leading-none">Gateway Response:</p>
              </div>
              <p className="text-emerald-500 font-black text-xs leading-relaxed italic">HTTP 201: INCIDENT_CREATED &bull; QUEUE: TRIA_N1</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA DE VENDAS FINAL (MILIONÁRIO) */}
      <section className="py-52 px-10 bg-gradient-to-br from-blue-600 to-indigo-950 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <Network size={1000} className="scale-125 rotate-12" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10 px-4">
          <h2 className="text-7xl md:text-[140px] font-black italic uppercase tracking-tighter mb-16 leading-[0.8] text-white">
            Pare de reagir. <br /> Comece a <span className="text-indigo-300/40 italic">governar.</span>
          </h2>
          <Link href="/login" className="inline-flex items-center gap-8 bg-white text-blue-600 px-20 py-10 rounded-[45px] font-black uppercase text-lg tracking-[0.3em] hover:scale-105 hover:bg-slate-100 transition-all shadow-[0_0_100px_rgba(255,255,255,0.2)] active:scale-95 group">
            Obter Acesso Master <ArrowRight size={36} className="group-hover:translate-x-4 transition-transform duration-500" />
          </Link>
          <div className="mt-20 flex flex-wrap justify-center items-center gap-12 text-[11px] font-black uppercase tracking-[0.6em] text-white/30 italic">
            <span className="flex items-center gap-3"><Fingerprint size={18} /> Zero-Trust Access</span>
            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-pulse" />
            <span className="flex items-center gap-3"><CpuIcon size={18} /> Engine AI Analytics</span>
            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-pulse" />
            <span className="flex items-center gap-3"><Server size={18} /> Tier-3 Infrastructure</span>
          </div>
        </div>
      </section>

      {/* FOOTER CORPORATIVO */}
      <footer className="py-24 px-10 border-t border-white/5 bg-[#020617] relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-4 group cursor-pointer">
             <Zap className="text-blue-600 group-hover:scale-125 transition-transform duration-700" size={36} />
             <span className="text-4xl font-black italic uppercase tracking-tighter leading-none">B2Y MASTER</span>
          </div>
          <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-widest text-slate-700 italic">
            <a href="#" className="hover:text-blue-500 transition-all">Privacy Policy</a>
            <a href="#" className="hover:text-blue-500 transition-all">Governance Protocol</a>
            <a href="#" className="hover:text-blue-500 transition-all">SLA Ethics</a>
            <a href="#" className="hover:text-blue-500 transition-all">SOC-2 Readiness</a>
          </div>
          <p className="text-slate-800 font-black text-[10px] uppercase tracking-widest italic">&copy; 2026 B2Y Global Intelligence Unit &bull; Enterprise Division</p>
        </div>
      </footer>
    </div>
  );
}