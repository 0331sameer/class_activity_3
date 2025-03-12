import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
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

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError(""); // Reset error state
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      alert("Signup successful! Please log in.");
    } catch (err) {
      console.error("Signup Error:", err); // Logs full error
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: result.user.displayName,
              email: result.user.email,
              password: result.user.uid,
            }),
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Signup failed");
        }
        alert("Signup successful! Please log in.");
      } catch (err) {
        alert("Error signing in with Google:", err);
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-orange-600 text-center mb-4">
          Sign Up
        </h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={handleSignup}
          className="w-full bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600"
        >
          Sign Up
        </button>
        <p className="text-center my-3">OR</p>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-orange-300 text-white p-2 rounded-lg hover:bg-orange-400"
        >
          <FcGoogle className="text-2xl mr-2" /> Sign Up with Google
        </button>
        <p className="text-center mt-4 text-sm">
          Already have an account?
          <Link to="/login" className="text-orange-600 ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
