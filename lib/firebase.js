// lib/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// ------------------------------------------------------------------
// PASTE YOUR REAL VALUES FROM FIREBASE CONSOLE BELOW
// ------------------------------------------------------------------
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbec8Y7rh8eyIi9V5KF1oZ6Nv4qwL64l0",
  authDomain: "indomitum.firebaseapp.com",
  projectId: "indomitum",
  storageBucket: "indomitum.firebasestorage.app",
  messagingSenderId: "1017219023687",
  appId: "1:1017219023687:web:d51b5df99f54d1cab68262",
  measurementId: "G-ENPS22N714"
};

// Initialize App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

// Initialize Analytics Safely (Only runs in the browser)
let analytics;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

export { auth, firestore, analytics };