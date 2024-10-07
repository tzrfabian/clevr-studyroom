import { useAppContext } from "@/lib/AppContext";
import {
  DailyVideo,
  useActiveSpeakerId,
  useParticipantProperty,
  useParticipantIds,
  useScreenShare,
  useDailyEvent,
} from "@daily-co/daily-react";
import classNames from "classnames";
import { useState } from "react";

function Tile({ sessionId }) {
  const { user } = useAppContext();
  const activeId = useActiveSpeakerId();
  const username = useParticipantProperty(sessionId, "user_name");
  const userVideo = useParticipantProperty(sessionId, "tracks.video.state");
  const userPhoto = useParticipantProperty(sessionId, "userData.photo_url")
  
  console.log(username, userVideo, "<<<<<<<<<<<<<<<<<<<<<");
  return (
    <div className="Tile flex items-center justify-center">
      {userVideo !== "playable" ? (
        <div
          className="flex flex-col items-center justify-center bg-black text-white w-80 h-40"
        >
          <img
            className="w-40 h-40 rounded-full"
            src={userPhoto}
            alt="pic"
          />
          <span className="text-lg font-semibold my-3">
            {username || user?.displayName}
          </span>
        </div>
      ) : (
        <DailyVideo
          key={sessionId}
          automirror
          className={classNames({ active: activeId === sessionId })}
          sessionId={sessionId}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>
  );
}

export default function Call({ isVideoEnabled }) {
  const participantIds = useParticipantIds();
  const { screens } = useScreenShare();

  const numParticipants = participantIds.length;
  const hasShareScreen = screens.length > 0
  const numCols = hasShareScreen ? 1 :  Math.min(2, numParticipants + (screens.length > 0 ? 1 : 0));
  const numRows = hasShareScreen ? numParticipants : Math.ceil((numParticipants + (screens.length > 0 ? 1 : 0)) / numCols);


  return (
    <>
    
    {screens.map((screen) => (
        <DailyVideo key={screen.screenId} sessionId={screen.session_id} type="screenVideo" />
      ))}
      
    <div
      className="Call flex justify-center items-center h-full"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, 1fr)`,
        gridTemplateRows: `repeat(${numRows}, 1fr)`,
        gap: "10px",
        padding: "20px",
        width: "100%",
        height: "100%",
      }}
    >

      {participantIds.map((id) => (
        <Tile key={id} sessionId={id} isVideoEnabled={isVideoEnabled} />
      ))}
    </div>
    </>
  );
}