import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLJo1a89I7Ip2_cvyAhM9ytccOLb6RqI0",
  authDomain: "lawntrammer-backend.firebaseapp.com",
  projectId: "lawntrammer-backend",
  storageBucket: "lawntrammer-backend.firebasestorage.app",
  messagingSenderId: "1042588742889",
  appId: "1:1042588742889:web:7bdf94849fd2b46af16c78",
  measurementId: "G-MP7CKNEC2Y"
};

// Initialize the Firebase App
const app = initializeApp(firebaseConfig);

// Initialize and export specific services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;