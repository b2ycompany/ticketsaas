"use client";
import { useState } from "react";
import { Ticket } from "@/types/ticket";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { X, CheckCircle, Clock, AlertTriangle, User, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  ticket: Ticket;
  onClose: () => void;
}

export default function TicketDetailSidebar({ ticket, onClose }: SidebarProps) {
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (newStatus: Ticket['status']) => {
    if (!ticket.id) return;
    setUpdating(true);
    try {
      const docRef = doc(db, "tickets", ticket.id);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Erro ao atualizar ticket:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 shadow-2xl z-[200] border-l border-white/10 flex flex-col"
    >
      {/* Header do Painel */}
      <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl">
        <div>
          <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest italic">Gestão de Incidente</span>
          <h3 className="text-xl font-black text-white tracking-tighter mt-1">ID: #{ticket.id?.substring(0, 8)}</h3>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <X className="text-slate-400" size={24} />
        </button>
      </div>

      {/* Conteúdo Scrolável */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <section>
          <h4 className="text-2xl font-black text-white mb-4 leading-tight">{ticket.title}</h4>
          <p className="text-slate-400 font-medium leading-relaxed">{ticket.description}</p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Prioridade</p>
            <span className={`font-black uppercase text-xs px-3 py-1 rounded-full ${ticket.priority === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
              {ticket.priority}
            </span>
          </div>
          <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Origem</p>
            <span className="text-white font-black text-xs uppercase">{ticket.source}</span>
          </div>
        </div>

        {/* Ações de Status */}
        <section className="space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Alterar Estado Operacional</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'in_progress', label: 'Iniciar Atendimento', icon: <Clock size={16}/>, color: 'hover:bg-blue-600' },
              { id: 'resolved', label: 'Marcar como Resolvido', icon: <CheckCircle size={16}/>, color: 'hover:bg-emerald-600' },
              { id: 'closed', label: 'Encerrar Chamado', icon: <X size={16}/>, color: 'hover:bg-slate-700' }
            ].map((btn) => (
              <button
                key={btn.id}
                disabled={updating}
                onClick={() => updateStatus(btn.id as Ticket['status'])}
                className={`w-full p-4 bg-white/5 rounded-2xl text-left font-bold text-sm flex items-center gap-4 transition-all border border-white/5 ${btn.color} hover:text-white`}
              >
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>
        </section>

        {/* Auditoria */}
        <section className="pt-8 border-t border-white/5">
          <h5 className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-widest mb-6 italic">
            <MessageSquare size={16} className="text-blue-500" /> Histórico de Auditoria
          </h5>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black">SYS</div>
              <div>
                <p className="text-xs font-bold text-white">Ticket criado automaticamente via Gateway</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Sincronização Ativa</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer do Painel */}
      <div className="p-8 border-t border-white/5 bg-slate-900/80">
        <button className="w-full bg-blue-600 p-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-blue-600 transition-all shadow-xl shadow-blue-600/20">
          Adicionar Comentário Técnico
        </button>
      </div>
    </motion.div>
  );
}