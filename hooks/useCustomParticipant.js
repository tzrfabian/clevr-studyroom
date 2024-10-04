import { useState, useEffect } from 'react';
import { useDailyEvent } from '@daily-co/daily-react';

export const useCustomParticipant = () => {
  const [participants, setParticipants] = useState([]);

  useDailyEvent('participant-joined', (event) => {
    console.log('Participant joined:', event.participant);
    setParticipants((prev) => [...prev, event.participant]);
  });

  useDailyEvent('participant-left', (event) => {
    console.log('Participant left:', event.participant);
    setParticipants((prev) =>
      prev.filter((p) => p.session_id !== event.participant.session_id)
    );
  });

  useDailyEvent('participant-updated', (event) => {
    console.log('Participant updated:', event.participant);
    setParticipants((prev) =>
      prev.map((p) =>
        p.session_id === event.participant.session_id
          ? event.participant
          : p
      )
    );
  });

  return participants;
};
