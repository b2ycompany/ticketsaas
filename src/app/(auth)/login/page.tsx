"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      alert("Falha na autenticação. Verifique os dados.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200 border border-white">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Bem-vindo de volta.</h2>
          <p className="text-slate-400 font-medium mt-2 text-sm">Aceda ao seu centro de operações.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase ml-4">E-mail Profissional</label>
            <input type="email" required onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-slate-100 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="exemplo@empresa.com" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase ml-4">Palavra-passe</label>
            <input type="password" required onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-100 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••" />
          </div>
          <button className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-xs">
            Entrar no Sistema
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Novo aqui? <Link href="/register" className="text-blue-600 font-bold hover:underline">Crie uma conta SaaS</Link>
        </p>
      </div>
    </div>
  );
}