"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Ticket } from "@/types/ticket";
import { 
  Globe, ShieldCheck, Timer, LayoutGrid, 
  ChevronRight, ArrowUpRight, BarChart3, Search
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * MASTER CLIENT PORTAL - B2Y ESM
 * Ajuste C: Visão do Cliente Final (White-label)
 */
export default function ClientPortal() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const customerName = "B2Y_ENTERPRISE_CORP";

  useEffect(() => {
    const q = query(collection(db, "tickets"), where("customerName", "==", customerName));
    const unsub = onSnapshot(q, (s) => {
      setTickets(s.docs.map(d => ({ id: d.id, ...d.data() } as Ticket)));
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-12 selection:bg-blue-600/30">
      {/* NAVBAR PORTAL */}
      <nav className="mb-20 flex justify-between items-center border-b border-white/5 pb-10">
        <div className="flex items-center gap-4 italic group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <Globe size={20} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Client Portal</h1>
        </div>
        <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <span className="text-blue-500">Organization: {customerName}</span>
          <div className="h-4 w-px bg-white/10" />
          <button className="bg-white/5 px-6 py-2 rounded-full hover:bg-white/10 transition-all">Support Center</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* KPI CARDS PORTAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { l: "Service Uptime", v: "99.98%", i: <ShieldCheck className="text-emerald-500" /> },
            { l: "Open Incidents", v: tickets.filter(t => t.status !== 'resolved').length, i: <LayoutGrid className="text-blue-500" /> },
            { l: "Avg Resolution", v: "1h 42m", i: <Timer className="text-purple-500" /> }
          ].map((k, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 p-12 rounded-[50px] shadow-3xl">
              <div className="mb-6">{k.i}</div>
              <p className="text-6xl font-black italic mb-2 tracking-tighter">{k.v}</p>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] italic">{k.l}</p>
            </div>
          ))}
        </div>

        {/* LISTAGEM DE TICKETS DO CLIENTE */}
        <section className="bg-white/[0.01] border border-white/5 rounded-[80px] p-16 shadow-3xl">
          <div className="flex justify-between items-center mb-16">
            <h3 className="text-4xl font-black italic uppercase tracking-tighter">Active Journey</h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
              <input placeholder="Filtrar Chamados..." className="bg-slate-950 border border-white/10 rounded-2xl p-4 pl-12 text-[10px] font-bold outline-none focus:border-blue-600 w-64" />
            </div>
          </div>

          <div className="space-y-6">
            {tickets.map(ticket => (
              <motion.div 
                whileHover={{ x: 10 }}
                key={ticket.id} 
                className="grid grid-cols-12 gap-8 p-10 bg-slate-950 border border-white/5 rounded-[40px] items-center hover:bg-white/[0.02] transition-all cursor-pointer group"
              >
                <div className="col-span-2">
                   <div className={`h-2 w-2 rounded-full ${ticket.priority === 'critical' ? 'bg-red-500' : 'bg-blue-600'} animate-pulse mb-3`} />
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">#{ticket.id?.substring(0,8)}</p>
                </div>
                <div className="col-span-6">
                   <h4 className="text-lg font-black uppercase italic group-hover:text-blue-500 transition-colors">{ticket.title}</h4>
                   <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 tracking-widest italic">{ticket.status} &bull; Updated 2m ago</p>
                </div>
                <div className="col-span-3 flex justify-center">
                   <div className="px-6 py-2 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">
                     SLA: Within Limits
                   </div>
                </div>
                <div className="col-span-1 flex justify-end">
                   <ArrowUpRight className="text-slate-800 group-hover:text-white transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}