import React, { useState } from "react";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import GoogleButton from "react-google-button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const signIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-8 bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={signIn} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200 transform hover:translate-y-1"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 flex justify-center">
          <GoogleButton
            onClick={signInWithGoogle}
            className="transform hover:scale-105 transition duration-200"
          />
        </div>
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline transition duration-200"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
