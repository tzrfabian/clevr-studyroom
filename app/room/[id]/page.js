"use client";
import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "../../../lib/AppContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { DailyAudio, DailyProvider, useDaily, useDailyEvent, useScreenShare, useLocalParticipant } from "@daily-co/daily-react";
import Call from "../../../components/Call";
import Controls from "@/components/Controls";
import Chat from "@/components/Chat";
import Loader from "@/components/Loader";
import { Bounce, toast } from "react-toastify";
import Whiteboard from "@/components/Whiteboard";


function CallWrapper({ }) {
  const daily = useDaily();
  const localParticipant = useLocalParticipant();
  const [joined, setJoined] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const { isSharingScreen, startScreenShare, stopScreenShare } = useScreenShare();
  const [hasShareScreen, setHasShareScreen] = useState(false);
  const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
  const [whiteboardOwnerId, setWhiteboardOwnerId] = useState(null);
  const params = useParams();
  const roomId = params.id;
  const router = useRouter();
  // console.log(roomId, "INI ROOM ID");
  const handleLeave = useCallback(async () => {
    if(daily) {
      await daily.leave();
    }
    // console.log(ev, " <<<< EVENT");
    router.push("/dashboard");
  }, [router, daily]);
  // useDailyEvent("left-meeting", handleLeave);
  useDailyEvent("joining-meeting", () => setJoined(true));

  useEffect(() => {
    if (daily) {
      daily.join().then(() => {
        toast.success("You are Joined the Room!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }).catch((err) => {
        toast.error(err.errorMsg)
        // console.log(err, "ERROR JOINING ROOM");
      });
    }

    return async () => {
      if (daily) {
        await daily.leave();
      }
    };
  }, [daily]);


    useDailyEvent("participant-updated", (event) => {
      if (event?.participant?.screen) {
        setHasShareScreen(true);
      } else {
        setHasShareScreen(false);
      }
    });


  const handleChatToggle = useCallback(() => {
    console.log("toggle chat showed");
    setShowChat((prev) => !prev);
  }, []);

  const handleToggleAudio = useCallback(() => {
    if (daily) {
      daily.setLocalAudio(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  }, [daily, isAudioEnabled]);

  const handleToggleVideo = useCallback(() => {
    if (daily) {
      daily.setLocalVideo(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  }, [daily, isVideoEnabled]);

  const handleScreenShareToggle = useCallback(async () => {
    if (hasShareScreen && !isSharingScreen) {
      toast.error("Screen sharing is currently in use by another participant.");
      return;
    }

    if (isSharingScreen) {
      await stopScreenShare();
    } else {
      await startScreenShare();
    }

    // if (isSharingScreen || isWhiteboardActive) {
    //   // await stopScreenShare();
    //   //setIsWhiteboardActive(false);
    //  // setWhiteboardOwnerId(null);
    //   // daily.sendAppMessage({ type: 'stop-whiteboard' }, '*');
    // } else {
    // }
    // await startScreenShare();
  }, [isSharingScreen, isWhiteboardActive, startScreenShare, stopScreenShare, hasShareScreen, daily]);

  const handleWhiteboardToggle = useCallback(async () => {
    setIsWhiteboardActive(true);
    
  
    await startScreenShare({
      displayMediaOptions: {
        selfBrowserSurface : 'include'
      }
    });
  
    //  return
    if (!localParticipant) return;
  
      if (isWhiteboardActive && whiteboardOwnerId === localParticipant.session_id) {
        setIsWhiteboardActive(false);
        setWhiteboardOwnerId(null);
       // daily.sendAppMessage({ type: 'stop-whiteboard' }, '*');
      } else if (!isWhiteboardActive && !isSharingScreen) {
        setWhiteboardOwnerId(localParticipant.session_id);
        // daily.sendAppMessage({ type: 'start-whiteboard', ownerId: localParticipant.session_id }, '*');
      }
    }, [isWhiteboardActive, isSharingScreen, daily, localParticipant, whiteboardOwnerId]);

  if (!joined) return <p>Joining the call...</p>;

  return (
    <div className="h-screen flex flex-col justify-between items-center">
      <div className="flex-grow w-full flex justify-center items-center gap-6">
      {isWhiteboardActive ? (
          <Whiteboard 
            isOwner={localParticipant && whiteboardOwnerId === localParticipant.session_id}
            daily={daily}
          />
        ) : (
          <Call isVideoEnabled={isVideoEnabled} />
        )}
        {showChat && <Chat roomId={roomId} />}
      </div>
      <div className="p-4 w-full flex justify-center">
        <Controls
          onLeave={handleLeave}
          onToggleAudio={handleToggleAudio}
          onToggleVideo={handleToggleVideo}
          onChatToggle={handleChatToggle}
          onScreenShare={handleScreenShareToggle}
          isScreenSharing={isSharingScreen}
          isScreenShareAllowed={true}
          onWhiteboardToggle={handleWhiteboardToggle}
          isWhiteboardActive={isWhiteboardActive}
          isWhiteboardAllowed={true}
          isWhiteboardOwner={localParticipant && whiteboardOwnerId === localParticipant.session_id}
          isHost={true}
        />
      </div>
    </div>
  );
}

export default function Room() {
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState(null);
  const { loading } = useAppContext();
  const params = useParams();
  const { user } = useAppContext();
  const router = useRouter();
  const roomId = params.id;

  const createOrJoinRoom = useCallback(
    async (signal) => {
      try {
        const response = await fetch("/api/daily/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName: roomId }),
          signal,
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);

        console.log("Room data received:", data);
        setRoomData(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error creating/joining Daily room:", error);
          setError(`Failed to create or join room: ${error.message}`);
        }
      }
    },
    [roomId]
  );

  useEffect(() => {
    console.log("hooks triggered");
    const controller = new AbortController();
    const signal = controller.signal;
    createOrJoinRoom(signal);

    return () => controller.abort();
  }, [createOrJoinRoom]);

  

  if (loading) return <div><Loader/></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!roomData) return <div>Setting up room...</div>;

  return (
    <ProtectedRoute>
      <DailyProvider url={roomData.url} userName={user.displayName} userData={{photo_url: user.photoURL}}>
        <CallWrapper  />
        <DailyAudio/>
      </DailyProvider>
    </ProtectedRoute>
  );
}