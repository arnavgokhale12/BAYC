import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AvatarCanvas from './AvatarCanvas';
import { RARITIES } from './traitData';

export default function MyCollection({ owned, onSelect }) {
  const scrollRef = useRef(null);

  if (!owned || owned.length === 0) return null;

  return (
    <div
      className="w-full py-4"
      style={{ borderBottom: '1px solid rgba(255,215,0,0.12)' }}
    >
      <div className="px-4 sm:px-8 mb-3 flex items-center gap-3">
        <h2
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ fontFamily: "'Space Grotesk',sans-serif", color: '#FFD700' }}
        >
          My Collection
        </h2>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(255,215,0,0.12)', color: '#C0A060' }}
        >
          {owned.length} owned
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-4 sm:px-8 pb-2"
        style={{ scrollbarWidth: 'thin' }}
      >
        <AnimatePresence>
          {owned.slice(0, 10).map((avatar, i) => (
            <OwnedCard
              key={avatar.id}
              avatar={avatar}
              index={i}
              onClick={() => onSelect(avatar)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function OwnedCard({ avatar, index, onClick }) {
  const tierColor = RARITIES[avatar.rarityTier]?.color || '#888';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 400, damping: 28 }}
      whileHover={{ y: -4, scale: 1.05 }}
      onClick={onClick}
      className="relative flex-shrink-0 cursor-pointer rounded-xl overflow-hidden group"
      style={{
        width: 80,
        border: `1px solid ${tierColor}44`,
        background: '#1a1a2e',
        boxShadow: `0 2px 12px rgba(0,0,0,0.4)`,
        transition: 'box-shadow 0.2s ease',
      }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 14px ${tierColor}33`,
          transition: 'opacity 0.2s ease',
        }}
      />

      <AvatarCanvas traits={avatar.traits} size={80} className="w-full block" />

      {/* OWNED label */}
      <div
        className="absolute bottom-0 inset-x-0 text-center py-0.5"
        style={{
          background: 'rgba(0,0,0,0.75)',
          fontSize: '8px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: '#FFD700',
        }}
      >
        OWNED
      </div>
    </motion.div>
  );
}
