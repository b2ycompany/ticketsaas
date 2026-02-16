"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { db, auth } from "../../lib/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  Timestamp 
} from "firebase/firestore";
import { Ticket } from "../../types/ticket";
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  LogOut, 
  AlertCircle, 
  Search, 
  Activity,
  ShieldCheck,
  Zap,
  BarChart3,
  Clock,
  PlayCircle,
  Plus,
  Settings,
  Bell,
  Terminal
} from "lucide-react";
import TicketDetailSidebar from "@/components/TicketDetailSidebar";
import { motion, AnimatePresence } from "framer-motion";

/**
 * DASHBOARD PAGE COMPONENT
 * Plataforma de Governança B2Y Master - Versão Enterprise 2026
 */
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // --- ESTADOS DE NAVEGAÇÃO E DADOS ---
  const [activeTab, setActiveTab] = useState<"tickets" | "sla" | "auditoria">("tickets");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isInjecting, setIsInjecting] = useState<boolean>(false);

  // --- PROTEÇÃO DE ROTA ---
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // --- SINCRONIZAÇÃO EM TEMPO REAL COM FIRESTORE ---
  useEffect(() => {
    if (!user) return;

    const ticketsRef = collection(db, "tickets");
    const q = query(ticketsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Ticket[];
      
      setTickets(ticketsList);
      setLoading(false);
    }, (err) => {
      console.error("Erro crítico na stream de dados:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // --- ENGINE DE INJEÇÃO DE DADOS (STRESS TEST) ---
  const injectSampleTickets = useCallback(async () => {
    if (isInjecting) return;
    setIsInjecting(true);

    const samplePool = [
      { title: "ZABBIX: High CPU utilization on Core-Switch-01", priority: "critical", customer: "Lion Solution", src: "ZABBIX_V7" },
      { title: "SECURITY: Brute force attack detected from IP 192.168.1.45", priority: "critical", customer: "B2Y Global", src: "SOC_INTERNAL" },
      { title: "STORAGE: Disk space low on Backup-Server-03 (95%)", priority: "high", customer: "Lion Solution", src: "VEAAM_CLOUD" },
      { title: "SLA ALERT: Incident #44521 is reaching expiration", priority: "medium", customer: "Internal_IT", src: "B2Y_ENGINE" },
      { title: "NETWORK: Packet loss detected on VPN Gateway Brasil", priority: "high", customer: "Lion Solution", src: "CISCO_MERAKI" }
    ];

    try {
      for (const item of samplePool) {
        await addDoc(collection(db, "tickets"), {
          title: item.title,
          description: `Incidente automatizado via gateway ${item.src}. Analisar logs de rede imediatamente.`,
          status: "open",
          priority: item.priority,
          customerName: item.customer,
          source: item.src,
          tenantId: user?.uid || "system",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          slaDeadline: new Date(Date.now() + 7200000), // +2 horas
        });
      }
      console.log("Massa de dados injetada com sucesso.");
    } catch (error) {
      console.error("Falha na injeção de teste:", error);
    } finally {
      setIsInjecting(false);
    }
  }, [user, isInjecting]);

  // --- LÓGICA DE FILTRAGEM ---
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(searchLower) ||
        t.customerName.toLowerCase().includes(searchLower) ||
        t.id?.toLowerCase().includes(searchLower)
      );
    });
  }, [tickets, searchQuery]);

  // --- BLOQUEIO DE RENDERIZAÇÃO ---
  if (authLoading || !user) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-white font-black uppercase tracking-widest text-xs">Authenticating Session...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR DE COMANDO LATERAL */}
      <aside className="w-80 bg-slate-900/40 backdrop-blur-3xl border-r border-white/5 p-8 flex flex-col z-[100]">
        <div className="flex items-center gap-4 mb-16">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)]">
            <Zap className="text-white fill-current" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tighter leading-none italic uppercase">TicketMaster</span>
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Enterprise Suite</span>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          <button 
            onClick={() => setActiveTab("tickets")} 
            className={`flex items-center gap-4 w-full p-5 rounded-[25px] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === "tickets" ? "bg-blue-600 shadow-2xl shadow-blue-600/30 text-white" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
          >
            <TicketIcon size={20} /> <span>Incidentes Live</span>
          </button>
          <button 
            onClick={() => setActiveTab("sla")} 
            className={`flex items-center gap-4 w-full p-5 rounded-[25px] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === "sla" ? "bg-blue-600 shadow-2xl shadow-blue-600/30 text-white" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
          >
            <Activity size={20} /> <span>Analytics SLA</span>
          </button>
          <button 
            onClick={() => setActiveTab("auditoria")} 
            className={`flex items-center gap-4 w-full p-5 rounded-[25px] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === "auditoria" ? "bg-blue-600 shadow-2xl shadow-blue-600/30 text-white" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
          >
            <ShieldCheck size={20} /> <span>Auditoria</span>
          </button>
        </nav>

        <div className="mt-auto space-y-6">
          <button 
            disabled={isInjecting}
            onClick={injectSampleTickets} 
            className="w-full p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
          >
            <Terminal size={18} /> {isInjecting ? "Sincronizando..." : "Stress Test (Injetar)"}
          </button>
          
          <div className="pt-6 border-t border-white/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-black text-sm italic">
                {user.email?.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-[10px] font-black text-white truncate uppercase tracking-widest">{user.email}</p>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Nível de Acesso: Global</p>
              </div>
            </div>
            <button 
              onClick={() => auth.signOut()} 
              className="flex items-center gap-4 w-full p-4 text-red-500 hover:bg-red-500/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              <LogOut size={18} /> <span>Logoff Seguro</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ÁREA DE TRABALHO DINÂMICA */}
      <main className="flex-1 overflow-y-auto p-16 relative">
        <AnimatePresence mode="wait">
          {activeTab === "tickets" && (
            <motion.div 
              key="tickets-view" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
            >
              <header className="flex justify-between items-end mb-20">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-blue-500 text-[9px] font-black uppercase tracking-widest">Live Operations Center</span>
                  </div>
                  <h2 className="text-8xl font-black tracking-tighter italic uppercase text-white leading-none">Console</h2>
                </div>
                <div className="flex gap-6">
                  <div className="bg-white/5 border border-white/5 p-10 rounded-[45px] text-center min-w-[180px] shadow-2xl">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 italic">Alertas Totais</p>
                    <p className="text-6xl font-black italic">{tickets.length}</p>
                  </div>
                </div>
              </header>

              <div className="relative mb-14 group">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={24} />
                <input 
                  type="text" 
                  placeholder="Pesquisar por cliente, título ou protocolo de incidente..." 
                  className="w-full p-10 pl-20 bg-white/5 border border-white/5 rounded-[40px] text-white outline-none focus:border-blue-500/50 transition-all font-black text-xl placeholder:text-slate-700 shadow-inner" 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
              </div>

              <div className="space-y-6">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((t) => (
                    <motion.div 
                      layoutId={t.id} 
                      key={t.id} 
                      onClick={() => setSelectedTicket(t)} 
                      className="bg-white/5 border border-white/5 p-10 rounded-[55px] hover:border-blue-600/50 hover:bg-white/[0.08] transition-all flex items-center justify-between group cursor-pointer shadow-xl relative overflow-hidden"
                    >
                      <div className="flex items-center gap-12 relative z-10">
                        <div className={`h-24 w-24 rounded-[30px] flex items-center justify-center shadow-2xl ${t.priority === 'critical' ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white'}`}>
                          <AlertCircle size={40} />
                        </div>
                        <div>
                          <h4 className="text-3xl font-black uppercase italic group-hover:text-blue-400 transition-colors tracking-tighter leading-none mb-4">{t.title}</h4>
                          <div className="flex items-center gap-6">
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">{t.customerName}</span>
                            <span className="h-1.5 w-1.5 bg-slate-800 rounded-full" />
                            <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.3em]">{t.source}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-10 relative z-10">
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1 italic tracking-[0.2em]">STATUS ATUAL</p>
                          <p className={`text-xl font-black italic ${t.status === 'open' ? 'text-blue-500' : 'text-emerald-500'}`}>{t.status.toUpperCase().replace('_', ' ')}</p>
                        </div>
                        <button className="bg-white text-slate-900 px-12 py-7 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95">
                          Gerenciar
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-60 text-center bg-white/[0.01] rounded-[80px] border-4 border-dashed border-white/5 flex flex-col items-center">
                    <div className="p-8 bg-white/5 rounded-full mb-8 text-slate-800"><Zap size={80} /></div>
                    <p className="text-slate-700 font-black text-4xl uppercase italic tracking-tighter">Nenhum alerta em processamento no momento</p>
                  </div>
                )}
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