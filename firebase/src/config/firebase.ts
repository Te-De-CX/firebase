import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqB8UsRNPh7Szvyhrqqh_lZY5hhMxN6A4",
  authDomain: "fir-8c965.firebaseapp.com",
  projectId: "fir-8c965",
  storageBucket: "fir-8c965.firebasestorage.app",
  messagingSenderId: "262170600034",
  appId: "1:262170600034:web:4427d2262d67d6f8d8273b",
  measurementId: "G-6KE4DWP1ME"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app)