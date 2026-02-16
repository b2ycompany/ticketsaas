"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
import { Vendor } from "@/types/vendor";
import { checkSLAStatusAndNotify } from "@/lib/notifications";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MoreHorizontal, 
  User as UserIcon, 
  ShieldAlert, 
  Timer, 
  Zap, 
  LayoutGrid, 
  Search, 
  Filter,
  ArrowRightLeft, 
  Activity, 
  BellRing,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  History
} from "lucide-react";

/**
 * KANBAN COMMAND CENTER V6.5 - ENTERPRISE HIGH DENSITY
 * Arquitetura de Board Dinâmico com Injeção de Colunas via Workflow Engine.
 */
export default function KanbanPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>("default");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // --- SINCRONIZAÇÃO MULTI-LEDGER (FIRESTORE) ---
  useEffect(() => {
    const ticketsQuery = query(collection(db, "tickets"));
    const vendorsQuery = query(collection(db, "vendors"));

    const unsubTickets = onSnapshot(ticketsQuery, (snapshot) => {
      setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Ticket[]);
    }, (err) => console.error("Ticket Sync Error:", err));

    const unsubVendors = onSnapshot(vendorsQuery, (snapshot) => {
      setVendors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Vendor[]);
    }, (err) => console.error("Vendor Sync Error:", err));

    return () => { unsubTickets(); unsubVendors(); };
  }, []);

  // --- MAPEAMENTO DINÂMICO DE COLUNAS (WORKFLOW ARCHITECT) ---
  const activeColumns = useMemo(() => {
    const vendor = vendors.find(v => v.id === selectedVendorId);
    // Fallback para colunas padrão ITIL se o fornecedor não tiver colunas customizadas
    return vendor?.customColumns && vendor.customColumns.length > 0 
      ? vendor.customColumns 
      : ["open", "in_progress", "waiting_customer", "resolved"];
  }, [vendors, selectedVendorId]);

  // --- ENGINE DE TRANSIÇÃO COM NOTIFICAÇÃO PREDITIVA ---
  const moveTicketWithAudit = useCallback(async (ticketId: string, newStatus: string) => {
    if (!ticketId) return;
    setIsSyncing(true);
    
    const note = prompt(`GOVERNANÇA: Justifique a migração para o estado [${newStatus.toUpperCase()}]`);
    
    if (!note || note.length < 10) {
      alert("AÇÃO BLOQUEADA: É obrigatório fornecer uma justificativa técnica (mín. 10 chars).");
      setIsSyncing(false);
      return;
    }

    try {
      const ticketRef = doc(db, "tickets", ticketId);
      const ticketData = tickets.find(t => t.id === ticketId);
      const vendorData = vendors.find(v => v.id === selectedVendorId);

      // 1. Atualização de Estado e Ledger de Auditoria
      await updateDoc(ticketRef, { 
        status: newStatus, 
        updatedAt: serverTimestamp(),
        auditTrail: arrayUnion({
          event: `KANBAN_MOVE_${newStatus.toUpperCase()}`,
          timestamp: new Date().toISOString(),
          note: note,
          operator: "ADMIN_SYSTEM_CONSOLE"
        })
      });

      // 2. Trigger de Notificação Inteligente baseada na Matriz de SLA
      if (ticketData && vendorData && newStatus !== 'resolved') {
        await checkSLAStatusAndNotify(ticketData, vendorData);
      }

      console.log(`B2Y MASTER: Protocolo ${ticketId} migrado com sucesso.`);
    } catch (error) {
      console.error("Critical Transition Failure:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [tickets, vendors, selectedVendorId]);

  // --- HANDLERS DE ARRASTE (HTML5 NATIVE API) ---
  const onHandleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("ticketId", id);
    e.dataTransfer.effectAllowed = "move";
    setDraggedId(id);
  };

  const onHandleDrop = (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("ticketId");
    if (id) moveTicketWithAudit(id, status);
    setDraggedId(null);
  };

  return (
    <div className="p-14 flex flex-col min-h-screen bg-transparent selection:bg-blue-500/30">
      
      {/* HEADER DE COMANDO INDUSTRIAL */}
      <header className="mb-14 flex justify-between items-center bg-white/[0.02] p-10 rounded-[50px] border border-white/5 shadow-3xl">
        <div className="flex items-center gap-10">
          <div className="bg-blue-600 p-5 rounded-[25px] shadow-[0_0_50px_rgba(37,99,235,0.4)] rotate-3">
            <LayoutGrid size={36} className="text-white" />
          </div>
          <div>
            <h2 className="text-7xl font-black italic uppercase tracking-tighter text-white leading-none">Operational Board</h2>
            <div className="flex items-center gap-4 mt-4 italic">
               <span className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[9px] font-black uppercase tracking-[0.4em]">
                 <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" /> Stream Sync Active
               </span>
               <span className="text-slate-600 font-bold text-[10px] uppercase tracking-widest px-4 border-l border-white/10">
                 B2Y Master Engine v6.5
               </span>
            </div>
          </div>
        </div>

        {/* SELETOR DE WORKFLOW (ITSM MATRIZ) */}
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-[35px] border border-white/10 shadow-inner">
              <Filter size={18} className="text-slate-500 ml-4" />
              <select 
                value={selectedVendorId} 
                onChange={(e) => setSelectedVendorId(e.target.value)}
                className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer pr-10 text-blue-500 appearance-none"
              >
                <option value="default">Fluxo Centralizado</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.name} JOURNEY</option>
                ))}
              </select>
           </div>
           {isSyncing && <Activity size={24} className="text-blue-500 animate-spin" />}
        </div>
      </header>

      {/* VIEW KANBAN - FONTES REDUZIDAS PARA MÁXIMA DENSIDADE */}
      <div className="flex-1 flex gap-10 overflow-x-auto pb-12 no-scrollbar items-start px-2">
        {activeColumns.map(col => (
          <div 
            key={col} 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onHandleDrop(e, col)}
            className="min-w-[420px] w-[420px] bg-white/[0.01] border border-white/5 rounded-[80px] flex flex-col p-10 shadow-3xl backdrop-blur-3xl relative group hover:bg-white/[0.02] transition-all"
          >
            {/* INDICADOR DE DROP ZONE */}
            <div className="absolute inset-4 border-2 border-dashed border-blue-600/10 rounded-[70px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <header className="flex justify-between items-center mb-12 relative z-10 px-6">
              <div className="flex items-center gap-5">
                <div className={`h-3 w-3 rounded-full ${col === 'open' ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,1)]' : 'bg-emerald-600'} animate-pulse`} />
                <h3 className="text-[16px] font-black uppercase tracking-[0.4em] text-slate-500 italic">
                  {col.replace('_', ' ')}
                </h3>
              </div>
              <div className="bg-slate-950 px-5 py-2 rounded-2xl border border-white/5 shadow-inner">
                <span className="text-blue-500 text-[14px] font-black italic">
                  {tickets.filter(t => t.status === col).length}
                </span>
              </div>
            </header>

            <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar px-1 min-h-[600px] border-t border-white/[0.03] pt-12 relative z-10">
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
                      className={`p-10 bg-[#0a0f1e] border border-white/5 rounded-[60px] hover:border-blue-600/50 transition-all cursor-grab active:cursor-grabbing group shadow-2xl relative overflow-hidden ${draggedId === ticket.id ? 'opacity-20 scale-95' : 'opacity-100'}`}
                    >
                      <div className={`absolute top-0 left-0 h-full w-3 ${ticket.priority === 'critical' ? 'bg-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-blue-600'}`} />
                      
                      <div className="flex justify-between items-start mb-8">
                         <div className="flex items-center gap-4">
                           <ShieldAlert size={18} className={ticket.priority === 'critical' ? 'text-red-500' : 'text-blue-500'} />
                           <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest italic">PROTOCOL: {ticket.id?.substring(0, 12).toUpperCase()}</span>
                         </div>
                         <button className="text-slate-800 group-hover:text-blue-500 transition-colors">
                          <MoreHorizontal size={24} />
                         </button>
                      </div>
                      
                      {/* DENSIDADE AUMENTADA: Título legível mas compacto */}
                      <h4 className="text-[19px] font-black text-white uppercase italic leading-[1.1] mb-12 tracking-tighter group-hover:text-blue-400 transition-colors duration-500 line-clamp-2">
                        {ticket.title}
                      </h4>

                      {/* SLA STATUS BAR VISUAL */}
                      <div className="w-full h-1.5 bg-white/5 rounded-full mb-10 overflow-hidden shadow-inner">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: "75%" }} 
                           className={`h-full ${ticket.priority === 'critical' ? 'bg-red-600' : 'bg-blue-600'} shadow-[0_0_15px_rgba(37,99,235,0.8)]`} 
                         />
                      </div>
                      
                      <div className="flex items-center justify-between pt-10 border-t border-white/[0.05]">
                         <div className="flex items-center gap-4 text-[12px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">
                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-blue-500 border border-white/5 shadow-inner">
                              <UserIcon size={18} />
                            </div>
                            <span className="truncate max-w-[130px]">{ticket.customerName.split(' ')[0]}</span>
                         </div>
                         <div className="flex items-center gap-3 text-[12px] font-black text-blue-500 italic bg-blue-500/10 px-6 py-3 rounded-3xl border border-blue-500/20 shadow-lg">
                            <Timer size={20} /> 00:32
                         </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </AnimatePresence>
              
              {tickets.filter(t => t.status === col).length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-10 py-40">
                   <ArrowRightLeft size={100} className="text-white rotate-90 mb-8" />
                   <p className="text-[18px] font-black uppercase tracking-[1em] italic text-center leading-loose">Standby Mode</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER DE CONFORMIDADE */}
      <footer className="mt-10 p-10 bg-white/[0.02] border border-white/5 rounded-[40px] flex items-center justify-center gap-10">
         <div className="flex items-center gap-4 text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] italic">
           <ShieldCheck size={16} className="text-emerald-500" /> B2Y Master Protocol Compliance Active
         </div>
         <div className="h-4 w-px bg-white/10" />
         <div className="flex items-center gap-4 text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] italic">
           <AlertTriangle size={16} className="text-orange-500" /> NOC Monitoring Tier 3
         </div>
      </footer>
    </div>
  );
}