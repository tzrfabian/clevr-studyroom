import React from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaComments, FaDesktop, FaChalkboard, FaSignOutAlt, FaUserCog } from 'react-icons/fa';

export default function Controls({
  onLeave,
  onToggleAudio,
  onToggleVideo,
  onChatToggle,
  onScreenShare,
  isScreenSharing,
  isScreenShareAllowed,
  onWhiteboardToggle,
  isWhiteboardActive,
  isWhiteboardAllowed,
  isWhiteboardOwner,
  isHost
}) {
  const [isAudioEnabled, setIsAudioEnabled] = React.useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);

  const handleToggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    onToggleAudio();
  };

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    onToggleVideo();
  };

  const buttonBaseClass = "p-3 rounded-full shadow-md focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-offset-2";
  const iconSize = 24;

  return (
    <div className="flex justify-center space-x-6 p-6 bg-gray-200 rounded-lg shadow-lg">
      {/* Toggle Audio */}
      <button
        onClick={handleToggleAudio}
        className={`${buttonBaseClass} ${isAudioEnabled ? 'bg-green-500 hover:bg-green-600 focus:ring-green-400' : 'bg-red-500 hover:bg-red-600 focus:ring-red-400'}`}
      >
        {isAudioEnabled ? <FaMicrophone size={iconSize} color="white" /> : <FaMicrophoneSlash size={iconSize} color="white" />}
      </button>

      {/* Toggle Video */}
      <button
        onClick={handleToggleVideo}
        className={`${buttonBaseClass} ${isVideoEnabled ? 'bg-green-500 hover:bg-green-600 focus:ring-green-400' : 'bg-red-500 hover:bg-red-600 focus:ring-red-400'}`}
      >
        {isVideoEnabled ? <FaVideo size={iconSize} color="white" /> : <FaVideoSlash size={iconSize} color="white" />}
      </button>

      {/* Toggle Chat */}
      <button
        onClick={onChatToggle}
        className={`${buttonBaseClass} bg-blue-500 hover:bg-blue-600 focus:ring-blue-400`}
      >
        <FaComments size={iconSize} color="white" />
      </button>

      {/* Share Screen */}
      {isScreenShareAllowed && (
        <button
          onClick={onScreenShare}
          className={`${buttonBaseClass} ${isScreenSharing ? 'bg-green-500 hover:bg-green-600 focus:ring-green-400' : 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-400'}`}
        >
          <FaDesktop size={iconSize} color="white" />
        </button>
      )}

      {/* Toggle Whiteboard */}
      {(isWhiteboardAllowed || isWhiteboardOwner) && (
        <button
          onClick={onWhiteboardToggle}
          className={`${buttonBaseClass} ${isWhiteboardActive ? 'bg-green-500 hover:bg-green-600 focus:ring-green-400' : 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-400'}`}
        >
          <FaChalkboard size={iconSize} color="white" />
        </button>
      )}

      {/* Host Controls */}
      {isHost && (
        <button
          onClick={() => {}}
          className={`${buttonBaseClass} bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400`}
        >
          <FaUserCog size={iconSize} color="white" />
        </button>
      )}

      {/* Leave Call */}
      <button
        onClick={onLeave}
        className={`${buttonBaseClass} bg-red-600 hover:bg-red-700 focus:ring-red-500`}
      >
        <FaSignOutAlt size={iconSize} color="white" />
      </button>
    </div>
  );
}
