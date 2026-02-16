"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "../../lib/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy 
} from "firebase/firestore";
import { Ticket } from "../../types/ticket";
import { 
  AlertCircle, 
  Search, 
  ChevronRight
} from "lucide-react";
import TicketDetailSidebar from "@/components/TicketDetailSidebar";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CONTEÚDO CENTRAL DO TERMINAL
 * Este arquivo NÃO deve conter a Sidebar, pois ela já está no layout.tsx.
 */
export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    // Escuta em tempo real (Sem filtros de where para evitar erros de índice composto por enquanto)
    const ticketsRef = collection(db, "tickets");
    const q = query(ticketsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Ticket[];
      setTickets(data);
      setLoading(false);
    }, (error) => {
      console.error("ERRO DE PERMISSÃO FIREBASE:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const kpis = useMemo(() => {
    const total = tickets.length;
    const res = tickets.filter(t => t.status === 'resolved').length;
    const crit = tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved').length;
    const rate = total > 0 ? ((res / total) * 100).toFixed(1) : "0.0";
    return { crit, rate };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const isNotHidden = t.status !== 'cancelled' && t.status !== 'deleted';
      const matchesStatus = filterStatus === "all" ? isNotHidden : t.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchQuery, filterStatus]);

  return (
    <div className="p-16">
      <header className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-8xl font-black tracking-tighter italic uppercase text-white leading-none">Terminal</h2>
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Monitoring Live Stream</p>
        </div>
        <div className="flex gap-6">
          <div className="bg-white/5 border border-white/5 p-8 rounded-[40px] text-center min-w-[160px]">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Compliance</p>
            <p className="text-5xl font-black italic text-emerald-500">{kpis.rate}%</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[40px] text-center min-w-[160px]">
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 italic">Críticos</p>
            <p className="text-5xl font-black italic text-red-500">{kpis.crit}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row gap-6 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="Pesquisar protocolo ou cliente..." 
            className="w-full p-8 pl-20 bg-white/5 border border-white/5 rounded-[35px] text-white outline-none focus:border-blue-500/50 transition-all font-bold text-xl" 
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-[35px] border border-white/5 overflow-x-auto no-scrollbar">
          {['all', 'open', 'in_progress', 'waiting_customer', 'resolved'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-6 py-4 rounded-[28px] text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="h-40 bg-white/5 animate-pulse rounded-[55px]" />
        ) : (
          filteredTickets.map((t) => (
            <motion.div 
              key={t.id} 
              onClick={() => setSelectedTicket(t)}
              whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.08)" }}
              className="bg-white/5 border border-white/5 p-10 rounded-[55px] transition-all flex items-center justify-between group cursor-pointer shadow-xl relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 h-full w-2 ${t.priority === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-blue-600'}`} />
              <div className="flex items-center gap-12 ml-4">
                <div className={`h-20 w-20 rounded-[30px] flex items-center justify-center ${t.priority === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-blue-600/20 text-blue-600'}`}>
                  <AlertCircle size={36} />
                </div>
                <div>
                  <h4 className="text-3xl font-black uppercase italic group-hover:text-blue-400 transition-colors tracking-tighter leading-none mb-4">{t.title}</h4>
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">{t.customerName} | {t.source}</span>
                </div>
              </div>
              <div className="flex items-center gap-10">
                <div className="text-right">
                   <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1 italic">Status</p>
                   <p className={`text-xl font-black italic ${t.status === 'open' ? 'text-blue-500' : 'text-emerald-500'}`}>{t.status.toUpperCase().replace('_', ' ')}</p>
                </div>
                <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                   <ChevronRight size={24} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedTicket && <TicketDetailSidebar ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />}
      </AnimatePresence>
    </div>
  );
}