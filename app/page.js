"use client";
import { useAppContext } from "../lib/AppContext";

export default function Home() {
  const { user, loading } = useAppContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-r from-blue-400 to-purple-600 text-white p-8">
      <h1 className="text-5xl font-bold mb-6 transform transition-transform duration-700 hover:scale-110 animate-bounce">
        Welcome to Clevr
      </h1>
      <p className="text-2xl mb-4 transition-opacity duration-500 hover:opacity-80 animate-fade-in-delayed">
        {user
          ? `Hello, ${user.email}!`
          : "Please log in or register to get started."}
      </p>
    </div>
  );
}
