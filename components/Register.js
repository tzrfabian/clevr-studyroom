import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import GoogleButton from 'react-google-button';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const signUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  const signUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={signUp} className="space-y-4 w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input input-bordered w-full"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input input-bordered w-full"
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          Sign Up
        </button>
      </form>
      <div className="mt-4 w-full">
        <GoogleButton onClick={signUpWithGoogle} style={{width: '100%'}} />
      </div>
      <p className="mt-4 text-center">
        Already have an account? <a href="/login" className="text-primary hover:underline">Login</a>
      </p>
    </div>
  );
};

export default Register;