"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";

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
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      console.error("Login Error:", errorMessage);
      setError("Credenciais inválidas ou erro de conexão.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden p-6">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[450px] z-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[40px] shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-600/20">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter">Acesso Restrito</h2>
            <p className="text-slate-400 text-sm mt-2 font-medium">Insira as suas credenciais de operador.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">ID de Utilizador</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" required placeholder="exemplo@b2y.com"
                  className="w-full p-5 pl-14 bg-white/[0.05] border border-white/5 rounded-2xl text-white outline-none focus:border-blue-600 transition-all font-bold placeholder:text-slate-600"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Chave de Segurança</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full p-5 pl-14 bg-white/[0.05] border border-white/5 rounded-2xl text-white outline-none focus:border-blue-600 transition-all font-bold placeholder:text-slate-600"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-xs font-bold text-center">{error}</p>}

            <button 
              disabled={loading}
              className="group w-full bg-blue-600 text-white p-6 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white hover:text-blue-600 transition-all shadow-xl shadow-blue-600/20 disabled:bg-slate-800"
            >
              {loading ? "Autenticando..." : "Entrar no Terminal"} 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </button>
          </form>

          <div className="mt-10 text-center">
            <Link href="/register" className="text-slate-500 font-bold text-xs hover:text-white transition uppercase tracking-widest">
              Solicitar Acesso (Novo Fornecedor)
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}