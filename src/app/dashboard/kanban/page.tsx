"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { Ticket } from "@/types/ticket";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MoreHorizontal, 
  User, 
  ShieldAlert, 
  AlertCircle, 
  Timer,
  Zap,
  ArrowRightLeft,
  Filter,
  Users
} from "lucide-react";

/**
 * KANBAN COMMAND CENTER - B2Y ENTERPRISE V3.0
 * Arquitetura de Arraste Híbrida: HTML5 Drag API + Framer Motion Layout
 */
export default function KanbanPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const columns: Ticket['status'][] = ["open", "in_progress", "waiting_customer", "resolved"];

  // --- SINCRONIZAÇÃO DE LEDGER REAL-TIME ---
  useEffect(() => {
    const ticketsRef = collection(db, "tickets");
    const q = query(ticketsRef);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Ticket[];
      setTickets(data);
    });
    
    return () => unsubscribe();
  }, []);

  // --- ENGINE DE TRANSIÇÃO DE ESTADO ---
  const moveTicket = useCallback(async (id: string, newStatus: Ticket['status']) => {
    if (!id) return;
    try {
      const ticketRef = doc(db, "tickets", id);
      await updateDoc(ticketRef, { 
        status: newStatus, 
        updatedAt: serverTimestamp(),
        // Auditoria automática de movimentação de Board
        lastMovement: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro crítico na transição de board:", error);
    }
  }, []);

  // --- HANDLERS DE ARRASTE (TIPAGEM ESTRITA CORRIGIDA) ---
  const onNativeDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("ticketId", id);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(id);
  };

  const onNativeDragEnd = () => {
    setIsDragging(null);
  };

  const onNativeDrop = (e: React.DragEvent<HTMLDivElement>, status: Ticket['status']) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("ticketId");
    if (id) moveTicket(id, status);
  };

  const onNativeDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <div className="h-screen bg-[#020617] p-12 flex flex-col selection:bg-blue-600/30 overflow-hidden">
      
      {/* CABEÇALHO DE MONITORAMENTO */}
      <header className="mb-14 flex justify-between items-center bg-white/[0.02] p-10 rounded-[45px] border border-white/5">
        <div className="flex items-center gap-8">
          <div className="bg-blue-600 p-5 rounded-[25px] shadow-[0_0_40px_rgba(37,99,235,0.4)] rotate-3">
            <Zap className="text-white fill-current" size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3 text-blue-500 mb-2 italic">
              <ShieldAlert size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Global ITSM Board</span>
            </div>
            <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Command Center</h2>
          </div>
        </div>

        <div className="flex gap-8 items-center">
           <div className="px-8 py-4 bg-slate-950 rounded-[25px] border border-white/5 flex flex-col items-center">
             <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Carga Global</p>
             <p className="text-3xl font-black text-white italic">{tickets.length}</p>
           </div>
           <div className="h-16 w-[1px] bg-white/10" />
           <div className="flex items-center gap-4">
              <button className="p-5 bg-white/5 rounded-2xl hover:bg-blue-600 transition-all text-slate-400 hover:text-white border border-white/5">
                <Filter size={20} />
              </button>
              <button className="p-5 bg-white/5 rounded-2xl hover:bg-blue-600 transition-all text-slate-400 hover:text-white border border-white/5">
                <Users size={20} />
              </button>
           </div>
        </div>
      </header>

      {/* VIEW KANBAN - GRID DE COLUNAS */}
      <div className="flex-1 flex gap-10 overflow-x-auto pb-10 no-scrollbar items-start px-2">
        {columns.map(col => (
          <div 
            key={col} 
            onDragOver={onNativeDragOver}
            onDrop={(e) => onNativeDrop(e, col)}
            className="min-w-[400px] w-[400px] bg-white/[0.02] border border-white/5 rounded-[65px] flex flex-col p-10 shadow-3xl backdrop-blur-3xl transition-all relative overflow-hidden"
          >
            {/* INDICADOR DE DROP ATIVO */}
            <div className="absolute inset-0 bg-blue-600/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none border-2 border-dashed border-blue-600/20 rounded-[65px] m-2" />

            <header className="flex justify-between items-center mb-12 relative z-10 px-4">
              <div className="flex items-center gap-4">
                <div className={`h-3 w-3 rounded-full ${col === 'open' ? 'bg-blue-500' : 'bg-emerald-500'} shadow-[0_0_15px_rgba(37,99,235,0.8)]`} />
                <h3 className="text-[13px] font-black uppercase tracking-[0.4em] text-slate-500 italic">
                  {col.replace('_', ' ')}
                </h3>
              </div>
              <div className="bg-slate-950 px-6 py-2 rounded-2xl border border-white/5 shadow-inner">
                <span className="text-blue-500 text-[14px] font-black italic">
                  {tickets.filter(t => t.status === col).length}
                </span>
              </div>
            </header>

            <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar px-1 min-h-[600px] border-t border-white/[0.04] pt-12 relative z-10">
              <AnimatePresence>
                {tickets.filter(t => t.status === col).map(ticket => (
                  <div
                    key={ticket.id}
                    draggable
                    onDragStart={(e) => onNativeDragStart(e, ticket.id || "")}
                    onDragEnd={onNativeDragEnd}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <motion.div 
                      layoutId={ticket.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: isDragging === ticket.id ? 0.5 : 1, 
                        scale: isDragging === ticket.id ? 0.95 : 1 
                      }}
                      className="p-10 bg-[#0a0f1e] border border-white/5 rounded-[50px] hover:border-blue-600/50 transition-all group shadow-2xl relative overflow-hidden"
                    >
                      <div className={`absolute top-0 left-0 h-full w-2.5 ${ticket.priority === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-blue-600'}`} />
                      
                      {/* CARD TOP INFO */}
                      <div className="flex justify-between items-start mb-8">
                         <div className="flex items-center gap-4">
                           <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${ticket.priority === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                             <AlertCircle size={20} />
                           </div>
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">ID: {ticket.id?.substring(0, 10).toUpperCase()}</span>
                         </div>
                         <button className="text-slate-800 group-hover:text-blue-500 transition-colors">
                          <MoreHorizontal size={24} />
                         </button>
                      </div>
                      
                      {/* CARD TITLE - DENSIDADE AUMENTADA (FONTE MENOR) */}
                      <h4 className="text-[17px] font-black text-white uppercase italic leading-tight mb-8 tracking-tighter group-hover:text-blue-400 transition-colors duration-500 line-clamp-2">
                        {ticket.title}
                      </h4>

                      {/* SLA PROGRESS BAR MOCKUP */}
                      <div className="w-full h-1.5 bg-white/5 rounded-full mb-8 overflow-hidden">
                         <div className="h-full bg-blue-600 w-[65%]" />
                      </div>
                      
                      {/* CARD FOOTER INFO */}
                      <div className="flex items-center justify-between pt-8 border-t border-white/[0.05]">
                         <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">
                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-blue-500 border border-white/5 shadow-inner">
                              <User size={16} />
                            </div>
                            <span className="truncate max-w-[100px]">{ticket.customerName.split(' ')[0]}</span>
                         </div>
                         <div className="flex items-center gap-3 text-[10px] font-black text-emerald-500 italic bg-emerald-500/10 px-5 py-2.5 rounded-2xl border border-emerald-500/20">
                            <Timer size={16} /> 00:45:12
                         </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </AnimatePresence>
              
              {/* EMPTY STATE INDICATOR */}
              {tickets.filter(t => t.status === col).length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-10 py-32 space-y-6">
                   <ArrowRightLeft size={100} className="text-white rotate-90" />
                   <p className="text-[14px] font-black uppercase tracking-[0.8em] italic">Standby</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}