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
    <div className="Tile flex items-center justify-center w-full h-full p-4">
      {userVideo !== "playable" ? (
        <div className="flex flex-col items-center justify-center bg-black text-white w-full h-full p-6 rounded-lg">
          <img
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg"
            src={userPhoto}
            alt="User Avatar"
          />
          <span className="text-lg font-semibold mt-4">
            {username || user?.displayName}
          </span>
        </div>
      ) : (
        <DailyVideo
          key={sessionId}
          automirror
          className={classNames({ active: activeId === sessionId })}
          sessionId={sessionId}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
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