// components/ImageEditor.tsx
import { useState } from 'react';
import Draggable from 'react-draggable';

const ImageEditor = ({ backgroundPath, overlayPath }) => {
  const [overlaySize, setOverlaySize] = useState({ width: 100, height: 100 });
  const [dragging, setDragging] = useState(false);

  // Handler to resize the overlay image using mouse
  const handleMouseDown = (e) => {
    setDragging(true);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const newWidth = e.clientX - e.target.offsetLeft;
      const newHeight = e.clientY - e.target.offsetTop;
      setOverlaySize({ width: newWidth, height: newHeight });
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '800px', // Set the background container size
        height: '600px',
      }}
    >
      {/* Background Image */}
      <img
        src={backgroundPath}
        alt="Background"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Draggable Overlay Image */}
      <Draggable>
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            cursor: 'move',
            width: `${overlaySize.width}px`,
            height: `${overlaySize.height}px`,
          }}
        >
          <img
            src={overlayPath}
            alt="Overlay"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
          />
          <div
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{
              position: 'absolute',
              right: '0',
              bottom: '0',
              width: '20px',
              height: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              cursor: 'nwse-resize',
            }}
          />
        </div>
      </Draggable>
    </div>
  );
};

export default ImageEditor;
