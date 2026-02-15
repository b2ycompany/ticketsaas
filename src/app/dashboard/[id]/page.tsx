"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Ticket } from "@/types/ticket";
import { ArrowLeft, Activity, Shield, Clock, Paperclip } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      const docRef = doc(db, "tickets", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTicket({ id: docSnap.id, ...docSnap.data() } as Ticket);
      }
    };
    fetchTicket();
  }, [id]);

  if (!ticket) return <div className="p-10 text-center font-bold">A carregar logs de auditoria...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition font-bold">
          <ArrowLeft size={20} /> Voltar ao Centro de Operações
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal: Conteúdo do Ticket */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  ID: {ticket.id?.substring(0, 8)}
                </span>
                <span className="text-slate-400 text-sm font-medium">{ticket.source.toUpperCase()} GATEWAY</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">{ticket.title}</h1>
              <p className="text-slate-600 leading-relaxed text-lg mb-8">{ticket.description}</p>
              
              <div className="flex gap-4 border-t pt-8">
                <button className="flex-1 bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-blue-600 transition">Assumir Ticket</button>
                <button className="p-4 bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 transition"><Paperclip /></button>
              </div>
            </div>
          </div>

          {/* Coluna Lateral: Timeline e SLA */}
          <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-xl">
              <h3 className="flex items-center gap-2 font-bold mb-6 text-blue-400">
                <Shield size={18} /> Status de Segurança
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Prioridade</p>
                  <p className="text-xl font-bold capitalize">{ticket.priority}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Tempo Restante</p>
                  <p className="text-3xl font-black text-emerald-400">01:42:10</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold mb-6 text-slate-800">
                <Activity size={18} className="text-blue-600" /> Timeline de Auditoria
              </h3>
              <div className="space-y-6 relative before:absolute before:left-[11px] before:h-full before:w-[2px] before:bg-slate-100">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 h-3 w-3 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                  <p className="text-sm font-bold text-slate-800">Ticket Criado via Webhook</p>
                  <p className="text-xs text-slate-400">Zabbix Monitoring • Agora</p>
                </div>
                <div className="relative pl-8 opacity-50">
                  <div className="absolute left-0 top-1 h-3 w-3 rounded-full bg-slate-300"></div>
                  <p className="text-sm font-bold text-slate-800">Aguardando Técnico</p>
                  <p className="text-xs text-slate-400">Sistema Automático</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}