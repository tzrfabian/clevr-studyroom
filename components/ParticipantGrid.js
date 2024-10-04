import React from 'react';
import { useParticipants } from '../hooks/useParticipants';

function ParticipantTile({ participant }) {
  return (
    <div className="relative w-full h-full">
      <video
        autoPlay
        muted={participant.local}
        playsInline
        ref={el => {
          if (el) {
            el.srcObject = participant.videoTrack && new MediaStream([participant.videoTrack]);
          }
        }}
        className="w-full h-full object-cover rounded-lg"
      />
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
        {participant.user_name || 'Guest'}
      </div>
    </div>
  );
}

export default function ParticipantGrid() {
  const { participants } = useParticipants();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {participants.map(participant => (
        <ParticipantTile key={participant.session_id} participant={participant} />
      ))}
    </div>
  );
}