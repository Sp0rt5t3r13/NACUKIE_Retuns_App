// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from "firebase/auth";

// NACUKIE Returns App Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfEjBsDJIPOK4-ghg65WDe2Tzv5KaXr0k",
  authDomain: "nacukie-returns-app.firebaseapp.com",
  projectId: "nacukie-returns-app",
  storageBucket: "nacukie-returns-app.firebasestorage.app",
  messagingSenderId: "142372165759",
  appId: "1:142372165759:web:4bc6c0370c976fc6a7074a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export authentication functions
export { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
};