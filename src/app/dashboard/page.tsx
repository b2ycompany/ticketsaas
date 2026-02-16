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
  ShieldAlert
} from "lucide-react";
import TicketDetailSidebar from "@/components/TicketDetailSidebar";
import { motion, AnimatePresence } from "framer-motion";

/**
 * B2Y MASTER - NEXT-GEN ITSM COMMAND CENTER
 * Versão: 1.2.5 - Governança Enterprise Blindada
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
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center">
        <div className="h-20 w-20 border-t-4 border-blue-600 rounded-full animate-spin shadow-2xl mb-8" />
        <h2 className="text-white font-black italic uppercase tracking-[0.6em] text-[10px] animate-pulse">Sincronizando Terminal</h2>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR DE COMANDO */}
      <aside className="w-84 bg-slate-900/40 backdrop-blur-3xl border-r border-white/5 p-10 flex flex-col z-[100] shadow-2xl">
        <div className="flex items-center gap-4 mb-20">
          <div className="bg-blue-600 p-4 rounded-[22px] shadow-[0_0_40px_rgba(37,99,235,0.4)]">
            <Zap className="text-white fill-current" size={24} />
          </div>
          <div className="flex flex-col uppercase italic font-black">
            <span className="text-2xl tracking-tighter">TicketMaster</span>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          <button 
            onClick={() => setActiveTab("tickets")}
            className={`flex items-center gap-6 w-full p-6 rounded-[30px] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === "tickets" ? "bg-blue-600 shadow-2xl text-white" : "text-slate-500 hover:text-white"}`}
          >
            <TicketIcon size={22} /> <span>Incidentes</span>
          </button>
          <button 
            onClick={() => setActiveTab("sla")}
            className={`flex items-center gap-6 w-full p-6 rounded-[30px] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === "sla" ? "bg-blue-600 shadow-2xl text-white" : "text-slate-500 hover:text-white"}`}
          >
            <BarChart3 size={22} /> <span>Analytics</span>
          </button>
          <button 
            onClick={() => setActiveTab("auditoria")}
            className={`flex items-center gap-6 w-full p-6 rounded-[30px] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === "auditoria" ? "bg-blue-600 shadow-2xl text-white" : "text-slate-500 hover:text-white"}`}
          >
            <ShieldCheck size={22} /> <span>Auditoria</span>
          </button>
        </nav>

        <button 
          onClick={() => auth.signOut()}
          className="mt-auto flex items-center gap-5 w-full p-5 text-red-500 hover:bg-red-500/10 rounded-[25px] transition-all font-black text-[10px] uppercase tracking-[0.3em]"
        >
          <LogOut size={20} /> <span>Logoff Seguro</span>
        </button>
      </aside>

      {/* ÁREA CENTRAL */}
      <main className="flex-1 overflow-y-auto p-16 relative custom-scrollbar">
        <AnimatePresence mode="wait">
          
          {activeTab === "tickets" && (
            <motion.div key="tickets-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <header className="flex justify-between items-end mb-20">
                <h2 className="text-9xl font-black tracking-tighter italic uppercase text-white leading-none">Console</h2>
                <div className="flex gap-6">
                  <div className="bg-white/5 border border-white/5 p-10 rounded-[50px] text-center min-w-[170px]">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Compliance</p>
                    <p className="text-6xl font-black italic text-emerald-500">{kpis.rate}%</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-10 rounded-[50px] text-center min-w-[170px]">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3 italic">Críticos</p>
                    <p className="text-6xl font-black italic text-red-500">{kpis.crit}</p>
                  </div>
                </div>
              </header>

              <div className="flex flex-col xl:flex-row gap-6 mb-16">
                <div className="relative flex-1">
                  <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-600" size={28} />
                  <input 
                    type="text" 
                    placeholder="Pesquisar incidente..." 
                    className="w-full p-10 pl-24 bg-white/5 border border-white/5 rounded-[45px] text-white outline-none focus:border-blue-500/50 transition-all font-black text-xl placeholder:text-slate-800" 
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-[45px] border border-white/5">
                  {['all', 'open', 'in_progress', 'waiting_customer', 'resolved'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setFilterStatus(s)} 
                      className={`px-8 py-5 rounded-[35px] text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {loading ? (
                  <div className="h-40 bg-white/5 animate-pulse rounded-[60px]" />
                ) : filteredTickets.map((t) => (
                    <motion.div 
                      key={t.id} 
                      onClick={() => setSelectedTicket(t)}
                      className="bg-white/5 border border-white/5 p-12 rounded-[65px] transition-all flex items-center justify-between group cursor-pointer shadow-xl"
                    >
                      <div className="flex items-center gap-14">
                        <div className={`h-28 w-28 rounded-[38px] flex items-center justify-center ${t.priority === 'critical' ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white'}`}>
                          <AlertCircle size={48} />
                        </div>
                        <div>
                          <h4 className="text-4xl font-black uppercase italic group-hover:text-blue-400 transition-colors tracking-tighter mb-4 leading-none">{t.title}</h4>
                          <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">{t.customerName} | {t.source} Gateway</span>
                        </div>
                      </div>
                      <button className="bg-white text-slate-900 px-14 py-8 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl">
                        Gerenciar
                      </button>
                    </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "sla" && (
            <motion.div key="sla-tab" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
              <h2 className="text-9xl font-black tracking-tighter italic uppercase text-white">Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="p-20 bg-white/5 rounded-[80px] border border-white/5">
                  <TrendingUp className="text-blue-500 mb-12" size={70} />
                  <h4 className="text-xl font-black uppercase tracking-[0.4em] text-slate-600">Compliance</h4>
                  <p className="text-[120px] font-black italic mt-12 leading-none">{kpis.rate}%</p>
                </div>
                <div className="p-20 bg-white/5 rounded-[80px] border border-white/5">
                  <Clock className="text-emerald-500 mb-12" size={70} />
                  <h4 className="text-xl font-black uppercase tracking-[0.4em] text-slate-600">Resolução</h4>
                  <p className="text-[120px] font-black italic mt-12 leading-none">12<span className="text-4xl ml-4">m</span></p>
                </div>
                <div className="p-20 bg-white/5 rounded-[80px] border border-white/5">
                  <Layers className="text-purple-500 mb-12" size={70} />
                  <h4 className="text-xl font-black uppercase tracking-[0.4em] text-slate-600">Load</h4>
                  <p className="text-[120px] font-black italic mt-12 leading-none text-emerald-500 italic">LOW</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "auditoria" && (
            <motion.div key="auditoria-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
              <header className="flex justify-between items-center">
                <h2 className="text-9xl font-black tracking-tighter italic uppercase text-white leading-none">Auditoria</h2>
                <div className="flex items-center gap-4 px-8 py-4 bg-red-500/10 rounded-[30px] border border-red-500/20 text-red-500 font-black text-xs uppercase tracking-widest italic">
                   <ShieldAlert size={20} /> Ledger Ativo
                </div>
              </header>
              <div className="bg-[#0a0f1e] p-20 rounded-[80px] border border-white/5 font-mono text-sm shadow-inner max-h-[65vh] overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-4 text-blue-500 font-black mb-12 italic uppercase tracking-[0.6em] border-b border-white/5 pb-8">
                   {/* // B2Y MASTER AUDIT LOG SYSTEM // */}
                   B2Y Master System Protocol 1.0
                </div>
                {tickets.map((t, idx) => (
                  <div key={`${t.id}-${idx}`} className="mb-8 flex gap-10 text-slate-600 border-b border-white/[0.03] pb-8">
                    <span className="text-blue-900 font-black">[{new Date().toLocaleTimeString()}]</span>
                    <p>
                       <span className="text-slate-500 font-black uppercase mr-4 tracking-widest italic">TRANS:</span> 
                       Protocolo <span className="text-slate-300 font-black">#{t.id}</span> 
                       migrado para <span className="text-blue-500 font-black uppercase tracking-widest ml-4">{t.status}</span>.
                    </p>
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