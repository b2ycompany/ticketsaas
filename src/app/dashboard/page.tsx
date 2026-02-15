"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { Ticket } from "@/types/ticket";
import { Timestamp } from "firebase/firestore";
import { Clock, AlertCircle, LayoutDashboard, Ticket as TicketIcon, Users, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ticket[];
      setTickets(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = () => { auth.signOut(); router.push("/login"); };

  /**
   * Formatação de SLA corrigida para evitar o erro 'any'
   * Aceita Timestamp do Firebase ou objeto Date padrão
   */
  const formatSLA = (deadline: Timestamp | Date | undefined) => {
    if (!deadline) return "Pendente";
    
    let date: Date;
    
    if (deadline instanceof Timestamp) {
      date = deadline.toDate();
    } else {
      date = deadline;
    }

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar Lateral */}
      <aside className="w-72 bg-slate-900 p-6 flex flex-col shadow-2xl border-r border-slate-800">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">TICKET MASTER</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="flex items-center gap-3 w-full p-3 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-600/20">
            <TicketIcon size={20} /> <span className="font-semibold text-sm">Fila de Atendimento</span>
          </button>
          <button className="flex items-center gap-3 w-full p-3 text-slate-400 hover:bg-slate-800 rounded-xl transition-all text-sm group">
            <Users size={20} className="group-hover:text-white" /> <span>Clientes Ativos</span>
          </button>
          <button className="flex items-center gap-3 w-full p-3 text-slate-400 hover:bg-slate-800 rounded-xl transition-all text-sm group">
            <Settings size={20} className="group-hover:text-white" /> <span>Configuração SaaS</span>
          </button>
        </nav>

        <button onClick={logout} className="mt-auto flex items-center gap-3 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold text-sm">
          <LogOut size={20} /> <span>Encerrar Sessão</span>
        </button>
      </aside>

      {/* Painel Central */}
      <main className="flex-1 overflow-y-auto p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">Operações</h2>
            <p className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-ping"></span>
              Sincronização em Tempo Real Ativa
            </p>
          </div>
          <div className="flex gap-6">
            <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tickets Totais</p>
              <p className="text-3xl font-black text-slate-900">{tickets.length}</p>
            </div>
          </div>
        </header>

        {/* Lista de Tickets Estilo Premium */}
        <div className="grid grid-cols-1 gap-5">
          {loading ? (
            <div className="space-y-4">
              <div className="h-28 bg-slate-200 rounded-3xl animate-pulse" />
              <div className="h-28 bg-slate-200 rounded-3xl animate-pulse" />
            </div>
          ) : tickets.map((t) => (
            <div key={t.id} className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner ${t.priority === 'critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                  {t.priority === 'critical' ? <AlertCircle size={32} /> : <TicketIcon size={32} />}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition tracking-tight mb-1">{t.title}</h4>
                  <div className="flex items-center gap-4">
                    <span className="bg-slate-900 text-white px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest">{t.source}</span>
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter">{t.customerName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-16">
                <div className="hidden lg:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Status Atual</p>
                  <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase ${t.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {t.status}
                  </span>
                </div>
                
                <div className="text-right min-w-[140px]">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest text-right">Limite SLA</p>
                  <div className="flex items-center justify-end gap-2 text-slate-800 font-mono font-black text-xl">
                    <Clock size={18} className="text-blue-500" />
                    {formatSLA(t.slaDeadline)}
                  </div>
                </div>

                <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-600/30">
                  Gerir Alerta
                </button>
              </div>
            </div>
          ))}
          
          {!loading && tickets.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[40px] border-4 border-dashed border-slate-100">
              <p className="text-slate-300 font-black text-xl uppercase tracking-tighter italic">Nenhum dado recebido via Webhook</p>
              <p className="text-slate-400 text-sm mt-2">A aguardar eventos do Zabbix ou ServiceNow...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}