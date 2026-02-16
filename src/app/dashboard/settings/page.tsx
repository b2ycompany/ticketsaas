"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  serverTimestamp, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { Vendor } from "@/types/vendor";
import { 
  Plus, 
  Cpu, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Clock, 
  ListTree, 
  Save,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * MASTER WORKFLOW & SLA SETUP - B2Y ENTERPRISE v3.5
 * Engenharia Reversa de Plataformas Tier-1 (ServiceNow/Remedy)
 */
export default function SettingsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [activeVendorTab, setActiveVendorTab] = useState<string | null>(null);
  const [vendorName, setVendorName] = useState("");
  const [newQueue, setNewQueue] = useState("");

  // --- SINCRONIZAÇÃO DE CONFIGURAÇÕES DE GOVERNANÇA ---
  useEffect(() => {
    const q = query(collection(db, "vendors"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Vendor[];
      setVendors(data);
      if (data.length > 0 && !activeVendorTab) {
        setActiveVendorTab(data[0].id);
      }
    });
    return () => unsubscribe();
  }, [activeVendorTab]);

  // --- CADASTRO DE NOVO PARCEIRO COM WORKFLOW PADRÃO ---
  const handleAddVendor = async () => {
    if (!vendorName.trim()) return;
    try {
      await addDoc(collection(db, "vendors"), {
        name: vendorName,
        active: true,
        category: 'software',
        customColumns: ['Triagem', 'Em Atendimento', 'Aguardando Cliente', 'Concluído'],
        slas: [
          { priority: 'critical', responseTime: 15, resolutionTime: 120 },
          { priority: 'high', responseTime: 60, resolutionTime: 480 },
          { priority: 'medium', responseTime: 120, resolutionTime: 960 },
          { priority: 'low', responseTime: 240, resolutionTime: 1440 }
        ],
        createdAt: serverTimestamp()
      });
      setVendorName("");
    } catch (error) {
      console.error("Falha ao criar workflow de parceiro:", error);
    }
  };

  // --- ATUALIZAÇÃO ATÔMICA DA MATRIZ DE SLA ---
  const handleUpdateSLA = async (vendorId: string, priority: string, field: string, value: number) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    const updatedSlas = vendor.slas.map(s => 
      s.priority === priority ? { ...s, [field]: value } : s
    );

    try {
      await updateDoc(doc(db, "vendors", vendorId), { slas: updatedSlas });
    } catch (error) {
      console.error("Erro na atualização da matriz:", error);
    }
  };

  // --- GESTÃO DINÂMICA DE FILAS (KANBAN SYNC) ---
  const handleAddQueue = async (vendorId: string) => {
    if (!newQueue.trim()) return;
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    const updatedColumns = [...(vendor.customColumns || []), newQueue];
    try {
      await updateDoc(doc(db, "vendors", vendorId), { customColumns: updatedColumns });
      setNewQueue("");
    } catch (error) {
      console.error("Erro ao expandir jornada:", error);
    }
  };

  const currentVendor = vendors.find(v => v.id === activeVendorTab);

  return (
    <div className="p-16 flex flex-col text-white min-h-full selection:bg-blue-500/30">
      
      {/* CABEÇALHO DE ARQUITETURA */}
      <header className="mb-20 flex items-center justify-between border-b border-white/5 pb-14">
        <div className="flex items-center gap-8">
          <div className="bg-blue-600 p-6 rounded-[30px] shadow-[0_0_50px_rgba(37,99,235,0.4)] rotate-3">
            <SettingsIcon size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-7xl font-black italic uppercase tracking-tighter leading-none">Workflow Architect</h2>
            <div className="flex items-center gap-4 mt-4">
               <div className="h-px w-16 bg-blue-600" />
               <p className="text-slate-500 font-black text-[11px] uppercase tracking-[0.6em] italic">ITIL 4 Compliance Matrix</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-16">
        
        {/* NAVEGAÇÃO DE PARCEIROS (EX: TAILWIND, AWS) */}
        <aside className="col-span-3 space-y-6">
          <div className="flex items-center justify-between mb-10 px-6">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic">Partners Ledger</span>
            <Zap size={16} className="text-blue-600 animate-pulse" />
          </div>
          
          <div className="space-y-4">
            {vendors.map(v => (
              <button 
                key={v.id}
                onClick={() => setActiveVendorTab(v.id)}
                className={`w-full p-8 rounded-[40px] border transition-all text-left flex items-center justify-between group shadow-2xl ${activeVendorTab === v.id ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/5 hover:bg-white/[0.08]'}`}
              >
                <div className="flex flex-col">
                  <span className={`text-sm font-black uppercase italic ${activeVendorTab === v.id ? 'text-white' : 'text-slate-400'}`}>{v.name}</span>
                  <span className={`text-[8px] font-bold mt-1 uppercase ${activeVendorTab === v.id ? 'text-blue-200' : 'text-slate-600'}`}>ID: {v.id.substring(0,8)}</span>
                </div>
                <ChevronRight size={20} className={activeVendorTab === v.id ? 'text-white' : 'text-slate-800'} />
              </button>
            ))}
          </div>

          <div className="pt-10 border-t border-white/5 space-y-4">
            <input 
              value={vendorName} onChange={(e) => setVendorName(e.target.value)}
              placeholder="Nome da Organização..." 
              className="w-full p-6 bg-slate-950 border border-white/10 rounded-[25px] text-xs font-black outline-none focus:border-blue-600 shadow-inner placeholder:text-slate-800" 
            />
            <button onClick={handleAddVendor} className="w-full p-6 bg-white/5 border-2 border-dashed border-white/10 rounded-[25px] text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:border-blue-600 transition-all active:scale-95">
              Integrar Novo Parceiro
            </button>
          </div>
        </aside>

        {/* PAINEL DE CONFIGURAÇÃO DE JORNADA E SLA */}
        <div className="col-span-9 space-y-16">
          {currentVendor ? (
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-16">
              
              {/* MATRIZ DE SLA (ENGENHARIA REVERSA SERVICENOW) */}
              <section className="bg-white/5 border border-white/5 p-14 rounded-[80px] relative overflow-hidden shadow-3xl">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none scale-150"><Clock size={300} /></div>
                <div className="flex items-center gap-6 mb-14 relative z-10">
                  <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500">
                    <Activity size={28} />
                  </div>
                  <h3 className="text-4xl font-black italic uppercase tracking-tight text-white leading-none">SLA Response Matrix</h3>
                </div>

                <div className="grid grid-cols-4 gap-10 mb-10 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-8 italic">
                  <div>Criticidade</div>
                  <div>Resposta (Min)</div>
                  <div>Resolução (Min)</div>
                  <div className="text-right">Ledger</div>
                </div>

                <div className="space-y-6 relative z-10">
                  {currentVendor.slas.map((sla) => (
                    <div key={sla.priority} className="grid grid-cols-4 gap-10 p-8 bg-slate-950/60 border border-white/5 rounded-[40px] items-center group hover:border-blue-600/40 transition-all shadow-2xl">
                      <div className="flex items-center gap-5">
                        <div className={`h-3 w-3 rounded-full ${sla.priority === 'critical' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'bg-blue-500'}`} />
                        <span className="text-lg font-black uppercase italic tracking-tighter text-white">{sla.priority}</span>
                      </div>
                      <input 
                        type="number" 
                        defaultValue={sla.responseTime} 
                        onBlur={(e) => handleUpdateSLA(currentVendor.id, sla.priority, 'responseTime', parseInt(e.target.value))}
                        className="bg-white/5 border border-white/5 p-4 rounded-2xl text-lg font-black w-32 outline-none focus:border-blue-500 shadow-inner text-blue-500 text-center"
                      />
                      <input 
                        type="number" 
                        defaultValue={sla.resolutionTime} 
                        onBlur={(e) => handleUpdateSLA(currentVendor.id, sla.priority, 'resolutionTime', parseInt(e.target.value))}
                        className="bg-white/5 border border-white/5 p-4 rounded-2xl text-lg font-black w-32 outline-none focus:border-blue-500 shadow-inner text-blue-500 text-center"
                      />
                      <div className="flex justify-end opacity-20 group-hover:opacity-100 transition-all">
                         <Save size={24} className="text-emerald-500 cursor-pointer hover:scale-125" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* WORKFLOW DE FILAS (TRANSITION ENGINE) */}
              <section className="bg-white/5 border border-white/5 p-14 rounded-[80px] shadow-3xl">
                <div className="flex items-center gap-6 mb-14">
                  <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-500">
                    <ListTree size={28} />
                  </div>
                  <h3 className="text-4xl font-black italic uppercase tracking-tight text-white leading-none">Custom Journey Workflow</h3>
                </div>

                <div className="flex flex-wrap gap-6 mb-14">
                  {currentVendor.customColumns?.map((col, idx) => (
                    <div key={idx} className="px-10 py-6 bg-blue-600/10 border border-blue-600/20 rounded-[35px] flex items-center gap-6 group hover:bg-blue-600 transition-all shadow-xl">
                      <span className="text-sm font-black uppercase italic tracking-widest group-hover:text-white transition-colors">{col}</span>
                      <ShieldCheck size={20} className="text-blue-500 group-hover:text-white" />
                    </div>
                  ))}
                  
                  <div className="flex gap-4">
                    <input 
                      placeholder="Identificador da Fila..." 
                      className="p-6 bg-slate-950 border border-white/10 rounded-[30px] text-sm font-black outline-none w-56 focus:border-blue-600 shadow-inner" 
                      value={newQueue}
                      onChange={(e) => setNewQueue(e.target.value)}
                    />
                    <button 
                      onClick={() => handleAddQueue(currentVendor.id)}
                      className="p-6 bg-blue-600 rounded-[30px] shadow-2xl shadow-blue-600/30 hover:scale-105 transition-all"
                    >
                      <Plus size={28} />
                    </button>
                  </div>
                </div>

                <div className="p-12 border-4 border-dashed border-white/5 rounded-[60px] text-center italic text-slate-700 font-black text-xs uppercase tracking-[0.6em] leading-relaxed">
                  A sequência acima define a renderização automática das colunas no Command Board.
                </div>
              </section>

            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-10 py-40">
               <Cpu size={150} className="mb-10 text-white animate-spin-slow" />
               <p className="font-black italic uppercase tracking-[0.8em] text-2xl">Aguardando Seleção de Matriz</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}