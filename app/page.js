'use client'
import { useAppContext } from '../lib/AppContext';

export default function Home() {
  const { user, loading } = useAppContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-8">Welcome to Clevr</h1>
      <p className="text-xl mb-4">
        {user ? `Hello, ${user.email}!` : 'Please log in or register to get started.'}
      </p>
    </div>
  );
}