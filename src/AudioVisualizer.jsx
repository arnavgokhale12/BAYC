import { useEffect, useRef } from 'react';
import { getAnalyserData } from './AudioEngine';

const BAR_COUNT = 7;

export default function AudioVisualizer({ active }) {
  const barsRef = useRef([]);

  useEffect(() => {
    if (!active) return;
    let animId;

    const tick = () => {
      const data = getAnalyserData();
      const step = Math.floor(data.length / BAR_COUNT);

      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const val = data[i * step] || 0;
        const pct = Math.max(15, (val / 255) * 100);
        bar.style.height = `${pct}%`;
        bar.style.opacity = active ? '1' : '0.2';
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [active]);

  return (
    <div
      className="flex items-end gap-0.5"
      style={{ width: 28, height: 20 }}
      aria-hidden
    >
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <div
          key={i}
          ref={el => { barsRef.current[i] = el; }}
          className="flex-1 rounded-t-sm"
          style={{
            height: '20%',
            background: '#FFD700',
            opacity: active ? 0.8 : 0.2,
            transition: active ? 'none' : 'height 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}
