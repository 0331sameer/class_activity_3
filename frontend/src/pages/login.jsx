import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { BrowserRouter as Routes, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log("Login Response:", data); // Debugging
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      alert("Login successful!");
    } catch (err) {
      alert("Error logging in:", err);
    }
    setEmail("");
    setPassword("");
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      try {
        const response = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: result.user.email,
            password: result.user.uid,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }
        alert("Login successful!");
      } catch (err) {
        alert("Error logging in with Google:", err);
      }
    } catch (error) {
      alert("Error signing in with Google:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-orange-600 text-center mb-4">
          Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600"
        >
          Login
        </button>
        <p className="text-center my-3">OR</p>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-orange-300 text-white p-2 rounded-lg hover:bg-orange-400"
        >
          <FcGoogle className="text-2xl mr-2" /> Login with Google
        </button>
        <p className="text-center mt-4 text-sm">
          Don't have an account?
          <Link to="/signup" className="text-orange-600 ml-1">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
