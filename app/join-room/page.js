'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { database } from '../../lib/firebase';
import { ref, get } from 'firebase/database';
import Link from 'next/link';
import Loader from '@/components/Loader';

export default function JoinRoom() {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!roomId || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const roomRef = ref(database, `rooms/${roomId}`);
      const snapshot = await get(roomRef);
      
      if (snapshot.exists()) {
        const roomData = snapshot.val();
        if (roomData.password === password) {
          router.push(`/room/${roomId}`);
        } else {
          alert('Incorrect password');
        }
      } else {
        alert('Room not found');
      }
      setLoading(false)
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room. Please try again.');
    }
  };

  if(loading) {
    return <Loader/>
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <h1 className="text-4xl font-bold mb-8">Join a Study Room</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <label htmlFor="roomId" className="block mb-2">Room ID</label>
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">Room Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">Join Room</button>
          <Link href={'/dashboard'}>
          <button type="button" className="btn btn-error text-white w-full my-3">Back</button>
          </Link>
        </form>
      </div>
    </ProtectedRoute>
  );
}