import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual key from Firebase Console
  authDomain: "lawntrammer-backend.firebaseapp.com",
  projectId: "lawntrammer-backend",
  storageBucket: "lawntrammer-backend.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize the Firebase App
const app = initializeApp(firebaseConfig);

// Initialize and export specific services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;