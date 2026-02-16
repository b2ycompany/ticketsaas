"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  arrayUnion 
} from "firebase/firestore";
import { Ticket } from "@/types/ticket";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MoreHorizontal, 
  ShieldAlert, 
  Timer,
  ArrowRightLeft,
  Search,
  Plus,
  LayoutGrid,
  User as UserIcon
} from "lucide-react";

/**
 * KANBAN BOARD ENTERPRISE V5.1 - B2Y RIGOROUS MODE
 * Interface de alta densidade para gestão de incidentes críticos.
 */
export default function KanbanPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  
  // Colunas ITSM ITIL 4 definidas para o fluxo operacional
  const columns: Ticket['status'][] = ["open", "in_progress", "waiting_customer", "resolved"];

  // Sincronização Ledger Real-Time com o Firestore
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

  // Transição com Protocolo de Auditoria Mandatário para Tracking
  const moveTicketWithAudit = useCallback(async (id: string, newStatus: Ticket['status']) => {
    if (!id) return;
    
    const note = prompt(`GOVERNANÇA: Justifique a migração do protocolo para o estado [${newStatus.toUpperCase()}]`);
    if (!note || note.length < 10) {
      alert("AÇÃO BLOQUEADA: Justificativa insuficiente para auditoria.");
      return;
    }

    try {
      const ticketRef = doc(db, "tickets", id);
      await updateDoc(ticketRef, { 
        status: newStatus, 
        updatedAt: serverTimestamp(),
        auditTrail: arrayUnion({
          event: `KANBAN_TRANSITION_${newStatus.toUpperCase()}`,
          timestamp: new Date().toISOString(),
          note: note,
          operator: "ADMIN_CONSOLE"
        })
      });
    } catch (error) {
      console.error("Falha crítica na transição do board:", error);
    }
  }, []);

  // HTML5 Drag Handlers para compatibilidade nativa de dataTransfer
  const onHandleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("ticketId", id);
    e.dataTransfer.effectAllowed = "move";
    setDraggedId(id);
  };

  const onHandleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onHandleDrop = (e: React.DragEvent<HTMLDivElement>, status: Ticket['status']) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("ticketId");
    if (id) moveTicketWithAudit(id, status);
    setDraggedId(null);
  };

  return (
    <div className="p-16 flex flex-col min-h-full">
      
      {/* HEADER DE MONITORAMENTO TÉCNICO */}
      <header className="mb-14 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 text-blue-500 mb-4 italic">
            <LayoutGrid size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">Operational Board v5.1</span>
          </div>
          <h2 className="text-8xl font-black italic uppercase tracking-tighter text-white leading-none">Command Board</h2>
        </div>

        <div className="flex gap-8 bg-white/5 p-10 rounded-[50px] border border-white/5 shadow-2xl">
           <div className="text-center px-8 border-r border-white/10">
             <p className="text-[10px] font-black text-slate-600 uppercase italic tracking-widest mb-3">Incidentes</p>
             <p className="text-5xl font-black text-white italic">{tickets.length}</p>
           </div>
           <div className="text-center px-8">
             <p className="text-[10px] font-black text-slate-600 uppercase italic tracking-widest mb-3">MTTR Média</p>
             <p className="text-5xl font-black text-blue-500 italic">22m</p>
           </div>
        </div>
      </header>

      {/* FERRAMENTAS DE PESQUISA RÁPIDA */}
      <div className="flex items-center gap-6 mb-16">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar protocolo de rede..." 
            className="w-full p-8 pl-16 bg-white/5 border border-white/5 rounded-[35px] text-white outline-none focus:border-blue-500/50 transition-all font-black text-sm shadow-inner" 
          />
        </div>
        <button className="bg-blue-600 p-8 rounded-[35px] shadow-2xl shadow-blue-600/20 hover:scale-105 transition-all">
          <Plus size={24} className="text-white" />
        </button>
      </div>

      {/* VIEW KANBAN - COLUNAS OPERACIONAIS */}
      <div className="flex-1 flex gap-8 overflow-x-auto pb-10 no-scrollbar items-start px-2">
        {columns.map(col => (
          <div 
            key={col} 
            onDragOver={onHandleDragOver}
            onDrop={(e) => onHandleDrop(e, col)}
            className="min-w-[400px] w-[400px] bg-white/[0.01] border border-white/5 rounded-[70px] flex flex-col p-10 shadow-3xl backdrop-blur-3xl transition-all relative group/column hover:bg-white/[0.03]"
          >
            <div className="absolute inset-2 border-2 border-dashed border-blue-600/10 rounded-[60px] opacity-0 group-hover/column:opacity-100 transition-opacity pointer-events-none" />
            
            <header className="flex justify-between items-center mb-12 relative z-10 px-4">
              <div className="flex items-center gap-4">
                <div className={`h-2.5 w-2.5 rounded-full ${col === 'open' ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,1)]' : 'bg-emerald-600'} animate-pulse`} />
                <h3 className="text-[14px] font-black uppercase tracking-[0.5em] text-slate-500 italic">
                  {col.replace('_', ' ')}
                </h3>
              </div>
              <div className="bg-slate-950 px-6 py-2 rounded-2xl border border-white/5 shadow-inner">
                <span className="text-blue-500 text-[14px] font-black italic">
                  {tickets.filter(t => t.status === col).length}
                </span>
              </div>
            </header>

            <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar px-1 min-h-[600px] border-t border-white/[0.03] pt-12">
              <AnimatePresence>
                {tickets.filter(t => t.status === col).map(ticket => (
                  <div
                    key={ticket.id}
                    draggable
                    onDragStart={(e) => onHandleDragStart(e, ticket.id || "")}
                    onDragEnd={() => setDraggedId(null)}
                  >
                    <motion.div 
                      layoutId={ticket.id}
                      className={`p-10 bg-[#0a0f1e] border border-white/5 rounded-[55px] hover:border-blue-600/50 transition-all cursor-grab active:cursor-grabbing group shadow-2xl relative overflow-hidden ${draggedId === ticket.id ? 'opacity-30 scale-95' : 'opacity-100'}`}
                    >
                      <div className={`absolute top-0 left-0 h-full w-2.5 ${ticket.priority === 'critical' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-blue-600'}`} />
                      
                      <div className="flex justify-between items-start mb-8">
                         <div className="flex items-center gap-3">
                           <ShieldAlert size={16} className={ticket.priority === 'critical' ? 'text-red-500' : 'text-blue-600'} />
                           <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">PROTOCOL: {ticket.id?.substring(0, 12).toUpperCase()}</span>
                         </div>
                         <button className="text-slate-800 group-hover:text-blue-500 transition-colors">
                          <MoreHorizontal size={24} />
                         </button>
                      </div>
                      
                      {/* DENSIDADE DE INFORMAÇÃO: Títulos pequenos para visualização massiva */}
                      <h4 className="text-[18px] font-black text-white uppercase italic leading-[1.1] mb-10 tracking-tighter group-hover:text-blue-400 transition-colors duration-500 line-clamp-2">
                        {ticket.title}
                      </h4>

                      <div className="w-full h-1 bg-white/5 rounded-full mb-10 overflow-hidden shadow-inner">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: "70%" }} 
                           className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]" 
                         />
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
    </div>
  );
}