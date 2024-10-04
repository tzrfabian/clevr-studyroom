import { useParticipantIds, useLocalParticipant, useParticipant } from '@daily-co/daily-react-hooks';
import { useMemo } from 'react';

export function useParticipants() {
  const participantIds = useParticipantIds();
  const localParticipant = useLocalParticipant();

  const participants = useMemo(() => {
    return participantIds.map(id => useParticipant(id));
  }, [participantIds]);

  const sortedParticipants = useMemo(() => {
    return participants.sort((a, b) => {
      if (a.local) return -1;
      if (b.local) return 1;
      return (a.user_name || '').localeCompare(b.user_name || '');
    });
  }, [participants]);

  const participantCount = participantIds.length;

  return {
    participants: sortedParticipants,
    localParticipant,
    participantCount
  };
}