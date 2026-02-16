"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Building2, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "tenants", user.uid), {
        companyName: companyName,
        adminEmail: email,
        plan: "enterprise_trial",
        createdAt: new Date(),
        active: true,
        setupComplete: false
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro no provisionamento";
      console.error("Registration Error:", errorMessage);
      setError("Erro ao provisionar instância. Verifique os dados.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden p-6">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[150px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] z-10"
      >
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-12 rounded-[50px] shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-emerald-600 rounded-2xl mb-6 shadow-lg shadow-emerald-600/20">
              <UserPlus className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">Provisionar <span className="text-blue-500">SaaS</span></h2>
            <p className="text-slate-500 text-xs mt-3 font-bold uppercase tracking-widest leading-relaxed">
              Inicie a sua operação de governança em segundos.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 italic">Organização / Empresa</label>
              <div className="relative">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" required placeholder="Ex: B2Y Global Solutions"
                  className="w-full p-5 pl-14 bg-white/[0.04] border border-white/5 rounded-2xl text-white outline-none focus:border-blue-600 transition-all font-bold placeholder:text-slate-700"
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 italic">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" required placeholder="admin@empresa.com"
                  className="w-full p-5 pl-14 bg-white/[0.04] border border-white/5 rounded-2xl text-white outline-none focus:border-blue-600 transition-all font-bold placeholder:text-slate-700"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 italic">Definir Chave Mestra</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" required placeholder="Mínimo 8 caracteres"
                  className="w-full p-5 pl-14 bg-white/[0.04] border border-white/5 rounded-2xl text-white outline-none focus:border-blue-600 transition-all font-bold placeholder:text-slate-700"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-[10px] font-black text-center uppercase tracking-widest">{error}</p>}

            <button 
              disabled={loading}
              className="group w-full bg-white text-slate-900 p-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-xl disabled:bg-slate-800"
            >
              {loading ? "Provisionando Sistema..." : "Criar Minha Plataforma"} 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </form>

          <div className="mt-10 text-center border-t border-white/5 pt-8">
            <Link href="/login" className="text-slate-500 font-black text-[10px] hover:text-blue-500 transition uppercase tracking-[0.2em]">
              Já possui uma instância? <span className="text-white ml-2 underline">Entrar</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center gap-3 text-slate-600">
           <ShieldCheck size={16} />
           <span className="text-[10px] font-black uppercase tracking-widest">AES-256 Encryption Secured</span>
        </div>
      </motion.div>
    </div>
  );
}