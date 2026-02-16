"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, ArrowLeft, ShieldAlert, Key, Mail, User, ShieldCheck } from "lucide-react";

/**
 * REGISTRO DE OPERADOR - B2Y MASTER V2.0
 * Path corrigido para @/lib/firebase e remoção de variáveis lixo.
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

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // B2Y Ledger: Criação do perfil administrativo no Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        role: "admin",
        status: "active",
        createdAt: serverTimestamp()
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Registration Critical Failure:", err);
      setError("Falha no protocolo de registro. Verifique as políticas de segurança.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 selection:bg-blue-600/30 relative overflow-hidden">
      
      {/* BOTÃO VOLTAR (ABSOLUTE UI) */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-12 left-12">
        <Link href="/" className="flex items-center gap-4 text-slate-500 hover:text-white transition-all group">
          <div className="p-3 bg-white/5 rounded-xl group-hover:bg-blue-600 transition-colors shadow-2xl">
            <ArrowLeft size={18} />
          </div>
          <span className="font-black text-[11px] uppercase tracking-[0.3em] italic">Cancelar Registro</span>
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white/[0.02] border border-white/5 p-16 rounded-[70px] shadow-3xl backdrop-blur-3xl relative"
      >
        <header className="text-center mb-16">
          <div className="inline-flex bg-emerald-600 p-6 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] mb-10">
            <UserPlus size={40} className="text-white" />
          </div>
          <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">New Operative</h2>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.6em] mt-5 italic">Credenciamento de Nível 3 B2Y</p>
        </header>

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase ml-8 italic tracking-widest">Identificação Master</label>
            <div className="relative group">
              <User className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={22} />
              <input 
                required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full p-8 pl-20 bg-slate-950 border border-white/10 rounded-[40px] outline-none focus:border-blue-600 font-bold transition-all text-sm placeholder:text-slate-900 shadow-inner" 
                placeholder="Ex: Marcus Aurelius"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase ml-8 italic tracking-widest">E-mail de Serviço</label>
            <div className="relative group">
              <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={22} />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full p-8 pl-20 bg-slate-950 border border-white/10 rounded-[40px] outline-none focus:border-blue-600 font-bold transition-all text-sm placeholder:text-slate-900 shadow-inner" 
                placeholder="operador@servico.com"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase ml-8 italic tracking-widest">Chave Alpha-Numerica</label>
            <div className="relative group">
              <Key className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={22} />
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full p-8 pl-20 bg-slate-950 border border-white/10 rounded-[40px] outline-none focus:border-blue-600 font-bold transition-all text-sm placeholder:text-slate-900 shadow-inner" 
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-3xl">
              <p className="text-red-500 text-[10px] font-black uppercase text-center italic tracking-widest leading-relaxed">{error}</p>
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full p-9 bg-white text-slate-950 rounded-[40px] font-black uppercase text-xs tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-3xl active:scale-95 disabled:opacity-50"
          >
            {loading ? "Registrando Ledger..." : "Validar Acesso Master"}
          </button>
        </form>

        <footer className="mt-16 pt-12 border-t border-white/5 text-center">
          <Link href="/login" className="text-slate-600 hover:text-blue-500 transition-all font-black text-[11px] uppercase tracking-[0.3em] italic">
            Já possui acesso? <span className="text-blue-500 border-b border-blue-500/20 ml-2">Login Terminal</span>
          </Link>
        </footer>
      </motion.div>

      <div className="mt-16 flex items-center gap-5 text-slate-800 text-[11px] font-black uppercase tracking-[0.8em] italic">
        <ShieldAlert size={18} /> <ShieldCheck size={18} /> High Security Enrollment
      </div>
    </div>
  );
}