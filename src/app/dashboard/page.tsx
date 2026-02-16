"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { db, auth } from "../../lib/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy 
} from "firebase/firestore";
import { Ticket } from "../../types/ticket";
import { 
  Ticket as TicketIcon, 
  LogOut, 
  AlertCircle, 
  Search, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  History,
  Clock,
  TrendingUp,
  Layers,
  ShieldAlert,
  LayoutGrid,
  Settings,
  ChevronRight,
  Activity
} from "lucide-react";
import TicketDetailSidebar from "@/components/TicketDetailSidebar";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/**
 * B2Y MASTER - NEXT-GEN ITSM COMMAND CENTER
 * Versão: 1.3.0 - High Density & Integrated Navigation
 */
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // --- ESTADOS DE OPERAÇÃO ---
  const [activeTab, setActiveTab] = useState<"tickets" | "sla" | "auditoria">("tickets");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // --- PROTOCOLO DE SEGURANÇA ---
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // --- SINCRONIZAÇÃO EM TEMPO REAL ---
  useEffect(() => {
    if (!user) return;

    const ticketsRef = collection(db, "tickets");
    const q = query(ticketsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Ticket[];
      
      setTickets(data);
      setLoading(false);
    }, (error) => {
      console.error("Critical Stream Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // --- FILTRAGEM ITSM ---
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = t.title.toLowerCase().includes(searchLower) || 
                           t.customerName.toLowerCase().includes(searchLower);
      
      const isNotHidden = t.status !== 'cancelled' && t.status !== 'deleted';
      const matchesStatus = filterStatus === "all" ? isNotHidden : t.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchQuery, filterStatus]);

  // --- KPI ENGINE ---
  const kpis = useMemo(() => {
    const total = tickets.length;
    const res = tickets.filter(t => t.status === 'resolved').length;
    const open = tickets.filter(t => t.status === 'open').length;
    const crit = tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved').length;
    const rate = total > 0 ? ((res / total) * 100).toFixed(1) : "100";

    return { total, res, open, crit, rate };
  }, [tickets]);

  if (authLoading) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center font-sans">
        <div className="h-16 w-16 border-t-2 border-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Booting Dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR DE COMANDO ATUALIZADA */}
      <aside className="w-72 bg-slate-900/40 backdrop-blur-3xl border-r border-white/5 p-6 flex flex-col z-[100] shadow-2xl">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <Zap className="text-white fill-current" size={18} />
          </div>
          <div className="flex flex-col uppercase italic font-black">
            <span className="text-lg tracking-tighter">TicketMaster</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4 mb-4">Operacional</p>
          <button 
            onClick={() => setActiveTab("tickets")}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "tickets" ? "bg-blue-600 shadow-xl text-white" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
          >
            <TicketIcon size={18} /> <span>Incidentes</span>
          </button>
          
          {/* NOVA CONEXÃO: BOARD KANBAN */}
          <Link href="/dashboard/kanban" className="flex items-center gap-4 w-full p-4 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
            <LayoutGrid size={18} /> <span>Board Kanban</span>
          </Link>

          <button 
            onClick={() => setActiveTab("sla")}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "sla" ? "bg-blue-600 shadow-xl text-white" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
          >
            <BarChart3 size={18} /> <span>Analytics</span>
          </button>

          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4 mt-8 mb-4">Administração</p>
          <button 
            onClick={() => setActiveTab("auditoria")}
            className={`flex items-center gap-4 w-full p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "auditoria" ? "bg-blue-600 shadow-xl text-white" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
          >
            <ShieldCheck size={18} /> <span>Auditoria</span>
          </button>
          
          {/* NOVA CONEXÃO: SETTINGS */}
          <Link href="/dashboard/settings" className="flex items-center gap-4 w-full p-4 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
            <Settings size={18} /> <span>Configurações</span>
          </Link>
        </nav>

        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black">
              {user.email?.substring(0, 2).toUpperCase()}
            </div>
            <p className="text-[9px] font-black text-slate-400 truncate uppercase">{user.email?.split('@')[0]}</p>
          </div>
          <button 
            onClick={() => auth.signOut()}
            className="flex items-center justify-center gap-3 w-full p-4 bg-red-500/10 text-red-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut size={16} /> <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* ÁREA CENTRAL - DENSIDADE DE FONTES REDUZIDA */}
      <main className="flex-1 overflow-y-auto p-12 relative custom-scrollbar">
        <AnimatePresence mode="wait">
          
          {activeTab === "tickets" && (
            <motion.div key="tickets-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <header className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-6xl font-black tracking-tighter italic uppercase text-white leading-none">Terminal</h2>
                  <p className="text-blue-500 text-[9px] font-black uppercase tracking-[0.4em] mt-3">Monitoring Live Stream</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white/5 border border-white/5 p-6 rounded-3xl text-center min-w-[140px]">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">SLA Compliance</p>
                    <p className="text-4xl font-black italic text-emerald-500">{kpis.rate}%</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl text-center min-w-[140px]">
                    <p className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1 italic">Incidentes Críticos</p>
                    <p className="text-4xl font-black italic text-red-500">{kpis.crit}</p>
                  </div>
                </div>
              </header>

              <div className="flex flex-col lg:flex-row gap-4 mb-10">
                <div className="relative flex-1 group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Localizar protocolo ou cliente..." 
                    className="w-full p-6 pl-16 bg-white/5 border border-white/5 rounded-3xl text-white outline-none focus:border-blue-500/50 transition-all font-bold text-sm" 
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-3xl border border-white/5">
                  {['all', 'open', 'in_progress', 'resolved'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setFilterStatus(s)} 
                      className={`px-6 py-3 rounded-2xl text-[8px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {loading ? (
                  <div className="h-32 bg-white/5 animate-pulse rounded-3xl" />
                ) : filteredTickets.map((t) => (
                    <motion.div 
                      key={t.id} 
                      onClick={() => setSelectedTicket(t)}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white/5 border border-white/5 p-8 rounded-[35px] transition-all flex items-center justify-between group cursor-pointer shadow-xl"
                    >
                      <div className="flex items-center gap-8">
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${t.priority === 'critical' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-blue-600 text-white'}`}>
                          <AlertCircle size={24} />
                        </div>
                        <div>
                          <h4 className="text-xl font-black uppercase italic group-hover:text-blue-400 transition-colors tracking-tight mb-2 leading-none">{t.title}</h4>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.customerName} | {t.source} Hub</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right hidden sm:block">
                           <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Status</p>
                           <p className={`text-sm font-black italic ${t.status === 'open' ? 'text-blue-500' : 'text-emerald-500'}`}>{t.status.toUpperCase()}</p>
                        </div>
                        <div className="bg-white text-slate-900 p-4 rounded-xl shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                           <ChevronRight size={18} />
                        </div>
                      </div>
                    </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "sla" && (
            <motion.div key="sla-tab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <h2 className="text-6xl font-black tracking-tighter italic uppercase text-white">Performance Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-12 bg-white/5 rounded-[50px] border border-white/5 relative overflow-hidden">
                  <TrendingUp className="text-blue-500 mb-8" size={40} />
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Média Global</h4>
                  <p className="text-7xl font-black italic mt-4">{kpis.rate}%</p>
                </div>
                <div className="p-12 bg-white/5 rounded-[50px] border border-white/5">
                  <Clock className="text-emerald-500 mb-8" size={40} />
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Tempo Resposta</h4>
                  <p className="text-7xl font-black italic mt-4">12<span className="text-lg ml-2 uppercase">min</span></p>
                </div>
                <div className="p-12 bg-white/5 rounded-[50px] border border-white/5">
                  <Layers className="text-purple-500 mb-8" size={40} />
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Volumetria</h4>
                  <p className="text-7xl font-black italic mt-4">LOW</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "auditoria" && (
            <motion.div key="auditoria-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <header className="flex justify-between items-center">
                <h2 className="text-6xl font-black tracking-tighter italic uppercase text-white">Auditoria</h2>
                <div className="flex items-center gap-3 px-6 py-2 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500 font-black text-[9px] uppercase tracking-widest">
                   <ShieldAlert size={14} /> Ledger Imutável
                </div>
              </header>
              <div className="bg-[#0a0f1e] p-10 rounded-[50px] border border-white/5 font-mono text-[11px] shadow-inner max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-3 text-blue-500 font-black mb-8 italic uppercase tracking-[0.4em]">
                   {/* // B2Y AUDIT STREAM ACTIVE // */}
                   B2Y Master System Protocol v1.3
                </div>
                {tickets.map((t, idx) => (
                  <div key={`${t.id}-${idx}`} className="mb-4 flex gap-6 text-slate-500 border-b border-white/[0.03] pb-4">
                    <span className="text-blue-900 font-black">[{new Date().toLocaleTimeString()}]</span>
                    <p>Protocolo <span className="text-slate-300 font-bold">#{t.id}</span> migrado para <span className="text-blue-500 font-black uppercase">{t.status}</span>.</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedTicket && <TicketDetailSidebar ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />}
        </AnimatePresence>
      </main>
    </div>
  );
}