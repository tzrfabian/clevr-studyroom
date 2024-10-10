import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import Loader from './Loader';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading, error] = useAuthState(auth);

  const signUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  const signIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  const signOut = () => auth.signOut();

  if (loading) {
    return <div><Loader/></div>;
  }

  if (user) {
    return (
      <div>
        <p>Welcome, {user.email}!</p>
        <button onClick={signOut} className="btn btn-primary">Sign Out</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="input input-bordered w-full max-w-xs mt-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="input input-bordered w-full max-w-xs mt-2"
      />
      <button onClick={signUp} className="btn btn-primary mt-2">Sign Up</button>
      <button onClick={signIn} className="btn btn-secondary mt-2">Sign In</button>
    </div>
  );
};

export default Auth;