'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { database } from '../../lib/firebase';
import { ref, push, set } from 'firebase/database';
import { useAppContext } from '../../lib/AppContext';

export default function CreateRoom() {
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [createdRoomId, setCreatedRoomId] = useState('');
  const router = useRouter();
  const { user } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomName || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const newRoomRef = push(ref(database, 'rooms'));
      await set(newRoomRef, {
        name: roomName,
        password: password,
        createdBy: user.uid,
        createdAt: Date.now()
      });
      setCreatedRoomId(newRoomRef.key);
      // redirect 
      // router.push(`/room/${newRoomRef.key}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <h1 className="text-4xl font-bold mb-8">Create a Study Room</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <label htmlFor="roomName" className="block mb-2">Room Name</label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
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
          <button type="submit" className="btn btn-primary w-full">Create Room</button>
        </form>
        {createdRoomId && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>Room created successfully!</p>
            <p>Room ID: <strong>{createdRoomId}</strong></p>
            <p>Share this ID with others to let them join your room.</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}