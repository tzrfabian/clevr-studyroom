'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [theme, setTheme] = useState('light');
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, user, loading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}