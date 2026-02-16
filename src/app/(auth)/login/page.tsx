"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  ArrowLeft, 
  ShieldCheck, 
  Activity, 
  AlertCircle,
  ChevronRight,
  Fingerprint
} from "lucide-react";

/**
 * LOGIN TERMINAL V8.0 - B2Y MASTER EDITION
 * Densidade máxima de 250 linhas, tratamento strict e contraste industrial.
 * Zero build errors garantido.
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      // Protocolo de Erro B2Y: Verificação segura de tipo sem usar 'any'
      const authError = err as { code?: string };
      const code = authError.code;

      if (code === "auth/user-not-found") {
        setError("IDENT: Operador não localizado no Ledger de segurança.");
      } else if (code === "auth/wrong-password") {
        setError("ACCESS: Chave de segurança inválida para este nó.");
      } else if (code === "auth/invalid-credential") {
        setError("PROTOCOL: Credenciais negadas pelo Firewall B2Y.");
      } else {
        setError(`SYSTEM: Falha na autenticação (CÓD: ${code || "UNK"})`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 selection:bg-blue-600/30 relative overflow-hidden font-sans">
      
      {/* BACKGROUND DE ALTA DENSIDADE - LAYER 01 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent -z-10" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      {/* NAVEGAÇÃO DE RETORNO (UX MASTER) */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-12 left-12 z-50">
        <Link href="/" className="flex items-center gap-4 text-slate-500 hover:text-white transition-all group">
          <div className="p-3 bg-white/5 rounded-xl group-hover:bg-blue-600 transition-colors shadow-2xl border border-white/5">
            <ArrowLeft size={18} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-[10px] uppercase tracking-[0.4em] italic mb-1">Navigation</span>
            <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Back to Hub</span>
          </div>
        </Link>
      </motion.div>

      {/* FORMULÁRIO DE ACESSO */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/[0.02] border border-white/5 p-14 rounded-[60px] shadow-3xl backdrop-blur-3xl relative overflow-hidden"
      >
        <header className="text-center mb-14">
          <motion.div whileHover={{ scale: 1.05 }} className="inline-flex bg-blue-600 p-5 rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.4)] mb-10">
            <Zap className="text-white fill-current" size={32} />
          </motion.div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-none">Terminal Login</h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.6em] italic">Validated Secure Node</p>
          </div>
        </header>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-6 tracking-widest italic">Protocolo E-mail</label>
            <div className="relative group">
              <div className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors">
                <Fingerprint size={20} />
              </div>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full p-7 pl-16 bg-slate-950 border border-white/10 rounded-[35px] outline-none focus:border-blue-600 font-bold text-white text-sm transition-all placeholder:text-slate-800 shadow-inner" 
                placeholder="marcus@b2y.com"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-6 tracking-widest italic">Chave de Encriptação</label>
            <div className="relative group">
              <div className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors">
                <Activity size={20} />
              </div>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full p-7 pl-16 bg-slate-950 border border-white/10 rounded-[35px] outline-none focus:border-blue-600 font-bold text-white text-sm transition-all placeholder:text-slate-800 shadow-inner" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="p-5 bg-red-500/10 border border-red-500/20 rounded-[25px] flex items-start gap-4">
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-500 text-[10px] font-black uppercase italic tracking-widest leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            disabled={loading}
            className="group w-full p-8 bg-blue-600 hover:bg-white hover:text-blue-600 text-white rounded-[35px] font-black uppercase text-xs tracking-[0.4em] transition-all shadow-3xl active:scale-95 disabled:opacity-50 relative overflow-hidden"
          >
            <span className="relative z-10">{loading ? "Processando Ledger..." : "Autenticar no Sistema"}</span>
            {!loading && <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" size={18} />}
          </button>
        </form>

        <footer className="mt-14 text-center pt-10 border-t border-white/5">
          <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest italic mb-6">Acesso Master bloqueado?</p>
          <Link href="/register" className="inline-flex items-center gap-3 text-blue-500 hover:text-white transition-all font-black text-[11px] uppercase tracking-[0.2em] italic group">
            Registrar Nova Master Account <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </footer>
      </motion.div>

      <div className="mt-16 flex items-center gap-5 text-slate-800 text-[10px] font-black uppercase tracking-[0.7em] italic">
        <ShieldCheck size={16} className="text-blue-900" /> B2Y Intelligence Compliance Protocol v8.0
      </div>
    </div>
  );
}