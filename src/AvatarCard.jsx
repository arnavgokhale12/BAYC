import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import AvatarCanvas from './AvatarCanvas';
import { RARITIES } from './traitData';
import { sfxHover, sfxThud } from './AudioEngine';

const RARITY_STYLES = {
  Common:    'bg-gray-600 text-gray-200',
  Uncommon:  'bg-green-700 text-green-100',
  Rare:      'bg-blue-700 text-blue-100',
  Legendary: 'bg-yellow-500 text-black font-bold',
};

export default function AvatarCard({ avatar, index, onClick, isOwned }) {
  const hoverTimeout = useRef(null);

  const handleHoverStart = useCallback(() => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => sfxHover(), 80);
  }, []);

  const handleHoverEnd = useCallback(() => {
    clearTimeout(hoverTimeout.current);
  }, []);

  const handleClick = useCallback(() => {
    sfxThud();
    onClick(avatar);
  }, [avatar, onClick]);

  const isLegendary = avatar.rarityTier === 'Legendary';
  const tierColor = RARITIES[avatar.rarityTier]?.color || '#888';

  // Pick 2 interesting traits for the hover preview (skip "None"/"No Hat"/etc.)
  const previewTraits = Object.entries(avatar.traits || {})
    .filter(([k, t]) => k !== 'background' && t && t.name && !['No Hat','None','No Clothes'].includes(t.name))
    .slice(0, 3);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={handleClick}
      className="relative group cursor-pointer rounded-xl overflow-hidden"
      style={{
        background: '#1a1a2e',
        border: `1px solid ${isLegendary ? '#FFD700' : 'rgba(255,215,0,0.2)'}`,
        boxShadow: isLegendary
          ? '0 0 20px rgba(255,215,0,0.3)'
          : '0 4px 24px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Glow on hover via CSS group */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          boxShadow: `0 0 30px ${tierColor}55, inset 0 0 20px ${tierColor}11`,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* OWNED badge */}
      {isOwned && (
        <div
          className="absolute top-2 left-2 z-10 text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: '#FFD700', color: '#000' }}
        >
          OWNED
        </div>
      )}

      {/* Legendary sparkle corner */}
      {isLegendary && (
        <div className="absolute top-2 right-2 z-10 text-base leading-none" aria-hidden>✦</div>
      )}

      {/* Avatar art */}
      <div className="relative overflow-hidden" style={{ background: '#0a0a0f' }}>
        <AvatarCanvas
          traits={avatar.traits}
          size={280}
          className="w-full h-auto block"
          style={{ aspectRatio: '1/1' }}
        />
        {/* Hover trait overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(to top, rgba(10,10,15,0.92) 0%, transparent 60%)',
            transition: 'opacity 0.25s ease',
          }}
        >
          <div className="flex flex-wrap gap-1">
            {previewTraits.map(([key, trait]) => (
              <span
                key={key}
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: RARITIES[trait.rarity]?.color + '33',
                  border: `1px solid ${RARITIES[trait.rarity]?.color}66`,
                  color: RARITIES[trait.rarity]?.color,
                }}
              >
                {trait.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-3 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <h3
            className="font-semibold text-sm truncate"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#fff' }}
          >
            {avatar.name}
          </h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${RARITY_STYLES[avatar.rarityTier]}`}
            style={avatar.rarityTier === 'Legendary' ? { background: 'linear-gradient(90deg,#FFD700,#FFF5A0,#FFD700)', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite' } : {}}
          >
            {avatar.rarityTier === 'Legendary' ? '⭐ ' : ''}{avatar.rarityTier}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#888' }}>
            Score: <span style={{ color: tierColor }}>{avatar.rarityScore}</span>
          </span>
          <span
            className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: '#FFD700' }}
          >
            View →
          </span>
        </div>
      </div>
    </motion.div>
  );
}
