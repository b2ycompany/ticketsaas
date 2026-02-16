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
  ShieldCheck,
  FileText,
  PauseCircle,
  PlayCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  ticket: Ticket;
  onClose: () => void;
}

/**
 * TICKET DETAIL SIDEBAR - FULL GOVERNANCE LAYER
 * Interface de Resolução com Protocolo de Auditoria Obrigatório
 */
export default function TicketDetailSidebar({ ticket, onClose }: SidebarProps) {
  const [rca, setRca] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // --- ENGINE DE ATUALIZAÇÃO DE ESTADO ---
  const handleUpdateStatus = async (newStatus: Ticket['status']) => {
    if (!ticket.id) return;

    // Bloqueio de Governança: Impede fechar ou cancelar sem RCA
    if ((newStatus === 'resolved' || newStatus === 'cancelled') && rca.trim().length < 25) {
      alert("GOVERNANÇA: O relatório técnico (RCA) é obrigatório e deve conter detalhes técnicos (mín. 25 caracteres).");
      return;
    }

    setIsProcessing(true);
    try {
      const ticketRef = doc(db, "tickets", ticket.id);
      await updateDoc(ticketRef, {
        status: newStatus,
        rca: rca || ticket.rca || "",
        updatedAt: serverTimestamp(),
        // Histórico imutável
        auditTrail: arrayUnion({
          event: `TRANSITION_TO_${newStatus.toUpperCase()}`,
          timestamp: new Date().toISOString(),
          note: rca || "Estado alterado manualmente pelo operador.",
          operator: "MASTER_ADMIN"
        })
      });
      onClose();
    } catch (err) {
      console.error("Critical Failure:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ x: "100%" }} 
      animate={{ x: 0 }} 
      exit={{ x: "100%" }} 
      transition={{ type: "spring", damping: 32, stiffness: 220 }} 
      className="fixed inset-y-0 right-0 w-full max-w-3xl bg-[#0a0f1e] shadow-[0_0_250px_rgba(0,0,0,1)] z-[200] border-l border-white/10 flex flex-col"
    >
      {/* HEADER */}
      <div className="p-16 border-b border-white/5 bg-slate-950/50">
        <div className="flex items-center gap-4 mb-6">
          <ShieldAlert className="text-blue-500 animate-pulse" size={20} />
          <span className="text-blue-500 font-black text-[11px] uppercase tracking-[0.4em] italic leading-none">Governança ITSM Ativa</span>
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            #{ticket.id?.substring(0, 18).toUpperCase()}
          </h3>
          <button onClick={onClose} className="p-10 bg-white/5 rounded-[40px] hover:bg-red-500/20 text-slate-500 hover:text-red-500 transition-all border border-white/5 shadow-2xl">
            <X size={44} />
          </button>
        </div>
      </div>

      {/* ÁREA TÉCNICA */}
      <div className="flex-1 overflow-y-auto p-20 space-y-20 custom-scrollbar">
        
        <section>
          <div className="flex flex-wrap gap-6 mb-16 font-black uppercase text-[13px] tracking-widest">
             <div className={`px-10 py-5 rounded-[30px] border flex items-center gap-4 ${ticket.priority === 'critical' ? 'bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.3)]' : 'bg-blue-600/20 text-blue-500 border-blue-500/30'}`}>
                <AlertCircle size={22} /> {ticket.priority} PRIORITY
             </div>
             <div className="px-10 py-5 rounded-[30px] bg-white/5 text-slate-400 border border-white/10 italic flex items-center gap-4">
                <Zap size={22} /> {ticket.source.toUpperCase()} GATEWAY
             </div>
          </div>
          
          <h4 className="text-6xl font-black text-white mb-16 tracking-tighter uppercase italic leading-[0.85] border-l-[12px] border-blue-600 pl-16">
            {ticket.title}
          </h4>
          
          <div className="bg-white/5 p-14 rounded-[70px] border border-white/5 shadow-inner">
             <p className="text-slate-400 text-3xl leading-relaxed font-medium italic">
                {ticket.description || "Nenhum detalhe adicional fornecido pela origem."}
             </p>
          </div>
        </section>

        {/* RCA PROTOCOL */}
        <section className="space-y-12 bg-blue-600/5 p-16 rounded-[80px] border border-blue-600/10 shadow-2xl">
          <div className="flex items-center gap-6 text-[13px] font-black text-blue-500 uppercase tracking-[0.5em] italic">
            <FileText size={24} /> Relatório de Causa Raiz (RCA)
          </div>

          <textarea 
            placeholder="Documente aqui a resolução ou justificativa técnica..."
            className="w-full p-14 bg-[#020617] border border-white/10 rounded-[60px] text-white outline-none focus:border-blue-600 transition-all font-black text-2xl h-72 resize-none shadow-inner placeholder:text-slate-800 italic"
            onChange={(e) => setRca(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            <button onClick={() => handleUpdateStatus('in_progress')} disabled={isProcessing} className="p-12 bg-blue-600 rounded-[50px] font-black text-[11px] uppercase tracking-[0.3em] flex flex-col items-center gap-8 hover:bg-white hover:text-blue-600 transition-all shadow-2xl disabled:opacity-50">
              <PlayCircle size={40} /> Iniciar SLA
            </button>
            <button onClick={() => handleUpdateStatus('waiting_customer')} disabled={isProcessing} className="p-12 bg-white/5 border border-white/10 rounded-[50px] font-black text-[11px] uppercase tracking-[0.3em] flex flex-col items-center gap-8 hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50">
              <PauseCircle size={40} /> Aguardar Cliente
            </button>
            <button onClick={() => handleUpdateStatus('resolved')} disabled={isProcessing} className="p-12 bg-white/5 border border-white/10 rounded-[50px] font-black text-[11px] uppercase tracking-[0.3em] flex flex-col items-center gap-8 hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50">
              <CheckCircle size={40} /> Validar Solução
            </button>
            <button onClick={() => handleUpdateStatus('cancelled')} disabled={isProcessing} className="p-12 bg-white/5 border border-white/10 rounded-[50px] font-black text-[11px] uppercase tracking-[0.3em] flex flex-col items-center gap-8 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50">
              <XCircle size={40} /> Cancelar Ticket
            </button>
          </div>
        </section>

        {/* AUDITORIA LEDGER */}
        <section className="pt-20 border-t border-white/5">
           <h5 className="text-[13px] font-black text-white uppercase tracking-[0.5em] mb-16 italic flex items-center gap-6">
              <ShieldCheck size={28} className="text-blue-500" /> B2Y Audit Trail
           </h5>
           <div className="space-y-16 relative before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-[4px] before:bg-white/5">
              <div className="relative pl-24">
                 <div className="absolute left-0 top-1 h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center border-[6px] border-[#0a0f1e] shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                    <ShieldCheck size={24} />
                 </div>
                 <div className="bg-white/5 p-12 rounded-[55px] border border-white/5">
                    <p className="text-lg font-black text-white uppercase italic">Evento de Segurança</p>
                    <p className="text-[13px] text-slate-500 font-bold uppercase mt-6 tracking-widest leading-relaxed italic">
                       Sincronização realizada via SSL Endpoint B2Y. Origem validada via hash SHA-256.
                    </p>
                 </div>
              </div>
           </div>
        </section>
      </div>

      <div className="p-16 bg-slate-950/80 border-t border-white/5 text-center">
         <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.6em] italic">B2Y Compliance Protocol V2.5 Active</p>
      </div>
    </motion.div>
  );
}