"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { db, auth } from "../../lib/firebase";
import { collection, query, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { Ticket } from "../../types/ticket";
import { LayoutDashboard, Ticket as TicketIcon, LogOut, Clock, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // PROTEÇÃO DE ROTA
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Ticket[];
      setTickets(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      {/* Sidebar Lateral */}
      <aside className="w-80 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/30">
            <LayoutDashboard size={24} />
          </div>
          <span className="font-black text-xl tracking-tighter italic">TICKETMASTER</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="flex items-center gap-4 w-full p-4 bg-blue-600 rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20 transition-all">
            <TicketIcon size={20} /> <span>Fila Central</span>
          </button>
        </nav>

        <button 
          onClick={() => auth.signOut()}
          className="mt-auto flex items-center gap-4 p-4 text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
        >
          <LogOut size={20} /> <span>Encerrar Terminal</span>
        </button>
      </aside>

      {/* Área de Trabalho */}
      <main className="flex-1 overflow-y-auto p-12">
        <header className="mb-12">
          <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2">Operador: {user.email}</p>
          <h2 className="text-5xl font-black tracking-tighter">Fila de Atendimento</h2>
        </header>

        <div className="space-y-4">
          {loading ? (
            <div className="h-20 w-full bg-white/5 animate-pulse rounded-3xl border border-white/5"></div>
          ) : (
            tickets.map((t) => (
              <div key={t.id} className="bg-white/5 border border-white/5 p-8 rounded-[35px] hover:border-blue-600/50 hover:bg-white/[0.07] transition-all flex items-center justify-between group">
                <div className="flex items-center gap-8">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${t.priority === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                    <AlertCircle size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold group-hover:text-blue-400 transition-colors">{t.title}</h4>
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{t.customerName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">SLA Deadline</p>
                  <div className="flex items-center gap-2 font-mono font-black text-xl text-blue-500">
                    <Clock size={16} /> 12:45
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}