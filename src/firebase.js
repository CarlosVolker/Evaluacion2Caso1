// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVNyLkqUDBBgyRD5_SC2NSqsokTGTML80",
  authDomain: "proyectos-a2aa3.firebaseapp.com",
  projectId: "proyectos-a2aa3",
  storageBucket: "proyectos-a2aa3.firebasestorage.app",
  messagingSenderId: "965731769142",
  appId: "1:965731769142:web:0fb4c08222e054e7383197"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export { db };