"use client";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { db, auth } from "../../lib/firebase";
import { collection, query, onSnapshot, orderBy, where, Timestamp } from "firebase/firestore";
import { Ticket } from "../../types/ticket";
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  LogOut, 
  AlertCircle, 
  Search, 
  Filter, 
  Bell, 
  User as UserIcon,
  Activity,
  ShieldCheck,
  Zap
} from "lucide-react";
import TicketDetailSidebar from "@/components/TicketDetailSidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Estados de Dados
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // PROTEÇÃO DE ROTA: Segurança em primeiro lugar
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // ENGINE DE SINCRONIZAÇÃO REAL-TIME (FIRESTORE)
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tickets"), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Ticket[];
      
      setTickets(data);
      setLoading(false);
    }, (error) => {
      console.error("Erro na sincronização de dados:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Lógica de Filtro e Busca
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === "all" || t.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [tickets, searchQuery, filterStatus]);

  // Cálculos de KPIs para a Diretoria
  const stats = useMemo(() => ({
    total: tickets.length,
    critical: tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved').length,
    open: tickets.filter(t => t.status === 'open').length,
  }), [tickets]);

  if (authLoading) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
        <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black italic uppercase tracking-[0.3em] text-xs">Acessando Terminal...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR DE COMANDO */}
      <aside className="w-80 bg-slate-900/40 backdrop-blur-2xl border-r border-white/5 p-8 flex flex-col z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/40">
            <Zap className="text-white fill-current" size={20} />
          </div>
          <span className="font-black text-2xl tracking-tighter italic uppercase">
            TICKET<span className="text-blue-500">MASTER</span>
          </span>
        </div>

        <nav className="flex-1 space-y-3">
          <button className="flex items-center gap-4 w-full p-4 bg-blue-600 rounded-[22px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all">
            <TicketIcon size={18} /> <span>Fila de Incidentes</span>
          </button>
          <button className="flex items-center gap-4 w-full p-4 text-slate-500 hover:text-white hover:bg-white/5 rounded-[22px] font-black text-[10px] uppercase tracking-widest transition-all">
            <Activity size={18} /> <span>Análise de SLA</span>
          </button>
          <button className="flex items-center gap-4 w-full p-4 text-slate-500 hover:text-white hover:bg-white/5 rounded-[22px] font-black text-[10px] uppercase tracking-widest transition-all">
            <ShieldCheck size={18} /> <span>Auditoria e Logs</span>
          </button>
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-black text-xs">
              {user.email?.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest text-white truncate">{user.email}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase italic">Operador Nível 3</p>
            </div>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="flex items-center gap-4 w-full p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut size={18} /> <span>Encerrar Terminal</span>
          </button>
        </div>
      </aside>

      {/* ÁREA DE TRABALHO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-12 relative custom-scrollbar">
        {/* HEADER DE PERFORMANCE */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <h2 className="text-7xl font-black tracking-tighter mb-2 italic">Dashboard</h2>
            <div className="flex items-center gap-4 text-slate-500">
               <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                 <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" /> Operação Live
               </span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/5 p-6 rounded-[35px] min-w-[140px] text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total</p>
              <p className="text-4xl font-black">{stats.total}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[35px] min-w-[140px] text-center">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 italic">Críticos</p>
              <p className="text-4xl font-black text-red-500">{stats.critical}</p>
            </div>
          </div>
        </header>

        {/* FERRAMENTAS DE FILTRO */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar por título, cliente ou ID..."
              className="w-full p-6 pl-16 bg-white/5 border border-white/5 rounded-[30px] text-white outline-none focus:border-blue-500/50 transition-all font-bold"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/5 border border-white/5 p-6 rounded-[30px] text-slate-400 font-black text-[10px] uppercase tracking-widest outline-none cursor-pointer focus:border-blue-500/50 appearance-none min-w-[180px] text-center"
          >
            <option value="all">Todos os Status</option>
            <option value="open">Abertos</option>
            <option value="in_progress">Em Atendimento</option>
            <option value="resolved">Resolvidos</option>
          </select>
        </div>

        {/* LISTAGEM DE INCIDENTES COM ANIMAÇÃO */}
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-[45px] animate-pulse border border-white/5" />)
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((t) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={t.id} 
                  onClick={() => setSelectedTicket(t)}
                  className="bg-white/5 border border-white/5 p-8 rounded-[45px] hover:border-blue-600/50 hover:bg-white/[0.08] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-8">
                    <div className={`h-16 w-16 rounded-[22px] flex items-center justify-center shadow-inner ${t.priority === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                      <AlertCircle size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black group-hover:text-blue-400 transition-colors tracking-tight uppercase italic">{t.title}</h4>
                      <div className="flex items-center gap-4 mt-2">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t.customerName}</span>
                         <span className="h-1 w-1 bg-slate-700 rounded-full" />
                         <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${t.status === 'open' ? 'text-blue-400' : 'text-emerald-400'}`}>
                           {t.status.replace('_', ' ')}
                         </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Sincronizado</p>
                      <p className="text-[10px] font-bold text-slate-400">via {t.source}</p>
                    </div>
                    <button className="bg-white text-slate-900 px-10 py-5 rounded-[22px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95">
                      Gerenciar
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-40 text-center bg-white/[0.02] rounded-[60px] border-4 border-dashed border-white/5">
                 <p className="text-slate-600 font-black text-2xl uppercase italic tracking-tighter">Nenhum incidente encontrado no radar</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* SIDEBAR DE DETALHES (SLIDE-OVER) */}
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