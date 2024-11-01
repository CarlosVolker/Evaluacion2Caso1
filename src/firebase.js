import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCVNyLkqUDBBgyRD5_SC2NSqsokTGTML80",
  authDomain: "proyectos-a2aa3.firebaseapp.com",
  projectId: "proyectos-a2aa3",
  storageBucket: "proyectos-a2aa3.firebasestorage.app",
  messagingSenderId: "965731769142",
  appId: "1:965731769142:web:0fb4c08222e054e7383197"
};

// Inicializa Firebase
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);
const functions = getFunctions(appFirebase);

export { db, functions, httpsCallable };
