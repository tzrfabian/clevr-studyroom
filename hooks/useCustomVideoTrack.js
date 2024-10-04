import { useState, useEffect } from 'react';
import { useDailyEvent } from '@daily-co/daily-react';

export const useCustomVideoTrack = (participantId) => {
  const [videoTrack, setVideoTrack] = useState(null);

  useDailyEvent('track-started', (event) => {
    if (event.participant.session_id === participantId && event.track.kind === 'video') {
      console.log('Video track started:', event.track);
      setVideoTrack(event.track);
    }
  });

  useDailyEvent('track-stopped', (event) => {
    if (event.participant.session_id === participantId && event.track.kind === 'video') {
      console.log('Video track stopped:', event.track);
      setVideoTrack(null);
    }
  });

  return videoTrack;
};
