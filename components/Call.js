import {
  DailyVideo,
  useActiveSpeakerId,
  useAudioTrack,
  useParticipantProperty,
  useParticipantIds,
} from "@daily-co/daily-react";
import classNames from "classnames";

function Tile({ sessionId, isVideoEnabled}) {
  const activeId = useActiveSpeakerId();
  const username = useParticipantProperty(sessionId, "user_name");
  const audioTrack = useAudioTrack(sessionId);

  return (
    <div className="Tile w-full h-full"> 
      {isVideoEnabled ? (
        <DailyVideo
          key={sessionId}
          automirror
          className={classNames({
            active: activeId === sessionId
          })}
          sessionId={sessionId}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div
          className="flex items-center justify-center bg-black text-white"
          style={{ width: "100%", height: "100%"}} // Full size black screen
        >
        
          <span className="text-lg font-semibold">{username || "Guest"}</span>
        </div>
      )}
    </div>
  );
}

export default function Call({ isVideoEnabled }) {
  const participantIds = useParticipantIds();

  return (
    <div className="Call w-screen h-screen">
      {participantIds.map((id) => (
        <Tile key={id} sessionId={id} isVideoEnabled={isVideoEnabled} />
      ))}
    </div>
  );
}
