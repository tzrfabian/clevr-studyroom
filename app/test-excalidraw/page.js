'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Excalidraw, so it's only loaded in client-side
const Excalidraw = dynamic(() => import('@excalidraw/excalidraw'), { ssr: false });

export default function ExcalidrawTest() {
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleWhiteboard = () => {
    setShowWhiteboard(!showWhiteboard);
  };

  if (!isClient) {
    return null;
  }

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
          {/* Excalidraw whiteboard component */}
          <Excalidraw />
        </div>
      )}
    </div>
  );
}
