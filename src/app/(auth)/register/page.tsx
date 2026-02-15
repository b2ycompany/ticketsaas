"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Criar utilizador no Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Criar o Tenant (Empresa) no Firestore
      await setDoc(doc(db, "tenants", user.uid), {
        name: companyName,
        adminEmail: email,
        plan: "free",
        createdAt: new Date()
      });

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Erro ao registar empresa.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Criar Conta SaaS</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="text" placeholder="Nome da Empresa / Fornecedor" required
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setCompanyName(e.target.value)} 
          />
          <input 
            type="email" placeholder="E-mail Administrador" required
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="Palavra-passe forte" required
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 transition-all">
            Começar Agora
          </button>
        </form>
      </div>
    </div>
  );
}