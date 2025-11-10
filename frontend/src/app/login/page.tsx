"use client";

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function LoginPage() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to home page
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // User will be redirected by onAuthStateChanged listener
    } catch (error) {
      console.error("Error during Google login:", error);
      setError("Failed to login with Google. Please try again.");
      // Handle errors here, e.g., display a message to the user
    }
  };

  return (
    <div className="login-page">
      {error && <p className="error-message">{error}</p>}
      <button
        onClick={handleGoogleLogin}
        className="login-button"
      >
        <img
          src="/globe.svg" // Assuming you have a Google icon in your public folder
          alt="Google logo"
        />
        Login with Google
      </button>
    </div>
  );
}
