"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ArrowLeft, ShieldCheck, Lock, Mail, Activity } from "lucide-react";

/**
 * LOGIN TERMINAL - B2Y MASTER V2.0
 * Path corrigido para @/lib/firebase e Tipagem Strict.
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      // B2Y Protocol: Log técnico silencioso e mensagem amigável para o operador
      console.error("Auth Failure:", err);
      setError("Credenciais inválidas ou acesso negado pelo Ledger de segurança.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 selection:bg-blue-600/30 relative overflow-hidden">
      {/* BACKGROUND DE ALTA DENSIDADE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent -z-10" />
      
      {/* NAVEGAÇÃO SUPERIOR */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-12 left-12">
        <Link href="/" className="flex items-center gap-4 text-slate-500 hover:text-white transition-all group">
          <div className="p-3 bg-white/5 rounded-xl group-hover:bg-blue-600 transition-colors shadow-xl">
            <ArrowLeft size={18} />
          </div>
          <span className="font-black text-[11px] uppercase tracking-[0.3em] italic">Voltar ao Início</span>
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/[0.02] border border-white/5 p-14 rounded-[60px] shadow-3xl backdrop-blur-3xl relative overflow-hidden"
      >
        <header className="text-center mb-14">
          <div className="inline-flex bg-blue-600 p-5 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.4)] mb-10">
            <Zap className="text-white fill-current" size={32} />
          </div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-none">Acesso Master</h2>
          <div className="flex items-center justify-center gap-3 mt-4 italic">
            <Activity size={12} className="text-blue-500 animate-pulse" />
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">B2Y Security Terminal</p>
          </div>
        </header>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-6 tracking-widest italic">Protocolo E-mail</label>
            <div className="relative group">
              <Mail className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full p-7 pl-16 bg-slate-950 border border-white/10 rounded-[35px] outline-none focus:border-blue-600 font-bold text-sm transition-all placeholder:text-slate-800" 
                placeholder="operador@b2y.com"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-6 tracking-widest italic">Chave de Encriptação</label>
            <div className="relative group">
              <Lock className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full p-7 pl-16 bg-slate-950 border border-white/10 rounded-[35px] outline-none focus:border-blue-600 font-bold text-sm transition-all placeholder:text-slate-800" 
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <p className="text-red-500 text-[9px] font-black uppercase text-center italic tracking-widest leading-relaxed">{error}</p>
            </motion.div>
          )}

          <button 
            disabled={loading}
            className="w-full p-8 bg-blue-600 hover:bg-white hover:text-blue-600 text-white rounded-[35px] font-black uppercase text-xs tracking-[0.4em] transition-all shadow-2xl active:scale-95 disabled:opacity-50"
          >
            {loading ? "Sincronizando..." : "Autenticar no Terminal"}
          </button>
        </form>

        <footer className="mt-14 text-center pt-10 border-t border-white/5">
          <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest italic mb-6">Solicitar novas credenciais?</p>
          <Link href="/register" className="text-blue-500 hover:text-white transition-colors font-black text-[11px] uppercase tracking-[0.2em] italic border-b border-blue-500/20 pb-1">
            Registrar Novo Master Account
          </Link>
        </footer>
      </motion.div>

      <div className="mt-16 flex items-center gap-4 text-slate-800 text-[10px] font-black uppercase tracking-[0.6em] italic">
        <ShieldCheck size={16} /> Restricted Access Protocol Active
      </div>
    </div>
  );
}