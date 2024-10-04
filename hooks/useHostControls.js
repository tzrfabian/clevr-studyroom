import { useDaily } from '@daily-co/daily-react-hooks';
import { useCallback, useState, useEffect } from 'react';
import { useParticipants } from './useParticipants';

export function useHostControls() {
  const daily = useDaily();
  const { participants, localParticipant } = useParticipants();
  const [isHost, setIsHost] = useState(false);

  const muteParticipant = useCallback((participantId) => {
    daily.updateParticipant(participantId, { setAudio: false });
  }, [daily]);

  const removeParticipant = useCallback((participantId) => {
    daily.updateParticipant(participantId, { eject: true });
  }, [daily]);

  const setScreenSharingPermission = useCallback((allowed) => {
    daily.updateMeetingSession({ startScreenShare: allowed });
  }, [daily]);

  useEffect(() => {
    setIsHost(localParticipant?.owner ?? false);
  }, [localParticipant]);

  return {
    isHost,
    muteParticipant,
    removeParticipant,
    setScreenSharingPermission
  };
}