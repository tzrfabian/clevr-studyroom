'use client'
import { useAppContext } from '../../lib/AppContext';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Dashboard() {
  const { user } = useAppContext();

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <h1 className="text-4xl font-bold mb-8">Welcome to your Dashboard</h1>
        <p className="text-xl mb-4">Hello, {user?.email}!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Link href="/create-room" className="btn btn-primary">
            Create a Study Room
          </Link>
          <Link href="/join-room" className="btn btn-secondary">
            Join a Study Room
          </Link>
          <Link href="/my-rooms" className="btn btn-accent">
            My Study Rooms
          </Link>
          <Link href="/profile" className="btn btn-info">
            Edit Profile
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}