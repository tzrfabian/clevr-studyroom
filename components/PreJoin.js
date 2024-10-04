import React, { useState, useCallback } from 'react';
import { useDaily, useDevices, useLocalParticipant } from '@daily-co/daily-react-hooks';

export default function PreJoin({ onJoin }) {
  const daily = useDaily();
  const { camState, micState, cameras, microphones, setCamera, setMicrophone } = useDevices();
  const localParticipant = useLocalParticipant();
  const [username, setUsername] = useState('');

  const handleJoin = useCallback(() => {
    daily.join({ userName: username });
    onJoin();
  }, [daily, username, onJoin]);

  const toggleAudio = useCallback(() => {
    daily.setLocalAudio(!daily.localAudio());
  }, [daily]);

  const toggleVideo = useCallback(() => {
    daily.setLocalVideo(!daily.localVideo());
  }, [daily]);

  if (!daily) {
    return <div>Initializing call... Please wait.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Join the Call</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="mb-4">
          <button onClick={toggleAudio} className="mr-2 p-2 bg-blue-500 text-white rounded">
            {micState === 'off' ? 'Unmute' : 'Mute'}
          </button>
          <button onClick={toggleVideo} className="p-2 bg-blue-500 text-white rounded">
            {camState === 'off' ? 'Turn on camera' : 'Turn off camera'}
          </button>
        </div>
        <button onClick={handleJoin} className="w-full p-2 bg-green-500 text-white rounded">
          Join Call
        </button>
      </div>
    </div>
  );
}