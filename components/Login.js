import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import GoogleButton from 'react-google-button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const signIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={signIn} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Sign In
          </button>
        </form>
        <div className="mt-4">
          <GoogleButton onClick={signInWithGoogle} />
        </div>
        <p className="mt-4 text-center">
          Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;