// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBbwzMjO9eXa6YvaHye3p1lAKgGl1vC1tk",
    authDomain: "birthday-invite-2d428.firebaseapp.com",
    projectId: "birthday-invite-2d428",
    storageBucket: "birthday-invite-2d428.firebasestorage.app",
    messagingSenderId: "6297106711",
    appId: "1:6297106711:web:95a34350fe8f07503d5f52",
    measurementId: "G-24L2KFMKBK"
  };

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Esporta Firestore
export const db = getFirestore(app);
