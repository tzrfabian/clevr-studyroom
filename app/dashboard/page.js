"use client";
import { useAppContext } from "../../lib/AppContext";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function Dashboard() {
  const { user } = useAppContext();

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
        <div className="bg-white text-gray-800 rounded-lg shadow-lg p-8 max-w-lg w-full text-center transition-all duration-300 transform hover:scale-105">
          <h1 className="text-4xl font-bold mb-4 transition-transform duration-500 ease-in-out hover:text-blue-500">
            Welcome to your Dashboard
          </h1>
          <p className="text-xl mb-6 transition-opacity duration-700 ease-in-out hover:opacity-80">
            Hello, {user?.email}!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/create-room"
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-5 rounded-lg shadow-md transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
            >
              Create a Study Room
            </Link>

            <Link
              href="/join-room"
              className="btn bg-teal-500 hover:bg-teal-600 text-white py-3 px-5 rounded-lg shadow-md transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
            >
              Join a Study Room
            </Link>

            <Link
              href="/my-rooms"
              className="btn bg-pink-500 hover:bg-pink-600 text-white py-3 px-5 rounded-lg shadow-md transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
            >
              My Study Rooms
            </Link>

            <Link
              href="/profile"
              className="btn bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-5 rounded-lg shadow-md transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
