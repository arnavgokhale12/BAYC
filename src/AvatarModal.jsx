import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AvatarCanvas from './AvatarCanvas';
import { RARITIES, TRAIT_CATEGORIES } from './traitData';
import { sfxSparkle, sfxThud } from './AudioEngine';

const RARITY_STYLES = {
  Common:    { bg: 'rgba(107,114,128,0.2)',  border: '#6b7280', text: '#9ca3af' },
  Uncommon:  { bg: 'rgba(34,197,94,0.15)',   border: '#22c55e', text: '#4ade80' },
  Rare:      { bg: 'rgba(59,130,246,0.15)',  border: '#3b82f6', text: '#60a5fa' },
  Legendary: { bg: 'rgba(255,215,0,0.15)',   border: '#FFD700', text: '#FFD700' },
};

export default function AvatarModal({ avatar, onClose, onMint, isOwned }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleMint = useCallback(() => {
    sfxThud();
    onMint(avatar);
    onClose();
  }, [avatar, onMint, onClose]);

  if (!avatar) return null;

  const allTraits = TRAIT_CATEGORIES.map(cat => ({
    category: cat.label,
    trait: avatar.traits?.[cat.key],
  })).filter(x => x.trait);

  const tierColor = RARITIES[avatar.rarityTier]?.color || '#888';
  const isLegendary = avatar.rarityTier === 'Legendary';

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        {/* Modal panel */}
        <motion.div
          key="modal-panel"
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
          style={{
            background: '#0f0f1e',
            border: `1px solid ${isLegendary ? '#FFD700' : 'rgba(255,215,0,0.25)'}`,
            boxShadow: isLegendary
              ? '0 0 60px rgba(255,215,0,0.25), 0 20px 60px rgba(0,0,0,0.7)'
              : '0 20px 60px rgba(0,0,0,0.7)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
            aria-label="Close"
          >
            ×
          </button>

          <div className="flex flex-col md:flex-row gap-0">
            {/* Left: Avatar */}
            <div
              className="flex-shrink-0 flex items-center justify-center p-6 md:p-8"
              style={{
                background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)',
                minWidth: 280,
              }}
            >
              <div
                className="relative rounded-xl overflow-hidden"
                style={{
                  border: `2px solid ${tierColor}66`,
                  boxShadow: `0 0 30px ${tierColor}33`,
                }}
              >
                <AvatarCanvas traits={avatar.traits} size={240} className="block" />
              </div>
            </div>

            {/* Right: Details */}
            <div className="flex-1 p-6 space-y-5">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2
                    className="text-2xl font-bold"
                    style={{ fontFamily: "'Space Grotesk',sans-serif", color: '#fff' }}
                  >
                    {avatar.name}
                  </h2>
                  {isOwned && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: '#FFD700', color: '#000' }}
                    >
                      OWNED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <RarityBadge tier={avatar.rarityTier} />
                  <span className="text-sm" style={{ color: '#888' }}>
                    Rarity Score: <span style={{ color: tierColor, fontWeight: 600 }}>{avatar.rarityScore}</span>
                  </span>
                </div>
              </div>

              {/* Rarity bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5" style={{ color: '#888' }}>
                  <span>Rarity</span>
                  <span style={{ color: tierColor }}>{avatar.rarityScore} pts</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (avatar.rarityScore / 120) * 100)}%` }}
                    transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${tierColor}88, ${tierColor})` }}
                  />
                </div>
              </div>

              {/* Traits grid */}
              <div>
                <h4
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: '#888' }}
                >
                  Traits
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {allTraits.map(({ category, trait }, i) => (
                    <TraitBadge
                      key={category}
                      category={category}
                      trait={trait}
                      delay={i * 0.07}
                    />
                  ))}
                </div>
              </div>

              {/* Mint button */}
              {!isOwned && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleMint}
                  className="w-full py-3 rounded-xl font-bold text-base tracking-wide transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #C0A060)',
                    color: '#000',
                    fontFamily: "'Space Grotesk',sans-serif",
                    boxShadow: '0 4px 20px rgba(255,215,0,0.3)',
                  }}
                >
                  ✦ Mint Yours
                </motion.button>
              )}
              {isOwned && (
                <div
                  className="w-full py-3 rounded-xl text-center font-bold text-base"
                  style={{
                    background: 'rgba(255,215,0,0.08)',
                    border: '1px solid rgba(255,215,0,0.3)',
                    color: '#FFD700',
                    fontFamily: "'Space Grotesk',sans-serif",
                  }}
                >
                  ✓ Already Owned
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function RarityBadge({ tier }) {
  const s = RARITY_STYLES[tier] || RARITY_STYLES.Common;
  const isLegendary = tier === 'Legendary';
  return (
    <span
      className="text-xs font-bold px-2.5 py-1 rounded-full"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
        ...(isLegendary ? {
          background: 'linear-gradient(90deg,#FFD700,#FFF5A0,#FFD700)',
          backgroundSize: '200% auto',
          animation: 'shimmer 3s linear infinite',
          color: '#000',
        } : {}),
      }}
    >
      {isLegendary && '⭐ '}{tier}
    </span>
  );
}

function TraitBadge({ category, trait, delay }) {
  const s = RARITY_STYLES[trait.rarity] || RARITY_STYLES.Common;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 400, damping: 25 }}
      onAnimationComplete={() => sfxSparkle()}
      className="rounded-lg p-2.5 space-y-0.5"
      style={{ background: s.bg, border: `1px solid ${s.border}44` }}
    >
      <div className="text-xs font-medium" style={{ color: '#666' }}>{category}</div>
      <div className="text-sm font-semibold" style={{ color: s.text }}>{trait.name}</div>
      <div className="text-xs" style={{ color: s.border + 'aa' }}>{trait.rarity}</div>
    </motion.div>
  );
}
