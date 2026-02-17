"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { Ticket } from "@/types/ticket";
import { 
  Zap, Activity, RefreshCcw, Play, BellRing, Terminal, Server, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * B2Y STRESS SIMULATOR V8.0
 * Ajuste A: Injeção de Dados em Massa (Corrigido para Pureza React)
 * Ajuste B: Outbound Notification Feed (Strictly Typed)
 */
export default function SimulatorPage() {
  const [isInjecting, setIsInjecting] = useState(false);
  const [logs, setLogs] = useState<{id: string, msg: string, type: string}[]>([]);
  const [liveAlerts, setLiveAlerts] = useState<Ticket[]>([]);

  // Tipos de incidentes técnicos reais para benchmark
  const incidentTypes = [
    { t: "High Latency - Core SW-01", d: "Latência > 250ms no backbone SP.", p: "critical", s: "ZABBIX" },
    { t: "DB Connection Timeout", d: "Pool de conexões Postgres saturado no cluster N2.", p: "high", s: "JIRA" },
    { t: "Cert Expiry Alert", d: "Certificado wildcard expira em menos de 72h.", p: "medium", s: "SERVICENOW" },
    { t: "DDoS Mitigation Active", d: "Tráfego anômalo detectado no Edge Node B2Y.", p: "critical", s: "CLOUD_WATCH" },
    { t: "Storage Capacity Warning", d: "Volume /data-store atingiu 92% de ocupação.", p: "high", s: "NAGIOS" }
  ];

  // Ajuste B: Escuta novos tickets e popula o feed de saída em tempo real
  useEffect(() => {
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
      setLiveAlerts(data);
    });
    return () => unsubscribe();
  }, []);

  const addLog = (msg: string, type: string) => {
    setLogs(prev => [{ id: crypto.randomUUID(), msg, type }, ...prev].slice(0, 25));
  };

  const injectIncidents = async (count: number) => {
    setIsInjecting(true);
    addLog(`Protocolo de Stress iniciado: Injetando ${count} objetos...`, "info");

    for (let i = 0; i < count; i++) {
      // Lógica impura executada fora da renderização (Correto)
      const randomIdx = Math.floor(Math.random() * incidentTypes.length);
      const type = incidentTypes[randomIdx];
      const randomId = Math.floor(Math.random() * 9999);

      try {
        await addDoc(collection(db, "tickets"), {
          title: `[STRESS] ${type.t} #ID-${randomId}`,
          description: type.d,
          priority: type.p,
          status: "Triagem",
          customerName: "B2Y_ENTERPRISE_GLOBAL",
          source: type.s,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          auditTrail: [{
            event: "IA_SIMULATION_INGEST",
            timestamp: new Date().toISOString(),
            note: "Ingestão via B2Y Stress Engine v8.0",
            operator: "SYSTEM_SIMULATOR"
          }]
        });
        addLog(`SUCCESS: Objeto ${i + 1} injetado com sucesso no Ledger.`, "success");
      } catch (err) {
        addLog(`CRITICAL: Falha na ingestão do objeto ${i + 1}.`, "error");
        console.error(err);
      }
      // Delay para simular fluxo real de rede
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    setIsInjecting(false);
    addLog(`Simulação concluída. ${count} registros persistidos.`, "info");
  };

  return (
    <div className="p-16 flex flex-col min-h-screen bg-transparent selection:bg-blue-600/30">
      
      {/* HEADER INDUSTRIAL */}
      <header className="mb-16 flex justify-between items-center bg-white/[0.02] p-12 rounded-[60px] border border-white/5 shadow-3xl backdrop-blur-xl">
        <div className="flex items-center gap-8">
          <div className="bg-blue-600 p-6 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.4)] animate-pulse">
            <Zap size={32} className="text-white fill-current" />
          </div>
          <div>
            <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white">Stress Engine</h2>
            <div className="flex items-center gap-4 mt-3">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.5em] italic">Data Ingestion Simulator v8.0</p>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <button 
            onClick={() => injectIncidents(10)} 
            disabled={isInjecting}
            className="px-10 py-5 bg-white text-slate-950 rounded-[25px] font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50"
          >
            <Play size={14} /> Inject 10 Tickets
          </button>
          <button 
            onClick={() => injectIncidents(50)} 
            disabled={isInjecting}
            className="px-10 py-5 bg-blue-600 text-white rounded-[25px] font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-blue-600 transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50"
          >
            <Zap size={14} /> Full Stress (50)
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12">
        {/* LADO ESQUERDO: CONSOLE DE LOGS */}
        <div className="col-span-7 bg-black/40 border border-white/5 rounded-[80px] p-12 shadow-3xl h-[650px] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none"><Terminal size={300} /></div>
          
          <div className="flex items-center justify-between mb-10 text-slate-500 italic relative z-10">
            <div className="flex items-center gap-4">
              <Terminal size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Ledger Ingestion Stream</span>
            </div>
            <span className="text-[9px] font-bold uppercase">{logs.length} Operations logged</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 font-mono text-[11px] no-scrollbar relative z-10 pr-4">
            <AnimatePresence mode="popLayout">
              {logs.map(log => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className={`flex gap-4 p-2 rounded-lg ${log.type === 'error' ? 'bg-red-500/10 text-red-400' : log.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/5 text-blue-400'}`}
                >
                  <span className="opacity-30 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                  <span className="font-bold shrink-0">AUTH-B2Y:</span>
                  <span className="truncate">{log.msg}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {logs.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <RefreshCcw size={48} className="animate-spin mb-4" />
                <p className="text-xs font-black uppercase italic tracking-widest">Waiting for protocol start...</p>
              </div>
            )}
          </div>
        </div>

        {/* LADO DIREITO: FEED DE NOTIFICAÇÕES (AJUSTE B) */}
        <div className="col-span-5 space-y-10">
          <div className="bg-white/5 border border-white/5 p-12 rounded-[80px] shadow-3xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-5 rotate-12"><BellRing size={200} /></div>
            
            <h3 className="text-2xl font-black italic uppercase mb-12 flex items-center gap-4 relative z-10">
              <BellRing className="text-blue-600 animate-bounce" size={24} /> Outbound Alerts
            </h3>
            
            <div className="space-y-5 relative z-10">
              <AnimatePresence>
                {liveAlerts.map((alert) => (
                  <motion.div 
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-slate-950/80 border-l-4 border-blue-600 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all shadow-xl"
                  >
                    <div className="max-w-[80%]">
                      <p className="text-[11px] font-black text-white uppercase italic truncate">{alert.title}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[8px] font-bold text-slate-600 uppercase bg-white/5 px-2 py-0.5 rounded-md">{alert.source}</span>
                        <span className="text-[8px] font-bold text-blue-500 uppercase italic">Status: {alert.status}</span>
                      </div>
                    </div>
                    <Activity size={18} className="text-slate-800 group-hover:text-blue-500 transition-colors" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* INDICADORES DE SAÚDE DO NÓ */}
          <div className="bg-blue-600 p-12 rounded-[70px] shadow-[0_0_60px_rgba(37,99,235,0.3)] relative overflow-hidden group">
             <Server className="absolute -bottom-10 -right-10 opacity-10 scale-150 group-hover:rotate-12 transition-transform duration-700" size={180} />
             <h4 className="text-4xl font-black italic uppercase text-white mb-6">Master Node</h4>
             <div className="grid grid-cols-2 gap-6 relative z-10">
               {[
                 { l: "CPU LOAD", v: "14%" },
                 { l: "MEMORY", v: "4.2GB" },
                 { l: "LATENCY", v: "8ms" },
                 { l: "UPTIME", v: "99.9%" }
               ].map(m => (
                 <div key={m.l} className="bg-white/10 p-4 rounded-2xl border border-white/10">
                   <p className="text-[8px] font-black text-blue-200 uppercase tracking-widest mb-1">{m.l}</p>
                   <div className="flex items-center gap-2">
                     <ShieldCheck size={12} className="text-white" />
                     <span className="text-sm font-black text-white">{m.v}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 py-10 border-t border-white/5 flex justify-center items-center gap-12 opacity-40">
        <div className="flex items-center gap-3 text-[10px] font-black italic uppercase tracking-[0.5em]">
          <RefreshCcw size={16} className="animate-spin text-blue-500" /> Auto-Ledger Synchronization Active
        </div>
      </footer>
    </div>
  );
}