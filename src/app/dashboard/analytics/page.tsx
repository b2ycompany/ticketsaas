"use client";

import { useMemo } from "react";
import { BarChart3, TrendingUp, Users, Clock, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsDashboard() {
  // Simulação de dados para visualização de benchmark
  const performanceData = [
    { provider: "Tailwind", sla: "98.5%", mttr: "45m", status: "Optimal" },
    { provider: "AWS Support", sla: "99.9%", mttr: "12m", status: "Elite" },
    { provider: "Internal Dev", sla: "85.2%", mttr: "4h", status: "Warning" }
  ];

  return (
    <div className="min-h-screen bg-[#020617] p-16 text-white overflow-y-auto">
      <header className="mb-20">
         <h2 className="text-8xl font-black italic uppercase tracking-tighter italic">Insight Hub</h2>
         <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.6em] mt-4">Analítico de Governança B2Y</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
         {[
           { label: "Tickets Gerados", val: "14.2k", icon: <TrendingUp /> },
           { label: "MTTR Global", val: "28m", icon: <Clock /> },
           { label: "Satisfação", val: "4.9/5", icon: <Users /> },
           { label: "Brechas SLA", val: "02", icon: <ShieldAlert className="text-red-500" /> }
         ].map((k, i) => (
           <div key={i} className="bg-white/5 border border-white/5 p-10 rounded-[50px] shadow-2xl backdrop-blur-md">
              <div className="text-blue-500 mb-6">{k.icon}</div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">{k.label}</p>
              <p className="text-5xl font-black italic">{k.val}</p>
           </div>
         ))}
      </div>

      <section className="bg-white/5 border border-white/5 rounded-[60px] p-12 overflow-hidden relative">
         <h3 className="text-3xl font-black italic uppercase mb-10 flex items-center gap-4">
            <BarChart3 className="text-blue-500" /> Performance de Fornecedores
         </h3>
         
         <div className="w-full space-y-4">
            {performanceData.map((d, i) => (
               <div key={i} className="flex items-center justify-between p-8 bg-slate-950/50 rounded-[35px] border border-white/5 hover:border-blue-600 transition-all group">
                  <div className="flex items-center gap-8">
                     <span className="text-xl font-black italic uppercase group-hover:text-blue-500 transition-colors">{d.provider}</span>
                     <div className="h-1.5 w-40 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full bg-blue-600`} style={{ width: d.sla }} />
                     </div>
                  </div>
                  <div className="flex gap-12">
                     <div className="text-right"><p className="text-[9px] font-black text-slate-600 uppercase italic">SLA Compliance</p><p className="font-black text-lg">{d.sla}</p></div>
                     <div className="text-right"><p className="text-[9px] font-black text-slate-600 uppercase italic">MTTR</p><p className="font-black text-lg">{d.mttr}</p></div>
                     <div className={`px-6 py-2 rounded-full font-black text-[10px] uppercase flex items-center ${d.status === 'Elite' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>{d.status}</div>
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
}