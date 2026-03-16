import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAqBIqFt3AKBavzVNr-VS9AlS7drPXXfcg",
    authDomain: "kall-e4441.firebaseapp.com",
    databaseURL: "https://kall-e4441-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kall-e4441",
    storageBucket: "kall-e4441.firebasestorage.app",
    messagingSenderId: "232976172726",
    appId: "1:232976172726:web:3cd3f6338a4ec52ba58817",
    measurementId: "G-YQBDKK616N"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };