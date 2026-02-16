"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, query, onSnapshot, doc, updateDoc, serverTimestamp, arrayUnion 
} from "firebase/firestore";
import { Ticket } from "@/types/ticket";
import { Vendor } from "@/types/vendor";
import { checkSLAStatusAndNotify } from "@/lib/notifications";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MoreHorizontal, User as UserIcon, ShieldAlert, Timer, 
  LayoutGrid, Search, Filter, ArrowRightLeft, Activity, 
  ShieldCheck, Zap, BellRing, ChevronRight, AlertTriangle, History
} from "lucide-react";

/**
 * KANBAN COMMAND CENTER V7.0 - HIGH DENSITY ARCHITECTURE
 * Sistema dinâmico de filas com injeção de workflow de fornecedores.
 */
export default function KanbanPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>("default");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- SINCRONIZAÇÃO DE LEDGERS ---
  useEffect(() => {
    const unsubTickets = onSnapshot(query(collection(db, "tickets")), (snapshot) => {
      setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Ticket[]);
    });
    const unsubVendors = onSnapshot(query(collection(db, "vendors")), (snapshot) => {
      setVendors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Vendor[]);
    });
    return () => { unsubTickets(); unsubVendors(); };
  }, []);

  // --- WORKFLOW ENGINE: MAPEAMENTO DE FILAS ---
  const activeColumns = useMemo(() => {
    const vendor = vendors.find(v => v.id === selectedVendorId);
    return vendor?.customColumns && vendor.customColumns.length > 0 
      ? vendor.customColumns 
      : ["open", "in_progress", "waiting_customer", "resolved"];
  }, [vendors, selectedVendorId]);

  // --- TRANSIÇÃO DE ESTADO COM AUDITORIA MANDATÁRIA ---
  const moveTicket = useCallback(async (ticketId: string, newStatus: string) => {
    if (!ticketId) return;
    setIsSyncing(true);
    
    const note = prompt(`GOVERNANÇA: Justifique a migração para [${newStatus.toUpperCase()}]`);
    if (!note || note.length < 5) {
      alert("AÇÃO REJEITADA: Justificativa de auditoria obrigatória.");
      setIsSyncing(false);
      return;
    }

    try {
      const ticketRef = doc(db, "tickets", ticketId);
      const ticketData = tickets.find(t => t.id === ticketId);
      const vendorData = vendors.find(v => v.id === selectedVendorId);

      await updateDoc(ticketRef, { 
        status: newStatus, 
        updatedAt: serverTimestamp(),
        auditTrail: arrayUnion({
          event: `BOARD_MOVE_${newStatus.toUpperCase()}`,
          timestamp: new Date().toISOString(),
          note: note,
          operator: "NOC_MASTER_ADMIN"
        })
      });

      if (ticketData && vendorData && newStatus !== 'resolved') {
        await checkSLAStatusAndNotify(ticketData, vendorData);
      }
    } catch (error) {
      console.error("Critical Board Error:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [tickets, vendors, selectedVendorId]);

  // --- RENDERIZAÇÃO DE FILAS ---
  return (
    <div className="p-12 flex flex-col min-h-screen bg-transparent selection:bg-blue-600/30">
      <header className="mb-14 flex justify-between items-center bg-white/[0.02] p-10 rounded-[50px] border border-white/5 shadow-3xl">
        <div className="flex items-center gap-8">
          <div className="bg-blue-600 p-5 rounded-[25px] shadow-[0_0_50px_rgba(37,99,235,0.4)]">
            <LayoutGrid size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white">Operational Board</h2>
            <div className="flex items-center gap-4 mt-3">
               <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[8px] font-black uppercase tracking-widest">
                 <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live Stream Sync
               </span>
               <div className="h-4 w-px bg-white/10" />
               <p className="text-slate-600 font-bold text-[9px] uppercase tracking-[0.4em]">Engine v7.0 Alpha</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
             <input 
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Filtrar Protocolo..." 
               className="bg-slate-950 border border-white/10 rounded-2xl p-4 pl-12 text-[10px] font-bold outline-none focus:border-blue-600 w-64 transition-all" 
             />
           </div>
           <select 
             value={selectedVendorId} 
             onChange={(e) => setSelectedVendorId(e.target.value)}
             className="bg-slate-950 p-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest outline-none text-blue-500 cursor-pointer"
           >
             <option value="default">Global Workflow</option>
             {vendors.map(v => <option key={v.id} value={v.id}>{v.name} JOURNEY</option>)}
           </select>
           {isSyncing && <Activity size={20} className="text-blue-500 animate-spin" />}
        </div>
      </header>

      <div className="flex-1 flex gap-10 overflow-x-auto pb-10 no-scrollbar items-start px-2">
        {activeColumns.map(col => (
          <div 
            key={col} 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("ticketId");
              if (id) moveTicket(id, col);
              setDraggedId(null);
            }}
            className="min-w-[420px] w-[420px] bg-white/[0.01] border border-white/5 rounded-[75px] flex flex-col p-10 shadow-3xl backdrop-blur-3xl relative group/column hover:bg-white/[0.02] transition-all"
          >
            <div className="absolute inset-4 border-2 border-dashed border-blue-600/5 rounded-[65px] opacity-0 group-hover/column:opacity-100 transition-opacity pointer-events-none" />
            
            <header className="flex justify-between items-center mb-12 relative z-10 px-6">
              <div className="flex items-center gap-4">
                <div className={`h-2.5 w-2.5 rounded-full ${col === 'open' ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,1)]' : 'bg-emerald-600'} animate-pulse`} />
                <h3 className="text-[14px] font-black uppercase tracking-[0.4em] text-slate-500 italic">{col.replace('_', ' ')}</h3>
              </div>
              <div className="bg-slate-950 px-5 py-2 rounded-2xl border border-white/5 shadow-inner">
                <span className="text-blue-500 text-[14px] font-black italic">{tickets.filter(t => t.status === col).length}</span>
              </div>
            </header>

            <div className="flex-1 space-y-8 min-h-[600px] border-t border-white/[0.03] pt-12 relative z-10">
              <AnimatePresence>
                {tickets.filter(t => t.status === col && t.title.toLowerCase().includes(searchTerm.toLowerCase())).map(ticket => (
                  <div key={ticket.id} draggable onDragStart={(e) => { e.dataTransfer.setData("ticketId", ticket.id || ""); setDraggedId(ticket.id || ""); }} onDragEnd={() => setDraggedId(null)}>
                    <motion.div layoutId={ticket.id} className={`p-10 bg-[#0a0f1e] border border-white/5 rounded-[55px] hover:border-blue-600/50 transition-all cursor-grab active:cursor-grabbing group shadow-2xl relative overflow-hidden ${draggedId === ticket.id ? 'opacity-20 scale-95' : 'opacity-100'}`}>
                      <div className={`absolute top-0 left-0 h-full w-2.5 ${ticket.priority === 'critical' ? 'bg-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-blue-600'}`} />
                      <div className="flex justify-between items-start mb-8">
                         <div className="flex items-center gap-3">
                           <ShieldAlert size={16} className={ticket.priority === 'critical' ? 'text-red-500' : 'text-blue-600'} />
                           <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">PROTOCOL: {ticket.id?.substring(0, 12).toUpperCase()}</span>
                         </div>
                         <div className="flex gap-2">
                            <History size={16} className="text-slate-800 hover:text-blue-500 cursor-pointer" />
                            <MoreHorizontal size={20} className="text-slate-800" />
                         </div>
                      </div>
                      
                      <h4 className="text-[18px] font-black text-white uppercase italic leading-[1.1] mb-10 tracking-tighter group-hover:text-blue-400 transition-colors duration-500 line-clamp-2">{ticket.title}</h4>

                      <div className="w-full h-1 bg-white/5 rounded-full mb-10 overflow-hidden shadow-inner">
                         <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                      </div>
                      
                      <div className="flex items-center justify-between pt-10 border-t border-white/[0.05]">
                         <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">
                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-blue-500 border border-white/5 shadow-inner">
                              <UserIcon size={18} />
                            </div>
                            <span className="truncate max-w-[120px]">{ticket.customerName.split(' ')[0]}</span>
                         </div>
                         <div className="flex items-center gap-3 text-[11px] font-black text-blue-500 italic bg-blue-500/10 px-6 py-3 rounded-3xl border border-blue-500/20 shadow-lg">
                            <Timer size={18} /> 00:32:15
                         </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </AnimatePresence>
              {tickets.filter(t => t.status === col).length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-10 py-40">
                   <ArrowRightLeft size={120} className="text-white rotate-90 mb-8" />
                   <p className="text-[16px] font-black uppercase tracking-[1em] italic text-center leading-loose">Queue Standby</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-10 p-10 bg-white/[0.02] border border-white/5 rounded-[40px] flex items-center justify-center gap-10">
         <div className="flex items-center gap-4 text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] italic">
           <ShieldCheck size={16} className="text-emerald-500" /> B2Y Master Protocol Compliance Active
         </div>
         <div className="h-4 w-px bg-white/10" />
         <div className="flex items-center gap-4 text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] italic">
           <BellRing size={16} className="text-blue-500" /> Smart Notification Ledger v7.0
         </div>
      </footer>
    </div>
  );
}