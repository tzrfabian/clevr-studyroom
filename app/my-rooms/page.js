'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { database } from '../../lib/firebase';
import { ref, query, orderByChild, equalTo, get, remove } from 'firebase/database';
import { useAppContext } from '../../lib/AppContext';
import Swal from 'sweetalert2';
import { Bounce, toast } from 'react-toastify';

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
      try {
        const result = await Swal.fire({
          title: 'Are you sure you want to delete this room?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText : 'Delete!',
        });
        if(result.isConfirmed) {
          const roomRef = ref(database, `rooms/${roomId}`);
          await remove(roomRef);
          toast.success('Delete room success!', {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          fetchRooms();
        }
      } catch (error) {
        console.error('Error deleting room:', error);
        toast.error('Failed to delete room. Please try again.');
      }
    
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-light-background dark:bg-dark-background transition-colors duration-500">
        <h1 className="text-5xl font-extrabold mb-8 text-light-text dark:text-dark-text transition-colors duration-500">
          My Study Rooms
        </h1>
  
        {rooms.length > 0 ? (
          <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl">
            {rooms.map((room) => (
              <li
                key={room.id}
                className="group relative p-6 bg-white dark:bg-gray-700 shadow-xl rounded-lg transition-colors duration-500 transform hover:scale-105 hover:shadow-2xl"
              >
                {/* Room Name */}
                <h2 className="text-2xl font-bold text-black dark:text-white mb-2 transition-colors duration-500">
                  {room.name}
                </h2>
                
                {/* Room Details */}
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Created: {new Date(room.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Room ID: {room.id}
                </p>
  
                {/* Action Buttons */}
                <div className="mt-4 flex justify-between space-x-4">
                  <button
                    onClick={() => router.push(`/room/${room.id}`)}
                    className="relative z-10 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500"
                  >
                    Enter Room
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="relative z-10 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-500"
                  >
                    Delete Room
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xl text-gray-600 dark:text-gray-300">
            You haven't created any rooms yet.
          </p>
        )}
      </div>
    </ProtectedRoute>
  );
  
  
  
  

  
}