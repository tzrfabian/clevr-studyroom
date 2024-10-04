'use client';
import { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext } from '../../../lib/AppContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { DailyProvider } from '@daily-co/daily-react';
import { useDaily, useDailyEvent } from '@daily-co/daily-react';
import Call from '../../../components/Call';

function CallWrapper({ onLeave }) {
  const daily = useDaily();
  const [joined, setJoined] = useState(false)

  useDailyEvent('left-meeting', onLeave);
  useDailyEvent('joining-meeting', () => {
    setJoined(true)
    console.log("kamu join")
  })

  useEffect(() => {
    if (daily) {
      console.log(daily)
      daily.join();

    }
  }, [daily]);

  if (!joined) return <p>Your're not join the call</p>

  return <Call />;
}

export default function Room() {
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState(null);
  const { loading } = useAppContext();
  const params = useParams();
  const {user} = useAppContext()
  const router = useRouter();
  const roomId = params.id;

  const createOrJoinRoom = useCallback(async (signal) => {
    try {
      const response = await fetch('/api/daily/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: roomId }),
        signal
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      console.log('Room data received:', data);
      setRoomData(data);
    } catch (error) {
      if (error.name === 'AbortError') return
      console.error('Error creating/joining Daily room:', error);
      setError(`Failed to create or join room: ${error.message}`);
    }
  }, [roomId]);

  useEffect(() => {
    console.log("hooks triggered")

    const controller = new AbortController();
    const signal = controller.signal;
    createOrJoinRoom(signal);

    return () => {
      console.log("abort prev request")
      controller.abort()
    }
  }, [createOrJoinRoom]);

  const handleLeave = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!roomData) {
    return <div>Setting up room...</div>;
  }

  return (
    <ProtectedRoute>
      <DailyProvider url={roomData.url} userName={user.name}>
        <CallWrapper onLeave={handleLeave} />
      </DailyProvider>
    </ProtectedRoute>
  );
}