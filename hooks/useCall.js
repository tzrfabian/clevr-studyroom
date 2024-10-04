import { useDaily, useLocalParticipant } from '@daily-co/daily-react-hooks';
import { useState, useCallback, useEffect } from 'react';
import { useParticipants } from './useParticipants';

export function useCall() {
  const daily = useDaily();
  const { participants, participantCount } = useParticipants();
  const localParticipant = useLocalParticipant();
  const [isLoading, setIsLoading] = useState(true);

  const leaveCall = useCallback(() => {
    daily.leave();
  }, [daily]);

  const toggleLocalAudio = useCallback(() => {
    daily.setLocalAudio(!localParticipant.audio);
  }, [daily, localParticipant]);

  const toggleLocalVideo = useCallback(() => {
    daily.setLocalVideo(!localParticipant.video);
  }, [daily, localParticipant]);

  useEffect(() => {
    if (daily && participants) {
      setIsLoading(false);
    }
  }, [daily, participants]);

  return {
    isLoading,
    participants,
    participantCount,
    localParticipant,
    leaveCall,
    toggleLocalAudio,
    toggleLocalVideo
  };
}