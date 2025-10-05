// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRGI__MvK_cqsR89_r3Qp3mb6LshRun3c",
  authDomain: "legacy-3cbf3.firebaseapp.com",
  projectId: "legacy-3cbf3",
  storageBucket: "legacy-3cbf3.firebasestorage.app",
  messagingSenderId: "464872189077",
  appId: "1:464872189077:web:b4827cb0815cbe87e4bf9c",
  measurementId: "G-KQJ5W3W2QK"
};

// Initialize Firebase with error handling
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let analytics: any = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Initialize Analytics (only in browser)
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

export { auth, db, storage, analytics };
export default app;
