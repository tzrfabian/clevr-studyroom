import React from 'react';

export default function ParticipantList({
  participants,
  localParticipant,
  isHost,
  onMuteParticipant,
  onRemoveParticipant,
  onSetScreenSharingPermission
}) {
  return (
    <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto">
      <h2 className="text-lg font-semibold p-4 border-b border-gray-200">Participants</h2>
      <ul>
        {participants.map(participant => (
          <li key={participant.session_id} className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span>{participant.user_name || 'Guest'}</span>
              {isHost && participant.session_id !== localParticipant.session_id && (
                <div>
                  <button
                    onClick={() => onMuteParticipant(participant.session_id)}
                    className="btn btn-sm btn-warning mr-2"
                  >
                    Mute
                  </button>
                  <button
                    onClick={() => onRemoveParticipant(participant.session_id)}
                    className="btn btn-sm btn-danger"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      {isHost && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => onSetScreenSharingPermission(true)}
            className="btn btn-sm btn-secondary mr-2"
          >
            Allow Screen Sharing
          </button>
          <button
            onClick={() => onSetScreenSharingPermission(false)}
            className="btn btn-sm btn-secondary"
          >
            Disable Screen Sharing
          </button>
        </div>
      )}
    </div>
  );
}