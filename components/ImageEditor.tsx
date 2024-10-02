import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [overlayPosition, setOverlayPosition] = useState({ x: 180, y: 130 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx && backgroundImage && overlayImage) {
      const background = new window.Image();
      const overlay = new window.Image();

      background.src = backgroundImage;
      overlay.src = overlayImage;

      background.onload = () => {
        // Draw background image
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        overlay.onload = () => {
          // Draw overlay image at current position
          ctx.drawImage(overlay, overlayPosition.x, overlayPosition.y, 400, 400);
        };
      };
    }
  }, [backgroundImage, overlayImage, overlayPosition]);

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
      mouseX < overlayPosition.x + 400 &&
      mouseY > overlayPosition.y &&
      mouseY < overlayPosition.y + 400
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
      />

      {/* Optional: Display overlay image for visualization */}
      {overlayImage && (
        <Image
          src={overlayImage}
          alt="Overlay"
          layout="intrinsic" // Use 'responsive' if needed
          style={{ position: 'absolute', left: overlayPosition.x, top: overlayPosition.y }}
          width={400} // Set appropriate width
          height={400} // Set appropriate height
        />
      )}

      <p>
        Upload a background image and an overlay image, and drag the overlay on the canvas.
      </p>
    </div>
  );
}
