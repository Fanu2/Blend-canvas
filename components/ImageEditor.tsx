import { useRef, useEffect, useState } from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [overlayPosition, setOverlayPosition] = useState({ x: 180, y: 130 });
  const [overlaySize, setOverlaySize] = useState({ width: 250, height: 250 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx && backgroundImage) {
      const background = new window.Image();
      background.src = backgroundImage;

      background.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height); // Draw background image

        if (overlayImage) {
          const overlay = new window.Image();
          overlay.src = overlayImage;

          overlay.onload = () => {
            ctx.drawImage(
              overlay,
              overlayPosition.x,
              overlayPosition.y,
              overlaySize.width,
              overlaySize.height
            ); // Draw overlay image at current position and size
          };
        }
      };
    }
  }, [backgroundImage, overlayImage, overlayPosition, overlaySize]);

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBackgroundImage(URL.createObjectURL(file));
    }
  };

  const handleOverlayUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOverlayImage(URL.createObjectURL(file));
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const mouseX = event.clientX - (rect?.left || 0);
    const mouseY = event.clientY - (rect?.top || 0);

    if (
      mouseX > overlayPosition.x &&
      mouseX < overlayPosition.x + overlaySize.width &&
      mouseY > overlayPosition.y &&
      mouseY < overlayPosition.y + overlaySize.height
    ) {
      setIsDragging(true);
      setDragStart({ x: mouseX - overlayPosition.x, y: mouseY - overlayPosition.y });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const rect = canvasRef.current?.getBoundingClientRect();
      const mouseX = event.clientX - (rect?.left || 0);
      const mouseY = event.clientY - (rect?.top || 0);
      setOverlayPosition({
        x: mouseX - dragStart.x,
        y: mouseY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResizeOverlay = (event: React.WheelEvent<HTMLCanvasElement>) => {
    if (event.deltaY < 0) {
      // Zoom in
      setOverlaySize((prevSize) => ({
        width: prevSize.width + 10,
        height: prevSize.height + 10,
      }));
    } else {
      // Zoom out
      setOverlaySize((prevSize) => ({
        width: prevSize.width - 10,
        height: prevSize.height - 10,
      }));
    }
  };

  return (
    <div>
      <h1>Overlay Image on Canvas</h1>

      <input type="file" accept="image/*" onChange={handleBackgroundUpload} />
      <input type="file" accept="image/*" onChange={handleOverlayUpload} />

      <canvas
        ref={canvasRef}
        width="800"
        height="600"
        style={{ border: '1px solid black', cursor: 'move' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleResizeOverlay}
      />

      <p>
        Upload a background image and an overlay image. Drag the overlay on the canvas and use the
        mouse wheel to resize.
      </p>
    </div>
  );
}
