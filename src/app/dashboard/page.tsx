"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { db, auth } from "../../lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { Ticket } from "../../types/ticket";
import { LayoutDashboard, Ticket as TicketIcon, LogOut, AlertCircle } from "lucide-react";
import TicketDetailSidebar from "@/components/TicketDetailSidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
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
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg">
            <LayoutDashboard size={24} />
          </div>
          <span className="font-black text-xl tracking-tighter italic">TICKETMASTER</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button className="flex items-center gap-4 w-full p-4 bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20">
            <TicketIcon size={18} /> <span>Fila Central</span>
          </button>
        </nav>
        <button onClick={() => auth.signOut()} className="mt-auto flex items-center gap-4 p-4 text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.3em]">
          <LogOut size={18} /> <span>Sair do Sistema</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12 relative">
        <header className="mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
             <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">NOC Terminal Ativo</span>
          </div>
          <h2 className="text-6xl font-black tracking-tighter">Incidentes Operacionais</h2>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="h-24 bg-white/5 rounded-3xl animate-pulse" />
          ) : (
            tickets.map((t) => (
              <motion.div 
                layoutId={t.id}
                key={t.id} 
                onClick={() => setSelectedTicket(t)}
                className="bg-white/5 border border-white/5 p-8 rounded-[40px] hover:border-blue-600/50 hover:bg-white/[0.08] transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-8">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner ${t.priority === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                    <AlertCircle size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black group-hover:text-blue-400 transition-colors tracking-tight">{t.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.customerName}</span>
                       <span className="h-1 w-1 bg-slate-700 rounded-full" />
                       <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">{t.status}</span>
                    </div>
                  </div>
                </div>
                <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                  Gerir Ticket
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Slide-over Lateral Detalhado */}
        <AnimatePresence>
          {selectedTicket && (
            <TicketDetailSidebar 
              ticket={selectedTicket} 
              onClose={() => setSelectedTicket(null)} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}