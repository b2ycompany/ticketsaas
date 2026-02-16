"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, serverTimestamp } from "firebase/firestore";
import { Vendor } from "@/types/vendor";
import { Building2, Plus, Cpu, Globe, Settings as SettingsIcon, ShieldCheck, Zap, Activity } from "lucide-react";

/**
 * MASTER SETUP PAGE - B2Y COMPLIANCE
 * Gestão de Parceiros e Fluxo de Governança Customizável.
 */
export default function SettingsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorName, setVendorName] = useState("");
  const [vendorSla, setVendorSla] = useState("4");

  useEffect(() => {
    const q = query(collection(db, "vendors"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Vendor[];
      setVendors(data);
    });
    return () => unsubscribe();
  }, []);

  const handleAddVendor = async () => {
    if (!vendorName.trim()) return;
    try {
      await addDoc(collection(db, "vendors"), {
        name: vendorName,
        defaultSla: vendorSla,
        active: true,
        createdAt: serverTimestamp()
      });
      setVendorName("");
      alert(`Parceiro ${vendorName} integrado com sucesso.`);
    } catch (error) {
      console.error("Falha na integração de parceiro:", error);
    }
  };

  return (
    <div className="p-16 flex flex-col text-white">
      <header className="mb-24 flex items-center justify-between border-b border-white/5 pb-16">
        <div className="flex items-center gap-8">
          <div className="bg-blue-600 p-6 rounded-[30px] shadow-2xl shadow-blue-600/20">
            <SettingsIcon size={48} className="text-white" />
          </div>
          <div>
            <h2 className="text-7xl font-black italic uppercase tracking-tighter">System Setup</h2>
            <div className="flex items-center gap-4 mt-3">
               <span className="h-px w-20 bg-blue-600" />
               <p className="text-slate-500 font-black uppercase text-[11px] tracking-[0.5em]">Workflow Engine & Governance v2.8</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
        
        {/* CARD: GESTÃO DE PARCEIROS (EX: TAILWIND) */}
        <section className="bg-white/5 border border-white/5 p-14 rounded-[80px] shadow-3xl backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
             <Building2 size={300} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-16">
              <div className="p-5 bg-blue-600/10 rounded-3xl border border-blue-600/20 text-blue-500 shadow-inner">
                <ShieldCheck size={36} />
              </div>
              <h3 className="text-4xl font-black italic uppercase tracking-tight text-white leading-none">Partners Hub</h3>
            </div>

            <div className="space-y-8 mb-20">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase ml-6 tracking-widest italic leading-none">Nome da Corporação Parceira</label>
                <input 
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="Ex: Tailwind Global Solutions" 
                  className="w-full p-10 bg-slate-950/80 border border-white/10 rounded-[45px] outline-none focus:border-blue-600 font-black text-lg transition-all shadow-inner placeholder:text-slate-800" 
                />
              </div>
              
              <div className="flex gap-6">
                <div className="flex-1 space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase ml-6 tracking-widest italic leading-none">Acordo de SLA (MTTR)</label>
                  <select 
                    value={vendorSla}
                    onChange={(e) => setVendorSla(e.target.value)}
                    className="w-full p-10 bg-slate-950/80 border border-white/10 rounded-[45px] outline-none font-black text-lg appearance-none cursor-pointer hover:border-blue-600 transition-all shadow-inner italic"
                  >
                    <option value="4">TIER 1: 04 HORAS</option>
                    <option value="12">TIER 2: 12 HORAS</option>
                    <option value="24">TIER 3: 24 HORAS</option>
                    <option value="48">TIER 4: 48 HORAS</option>
                  </select>
                </div>
                <button 
                  onClick={handleAddVendor} 
                  className="mt-6 bg-blue-600 px-12 rounded-[45px] font-black uppercase text-[12px] tracking-[0.3em] hover:bg-white hover:text-blue-600 transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center active:scale-95"
                >
                  <Plus size={32} />
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[450px] overflow-y-auto no-scrollbar pr-2">
              {vendors.map(v => (
                <div key={v.id} className="p-10 bg-slate-950/50 border border-white/5 rounded-[50px] flex justify-between items-center group/item hover:border-blue-600/50 transition-all shadow-2xl">
                  <div className="flex items-center gap-6">
                    <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(37,99,235,1)]" />
                    <span className="font-black italic text-2xl text-white group-hover/item:text-blue-500 transition-colors uppercase tracking-tighter">{v.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic leading-none">Contrato SLA Ativo</p>
                    <p className="text-xl font-black text-blue-500 uppercase tracking-tighter italic leading-none">{v.defaultSla}H MAX RESPONSE</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CARD: WORKFLOW ENGINE VISUAL */}
        <section className="bg-blue-600/5 border border-blue-600/10 p-16 rounded-[80px] relative overflow-hidden flex flex-col justify-center shadow-3xl">
          <div className="absolute top-0 right-0 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000"><Cpu size={500} /></div>
          <div className="relative z-10">
            <div className="flex items-center gap-8 mb-12 text-blue-500">
              <Globe size={80} className="animate-spin-slow" />
              <h3 className="text-6xl font-black italic uppercase tracking-tighter leading-none">Workflow Engine</h3>
            </div>
            <p className="text-slate-400 font-medium italic text-3xl mb-16 leading-relaxed max-w-xl">
              Configure a jornada de resolução. Automatize a escalada de tickets e defina quem assume cada estágio do pipeline operacional em tempo real.
            </p>
            <div className="p-14 bg-[#020617]/80 rounded-[60px] border border-blue-600/20 flex items-center justify-center italic text-blue-500 font-black uppercase text-[12px] tracking-[0.5em] border-dashed border-2 shadow-inner">
               <Zap size={20} className="mr-6" /> Sincronização em Tempo Real v2.8 Active
            </div>
            <div className="grid grid-cols-2 gap-6 mt-12">
               <div className="p-8 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center">
                  <Activity className="text-blue-500 mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic text-center">Auto-Escalation Protocol</span>
               </div>
               <div className="p-8 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center">
                  <ShieldCheck className="text-emerald-500 mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic text-center">Multi-Vendor Compliance</span>
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}