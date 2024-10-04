import { useAppContext } from "@/lib/AppContext";
import {
  DailyVideo,
  useActiveSpeakerId,
  useAudioTrack,
  useParticipantProperty,
  useParticipantIds,
  useLocalSessionId,
} from "@daily-co/daily-react";
import classNames from "classnames";

function Tile({ sessionId}) {
  const {user} = useAppContext();
  const activeId = useActiveSpeakerId();
  const username = useParticipantProperty(sessionId, "user_name");
  const userVideo = useParticipantProperty(sessionId, 'tracks.video.state')

  console.log(userVideo, "<<< ", sessionId)
  const audioTrack = useAudioTrack(sessionId);

  console.log({ sessionId, username })

  return (
    <div className="Tile w-full h-full"> 
      {userVideo === 'off' ? (
        
        <div
          className="flex flex-col items-center justify-center bg-black text-white"
          style={{ width: "100%", height: "100%"}} // Full size black screen
        >
          <img className="w-40 h-40 rounded-full" src={user?.photoURL} alt="pic"/>
          <span className="text-lg font-semibold my-3">{username || user?.displayName}</span>
        </div>
      ) : (
        
        <DailyVideo
          key={sessionId}
          automirror
          className={classNames({
            active: activeId === sessionId
          })}
          sessionId={sessionId}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>
  );
}

export default function Call({ isVideoEnabled }) {
  const participantIds = useParticipantIds();

  console.log(participantIds)

  return (
    <div className="Call w-screen h-screen">
      {participantIds.map((id) => (
        <Tile key={id} sessionId={id} isVideoEnabled={isVideoEnabled} />
      ))}
    </div>
  );
}
