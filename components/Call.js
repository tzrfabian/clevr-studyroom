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

function Tile({ sessionId, hasShareScreen, isSingleParticipant }) {
  const { user } = useAppContext();
  const activeId = useActiveSpeakerId();
  const username = useParticipantProperty(sessionId, "user_name");
  const userVideo = useParticipantProperty(sessionId, "tracks.video.state");
  const userPhoto = useParticipantProperty(sessionId, "userData.photo_url");

  console.log(username, userVideo, "<<<<<<<<<<<<<<<<<<<<<");
  return (
    <div className="">
      {userVideo !== "playable" ? (
        <div
          className={`flex flex-col items-center justify-center bg-black text-white w-full ${
            hasShareScreen ? "" : isSingleParticipant ? "h-full" : "h-80"
          } rounded-lg`}
        >
          <img
            className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover shadow-lg"
            src={userPhoto}
            alt="User Avatar"
          />
          <span className="text-sm md:text-md font-semibold mt-2">
            {username || user?.displayName}
          </span>
        </div>
      ) : (
        <DailyVideo
          key={sessionId}
          automirror
          className={classNames({
            // active: activeId === sessionId,
            "h-80": !hasShareScreen && !isSingleParticipant,
            "h-full": isSingleParticipant,
          })}
          sessionId={sessionId}
          style={{
            width: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      )}
    </div>
  );
}

export default function Call({ isVideoEnabled }) {
  const participantIds = useParticipantIds();
  const { screens, startScreenShare } = useScreenShare();

  const hasShareScreen = screens.length > 0;

  const numCols = hasShareScreen ? 1 : Math.min(2, participantIds.length);

  const isSingleParticipant = participantIds.length === 1;

  return (
    <>
      {screens.map((screen) => (
        <div
          key={screen.screenId}
          className="ScreenShare"
          style={{
            width: hasShareScreen ? "80%" : "100%",
            height: "100%",
          }}
        >
          <DailyVideo sessionId={screen.session_id} type="screenVideo" />
        </div>
      ))}

      <div
        className="CallTiles"
        style={{
          display: hasShareScreen ? "flex" : "grid",
          flexDirection: hasShareScreen ? "column" : "unset",
          gridTemplateColumns: !hasShareScreen
            ? `repeat(${numCols}, 1fr)`
            : "unset",
          gap: "10px",
          width: hasShareScreen ? "20%" : "100%",
          height: "100%",
          overflowY: "auto",
        }}
      >
        {participantIds.map((id) => (
          <Tile
            key={id}
            sessionId={id}
            hasShareScreen={hasShareScreen}
            isSingleParticipant={isSingleParticipant}
            isVideoEnabled={isVideoEnabled}
          />
        ))}
      </div>
    </>
  );
}
