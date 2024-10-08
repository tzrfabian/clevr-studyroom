"use client";
import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "../../../lib/AppContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { DailyAudio, DailyProvider, useDaily, useDailyEvent, useScreenShare } from "@daily-co/daily-react";
import Call from "../../../components/Call";
import Controls from "@/components/Controls";
import Chat from "@/components/Chat";
import Loader from "@/components/Loader";


function CallWrapper({ onLeave }) {
  const daily = useDaily();
  const [joined, setJoined] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const { isSharingScreen, startScreenShare, stopScreenShare } = useScreenShare();
  const [hasShareScreen, setHasShareScreen] = useState(false);
  const params = useParams();
  const roomId = params.id;
  // console.log(roomId, "INI ROOM ID");

  useDailyEvent("left-meeting", onLeave);
  useDailyEvent("joining-meeting", () => setJoined(true));

  useEffect(() => {
    if (daily) {
      daily.join();
    }

    return () => {
      if (daily) {
        daily.leave();
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
      alert("Screen sharing is currently in use by another participant.");
      return;
    }

    if (isSharingScreen) {
      await stopScreenShare();
    } else {
      await startScreenShare();
    }
  }, [isSharingScreen, startScreenShare, stopScreenShare, hasShareScreen]);

  if (!joined) return <p>Joining the call...</p>;

  return (
    <div className="h-screen flex flex-col justify-between items-center">
      <div className="flex-grow w-full flex justify-center items-center gap-6">
        <Call isVideoEnabled={isVideoEnabled} />
        {showChat && <Chat roomId={roomId} />}
      </div>
      <div className="p-4 w-full flex justify-center">
        <Controls
          onLeave={onLeave}
          onToggleAudio={handleToggleAudio}
          onToggleVideo={handleToggleVideo}
          onChatToggle={handleChatToggle}
          onScreenShare={handleScreenShareToggle}
          isScreenSharing={isSharingScreen}
          isScreenShareAllowed={true}
          onWhiteboardToggle={() => console.log("Whiteboard toggled")}
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

  const handleLeave = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  if (loading) return <div><Loader/></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!roomData) return <div>Setting up room...</div>;

  return (
    <ProtectedRoute>
      <DailyProvider url={roomData.url} userName={user.displayName} userData={{photo_url: user.photoURL}}>
        <CallWrapper onLeave={handleLeave} />
        <DailyAudio/>
      </DailyProvider>
    </ProtectedRoute>
  );
}