import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAxKYSgBSyFRcQ8Uk9gHI5etxE1FY_HJG8",
  authDomain: "bancodigital-backend.firebaseapp.com",
  projectId: "bancodigital-backend",
  storageBucket: "bancodigital-backend.firebasestorage.app",
  messagingSenderId: "238278753092",
  appId: "1:238278753092:web:b13ccc06b59f93b849f511"
};

// Garante que não inicializamos o Firebase duas vezes
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };