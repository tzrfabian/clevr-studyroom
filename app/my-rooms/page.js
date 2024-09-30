'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { database } from '../../lib/firebase';
import { ref, query, orderByChild, equalTo, get, remove } from 'firebase/database';
import { useAppContext } from '../../lib/AppContext';

export default function MyRooms() {
  const [rooms, setRooms] = useState([]);
  const router = useRouter();
  const { user } = useAppContext();

  const fetchRooms = async () => {
    if (user) {
      const roomsRef = ref(database, 'rooms');
      const userRoomsQuery = query(roomsRef, orderByChild('createdBy'), equalTo(user.uid));
      
      try {
        const snapshot = await get(userRoomsQuery);
        if (snapshot.exists()) {
          const roomsData = snapshot.val();
          const roomsList = Object.entries(roomsData).map(([id, room]) => ({
            id,
            ...room
          }));
          setRooms(roomsList);
        } else {
          setRooms([]);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [user]);

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const roomRef = ref(database, `rooms/${roomId}`);
        await remove(roomRef);
        alert('Room deleted successfully');
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Failed to delete room. Please try again.');
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <h1 className="text-4xl font-bold mb-8">My Study Rooms</h1>
        {rooms.length > 0 ? (
          <ul className="w-full max-w-md">
            {rooms.map((room) => (
              <li key={room.id} className="mb-4 p-4 border rounded">
                <h2 className="text-xl font-semibold">{room.name}</h2>
                <p>Created: {new Date(room.createdAt).toLocaleString()}</p>
                <p>Room ID: {room.id}</p>
                <div className="mt-2 flex justify-between">
                  <button 
                    onClick={() => router.push(`/room/${room.id}`)}
                    className="btn btn-primary"
                  >
                    Enter Room
                  </button>
                  <button 
                    onClick={() => handleDeleteRoom(room.id)}
                    className="btn btn-error"
                  >
                    Delete Room
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't created any rooms yet.</p>
        )}
      </div>
    </ProtectedRoute>
  );
}