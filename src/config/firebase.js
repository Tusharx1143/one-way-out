import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLi0DispQ1JNNyAn5-Yrc6Pwoisw60dRc",
  authDomain: "one-way-out-d3cf3.firebaseapp.com",
  projectId: "one-way-out-d3cf3",
  storageBucket: "one-way-out-d3cf3.firebasestorage.app",
  messagingSenderId: "33088827867",
  appId: "1:33088827867:web:daafe66e975dad4c4e37fe"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
