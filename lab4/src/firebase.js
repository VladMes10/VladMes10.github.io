import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Конфігурація Firebase мого веб-застосунку
const firebaseConfig = {
  apiKey: "AIzaSyB482UWUU3TXQXTDVVRRp-BNds7wAwLcVA",
  authDomain: "hackpoint-lab4.firebaseapp.com",
  projectId: "hackpoint-lab4",
  storageBucket: "hackpoint-lab4.firebasestorage.app",
  messagingSenderId: "999816157771",
  appId: "1:999816157771:web:3737c7e7586103260a4bce"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Експорт сервісів для використання в інших файлах
export const auth = getAuth(app); // Сервіс входу
export const db = getFirestore(app); // Сервіс бази даних