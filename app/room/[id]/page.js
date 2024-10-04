"use client";
import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "../../../lib/AppContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { DailyProvider } from "@daily-co/daily-react";
import { useDaily, useDailyEvent } from "@daily-co/daily-react";
import Call from "../../../components/Call";
import Controls from "@/components/Controls";

function CallWrapper({ onLeave }) {
  const daily = useDaily();
  const [joined, setJoined] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useDailyEvent("left-meeting", onLeave);
  useDailyEvent("joining-meeting", () => {
    setJoined(true);
    console.log("You joined the call");
  });

  useEffect(() => {
    if (daily) {
      console.log(daily);
      daily.join();
    }
  }, [daily]);

  // Toggle Audio
  const handleToggleAudio = useCallback(() => {
    if (daily) {
      daily.setLocalAudio(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  }, [daily, isAudioEnabled]);

  // Toggle Video
  const handleToggleVideo = useCallback(() => {
    if (daily) {
      daily.setLocalVideo(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  }, [daily, isVideoEnabled]);

  // Toggle Screen Share
  const handleScreenShareToggle = useCallback(() => {
    if (daily && !isScreenSharing) {
      daily.startScreenShare();
      setIsScreenSharing(true);
    } else if (daily && isScreenSharing) {
      daily.stopScreenShare();
      setIsScreenSharing(false);
    }
  }, [daily, isScreenSharing]);

  if (!joined) return <p>Your're not join the call</p>;

  return (
    <div className="h-screen flex flex-col justify-between">
      {" "}
      <div className="flex-grow">
        <Call isVideoEnabled={isVideoEnabled} />
      </div>
      <div className="p-4 bg-gray-800">
        <Controls
          onLeave={onLeave}
          onToggleAudio={handleToggleAudio}
          onToggleVideo={handleToggleVideo}
          onChatToggle={() => console.log("Chat toggled")}
          onScreenShare={handleScreenShareToggle}
          isScreenSharing={isScreenSharing}
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
        if (data.error) {
          throw new Error(data.error);
        }
        console.log("Room data received:", data);
        setRoomData(data);
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Error creating/joining Daily room:", error);
        setError(`Failed to create or join room: ${error.message}`);
      }
    },
    [roomId]
  );

  useEffect(() => {
    console.log("hooks triggered");

    const controller = new AbortController();
    const signal = controller.signal;
    createOrJoinRoom(signal);

    return () => {
      console.log("abort prev request");
      controller.abort();
    };
  }, [createOrJoinRoom]);

  const handleLeave = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!roomData) {
    return <div>Setting up room...</div>;
  }

  return (
    <ProtectedRoute>
      <DailyProvider url={roomData.url} userName={user.name}>
        <CallWrapper onLeave={handleLeave} />
      </DailyProvider>
    </ProtectedRoute>
  );
}
