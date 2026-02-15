"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { Ticket } from "@/types/ticket";
import { Clock, AlertCircle, LayoutDashboard, Ticket as TicketIcon, Users, Settings, LogOut, BarChart2 } from "lucide-react";
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

  const formatSLA = (deadline: Timestamp | Date | undefined) => {
    if (!deadline) return "A calcular...";
    const date = deadline instanceof Timestamp ? deadline.toDate() : deadline;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar de Tecnologia de Ponta */}
      <aside className="w-80 bg-slate-900 p-8 flex flex-col shadow-2xl z-20">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/40">
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <span className="text-white font-black text-2xl tracking-tighter italic">TICKET<span className="text-blue-500 italic">MASTER</span></span>
        </div>

        <nav className="flex-1 space-y-3">
          <button className="flex items-center gap-4 w-full p-4 bg-blue-600 text-white rounded-[24px] shadow-xl shadow-blue-600/20 transition-all font-bold text-sm">
            <TicketIcon size={20} /> <span>Fila de Operações</span>
          </button>
          <button className="flex items-center gap-4 w-full p-4 text-slate-400 hover:text-white hover:bg-slate-800 rounded-[24px] transition-all font-bold text-sm">
            <BarChart2 size={20} /> <span>Relatórios de SLA</span>
          </button>
          <button className="flex items-center gap-4 w-full p-4 text-slate-400 hover:text-white hover:bg-slate-800 rounded-[24px] transition-all font-bold text-sm">
            <Users size={20} /> <span>Base de Clientes</span>
          </button>
          <button className="flex items-center gap-4 w-full p-4 text-slate-400 hover:text-white hover:bg-slate-800 rounded-[24px] transition-all font-bold text-sm">
            <Settings size={20} /> <span>Configurações SaaS</span>
          </button>
        </nav>

        <button onClick={logout} className="mt-auto flex items-center gap-4 p-5 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-black text-xs uppercase tracking-widest">
          <LogOut size={20} /> <span>Encerrar Sessão</span>
        </button>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 overflow-y-auto p-12 bg-[#F8FAFC]">
        <header className="flex justify-between items-end mb-12">
          <div>
            <p className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-2">Painel de Controlo</p>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Performance de Hoje</h2>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 min-w-[160px]">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Tickets Ativos</p>
              <p className="text-4xl font-black text-slate-900 text-center">{tickets.length}</p>
            </div>
          </div>
        </header>

        {/* Métricas de Cartão */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-emerald-50 p-8 rounded-[40px] border border-emerald-100">
            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Eficiência SLA</p>
            <p className="text-4xl font-black text-emerald-900">99.4%</p>
          </div>
          <div className="bg-blue-50 p-8 rounded-[40px] border border-blue-100">
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Média de Resposta</p>
            <p className="text-4xl font-black text-blue-900">14min</p>
          </div>
          <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Status do Sistema</p>
            <p className="text-4xl font-black text-white flex items-center gap-3">
              LIVE <span className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></span>
            </p>
          </div>
        </div>

        {/* Lista de Incidentes */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <AlertCircle className="text-blue-600" /> Incidentes em Aberto
          </h3>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-28 bg-white rounded-[32px] border" />
              <div className="h-28 bg-white rounded-[32px] border" />
            </div>
          ) : tickets.map((t) => (
            <div key={t.id} className="group bg-white p-8 rounded-[35px] shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className={`h-16 w-16 rounded-[22px] flex items-center justify-center shadow-inner ${t.priority === 'critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                  {t.priority === 'critical' ? <AlertCircle size={32} /> : <TicketIcon size={32} />}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition tracking-tight mb-2">{t.title}</h4>
                  <div className="flex items-center gap-4">
                    <span className="bg-slate-900 text-white px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">{t.source}</span>
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter">{t.customerName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-16">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">SLA Deadline</p>
                  <div className="flex items-center justify-end gap-2 text-slate-900 font-mono font-black text-2xl tracking-tighter">
                    <Clock size={20} className="text-blue-600" />
                    {formatSLA(t.slaDeadline)}
                  </div>
                </div>
                <button className="bg-slate-900 text-white px-10 py-5 rounded-[22px] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                  Gerir Ticket
                </button>
              </div>
            </div>
          ))}
          {!loading && tickets.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[50px] border-4 border-dashed border-slate-100">
              <p className="text-slate-300 font-black text-2xl uppercase italic tracking-tighter">Nenhum alerta recebido via Zabbix</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}