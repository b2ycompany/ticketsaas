"use client";

import { useState } from "react";
import { Ticket } from "@/types/ticket";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { 
  X, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Trash2, 
  ShieldAlert, 
  Activity, 
  Hash,
  Zap 
} from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  ticket: Ticket;
  onClose: () => void;
}

/**
 * TICKET DETAIL SIDEBAR COMPONENT
 * Gerenciamento de Ciclo de Vida do Incidente B2Y Master
 */
export default function TicketDetailSidebar({ ticket, onClose }: SidebarProps) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // --- ATUALIZAÇÃO DE ESTADO ---
  const handleUpdateStatus = async (newStatus: Ticket['status']) => {
    if (!ticket.id) return;
    setIsProcessing(true);
    
    try {
      const ticketRef = doc(db, "tickets", ticket.id);
      await updateDoc(ticketRef, { 
        status: newStatus, 
        updatedAt: serverTimestamp() 
      });
      onClose();
    } catch (err) {
      console.error("Falha ao atualizar estado do ticket:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- EXCLUSÃO DEFINITIVA ---
  const handleDeleteTicket = async () => {
    if (!ticket.id) return;
    const confirmDelete = window.confirm("Deseja expurgar este registro definitivamente da governança?");
    
    if (confirmDelete) {
      setIsProcessing(true);
      try {
        const ticketRef = doc(db, "tickets", ticket.id);
        await deleteDoc(ticketRef);
        onClose();
      } catch (err) {
        console.error("Falha ao remover ticket:", err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <motion.div 
      initial={{ x: "100%" }} 
      animate={{ x: 0 }} 
      exit={{ x: "100%" }} 
      transition={{ type: "spring", damping: 28, stiffness: 200 }} 
      className="fixed inset-y-0 right-0 w-full max-w-2xl bg-[#0a0f1e] shadow-[0_0_150px_rgba(0,0,0,0.9)] z-[200] border-l border-white/10 flex flex-col"
    >
      {/* CABEÇALHO TÉCNICO */}
      <div className="p-12 border-b border-white/5 bg-slate-950/40 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          <Activity size={300} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="text-blue-500" size={16} />
            <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] italic leading-none">Terminal de Incidente</span>
          </div>
          <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none flex items-center gap-4">
            <Hash className="text-slate-800" size={24} /> {ticket.id?.substring(0, 12)}
          </h3>
        </div>
        <button 
          onClick={onClose} 
          className="p-6 bg-white/5 rounded-3xl hover:bg-red-500/20 transition-all text-slate-500 hover:text-red-500 relative z-10"
        >
          <X size={32} />
        </button>
      </div>

      {/* ÁREA DE INFORMAÇÕES DETALHADAS */}
      <div className="flex-1 overflow-y-auto p-14 space-y-14 custom-scrollbar">
        
        {/* RESUMO DE PRIORIDADE */}
        <section>
          <div className="flex flex-wrap gap-4 mb-10">
             <span className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest border ${ticket.priority === 'critical' ? 'bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-blue-600/20 text-blue-500 border-blue-500/30'}`}>
                {ticket.priority} SEVERITY
             </span>
             <span className="px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-white/5 text-slate-400 border border-white/10 italic">
                GATEWAY: {ticket.source.toUpperCase()}
             </span>
          </div>
          
          <h4 className="text-5xl font-black text-white mb-10 tracking-tighter uppercase italic leading-[0.9] border-l-8 border-blue-600 pl-8">
            {ticket.title}
          </h4>
          
          <div className="bg-white/5 p-10 rounded-[50px] border border-white/5 shadow-inner text-xl leading-relaxed font-medium italic text-slate-400">
             {ticket.description || "Descrição técnica não preenchida na origem do Webhook."}
          </div>
        </section>

        {/* CONTROLES OPERACIONAIS */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic">
            <div className="h-px bg-white/5 flex-1" />
            Workflow de Resolução
            <div className="h-px bg-white/5 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => handleUpdateStatus('in_progress')} 
              disabled={isProcessing} 
              className="p-10 bg-blue-600 rounded-[40px] font-black text-[11px] uppercase tracking-[0.2em] flex flex-col items-center gap-6 hover:bg-white hover:text-blue-600 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] disabled:opacity-50 group"
            >
              <Clock size={32} className="group-hover:rotate-12 transition-transform" />
              Assumir SLA
            </button>
            <button 
              onClick={() => handleUpdateStatus('resolved')} 
              disabled={isProcessing} 
              className="p-10 bg-white/5 border border-white/10 rounded-[40px] font-black text-[11px] uppercase tracking-[0.2em] flex flex-col items-center gap-6 hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50 group"
            >
              <CheckCircle size={32} className="group-hover:scale-110 transition-transform" />
              Finalizar Atendimento
            </button>
          </div>
          
          <div className="flex justify-center pt-4">
            <button 
              onClick={handleDeleteTicket} 
              disabled={isProcessing}
              className="flex items-center gap-3 text-red-500/40 hover:text-red-500 transition-colors font-black text-[11px] uppercase tracking-widest italic"
            >
              <Trash2 size={16} /> Expurgar Registro do Database
            </button>
          </div>
        </section>

        {/* TIMELINE DE AUDITORIA */}
        <section className="pt-14 border-t border-white/5">
           <h5 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-12 italic flex items-center gap-4">
              <MessageSquare size={20} className="text-blue-500" /> Histórico de Transações
           </h5>
           
           <div className="space-y-12 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
              <div className="relative pl-16">
                 <div className="absolute left-0 top-1 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center border-4 border-[#0a0f1e] shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                    <Zap size={16} />
                 </div>
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <p className="text-sm font-black text-white uppercase italic">Sincronização Gateway</p>
                    <p className="text-[11px] text-slate-500 font-bold uppercase mt-2 tracking-widest leading-relaxed">
                       Evento capturado em tempo real via B2Y Webhook.
                    </p>
                 </div>
              </div>
           </div>
        </section>
      </div>

      {/* FOOTER */}
      <div className="p-12 bg-slate-950/60 backdrop-blur-2xl border-t border-white/5">
         <button className="w-full bg-white/5 border border-white/10 p-10 rounded-[40px] font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-6 hover:bg-blue-600 hover:text-white transition-all shadow-2xl">
            <MessageSquare size={24} /> Adicionar Relatório Técnico
         </button>
      </div>
    </motion.div>
  );
}