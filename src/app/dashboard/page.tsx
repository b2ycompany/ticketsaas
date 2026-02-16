"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { db, auth } from "../../lib/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  where 
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
  TrendingUp,
  Clock,
  Layers,
  ChevronRight,
  ShieldAlert,
  Server,
  Network
} from "lucide-react";
import TicketDetailSidebar from "@/components/TicketDetailSidebar";
import { motion, AnimatePresence } from "framer-motion";

/**
 * B2Y MASTER COMMAND CENTER - V1.0.8 ENTERPRISE
 * Arquitetura de Governança de Incidentes de Missão Crítica
 */
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // --- ESTADOS DE OPERAÇÃO E INTERFACE ---
  const [activeTab, setActiveTab] = useState<"tickets" | "sla" | "auditoria">("tickets");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // --- VALIDAÇÃO DE SEGURANÇA DE ROTA ---
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // --- ENGINE DE SINCRONIZAÇÃO EM TEMPO REAL (FIRESTORE) ---
  useEffect(() => {
    if (!user) return;

    // Implementação de Soft Delete: Filtramos tickets com estado 'deleted'
    const ticketsRef = collection(db, "tickets");
    const q = query(
      ticketsRef, 
      where("status", "!=", "deleted"),
      orderBy("status", "asc"),
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
      console.error("Critical Data Stream Failure:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // --- KPI ANALYTICS ENGINE (ITIL 4 COMPLIANT) ---
  const stats = useMemo(() => {
    const criticals = tickets.filter(t => t.priority === 'critical').length;
    const openCount = tickets.filter(t => t.status === 'open').length;
    const resolvedCount = tickets.filter(t => t.status === 'resolved').length;
    const complianceRate = tickets.length > 0 ? ((resolvedCount / tickets.length) * 100).toFixed(1) : "100";
    
    return {
      total: tickets.length,
      critical: criticals,
      open: openCount,
      resolved: resolvedCount,
      compliance: complianceRate
    };
  }, [tickets]);

  // --- FILTRAGEM DE ALTA PERFORMANCE ---
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tickets, searchQuery]);

  if (authLoading || !user) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center">
        <div className="h-24 w-24 border-t-4 border-blue-600 rounded-full animate-spin shadow-[0_0_40px_rgba(37,99,235,0.3)]" />
        <p className="mt-8 text-white font-black italic uppercase tracking-[0.5em] text-[10px] animate-pulse">Sincronizando Terminal Master</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden selection:bg-blue-600/40">
      
      {/* SIDEBAR DE COMANDO PREMIUM */}
      <aside className="w-80 bg-slate-900/40 backdrop-blur-3xl border-r border-white/5 p-8 flex flex-col z-[100] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-50" />
        
        <div className="flex items-center gap-4 mb-20 group">
          <div className="bg-blue-600 p-3.5 rounded-[22px] shadow-[0_0_30px_rgba(37,99,235,0.4)] group-hover:rotate-12 transition-transform duration-500">
            <Zap className="text-white fill-current" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter italic uppercase">TicketMaster</span>
            <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em] leading-none mt-1">Enterprise Suite</span>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          <button 
            onClick={() => setActiveTab("tickets")}
            className={`flex items-center gap-5 w-full p-5 rounded-[28px] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === "tickets" ? "bg-blue-600 shadow-2xl shadow-blue-600/30 text-white" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
          >
            <TicketIcon size={20} /> <span>Incidentes Live</span>
          </button>
          <button 
            onClick={() => setActiveTab("sla")}
            className={`flex items-center gap-5 w-full p-5 rounded-[28px] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === "sla" ? "bg-blue-600 shadow-2xl shadow-blue-600/30 text-white" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
          >
            <BarChart3 size={20} /> <span>Analytics SLA</span>
          </button>
          <button 
            onClick={() => setActiveTab("auditoria")}
            className={`flex items-center gap-5 w-full p-5 rounded-[28px] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === "auditoria" ? "bg-blue-600 shadow-2xl shadow-blue-600/30 text-white" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
          >
            <ShieldCheck size={20} /> <span>Auditoria</span>
          </button>
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 space-y-8">
          <div className="bg-white/[0.03] p-6 rounded-[30px] border border-white/5">
             <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-xs italic">
                  {user.email?.substring(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-white truncate uppercase tracking-widest">{user.email?.split('@')[0]}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase italic mt-1 tracking-widest leading-none">Status: Online</p>
                </div>
             </div>
             <button 
               onClick={() => auth.signOut()}
               className="flex items-center justify-center gap-3 w-full p-3 bg-red-500/10 text-red-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
             >
               <LogOut size={14} /> <span>Sair do Terminal</span>
             </button>
          </div>
        </div>
      </aside>

      {/* PAINEL DE CONTEÚDO DINÂMICO */}
      <main className="flex-1 overflow-y-auto p-16 relative custom-scrollbar">
        <AnimatePresence mode="wait">
          
          {/* ABA: FILA OPERACIONAL */}
          {activeTab === "tickets" && (
            <motion.div key="tickets-tab" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <header className="flex justify-between items-end mb-20">
                <div>
                  <h2 className="text-8xl font-black tracking-tighter italic uppercase text-white leading-none">Console</h2>
                  <div className="flex items-center gap-5 mt-6">
                     <span className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-500 text-[9px] font-black uppercase tracking-widest italic">
                       <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,1)]" /> Governança Ativa
                     </span>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="bg-white/5 border border-white/5 p-10 rounded-[45px] text-center min-w-[180px] shadow-2xl backdrop-blur-md">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Compliance</p>
                    <p className="text-6xl font-black text-emerald-500 italic">{stats.compliance}%</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-10 rounded-[45px] text-center min-w-[180px] shadow-2xl">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 italic">Críticos</p>
                    <p className="text-6xl font-black text-red-500 italic">{stats.critical}</p>
                  </div>
                </div>
              </header>

              <div className="relative mb-14 group">
                <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={28} />
                <input 
                  type="text" 
                  placeholder="Filtrar console por cliente, título ou ID de hash..." 
                  className="w-full p-12 pl-24 bg-white/5 border border-white/5 rounded-[50px] text-white outline-none focus:border-blue-500/50 transition-all font-black text-xl placeholder:text-slate-800 shadow-inner" 
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-6">
                {loading ? (
                  <div className="h-40 bg-white/5 animate-pulse rounded-[55px] border border-white/5" />
                ) : filteredTickets.length > 0 ? (
                  filteredTickets.map((t) => (
                    <motion.div 
                      key={t.id} 
                      onClick={() => setSelectedTicket(t)}
                      whileHover={{ x: 15, backgroundColor: "rgba(255,255,255,0.08)" }}
                      className="bg-white/5 border border-white/5 p-12 rounded-[60px] transition-all flex items-center justify-between group cursor-pointer shadow-xl relative overflow-hidden"
                    >
                      <div className="flex items-center gap-14 relative z-10">
                        <div className={`h-28 w-28 rounded-[35px] flex items-center justify-center shadow-2xl ${t.priority === 'critical' ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white'}`}>
                          <AlertCircle size={48} />
                        </div>
                        <div>
                          <h4 className="text-3xl font-black uppercase italic group-hover:text-blue-400 transition-colors tracking-tighter leading-none mb-4">{t.title}</h4>
                          <div className="flex items-center gap-8 text-slate-500 font-black text-[11px] uppercase tracking-[0.3em]">
                            <span className="flex items-center gap-2"><Server size={14} /> {t.customerName}</span>
                            <span className="h-2 w-2 bg-slate-800 rounded-full" />
                            <span className="text-blue-500 italic flex items-center gap-2"><Network size={14} /> {t.source} Gateway</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-12 relative z-10">
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Operação</p>
                           <p className={`text-2xl font-black italic ${t.status === 'open' ? 'text-blue-500' : 'text-emerald-500'}`}>{t.status.toUpperCase().replace('_', ' ')}</p>
                        </div>
                        <div className="bg-white text-slate-900 p-8 rounded-[30px] shadow-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                           <ChevronRight size={24} />
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-72 text-center bg-white/[0.01] rounded-[100px] border-4 border-dashed border-white/5 flex flex-col items-center justify-center opacity-40">
                    <History size={100} className="text-slate-800 mb-10" />
                    <p className="text-slate-700 font-black text-5xl uppercase italic tracking-tighter">Radar Operacional Limpo</p>
                    <p className="text-slate-800 font-bold uppercase text-[10px] mt-6 tracking-[0.6em]">Aguardando Ingestão de Dados</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ABA: ANALYTICS INTERATIVO */}
          {activeTab === "sla" && (
            <motion.div key="sla-tab" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-16">
              <header>
                <h2 className="text-8xl font-black tracking-tighter italic uppercase text-white">Analytics</h2>
                <p className="text-slate-500 font-bold text-2xl italic mt-6">Protocolos de monitoramento e performance global.</p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="p-16 bg-white/5 rounded-[70px] border border-white/5 group hover:border-blue-600/40 transition-all shadow-2xl relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 text-blue-600/10"><TrendingUp size={200} /></div>
                  <TrendingUp className="text-blue-500 mb-10" size={60} />
                  <h4 className="text-xl font-black uppercase tracking-[0.3em] text-slate-500">Taxa Compliance</h4>
                  <p className="text-9xl font-black italic mt-8 leading-none">{stats.compliance}%</p>
                </div>
                <div className="p-16 bg-white/5 rounded-[70px] border border-white/5 group hover:border-emerald-600/40 transition-all shadow-2xl relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 text-emerald-600/10"><Clock size={200} /></div>
                  <Clock className="text-emerald-500 mb-10" size={60} />
                  <h4 className="text-xl font-black uppercase tracking-[0.3em] text-slate-500">Resolvidos</h4>
                  <p className="text-9xl font-black italic mt-8 leading-none">{stats.resolved}</p>
                </div>
                <div className="p-16 bg-white/5 rounded-[70px] border border-white/5 group hover:border-purple-600/40 transition-all shadow-2xl relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 text-purple-600/10"><Layers size={200} /></div>
                  <Layers className="text-purple-500 mb-10" size={60} />
                  <h4 className="text-xl font-black uppercase tracking-[0.3em] text-slate-500">Média SLAs</h4>
                  <p className="text-9xl font-black italic mt-8 leading-none">12<span className="text-2xl italic text-slate-600 ml-4">min</span></p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ABA: AUDITORIA DE SISTEMA */}
          {activeTab === "auditoria" && (
            <motion.div key="auditoria-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <header className="flex justify-between items-center">
                <h2 className="text-8xl font-black tracking-tighter italic uppercase text-white">Auditoria</h2>
                <div className="flex items-center gap-3 px-6 py-3 bg-red-500/10 rounded-3xl border border-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-widest">
                   <ShieldAlert size={16} /> Registros Imutáveis
                </div>
              </header>
              <div className="bg-[#0a0f1e] p-16 rounded-[70px] border border-white/5 font-mono text-sm leading-relaxed shadow-inner max-h-[60vh] overflow-y-auto custom-scrollbar relative">
                {/* JSX Corrigido: Comentário removido da árvore DOM para evitar erro ESLint */}
                <div className="flex items-center gap-4 text-blue-500 font-black mb-10 italic uppercase tracking-[0.5em]">
                  
                </div>
                {tickets.map((t, idx) => (
                  <div key={`${t.id}-${idx}`} className="mb-6 flex gap-8 text-slate-600 border-b border-white/[0.03] pb-6 hover:text-slate-400 transition-colors">
                    <span className="text-blue-900 font-black whitespace-nowrap bg-blue-900/10 px-3 py-1 rounded-lg">[{new Date().toLocaleTimeString()}]</span>
                    <p>
                       <span className="text-slate-500 font-black uppercase italic mr-3">TRANSACTION:</span> 
                       Protocolo <span className="text-slate-300 font-black italic underline decoration-blue-600/40 mx-2">#{t.id}</span> 
                       atualizado para <span className="text-blue-500 font-black uppercase tracking-widest ml-2 italic">{t.status}</span>.
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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