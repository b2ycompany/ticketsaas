"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, serverTimestamp } from "firebase/firestore";
import { Vendor } from "@/types/vendor";
import { Building2, Plus, Cpu, Globe } from "lucide-react";

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
    } catch (error) {
      console.error("Erro ao cadastrar fornecedor:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-16 text-white overflow-y-auto">
      <header className="mb-20">
        <h2 className="text-7xl font-black italic uppercase tracking-tighter mb-4">Master Setup</h2>
        <div className="flex items-center gap-4">
           <span className="h-px w-20 bg-blue-600" />
           <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.5em]">Governança de Parceiros e Fluxo ITSM</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <section className="bg-white/5 border border-white/5 p-12 rounded-[60px] shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-6 mb-12">
            <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-600/20 text-blue-600">
              <Building2 size={32} />
            </div>
            <h3 className="text-3xl font-black italic uppercase tracking-tight text-white">Gestão de Parceiros</h3>
          </div>

          <div className="space-y-6 mb-14">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-4">Nome da Organização Externa</label>
              <input 
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="Ex: Tailwind Solutions" 
                className="w-full p-8 bg-slate-950 border border-white/10 rounded-[30px] outline-none focus:border-blue-600 font-bold text-sm transition-all" 
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4">SLA de Contrato (MTTR)</label>
                <select 
                  value={vendorSla}
                  onChange={(e) => setVendorSla(e.target.value)}
                  className="w-full p-8 bg-slate-950 border border-white/10 rounded-[30px] outline-none font-bold text-sm appearance-none cursor-pointer"
                >
                  <option value="4">Prioridade 1: 04 Horas</option>
                  <option value="12">Prioridade 2: 12 Horas</option>
                  <option value="24">Prioridade 3: 24 Horas</option>
                  <option value="48">Prioridade 4: 48 Horas</option>
                </select>
              </div>
              <button 
                onClick={handleAddVendor} 
                className="mt-6 bg-blue-600 px-10 rounded-[30px] font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-blue-600 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
            {vendors.map(v => (
              <div key={v.id} className="p-8 bg-slate-950/50 border border-white/5 rounded-[35px] flex justify-between items-center group hover:border-blue-600/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />
                  <span className="font-black italic text-lg text-white group-hover:text-blue-500 transition-colors">{v.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-600 uppercase">Acordo de SLA</p>
                  <p className="text-xs font-black text-blue-500 uppercase tracking-widest">{v.defaultSla}H MTTR</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-blue-600/5 border border-blue-600/10 p-12 rounded-[60px] relative overflow-hidden flex flex-col justify-center min-h-[500px]">
          <div className="absolute top-0 right-0 opacity-10 scale-150 rotate-12"><Cpu size={400} /></div>
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-8 text-blue-500">
              <Globe size={48} />
              <h3 className="text-5xl font-black italic uppercase tracking-tighter">Workflow Engine</h3>
            </div>
            <p className="text-slate-400 font-medium italic text-xl mb-12 leading-relaxed max-w-md">
              O administrador tem controle total sobre a jornada do incidente. Defina regras automáticas de transição e escale tickets para parceiros externos em tempo real.
            </p>
            <div className="p-10 bg-slate-950/80 rounded-[40px] border border-blue-600/20 flex items-center justify-center italic text-blue-500 font-black uppercase text-[11px] tracking-[0.4em] border-dashed border-2 shadow-2xl">
              Sincronização de Fluxo V2.8 Ativa
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}