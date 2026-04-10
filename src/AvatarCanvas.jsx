import { useEffect, useRef } from 'react';
import { drawAvatar } from './AvatarGenerator';

export default function AvatarCanvas({ traits, size = 200, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !traits) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawAvatar(ctx, size, traits);
  }, [traits, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
