'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext } from '../../../lib/AppContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import DailyIframe from '@daily-co/daily-js';

export default function Room() {
  const [dailyUrl, setDailyUrl] = useState(null);
  const [error, setError] = useState(null);
  const { user, loading } = useAppContext();
  const params = useParams();
  const router = useRouter();
  const roomId = params.id;

  const createOrJoinRoom = useCallback(async () => {
    try {
      const response = await fetch('/api/daily/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: roomId })
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setDailyUrl(data.url);
    } catch (error) {
      console.error('Error creating/joining Daily room:', error);
      setError(`Failed to create or join room: ${error.message}`);
    }
  }, [roomId]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    createOrJoinRoom();

    return () => {
    };
  }, [user, loading, router, createOrJoinRoom]);

  useEffect(() => {
    if (dailyUrl) {
      const dailyScript = document.createElement('script');
      dailyScript.src = 'https://unpkg.com/@daily-co/daily-js';
      dailyScript.async = true;
      document.body.appendChild(dailyScript);

      dailyScript.onload = () => {
        const callFrame = DailyIframe.createFrame({
          iframeStyle: {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%'
          },
          showLeaveButton: true,
          showFullscreenButton: true,
        });

        callFrame.join({ url: dailyUrl });
      };

      return () => {
        document.body.removeChild(dailyScript);
      };
    }
  }, [dailyUrl]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!dailyUrl) {
    return <div>Setting up room...</div>;
  }

  return (
    <ProtectedRoute>
      <div id="daily-container" style={{ width: '100%', height: '100vh' }}></div>
    </ProtectedRoute>
  );
}