'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { database } from '../../lib/firebase';
import { ref, push, set } from 'firebase/database';
import { useAppContext } from '../../lib/AppContext';
import Link from 'next/link';
import { Bounce, toast } from 'react-toastify';
import Loader from '@/components/Loader';

export default function CreateRoom() {
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [createdRoomId, setCreatedRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!roomName || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/daily/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create room');
      }

      const newRoomRef = push(ref(database, 'rooms'));
      await set(newRoomRef, {
        name: roomName,
        password: password,
        dailyRoomUrl: data.url, 
        createdBy: user.uid,
        createdAt: Date.now(),
      });
      setLoading(false);
      toast.success("Room Created!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setCreatedRoomId(newRoomRef.key);
      console.log(createdRoomId);
      // redirect 
      // router.push(`/room/${newRoomRef.key}`);
    } catch (error) {
      toast.error('Failed to create room. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error('Error creating room:', error);
    }
  };

  if(loading) {
    return <Loader/>
  }

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
          <Link href={'/dashboard'}>
          <button type="button" className="btn btn-error text-white w-full my-3">Back</button>
          </Link>
        </form>
        {createdRoomId && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>Room created successfully!</p>
            <p>Room ID: <strong>{createdRoomId}</strong></p>
            <p>Share this ID with others to let them join your room.</p>
            <p className='mt-2'>Do you want to redirect to your room?</p>
            {/* <Link href={`/room/${createdRoomId}`}> */}
            <button className="btn btn-success text-white w-full my-2" 
            onClick={() => router.push(`/room/${createdRoomId}`)}
            >
              Go to Your Room
            </button>
            {/* </Link> */}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}