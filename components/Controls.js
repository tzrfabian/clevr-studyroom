import React from 'react';

export default function Controls({
  onLeave,
  onToggleAudio,
  onToggleVideo,
  onChatToggle,
  onScreenShare,
  isScreenSharing,
  isScreenShareAllowed,
  onWhiteboardToggle,
  isHost
}) {
  return (
    <div className="flex justify-center space-x-4 p-4 bg-gray-100">
      <button onClick={onToggleAudio} className="btn btn-primary">
        Toggle Audio
      </button>
      <button onClick={onToggleVideo} className="btn btn-primary">
        Toggle Video
      </button>
      <button onClick={onChatToggle} className="btn btn-secondary">
        Toggle Chat
      </button>
      {isScreenShareAllowed && (
        <button onClick={onScreenShare} className="btn btn-secondary">
          {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
        </button>
      )}
      <button onClick={onWhiteboardToggle} className="btn btn-secondary">
        Toggle Whiteboard
      </button>
      {isHost && (
        <button onClick={() => {}} className="btn btn-warning">
          Host Controls
        </button>
      )}
      <button onClick={onLeave} className="btn btn-danger">
        Leave Call
      </button>
    </div>
  );
}