'use client'
import React, { useState } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';

export default function ExcalidrawTest() {
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  const toggleWhiteboard = () => {
    setShowWhiteboard(!showWhiteboard);
  };

  return (
    <div>
      <h1>Excalidraw Whiteboard Example</h1>
      <button
        onClick={toggleWhiteboard}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        <span role="img" aria-label="whiteboard" style={{ marginRight: '10px' }}>
          🖌️
        </span>
        Open Whiteboard
      </button>

      {showWhiteboard && (
        <div style={{ width: '100%', height: '500px', marginTop: '20px', border: '1px solid #ccc' }}>
            {/* excalidraw whiteboard component */}
          <Excalidraw />
        </div>
      )}
    </div>
  );
}
