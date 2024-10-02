import { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';

export default function Home() {
  const canvasRef = useRef(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const [overlaySize, setOverlaySize] = useState({ width: 400, height: 400 });
  const [dragPosition, setDragPosition] = useState({ x: 180, y: 130 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (backgroundImage && overlayImage) {
      const background = new Image();
      const overlay = new Image();

      background.src = backgroundImage;
      overlay.src = overlayImage;

      background.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        // Draw background image
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        overlay.onload = () => {
          // Draw overlay image at its current position and size
          ctx.drawImage(
            overlay,
            dragPosition.x,
            dragPosition.y,
            overlaySize.width,
            overlaySize.height
          );
        };
      };
    }
  }, [backgroundImage, overlayImage, overlaySize, dragPosition]);

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackgroundImage(URL.createObjectURL(file));
    }
  };

  const handleOverlayUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOverlayImage(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e, ui) => {
    setDragPosition({ x: ui.x, y: ui.y });
  };

  const handleResizeStart = () => {
    setDragging(true);
  };

  const handleResize = (e) => {
    if (dragging) {
      const newWidth = e.clientX - dragPosition.x;
      const newHeight = e.clientY - dragPosition.y;
      setOverlaySize({ width: newWidth, height: newHeight });
    }
  };

  const handleResizeStop = () => {
    setDragging(false);
  };

  return (
    <div>
      <h1>Overlay Image on Canvas</h1>

      <input type="file" accept="image/*" onChange={handleBackgroundUpload} />
      <input type="file" accept="image/*" onChange={handleOverlayUpload} />

      <Draggable onDrag={handleDrag} position={dragPosition}>
        <div
          style={{
            position: 'absolute',
            top: dragPosition.y,
            left: dragPosition.x,
            cursor: 'move',
            width: overlaySize.width,
            height: overlaySize.height,
            pointerEvents: 'none',
          }}
        >
          <canvas
            ref={canvasRef}
            width="800"
            height="600"
            style={{ border: '1px solid black', pointerEvents: 'auto' }}
            onMouseMove={handleResize}
            onMouseUp={handleResizeStop}
            onMouseDown={handleResizeStart}
          />
        </div>
      </Draggable>

      <p>
        Upload a background image and an overlay image, then drag and resize the overlay on the canvas.
      </p>
    </div>
  );
}
