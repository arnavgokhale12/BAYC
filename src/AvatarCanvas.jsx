import { useEffect, useRef, useState } from 'react';
import { compositeLayers } from './LayerCompositor';

export default function AvatarCanvas({ traits, size = 200, className = '', style = {} }) {
  const canvasRef   = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current || !traits) return;
    let cancelled = false;

    setLoading(true);
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    compositeLayers(ctx, size, traits).then(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [traits, size]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: size, height: size, flexShrink: 0, ...style }}
    >
      {/* Shimmer skeleton while layers load */}
      {loading && (
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, #1a1a2e 25%, #2a2a3e 50%, #1a1a2e 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s linear infinite',
          }}
        />
      )}

      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          display: 'block',
          width:   '100%',
          height:  '100%',
          opacity:    loading ? 0 : 1,
          transition: 'opacity 0.25s ease',
        }}
      />
    </div>
  );
}
