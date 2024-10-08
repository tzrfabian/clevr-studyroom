import React, { useEffect, useState } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';

const Whiteboard = ({ isOwner, daily }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);  
  const [elements, setElements] = useState([]);  

  useEffect(() => {
    if (isOwner && excalidrawAPI) {
      const canvas = excalidrawAPI.exportToCanvas({
        elements: excalidrawAPI.getSceneElements(),
      });
      console.log(canvas, "<<<")
      if (canvas) {
        const stream = canvas.captureStream();  
        daily.startScreenShare({
            mediaStream: stream
        }); 
      }
    }
  }, [isOwner, daily, excalidrawAPI]);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Excalidraw
        ref={(api) => setExcalidrawAPI(api)}  
        initialData={{ elements }} 
        onChange={(newElements) => setElements(newElements)}  
      />
    </div>
  );
};

export default Whiteboard;
