import { useDaily, useScreenShare as useDailyScreenShare } from '@daily-co/daily-react-hooks';
import { useCallback, useState } from 'react';

export function useScreenShare() {
  const daily = useDaily();
  const { isSharingScreen, startScreenShare, stopScreenShare } = useDailyScreenShare();
  const [isScreenShareAllowed, setIsScreenShareAllowed] = useState(true);

  const toggleScreenShare = useCallback(() => {
    if (isSharingScreen) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  }, [isSharingScreen, startScreenShare, stopScreenShare]);

  const setScreenSharePermission = useCallback((allowed) => {
    setIsScreenShareAllowed(allowed);
    daily.updateMeetingSession({ startScreenShare: allowed });
  }, [daily]);

  return {
    isSharingScreen,
    isScreenShareAllowed,
    toggleScreenShare,
    setScreenSharePermission
  };
}