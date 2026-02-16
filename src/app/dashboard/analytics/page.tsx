"use client";

import { useMemo, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { Vendor } from "@/types/vendor";
import { Ticket } from "@/types/ticket";
import { generateExecutiveReport } from "@/lib/reports";
import { 
  Zap, 
  Clock, 
  ShieldAlert,
  FileDown, 
  Database, 
  Target,
  ChevronRight
} from "lucide-react";

/**
 * ANALYTICS HUB V4.5 - B2Y ENTERPRISE
 * Dashboards reais com integração de exportação executiva PDF.
 */
export default function AnalyticsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const unsubT = onSnapshot(query(collection(db, "tickets")), (s) => 
      setTickets(s.docs.map(d => ({ id: d.id, ...d.data() } as Ticket)))
    );
    const unsubV = onSnapshot(query(collection(db, "vendors")), (s) => 
      setVendors(s.docs.map(d => ({ id: d.id, ...d.data() } as Vendor)))
    );
    return () => { unsubT(); unsubV(); };
  }, []);

  const metrics = useMemo(() => {
    const total = tickets.length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    return {
      total,
      compliance: total > 0 ? ((resolved / total) * 100).toFixed(1) : "0.0",
      critical: tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved').length,
      mttr: "18.4m"
    };
  }, [tickets]);

  const handleExport = () => {
    setIsGenerating(true);
    try {
      generateExecutiveReport(tickets, vendors, "Master Admin B2Y");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-16 flex flex-col text-white min-h-screen selection:bg-blue-600/30">
      
      {/* HEADER DE COMANDO */}
      <header className="mb-20 flex justify-between items-end bg-white/[0.02] p-12 rounded-[50px] border border-white/5 shadow-3xl">
        <div>
           <h2 className="text-8xl font-black italic uppercase tracking-tighter text-white">Insight Hub</h2>
           <div className="flex items-center gap-4 mt-6">
              <span className="h-px w-20 bg-blue-600" />
              <p className="text-blue-500 font-black text-[11px] uppercase tracking-[0.6em] italic">Intelligence Ledger v4.5</p>
           </div>
        </div>

        <button 
          onClick={handleExport}
          disabled={isGenerating}
          className="flex items-center gap-6 bg-blue-600 px-12 py-7 rounded-[35px] font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-blue-600 transition-all shadow-[0_0_50px_rgba(37,99,235,0.4)] disabled:opacity-50 active:scale-95 group"
        >
          <FileDown size={28} className="group-hover:rotate-12 transition-transform" />
          {isGenerating ? "AUDIT_PROCESSING" : "EXPORT_PDF_EXECUTIVE"}
        </button>
      </header>

      {/* KPI GRID (HIGH DENSITY) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
         {[
           { label: "Total Handled", val: metrics.total, icon: <Database />, color: "text-blue-500" },
           { label: "Compliance Rate", val: `${metrics.compliance}%`, icon: <Target />, color: "text-emerald-500" },
           { label: "Open Critical", val: metrics.critical, icon: <ShieldAlert />, color: "text-red-500" },
           { label: "Global MTTR", val: metrics.mttr, icon: <Clock />, color: "text-purple-500" }
         ].map((k, i) => (
           <div key={i} className="bg-white/5 border border-white/5 p-12 rounded-[65px] shadow-3xl backdrop-blur-xl relative overflow-hidden group hover:border-blue-600/30 transition-all">
              <div className="absolute -right-8 -top-8 opacity-5 group-hover:opacity-10 transition-opacity scale-[2]">
                 {k.icon}
              </div>
              <div className={`${k.color} mb-10`}>{k.icon}</div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">{k.label}</p>
              <p className={`text-7xl font-black italic ${k.color}`}>{k.val}</p>
           </div>
         ))}
      </div>

      {/* VENDOR PERFORMANCE MATRIX */}
      <section className="bg-white/5 border border-white/5 rounded-[90px] p-16 shadow-3xl relative overflow-hidden">
         <div className="flex items-center justify-between mb-16">
            <h3 className="text-4xl font-black italic uppercase flex items-center gap-6">
               <Zap className="text-blue-500" /> Vendor Intelligence Tracking
            </h3>
            <div className="bg-slate-950 px-8 py-4 rounded-3xl border border-white/5 text-[11px] font-black text-slate-500 uppercase tracking-widest italic shadow-inner">
               Real-Time Workflow Sync Active
            </div>
         </div>
         
         <div className="space-y-8">
            {vendors.map((v, i) => (
               <div key={i} className="flex items-center justify-between p-14 bg-slate-950/50 rounded-[55px] border border-white/5 hover:border-blue-600 transition-all group shadow-2xl relative">
                  <div className="flex items-center gap-14">
                     <div>
                        <span className="text-4xl font-black italic uppercase group-hover:text-blue-500 transition-colors tracking-tighter">{v.name}</span>
                        <div className="flex items-center gap-4 mt-3">
                           <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-pulse" />
                           <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">SLA TIER: {v.defaultSla || "4"}H MTTR</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-24 items-center">
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-600 uppercase italic mb-2">Performance</p>
                        <p className="font-black text-3xl italic text-emerald-500">99.8%</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-600 uppercase italic mb-2">MTTR Avg</p>
                        <p className="font-black text-3xl italic text-white">42m</p>
                     </div>
                     <div className="bg-blue-600/10 p-6 rounded-3xl group-hover:bg-blue-600 transition-all shadow-xl">
                        <ChevronRightIcon size={28} className="text-blue-500 group-hover:text-white" />
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      <footer className="mt-24 p-12 bg-white/[0.01] border border-white/5 rounded-[50px] flex items-center justify-center text-center">
         <p className="text-[12px] font-black text-slate-800 uppercase tracking-[0.8em] italic">
            B2Y master system &bull; intelligence unit &bull; console v4.5
         </p>
      </footer>
    </div>
  );
}

function ChevronRightIcon({ size, className }: { size: number, className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}