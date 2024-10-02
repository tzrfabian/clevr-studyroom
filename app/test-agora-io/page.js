'use client';

import { useState, useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const APP_ID = '15899addaed34a92baa7d085faa6f4d1';  // Ganti dengan App ID dari Agora.io
const TOKEN = '007eJxTYNAVO6rCZ7O/asPHuVdvvNz+U2vShdeccX2zX8Q8ynr/8YmmAoOhqYWlZWJKSmJqirFJoqVRUmKieYqBhWlaYqJZmkmKITPb37SGQEaGF2ENTIwMEAjiczKUpBaX6Bbl5+cyMAAAAiAk/g==';    // Ganti dengan Token dari Agora.io (atau bisa null jika tidak pakai token)
const CHANNEL = 'test-room'; // Ganti dengan Channel Name dari Agora.io

const Meeting = () => {
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState({ videoTrack: null, audioTrack: null });
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const agoraClient = useRef(null);
  const localVideoRef = useRef(null);

  // Function to initialize and join the meeting room
  const joinMeeting = async () => {
    if (typeof window === 'undefined') {
      console.error('Agora SDK requires browser environment');
      return;
    }

    console.log('Joining the meeting...');
    setLoading(true);
    agoraClient.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    try {
      // Log connection details
      console.log('App ID:', APP_ID);
      console.log('Channel:', CHANNEL);
      console.log('Token:', TOKEN);

      // Create audio and video tracks
      const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalTracks({ videoTrack: cameraTrack, audioTrack: microphoneTrack });

      // Join the Agora channel
      await agoraClient.current.join(APP_ID, CHANNEL, TOKEN, null);
      console.log('Successfully joined the channel');

      // Play local video track
      cameraTrack.play(localVideoRef.current);

      // Publish local tracks to the channel
      await agoraClient.current.publish([microphoneTrack, cameraTrack]);
      console.log('Successfully published local tracks');

      agoraClient.current.on('user-published', async (user, mediaType) => {
        console.log('New user published:', user.uid);
        await agoraClient.current.subscribe(user, mediaType);
        if (mediaType === 'video') {
          const remoteVideoTrack = user.videoTrack;
          setUsers((prevUsers) => [...prevUsers, { uid: user.uid, track: remoteVideoTrack }]);
        }
      });

      setJoined(true);
    } catch (error) {
      console.error('Error joining the meeting:', error);
    }
    setLoading(false);
  };

  // Function to leave the meeting room
  const leaveMeeting = async () => {
    console.log('Leaving the meeting...');
    if (localTracks.videoTrack) localTracks.videoTrack.stop();
    if (localTracks.audioTrack) localTracks.audioTrack.stop();

    if (localTracks.videoTrack) localTracks.videoTrack.close();
    if (localTracks.audioTrack) localTracks.audioTrack.close();

    await agoraClient.current.leave();
    setJoined(false);
    setUsers([]);
    setLocalTracks({ videoTrack: null, audioTrack: null });
    console.log('Left the meeting');
  };

  // Toggle camera on/off
  const toggleCamera = async () => {
    if (localTracks.videoTrack) {
      if (isCameraOn) {
        await localTracks.videoTrack.setEnabled(false);  // Matikan kamera
      } else {
        await localTracks.videoTrack.setEnabled(true);   // Nyalakan kamera
      }
      setIsCameraOn(!isCameraOn);
    }
  };

  // Toggle microphone on/off
  const toggleMic = async () => {
    if (localTracks.audioTrack) {
      if (isMicOn) {
        await localTracks.audioTrack.setEnabled(false);  // Matikan mic
      } else {
        await localTracks.audioTrack.setEnabled(true);   // Nyalakan mic
      }
      setIsMicOn(!isMicOn);
    }
  };

  useEffect(() => {
    return () => {
      if (joined) {
        leaveMeeting();
      }
    };
  }, [joined]);

  return (
    <div>
      <h1>Agora Meeting Room</h1>
      {!joined ? (
        <button onClick={joinMeeting} disabled={loading}>
          {loading ? 'Joining...' : 'Join Room'}
        </button>
      ) : (
        <div>
          <button onClick={leaveMeeting}>Leave Room</button>
          <button onClick={toggleCamera}>
            {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
          </button>
          <button onClick={toggleMic}>
            {isMicOn ? 'Turn Off Mic' : 'Turn On Mic'}
          </button>
        </div>
      )}

      <div>
        <h2>Local User</h2>
        <div ref={localVideoRef} style={{ width: '400px', height: '300px', backgroundColor: 'black' }}></div>
      </div>

      <div>
        <h2>Remote Users</h2>
        <div>
          {users.map((user) => (
            <div key={user.uid}>
              <h3>User {user.uid}</h3>
              <div
                style={{ width: '400px', height: '300px', backgroundColor: 'black' }}
                ref={(el) => {
                  if (el && user.track) {
                    user.track.play(el);  // Play video only when the element is available
                  }
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Meeting;
