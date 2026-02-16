"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  serverTimestamp 
} from "firebase/firestore";
import { Vendor } from "@/types/vendor";
import { Integration } from "@/types/integration";
import { 
  Plus, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Clock, 
  ListTree, 
  Save,
  ChevronRight,
  Database,
  Terminal,
  Cpu,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * B2Y MASTER SETTINGS & INTEGRATION HUB V5.0
 * Arquitetura de alta densidade para Governança ITIL e Conectores Dinâmicos.
 */
export default function SettingsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [activeTab, setActiveTab] = useState<"vendors" | "integrations">("vendors");
  const [activeVendorTab, setActiveVendorTab] = useState<string | null>(null);
  const [integrationsList, setIntegrationsList] = useState<Integration[]>([]);
  
  // Estados de Cadastro de Workflow
  const [vendorName, setVendorName] = useState("");
  const [newQueue, setNewQueue] = useState("");
  
  // Estados de Configuração de API
  const [jiraToken, setJiraToken] = useState("");
  const [targetQueue, setTargetQueue] = useState("Triagem");

  // --- SINCRONIZAÇÃO EM TEMPO REAL ---
  useEffect(() => {
    const unsubVendors = onSnapshot(query(collection(db, "vendors")), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Vendor));
      setVendors(data);
      if (data.length > 0 && !activeVendorTab) setActiveVendorTab(data[0].id);
    });

    const unsubInt = onSnapshot(query(collection(db, "integrations")), (snap) => {
      setIntegrationsList(snap.docs.map(d => ({ id: d.id, ...d.data() } as Integration)));
    });

    return () => { unsubVendors(); unsubInt(); };
  }, [activeVendorTab]);

  // --- PERSISTÊNCIA DE CONECTORES (GATEWAY API) ---
  const saveIntegration = async (provider: 'jira' | 'zabbix' | 'servicenow') => {
    try {
      const payload: Partial<Integration> = {
        provider,
        apiKey: jiraToken || "WEBHOOK_SECURE_TOKEN_B2Y",
        endpoint: "https://api.b2y-platform.com/v1/ingest",
        targetQueue,
        active: true,
        lastSync: serverTimestamp()
      };
      await addDoc(collection(db, "integrations"), payload);
      setJiraToken("");
      alert(`CONECTOR: Gateway ${provider.toUpperCase()} ativado no Ledger de Integrações.`);
    } catch (err) {
      console.error("Falha crítica ao salvar conector:", err);
    }
  };

  const handleAddVendor = async () => {
    if (!vendorName.trim()) return;
    await addDoc(collection(db, "vendors"), {
      name: vendorName,
      active: true,
      customColumns: ['Triagem', 'N1', 'N2', 'Pendente Fornecedor', 'Concluído'],
      slas: [
        { priority: 'critical', responseTime: 15, resolutionTime: 120 },
        { priority: 'high', responseTime: 60, resolutionTime: 480 }
      ],
      createdAt: serverTimestamp()
    });
    setVendorName("");
  };

  const currentVendor = vendors.find(v => v.id === activeVendorTab);

  return (
    <div className="p-16 flex flex-col text-white min-h-full selection:bg-blue-600/30">
      
      {/* CABEÇALHO MASTER SETUP - DENSIDADE INDUSTRIAL */}
      <header className="mb-20 flex items-center justify-between border-b border-white/5 pb-14">
        <div className="flex items-center gap-8">
          <div className="bg-blue-600 p-6 rounded-[30px] shadow-[0_0_50px_rgba(37,99,235,0.4)]">
            <SettingsIcon size={40} />
          </div>
          <div>
            <h2 className="text-7xl font-black italic uppercase tracking-tighter leading-none text-white">System Architecture</h2>
            <div className="flex items-center gap-4 mt-4">
               <div className="h-px w-20 bg-blue-600" />
               <p className="text-slate-500 font-black text-[11px] uppercase tracking-[0.6em] italic leading-none">Global Workflow & Connector Hub</p>
            </div>
          </div>
        </div>

        {/* NAVEGAÇÃO ENTRE ABAS - CORREÇÃO DE TIPO ANY */}
        <div className="flex bg-white/5 p-3 rounded-[35px] border border-white/5 shadow-inner">
          {(["vendors", "integrations"] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-12 py-5 rounded-[28px] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-blue-600 shadow-2xl text-white" : "text-slate-500 hover:text-white"}`}
            >
              {tab === "vendors" ? "Workflows & SLAs" : "API Connectors"}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === "vendors" ? (
          <motion.div 
            key="vendors" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-12 gap-16"
          >
            {/* SIDEBAR DE PARCEIROS */}
            <aside className="col-span-3 space-y-6">
              <div className="flex items-center justify-between mb-8 px-6 italic text-slate-700">
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">Active Partners Ledger</span>
                <Globe size={14} />
              </div>
              {vendors.map(v => (
                <button 
                  key={v.id} onClick={() => setActiveVendorTab(v.id)}
                  className={`w-full p-8 rounded-[45px] border transition-all text-left flex items-center justify-between group shadow-2xl ${activeVendorTab === v.id ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                >
                  <div className="flex flex-col">
                    <span className={`text-sm font-black uppercase italic ${activeVendorTab === v.id ? 'text-white' : 'text-slate-400'}`}>{v.name}</span>
                    <p className={`text-[8px] font-bold uppercase mt-1 ${activeVendorTab === v.id ? 'text-blue-200' : 'text-slate-600'}`}>SLA COMPLIANCE: 98%</p>
                  </div>
                  <ChevronRight size={20} className={activeVendorTab === v.id ? 'text-white' : 'text-slate-800'} />
                </button>
              ))}
              <div className="pt-10 border-t border-white/5 space-y-4">
                 <input 
                   value={vendorName} onChange={(e) => setVendorName(e.target.value)} 
                   placeholder="Nome da Organização..." 
                   className="w-full p-6 bg-slate-950 border border-white/10 rounded-[25px] text-xs font-black outline-none focus:border-blue-600 shadow-inner" 
                 />
                 <button onClick={handleAddVendor} className="w-full p-6 bg-white/5 border-2 border-dashed border-white/10 rounded-[25px] text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95">
                   Adicionar Parceiro
                 </button>
              </div>
            </aside>

            {/* PAINEL DE CONFIGURAÇÃO - WORKFLOW & SLA */}
            <div className="col-span-9 space-y-16">
              {currentVendor && (
                <div className="space-y-16">
                  {/* MATRIZ DE RESPOSTA */}
                  <section className="bg-white/5 border border-white/5 p-14 rounded-[80px] relative overflow-hidden shadow-3xl">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none scale-150 rotate-12"><Clock size={300} /></div>
                    <div className="flex items-center gap-6 mb-14 relative z-10">
                      <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500"><Activity size={28} /></div>
                      <h3 className="text-4xl font-black italic uppercase tracking-tight text-white leading-none">Response Matrix (SLA)</h3>
                    </div>
                    <div className="space-y-6 relative z-10 px-4">
                      {currentVendor.slas.map((sla) => (
                        <div key={sla.priority} className="grid grid-cols-4 gap-12 p-10 bg-slate-950/60 border border-white/5 rounded-[45px] items-center group shadow-2xl">
                          <div className="flex items-center gap-5">
                            <div className={`h-3 w-3 rounded-full ${sla.priority === 'critical' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'bg-blue-500'}`} />
                            <span className="text-lg font-black uppercase italic tracking-tighter text-white">{sla.priority}</span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-slate-700 uppercase italic">MTTR Response (Min)</label>
                            <input type="number" defaultValue={sla.responseTime} className="bg-white/5 p-5 rounded-3xl text-xl font-black outline-none focus:border-blue-500 text-blue-500 text-center shadow-inner" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-slate-700 uppercase italic">MTTR Resolution (Min)</label>
                            <input type="number" defaultValue={sla.resolutionTime} className="bg-white/5 p-5 rounded-3xl text-xl font-black outline-none focus:border-blue-500 text-blue-500 text-center shadow-inner" />
                          </div>
                          <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all"><Save size={24} className="text-emerald-500 cursor-pointer" /></div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* QUEUE MAPPING */}
                  <section className="bg-white/5 border border-white/5 p-14 rounded-[80px] shadow-3xl">
                    <div className="flex items-center gap-6 mb-14">
                      <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-600/20 text-blue-500"><ListTree size={32} /></div>
                      <h3 className="text-4xl font-black italic uppercase tracking-tight text-white leading-none">Queue Architecture</h3>
                    </div>
                    <div className="flex flex-wrap gap-6 mb-12">
                      {currentVendor.customColumns.map((c, i) => (
                        <div key={i} className="px-12 py-8 bg-blue-600/10 border border-blue-600/20 rounded-[45px] flex items-center gap-6 group hover:bg-blue-600 transition-all shadow-xl">
                          <span className="text-[14px] font-black uppercase italic tracking-widest group-hover:text-white transition-colors">{c}</span>
                          <ShieldCheck size={24} className="text-blue-500 group-hover:text-white" />
                        </div>
                      ))}
                      <div className="flex gap-4">
                        <input value={newQueue} onChange={(e) => setNewQueue(e.target.value)} placeholder="Nova Fila..." className="p-8 bg-slate-950 border border-white/10 rounded-[35px] text-xs font-black outline-none w-48 shadow-inner" />
                        <button className="p-8 bg-blue-600 rounded-[35px] shadow-2xl hover:scale-105 transition-all"><Plus size={32} /></button>
                      </div>
                    </div>
                    <div className="p-10 border-4 border-dashed border-white/5 rounded-[60px] text-center italic text-slate-800 font-black text-xs uppercase tracking-[0.8em]">B2Y Journey Mapping Protocol v5.0</div>
                  </section>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="integrations" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {/* JIRA CONNECTOR */}
            <div className="bg-white/5 border border-white/5 p-14 rounded-[80px] relative overflow-hidden group hover:border-blue-500 transition-all shadow-3xl flex flex-col">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform scale-150"><Database size={200} /></div>
              <div className="flex items-center gap-6 mb-12 relative z-10">
                 <div className="bg-blue-600 p-5 rounded-[25px] shadow-2xl shadow-blue-600/20"><Zap size={32} className="text-white fill-current" /></div>
                 <h3 className="text-4xl font-black italic uppercase leading-none text-white">Jira Software</h3>
              </div>
              <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mb-10 italic leading-relaxed">Conecte seu Jira Cloud para ingestão automática de tickets e sincronização de estado.</p>
              <div className="space-y-6 relative z-10 mt-auto">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase ml-4 italic">API Credential Token</label>
                    <input value={jiraToken} onChange={(e) => setJiraToken(e.target.value)} type="password" placeholder="ATLASSIAN_TOKEN..." className="w-full p-7 bg-slate-950 border border-white/10 rounded-[30px] text-xs font-black outline-none focus:border-blue-500 shadow-inner" />
                 </div>
                 <select value={targetQueue} onChange={(e) => setTargetQueue(e.target.value)} className="w-full p-7 bg-slate-950 border border-white/10 rounded-[30px] text-xs font-black outline-none italic text-blue-500 cursor-pointer shadow-inner">
                   <option value="Triagem">Mapear para: Fila de Triagem</option>
                   <option value="Suporte_N2">Mapear para: Suporte Especializado</option>
                 </select>
                 <button onClick={() => saveIntegration('jira')} className="w-full p-8 bg-blue-600 rounded-[35px] font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:bg-white hover:text-blue-600 transition-all">Ativar Conector</button>
              </div>
            </div>

            {/* ZABBIX MONITORING */}
            <div className="bg-white/5 border border-white/5 p-14 rounded-[80px] relative overflow-hidden group hover:border-emerald-500 transition-all shadow-3xl flex flex-col">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:-rotate-12 transition-transform scale-150"><Terminal size={200} /></div>
              <div className="flex items-center gap-6 mb-12 relative z-10">
                 <div className="bg-emerald-600 p-5 rounded-[25px] shadow-2xl shadow-emerald-600/20"><Activity size={32} className="text-white" /></div>
                 <h3 className="text-4xl font-black italic uppercase leading-none text-white">Zabbix NOC</h3>
              </div>
              <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mb-10 italic leading-relaxed">Converta alertas de monitoramento de rede e infraestrutura em incidentes críticos.</p>
              <div className="space-y-6 relative z-10 mt-auto">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase ml-4 italic">Webhook Endpoint</label>
                    <div className="w-full p-7 bg-slate-900 border border-white/5 rounded-[30px] text-[10px] font-bold text-slate-500 truncate italic">https://api.b2y.com/v1/zabbix/ingest</div>
                 </div>
                 <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[30px] text-center italic">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Status: Sincronização Ativa</span>
                 </div>
                 <button onClick={() => saveIntegration('zabbix')} className="w-full p-8 bg-emerald-600 rounded-[35px] font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:bg-white hover:text-emerald-600 transition-all">Link Infrastructure</button>
              </div>
            </div>

            {/* SERVICENOW BRIDGE */}
            <div className="bg-white/5 border border-white/5 p-14 rounded-[80px] relative overflow-hidden group hover:border-slate-500 transition-all shadow-3xl flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 border-dashed border-4">
               <Cpu size={120} className="text-slate-800 mb-8 group-hover:text-blue-500 transition-colors" />
               <h4 className="text-3xl font-black italic uppercase text-white">ServiceNow API</h4>
               <p className="text-[11px] font-bold text-slate-600 uppercase mt-4 tracking-[0.6em] italic">Enterprise Bridge v2.0</p>
               
               <div className="mt-12 space-y-4">
                  <div className="flex items-center gap-2 px-8 py-3 bg-white/5 rounded-full text-[9px] font-black uppercase text-slate-700 italic border border-white/5">
                    <ShieldCheck size={14} /> Auditoria em Progresso
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER DE CONFORMIDADE E MONITORAMENTO DE INTEGRAÇÕES */}
      <footer className="mt-auto pt-10 border-t border-white/5 flex justify-between items-center italic">
         <div className="flex items-center gap-4 text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
           <ShieldCheck size={16} className="text-emerald-500" /> B2Y Master Gateway Security Protocol Active
         </div>
         <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <p className="text-[8px] font-black text-slate-600 uppercase">Conectores Ativos</p>
               <p className="text-xs font-black text-blue-500">{integrationsList.length} Gateways</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-[10px] font-black text-slate-800 uppercase tracking-widest">System Health: 99.9%</div>
         </div>
      </footer>
    </div>
  );
}