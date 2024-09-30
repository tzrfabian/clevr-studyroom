'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { database } from '../../../lib/firebase';
import { ref, onValue, set, remove, push, onChildAdded, onChildRemoved } from 'firebase/database';
import { useAppContext } from '../../../lib/AppContext';
import Peer from 'simple-peer';
import DeviceSettings from '../../../components/DeviceSettings';

const MAX_PARTICIPANTS = 10;

export default function Room() {
  const [room, setRoom] = useState(null);
  const [peers, setPeers] = useState({});
  const [participantCount, setParticipantCount] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isScreenShareLoading, setIsScreenShareLoading] = useState(false);
  const [screenSharingStream, setScreenSharingStream] = useState(null);
  const [error, setError] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [devices, setDevices] = useState({ videoinput: [], audioinput: [], audiooutput: [] });
  const [selectedDevices, setSelectedDevices] = useState({ videoinput: '', audioinput: '', audiooutput: '' });
  
  const { user, loading } = useAppContext();
  const params = useParams();
  const router = useRouter();
  const roomId = params.id;
  const userVideo = useRef(null);
  const streamRef = useRef(null);
  const peersRef = useRef({});

  const createPeer = useCallback((peerId, initiator) => {
    const peer = new Peer({
      initiator,
      trickle: false,
      stream: streamRef.current,  
    });

    peer.on('signal', signal => {
      const signalRef = ref(database, `rooms/${roomId}/signals/${peerId}`);
      push(signalRef, { userId: user.uid, signal });
    });

    peer.on('stream', stream => {
      setPeers(prevPeers => ({
        ...prevPeers,
        [peerId]: { ...prevPeers[peerId], stream },
      }));
    });

    return peer;
  }, [roomId, user]);

  const addPeer = useCallback((peerId, peer) => {
    peersRef.current[peerId] = peer;
    setPeers(prevPeers => ({
      ...prevPeers,
      [peerId]: { peer },
    }));
  }, []);

  const removePeer = useCallback((peerId) => {
    if (peersRef.current[peerId]) {
      peersRef.current[peerId].destroy();
      delete peersRef.current[peerId];
    }
    setPeers(prevPeers => {
      const newPeers = { ...prevPeers };
      delete newPeers[peerId];
      return newPeers;
    });
  }, []);

  const setupMediaStream = useCallback(async () => {
    if (userVideo.current) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: selectedDevices.videoinput ? { exact: selectedDevices.videoinput } : undefined },
          audio: { deviceId: selectedDevices.audioinput ? { exact: selectedDevices.audioinput } : undefined }
        });
        
        if (streamRef.current) {
          const oldTracks = streamRef.current.getTracks();
          oldTracks.forEach(track => track.stop());
        }

        streamRef.current = mediaStream;
        userVideo.current.srcObject = mediaStream;

        if (user && roomId) {
          const myUserRef = ref(database, `rooms/${roomId}/users/${user.uid}`);
          await set(myUserRef, { uid: user.uid, audio: true, video: true });
        }

        setError(null);
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setError(`Failed to access camera or microphone: ${error.message}`);
      }
    } else {
      setError('Video element not found. Please wait a moment and try again.');
    }
  }, [user, roomId, selectedDevices]);

  const changeDevice = async (kind, deviceId) => {
    setSelectedDevices(prev => ({ ...prev, [kind]: deviceId }));
    const constraints = {
      [kind === 'videoinput' ? 'video' : 'audio']: { deviceId: { exact: deviceId } }
    };

    try {
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      const newTrack = newStream.getTracks()[0];
      const oldTrack = streamRef.current.getTracks().find(track => track.kind === newTrack.kind);

      if (oldTrack) {
        streamRef.current.removeTrack(oldTrack);
        oldTrack.stop(); 
      }

      streamRef.current.addTrack(newTrack);
      userVideo.current.srcObject = streamRef.current;

      Object.values(peersRef.current).forEach(peer => {
        peer.replaceTrack(oldTrack, newTrack, streamRef.current);
      });
    } catch (error) {
      console.error('Error changing device:', error);
      setError('Failed to change device. Please try again.');
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const roomRef = ref(database, `rooms/${roomId}`);
    const usersRef = ref(database, `rooms/${roomId}/users`);
    const signalsRef = ref(database, `rooms/${roomId}/signals/${user.uid}`);

    const roomListener = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        setRoom(snapshot.val());
      } else {
        console.log('No such room!');
        router.push('/dashboard');
      }
    });

    const userJoinedListener = onChildAdded(usersRef, (snapshot) => {
      const userId = snapshot.key;
      setParticipantCount(prevCount => {
        const newCount = prevCount + 1;
        if (newCount > MAX_PARTICIPANTS) {
          setError('Maximum number of participants reached.');
          return prevCount;
        }
        if (userId !== user.uid) {
          const peer = createPeer(userId, true);
          addPeer(userId, peer);
        }
        return newCount;
      });
    });

    const userLeftListener = onChildRemoved(usersRef, (snapshot) => {
      const userId = snapshot.key;
      removePeer(userId);
      setParticipantCount(prevCount => prevCount - 1);
    });

    const signalListener = onChildAdded(signalsRef, (snapshot) => {
      const data = snapshot.val();
      if (data.userId !== user.uid) {
        const peer = peersRef.current[data.userId];
        if (peer) {
          peer.signal(data.signal);
        }
      }
    });

    const timeoutId = setTimeout(() => {
      setupMediaStream();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      roomListener();
      userJoinedListener();
      userLeftListener();
      signalListener();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenSharingStream) {
        screenSharingStream.getTracks().forEach(track => track.stop());
      }
      Object.values(peersRef.current).forEach(peer => peer.destroy());
      if (user && roomId) {
        remove(ref(database, `rooms/${roomId}/users/${user.uid}`));
      }
    };
  }, [roomId, user, router, loading, setupMediaStream, createPeer, addPeer, removePeer, screenSharingStream]);

  const toggleAudio = useCallback(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
        if (user && roomId) {
          const myUserRef = ref(database, `rooms/${roomId}/users/${user.uid}`);
          set(myUserRef, { uid: user.uid, audio: audioTrack.enabled, video: streamRef.current.getVideoTracks()[0]?.enabled });
        }
      }
    }
  }, [user, roomId]);

  const toggleVideo = useCallback(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        if (user && roomId) {
          const myUserRef = ref(database, `rooms/${roomId}/users/${user.uid}`);
          set(myUserRef, { uid: user.uid, audio: streamRef.current.getAudioTracks()[0]?.enabled, video: videoTrack.enabled });
        }
      }
    }
  }, [user, roomId]);

  const startScreenShare = useCallback(async () => {
    setIsScreenShareLoading(true);
    setError(null);
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      setScreenSharingStream(screenStream);
      setIsScreenSharing(true);

      Object.values(peersRef.current).forEach(peer => {
        peer.addStream(screenStream);
      });

      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

    } catch (error) {
      console.error('Error starting screen share:', error);
      if (error.name === 'NotAllowedError') {
        setError('Screen sharing was cancelled. Please try again.');
      } else {
        setError('Failed to start screen sharing. Please try again.');
      }
    } finally {
      setIsScreenShareLoading(false);
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    if (screenSharingStream) {
      screenSharingStream.getTracks().forEach(track => track.stop());
      setScreenSharingStream(null);
      setIsScreenSharing(false);

      Object.values(peersRef.current).forEach(peer => {
        peer.removeStream(screenSharingStream);
      });
    }
  }, [screenSharingStream]);

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl font-bold p-4">Room: {room ? room.name : 'Loading...'}</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
      <div className="flex-grow grid grid-cols-2 gap-4 p-4 relative">
        {!isScreenSharing && (
          <>
            <div className="relative">
              <video
                ref={userVideo}
                autoPlay
                muted
                playsInline
                className="w-full h-auto"
              />
              <p className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2">You</p>
            </div>
            {Object.entries(peers).map(([peerId, { stream }]) => (
              <div key={peerId} className="relative">
                <video
                  autoPlay
                  playsInline
                  className="w-full h-auto"
                  ref={video => {
                    if (video) {
                      video.srcObject = stream;
                    }
                  }}
                />
                <p className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2">Peer</p>
              </div>
            ))}
          </>
        )}
        {isScreenSharing && screenSharingStream && (
          <>
            <div className="relative col-span-2">
              <video
                autoPlay
                playsInline
                className="w-full h-auto"
                ref={video => {
                  if (video) {
                    video.srcObject = screenSharingStream;
                  }
                }}
              />
              <p className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2">Screen Share</p>
            </div>
            <div className="absolute bottom-4 right-4 w-40 h-30">
              <video
                ref={userVideo}
                autoPlay
                muted
                playsInline
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </>
        )}
      </div>
      <div className="p-4 space-x-4">
        <button
          onClick={toggleAudio}
          className={`btn ${isAudioMuted ? 'btn-error' : 'btn-primary'}`}
        >
          {isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
        </button>
        <button
          onClick={toggleVideo}
          className={`btn ${isVideoOff ? 'btn-error' : 'btn-primary'}`}
        >
          {isVideoOff ? 'Turn On Video' : 'Turn Off Video'}
        </button>
        <button
          onClick={isScreenSharing ? stopScreenShare : startScreenShare}
          className={`btn ${isScreenSharing ? 'btn-error' : 'btn-secondary'}`}
          disabled={isScreenShareLoading}
        >
          {isScreenShareLoading ? 'Setting up...' : isScreenSharing ? 'Stop Screen Share' : 'Start Screen Share'}
        </button>
        <button onClick={() => setIsSettingsOpen(true)} className="btn btn-secondary">
          Settings
        </button>
      </div>
      <DeviceSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        devices={devices}
        selectedDevices={selectedDevices}
        onDeviceChange={changeDevice}
        stream={streamRef.current}
        testAudioUrl="" // fix this. should find path to firebase database. 
      />
    </div>
  );
}



