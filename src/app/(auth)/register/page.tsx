"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Criar utilizador no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Criar o Perfil da Empresa (Tenant) no Firestore
      await setDoc(doc(db, "tenants", user.uid), {
        companyName: companyName,
        adminEmail: email,
        plan: "enterprise_trial",
        createdAt: new Date(),
        active: true
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      // Correção do erro ESLint: Tratando o erro como objeto Error
      const error = err as Error;
      console.error("Erro no registo:", error.message);
      alert("Erro ao criar conta: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-xl bg-white rounded-[50px] p-12 shadow-2xl">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">B2Y SaaS Platform</h2>
          <p className="text-slate-500 font-medium mt-2">Crie a sua instância de monitorização agora.</p>
        </div>

        <form onSubmit={handleRegister} className="grid grid-cols-1 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Organização</label>
            <input 
              type="text" required placeholder="Nome da sua Empresa"
              className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
              onChange={(e) => setCompanyName(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">E-mail Admin</label>
            <input 
              type="email" required placeholder="admin@empresa.com"
              className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Senha de Acesso</label>
            <input 
              type="password" required placeholder="••••••••"
              className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-6 rounded-[30px] font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-blue-200 mt-4 disabled:bg-slate-300"
          >
            {loading ? "Provisionando..." : "Registrar Empresa"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <Link href="/login" className="text-slate-400 font-bold hover:text-blue-600 transition">Já tem conta? Entrar</Link>
        </div>
      </div>
    </div>
  );
}