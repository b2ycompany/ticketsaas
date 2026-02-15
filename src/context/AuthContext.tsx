"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthContext = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setTimeout(() => setLoading(false), 1500); // Forçamos 1.5s para exibir a marca
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900">
        <div className="relative">
          <div className="h-24 w-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 bg-blue-500 rounded-lg rotate-45 animate-pulse"></div>
          </div>
        </div>
        <h1 className="mt-8 text-white font-black tracking-[0.3em] animate-pulse">TICKETMASTER</h1>
        <p className="text-slate-500 text-xs mt-2 uppercase font-bold">Iniciando Engine de SLA...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);