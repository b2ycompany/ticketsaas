"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, 
  ArrowLeft, 
  ShieldAlert, 
  Mail, 
  User, 
  Activity, 
  Database,
  Lock,
  Zap,
  AlertCircle
} from "lucide-react";

/**
 * REGISTER TERMINAL V8.0 - B2Y MASTER EDITION
 * Densidade máxima de 250 linhas, tipagem strict e visibilidade industrial.
 * Zero imports lixo.
 */
export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("SECURITY: A chave de acesso deve possuir mínimo de 8 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // PERSISTÊNCIA NO LEDGER DE OPERADORES
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        role: "admin",
        status: "active",
        node: "MASTER-LEDGER-01",
        createdAt: serverTimestamp(),
        lastSync: serverTimestamp()
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      const authError = err as { code?: string };
      const code = authError.code;

      if (code === "auth/email-already-in-use") {
        setError("LEDGER: Este e-mail já possui credenciamento ativo.");
      } else if (code === "auth/weak-password") {
        setError("SECURITY: Chave de acesso detectada como vulnerável.");
      } else {
        setError(`SYSTEM: Erro no protocolo de registro (${code || "FATAL"})`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 selection:bg-blue-600/30 relative overflow-hidden font-sans">
      
      {/* LAYER DE FUNDO CORPORATIVO */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/5 via-transparent to-transparent -z-10" />

      {/* BOTÃO VOLTAR (UX MASTER) */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-12 left-12 z-50">
        <Link href="/" className="flex items-center gap-4 text-slate-500 hover:text-white transition-all group">
          <div className="p-3 bg-white/5 rounded-xl group-hover:bg-emerald-600 transition-colors shadow-2xl border border-white/5">
            <ArrowLeft size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[10px] uppercase tracking-[0.4em] italic mb-1">System</span>
            <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Abort Process</span>
          </div>
        </Link>
      </motion.div>

      {/* BOX DE REGISTRO */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white/[0.02] border border-white/5 p-16 rounded-[70px] shadow-3xl backdrop-blur-3xl relative"
      >
        <header className="text-center mb-16">
          <motion.div whileHover={{ rotate: -5 }} className="inline-flex bg-emerald-600 p-6 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.3)] mb-10">
            <UserPlus size={40} className="text-white" />
          </motion.div>
          <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">New Operative</h2>
          <div className="flex items-center justify-center gap-5 mt-8">
            <div className="h-px w-12 bg-emerald-600 opacity-30" />
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.8em] italic leading-none">Enrollment B2Y v8.0</p>
            <div className="h-px w-12 bg-emerald-600 opacity-30" />
          </div>
        </header>

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase ml-8 italic tracking-widest leading-none">Identificação Master</label>
            <div className="relative group">
              <User className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={22} />
              <input 
                required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full p-8 pl-20 bg-slate-950 border border-white/10 rounded-[40px] outline-none focus:border-blue-600 font-bold text-white transition-all text-sm shadow-inner" 
                placeholder="Ex: Marcus Aurelius"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase ml-8 italic tracking-widest leading-none">E-mail de Serviço</label>
            <div className="relative group">
              <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={22} />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full p-8 pl-20 bg-slate-950 border border-white/10 rounded-[40px] outline-none focus:border-blue-600 font-bold text-white transition-all text-sm shadow-inner" 
                placeholder="marcus@agency.com"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase ml-8 italic tracking-widest leading-none">Chave Alpha (8+ chars)</label>
            <div className="relative group">
              <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={22} />
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full p-8 pl-20 bg-slate-950 border border-white/10 rounded-[40px] outline-none focus:border-blue-600 font-bold text-white transition-all text-sm shadow-inner" 
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-4">
                <AlertCircle size={20} className="text-red-500" />
                <p className="text-red-500 text-[10px] font-black uppercase text-center italic tracking-widest leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            disabled={loading}
            className="w-full p-9 bg-white text-slate-950 rounded-[45px] font-black uppercase text-xs tracking-[0.4em] hover:bg-emerald-600 hover:text-white transition-all shadow-3xl active:scale-95 disabled:opacity-50"
          >
            {loading ? "Validando Protocolo..." : "Ativar Master Account"}
          </button>
        </form>

        <footer className="mt-16 pt-12 border-t border-white/5 text-center">
          <Link href="/login" className="text-slate-600 hover:text-blue-500 transition-all font-black text-[11px] uppercase tracking-[0.3em] italic">
            Já possui credenciais? <span className="text-blue-500 border-b border-blue-500/20 ml-2">Login Terminal</span>
          </Link>
        </footer>
      </motion.div>

      <div className="mt-16 flex items-center gap-6 text-slate-800 text-[11px] font-black uppercase tracking-[0.8em] italic">
        <ShieldAlert size={18} /> <Database size={18} /> <Activity size={18} /> <Zap size={18} /> Validated Enrollment Node
      </div>
    </div>
  );
}