import {
    useDailyEvent,
    useParticipantIds
  } from "@daily-co/daily-react";
  import Tile from "./Tile";
import CallControls from "./CallControls";
  
  export default function Call({ onLeave }) {
    const participantIds = useParticipantIds();
  
    useDailyEvent("left-meeting", onLeave);
  
    return (
      <div className="Call">
        <div
          className="tiles"
          style={{ "--columns": Math.ceil(Math.sqrt(participantIds.length)) }}
        >
          {participantIds.map((id) => (
            <Tile key={id} sessionId={id} />
          ))}
        </div>
        <CallControls />
      </div>
    );
  }
  