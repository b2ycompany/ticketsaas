"use client";

import { useMemo, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { Vendor } from "@/types/vendor";
import { Ticket } from "@/types/ticket";
import { 
  BarChart3, TrendingUp, Users, Clock, ShieldAlert, 
  Activity, Zap, Globe, Cpu 
} from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const unsubT = onSnapshot(query(collection(db, "tickets")), (s) => setTickets(s.docs.map(d => d.data() as Ticket)));
    const unsubV = onSnapshot(query(collection(db, "vendors")), (s) => setVendors(s.docs.map(d => d.data() as Vendor)));
    return () => { unsubT(); unsubV(); };
  }, []);

  const metrics = useMemo(() => ({
    total: tickets.length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    compliance: tickets.length > 0 ? ((tickets.filter(t => t.status === 'resolved').length / tickets.length) * 100).toFixed(1) : "100",
    criticalImpact: tickets.filter(t => t.priority === 'critical').length
  }), [tickets]);

  return (
    <div className="p-16 flex flex-col text-white min-h-screen">
      <header className="mb-20">
         <h2 className="text-8xl font-black italic uppercase tracking-tighter">Insight Hub</h2>
         <div className="flex items-center gap-4 mt-4">
            <span className="h-px w-20 bg-blue-600" />
            <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.6em] italic">B2Y Governança Analytics v3.0</p>
         </div>
      </header>

      {/* GRID DE KPIs DE ALTA PERFORMANCE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
         {[
           { label: "Tickets Processados", val: metrics.total, icon: <TrendingUp />, color: "text-blue-500" },
           { label: "SLA Compliance", val: `${metrics.compliance}%`, icon: <Activity />, color: "text-emerald-500" },
           { label: "Impacto Crítico", val: metrics.criticalImpact, icon: <ShieldAlert />, color: "text-red-500" },
           { label: "MTTR Global", val: "18m", icon: <Clock />, color: "text-purple-500" }
         ].map((k, i) => (
           <div key={i} className="bg-white/5 border border-white/5 p-12 rounded-[60px] shadow-3xl backdrop-blur-xl relative overflow-hidden group">
              <div className={`${k.color} mb-8 transition-transform group-hover:scale-110 duration-500`}>{k.icon}</div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic leading-none">{k.label}</p>
              <p className={`text-6xl font-black italic ${k.color}`}>{k.val}</p>
           </div>
         ))}
      </div>

      {/* PERFORMANCE POR FORNECEDOR (BENCHMARK) */}
      <section className="bg-white/5 border border-white/5 rounded-[80px] p-16 shadow-3xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><BarChart3 size={300} /></div>
         <h3 className="text-4xl font-black italic uppercase mb-12 flex items-center gap-6">
            <Zap className="text-blue-500" /> Vendor MTTR Analytics
         </h3>
         
         <div className="space-y-6">
            {vendors.map((v, i) => (
               <div key={i} className="flex items-center justify-between p-10 bg-slate-950/50 rounded-[45px] border border-white/5 hover:border-blue-600 transition-all group">
                  <div className="flex items-center gap-10">
                     <span className="text-2xl font-black italic uppercase group-hover:text-blue-500 transition-colors tracking-tighter">{v.name}</span>
                     <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden hidden xl:block shadow-inner">
                        <div className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,1)]" style={{ width: '85%' }} />
                     </div>
                  </div>
                  <div className="flex gap-16 items-center">
                     <div className="text-right">
                        <p className="text-[9px] font-black text-slate-600 uppercase italic mb-1 tracking-widest">SLA Ativo</p>
                        <p className="font-black text-xl italic text-emerald-500">99.8%</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[9px] font-black text-slate-600 uppercase italic mb-1 tracking-widest">MTTR</p>
                        <p className="font-black text-xl italic text-white">42m</p>
                     </div>
                     <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase italic">OPTIMAL</div>
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
}