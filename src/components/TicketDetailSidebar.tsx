"use client";

import { useState } from "react";
import { Ticket } from "@/types/ticket";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { 
  X, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Trash2, 
  ShieldAlert, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  ticket: Ticket;
  onClose: () => void;
}

/**
 * TICKET DETAIL SIDEBAR - GOVERNANCE LAYER
 * Interface de Resolução com Auditoria Obrigatória
 */
export default function TicketDetailSidebar({ ticket, onClose }: SidebarProps) {
  const [rca, setRca] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // --- RESOLUÇÃO COM VALIDAÇÃO DE RCA (ITIL COMPLIANT) ---
  const handleResolve = async () => {
    if (!ticket.id) return;
    
    // Validação de texto para garantir governança (Root Cause Analysis)
    if (rca.trim().length < 20) {
      alert("ERRO DE PROTOCOLO: O relatório de causa raiz (RCA) deve conter pelo menos 20 caracteres para validação de auditoria.");
      return;
    }

    setIsProcessing(true);
    try {
      const ticketRef = doc(db, "tickets", ticket.id);
      await updateDoc(ticketRef, {
        status: 'resolved',
        rca: rca,
        updatedAt: serverTimestamp(),
        // Histórico imutável de logs
        auditTrail: arrayUnion({
          event: "RESOLVED",
          timestamp: new Date().toISOString(),
          note: rca
        })
      });
      console.log(`Governança: Ticket #${ticket.id} resolvido.`);
      onClose();
    } catch (err) {
      console.error("Erro ao processar resolução:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- SOFT DELETE (AUDITORIA PERSISTENTE) ---
  const handleSoftDelete = async () => {
    if (!ticket.id) return;
    
    const confirmDelete = window.confirm("ATENÇÃO: Este incidente será removido da fila operacional, mas permanecerá no banco de dados para auditoria perpétua. Confirmar Soft Delete?");
    
    if (confirmDelete) {
      setIsProcessing(true);
      try {
        const ticketRef = doc(db, "tickets", ticket.id);
        await updateDoc(ticketRef, {
          status: 'deleted',
          deletedAt: serverTimestamp(),
          auditTrail: arrayUnion({
            event: "REMOVED_FROM_QUEUE",
            timestamp: new Date().toISOString(),
            note: "Remoção manual realizada pelo operador administrativo."
          })
        });
        onClose();
      } catch (err) {
        console.error("Erro ao realizar soft delete:", err);
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
      transition={{ type: "spring", damping: 30, stiffness: 200 }} 
      className="fixed inset-y-0 right-0 w-full max-w-2xl bg-[#0a0f1e] shadow-[0_0_200px_rgba(0,0,0,1)] z-[200] border-l border-white/10 flex flex-col"
    >
      {/* HEADER DE GOVERNANÇA */}
      <div className="p-12 border-b border-white/5 flex justify-between items-center bg-slate-950/40 relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="text-blue-500 animate-pulse" size={16} />
            <span className="text-blue-500 font-black text-[11px] uppercase tracking-[0.4em] italic leading-none">Terminal de Governança</span>
          </div>
          <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
            #{ticket.id?.substring(0, 12).toUpperCase()}
          </h3>
        </div>
        <button 
          onClick={onClose} 
          className="p-6 bg-white/5 rounded-[25px] hover:bg-red-500/20 transition-all text-slate-500 hover:text-red-500 shadow-xl"
        >
          <X size={32} />
        </button>
      </div>

      {/* ÁREA DE TRABALHO TÉCNICA */}
      <div className="flex-1 overflow-y-auto p-14 space-y-14 custom-scrollbar">
        
        {/* RESUMO DO INCIDENTE */}
        <section>
          <div className="flex flex-wrap gap-4 mb-12">
             <span className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest border ${ticket.priority === 'critical' ? 'bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_25px_rgba(239,68,68,0.2)]' : 'bg-blue-600/20 text-blue-500 border-blue-500/30'}`}>
                {ticket.priority} PRIORITY
             </span>
             <span className="px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-white/5 text-slate-400 border border-white/10 italic">
                GATEWAY: {ticket.source.toUpperCase()}
             </span>
          </div>
          
          <h4 className="text-5xl font-black text-white mb-10 tracking-tighter uppercase italic leading-[0.85] border-l-8 border-blue-600 pl-10">
            {ticket.title}
          </h4>
          
          <div className="bg-white/5 p-10 rounded-[50px] border border-white/5 shadow-inner">
             <p className="text-slate-400 text-xl leading-relaxed font-medium italic">
                {ticket.description || "O sistema de monitoramento não reportou detalhes descritivos adicionais para este protocolo."}
             </p>
          </div>
        </section>

        {/* RCA & WORKFLOW (OBRIGATÓRIO) */}
        <section className="space-y-8 bg-blue-600/5 p-10 rounded-[50px] border border-blue-600/10">
          <div className="flex items-center gap-4 text-[11px] font-black text-blue-500 uppercase tracking-[0.4em] italic">
            <FileText size={16} /> Relatório de Causa Raiz (RCA)
          </div>

          <textarea 
            placeholder="Descreva detalhadamente as ações corretivas tomadas..."
            className="w-full p-10 bg-[#020617] border border-white/10 rounded-[40px] text-white outline-none focus:border-blue-600 transition-all font-bold text-lg h-48 resize-none shadow-inner placeholder:text-slate-800 italic"
            onChange={(e) => setRca(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <button 
              onClick={handleResolve} 
              disabled={isProcessing} 
              className="p-10 bg-blue-600 rounded-[40px] font-black text-xs uppercase tracking-[0.2em] flex flex-col items-center gap-6 hover:bg-emerald-600 hover:text-white transition-all shadow-2xl shadow-blue-600/20 disabled:opacity-50 group"
            >
              <CheckCircle size={32} className="group-hover:scale-110 transition-transform" />
              Validar Solução
            </button>
            <button 
              onClick={handleSoftDelete} 
              disabled={isProcessing} 
              className="p-10 bg-white/5 border border-white/10 rounded-[40px] font-black text-xs uppercase tracking-[0.2em] flex flex-col items-center gap-6 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 group"
            >
              <Trash2 size={32} className="group-hover:rotate-12 transition-transform" />
              Soft Delete
            </button>
          </div>
        </section>

        {/* TIMELINE DE AUDITORIA IMUTÁVEL */}
        <section className="pt-14 border-t border-white/5">
           <h5 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-12 italic flex items-center gap-4">
              <ShieldCheck size={20} className="text-blue-500" /> Auditoria Imutável (B2Y Logs)
           </h5>
           
           <div className="space-y-12 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
              <div className="relative pl-16">
                 <div className="absolute left-0 top-1 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center border-4 border-[#0a0f1e] shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                    <Zap size={16} />
                 </div>
                 <div className="bg-white/5 p-8 rounded-[35px] border border-white/5">
                    <p className="text-sm font-black text-white uppercase italic">Sincronização Gateway</p>
                    <p className="text-[11px] text-slate-500 font-bold uppercase mt-3 tracking-widest leading-relaxed">
                       Evento capturado e registrado no ledger operacional com sucesso.
                    </p>
                 </div>
              </div>
           </div>
        </section>
      </div>

      {/* FOOTER DE GOVERNANÇA */}
      <div className="p-12 bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 text-center">
         <p className="flex items-center justify-center gap-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic">
           <AlertCircle size={14} /> Sistema em Compliance ITIL 4
         </p>
      </div>
    </motion.div>
  );
}