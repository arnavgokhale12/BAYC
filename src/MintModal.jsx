import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import AvatarCanvas from './AvatarCanvas';
import { TRAIT_CATEGORIES, RARITIES } from './traitData';
import { mintAvatar } from './AvatarGenerator';
import { sfxSlotTick, sfxSlotLock, sfxCoinChime, sfxThud } from './AudioEngine';

const SPIN_DURATION = 1200; // ms per slot
const SPIN_TICK_INTERVAL = 60; // ms between ticks while spinning

export default function MintModal({ ownedCount, onMinted, onClose }) {
  const [phase, setPhase] = useState('idle'); // idle | spinning | done
  const [lockedTraits, setLockedTraits] = useState({});
  const [spinningSlot, setSpinningSlot] = useState(null);
  const [spinDisplay, setSpinDisplay] = useState({});
  const [mintedAvatar, setMintedAvatar] = useState(null);
  const tickRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const startMint = useCallback(() => {
    sfxThud();
    const avatar = mintAvatar(ownedCount);
    setMintedAvatar(avatar);
    setLockedTraits({});
    setPhase('spinning');

    const categories = TRAIT_CATEGORIES;
    let catIndex = 0;

    function spinNext() {
      if (catIndex >= categories.length) {
        // All done
        setSpinningSlot(null);
        setPhase('done');
        sfxCoinChime();
        setTimeout(() => {
          confetti({
            particleCount: 180,
            spread: 80,
            origin: { y: 0.55 },
            colors: ['#FFD700', '#FFF5A0', '#C0A060', '#ffffff', '#ff6600'],
            scalar: 1.2,
          });
        }, 200);
        return;
      }
      const cat = categories[catIndex];
      setSpinningSlot(cat.key);

      // Rapid-cycle through random traits for this slot
      tickRef.current = setInterval(() => {
        const randomTraits = cat.traits;
        const randomTrait = randomTraits[Math.floor(Math.random() * randomTraits.length)];
        sfxSlotTick();
        setSpinDisplay(prev => ({ ...prev, [cat.key]: randomTrait }));
      }, SPIN_TICK_INTERVAL);

      // Lock in after SPIN_DURATION
      setTimeout(() => {
        clearInterval(tickRef.current);
        const finalTrait = avatar.traits[cat.key];
        sfxSlotLock();
        setSpinDisplay(prev => ({ ...prev, [cat.key]: finalTrait }));
        setLockedTraits(prev => ({ ...prev, [cat.key]: finalTrait }));
        setSpinningSlot(null);
        catIndex++;
        setTimeout(spinNext, 200);
      }, SPIN_DURATION + catIndex * 80);
    }

    spinNext();
  }, [ownedCount]);

  const handleConfirm = useCallback(() => {
    if (mintedAvatar) {
      onMinted(mintedAvatar);
      onClose();
    }
  }, [mintedAvatar, onMinted, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="mint-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
        onClick={phase === 'idle' ? onClose : undefined}
      >
        <motion.div
          key="mint-panel"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="relative w-full max-w-lg rounded-2xl overflow-hidden"
          style={{
            background: '#0f0f1e',
            border: '1px solid rgba(255,215,0,0.35)',
            boxShadow: '0 0 60px rgba(255,215,0,0.2), 0 20px 60px rgba(0,0,0,0.8)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="px-6 pt-6 pb-4 text-center"
            style={{ borderBottom: '1px solid rgba(255,215,0,0.1)' }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-lg"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}
            >
              ×
            </button>
            <div className="text-3xl mb-1">🎰</div>
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: "'Space Grotesk',sans-serif", color: '#FFD700' }}
            >
              {phase === 'done' ? 'MINTED!' : 'Mint Your Ape'}
            </h2>
            <p className="text-sm mt-1" style={{ color: '#888' }}>
              {phase === 'idle' && 'Spin the reels to reveal your unique ape'}
              {phase === 'spinning' && 'Locking in traits...'}
              {phase === 'done' && 'Your ape has been added to your collection'}
            </p>
          </div>

          {/* Slot machine */}
          <div className="p-6 space-y-2">
            {TRAIT_CATEGORIES.map(cat => (
              <SlotRow
                key={cat.key}
                category={cat}
                spinning={spinningSlot === cat.key}
                locked={!!lockedTraits[cat.key]}
                displayTrait={spinDisplay[cat.key] || lockedTraits[cat.key]}
              />
            ))}
          </div>

          {/* Result avatar */}
          <AnimatePresence>
            {phase === 'done' && mintedAvatar && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                className="px-6 pb-4 flex justify-center"
              >
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: '2px solid #FFD700',
                    boxShadow: '0 0 40px rgba(255,215,0,0.35)',
                  }}
                >
                  <AvatarCanvas traits={mintedAvatar.traits} size={200} className="block" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="px-6 pb-6 space-y-3">
            {phase === 'idle' && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startMint}
                className="w-full py-3.5 rounded-xl font-bold text-base"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #C0A060)',
                  color: '#000',
                  fontFamily: "'Space Grotesk',sans-serif",
                  boxShadow: '0 4px 20px rgba(255,215,0,0.4)',
                }}
              >
                🎲 Spin & Mint
              </motion.button>
            )}
            {phase === 'spinning' && (
              <div
                className="w-full py-3.5 rounded-xl text-center font-bold text-base"
                style={{
                  background: 'rgba(255,215,0,0.08)',
                  border: '1px solid rgba(255,215,0,0.2)',
                  color: '#888',
                  fontFamily: "'Space Grotesk',sans-serif",
                }}
              >
                ⏳ Spinning...
              </div>
            )}
            {phase === 'done' && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleConfirm}
                className="w-full py-3.5 rounded-xl font-bold text-base"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #C0A060)',
                  color: '#000',
                  fontFamily: "'Space Grotesk',sans-serif",
                  boxShadow: '0 4px 20px rgba(255,215,0,0.4)',
                }}
              >
                ✓ Add to My Collection
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SlotRow({ category, spinning, locked, displayTrait }) {
  const rarity = displayTrait?.rarity || 'Common';
  const rarityColor = RARITIES[rarity]?.color || '#888';

  return (
    <motion.div
      className="flex items-center gap-3 rounded-xl px-4 py-2.5"
      animate={locked ? { background: 'rgba(255,215,0,0.06)' } : { background: 'rgba(255,255,255,0.03)' }}
      style={{
        border: locked
          ? `1px solid ${rarityColor}44`
          : spinning
          ? '1px solid rgba(255,215,0,0.25)'
          : '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 0.2s ease',
      }}
    >
      {/* Category label */}
      <div
        className="text-xs font-medium w-20 flex-shrink-0 uppercase tracking-wider"
        style={{ color: '#555' }}
      >
        {category.label}
      </div>

      {/* Spinning reel */}
      <div className="flex-1 h-8 overflow-hidden relative flex items-center">
        <AnimatePresence mode="wait">
          {spinning ? (
            <motion.div
              key={displayTrait?.id || 'spin'}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.05 }}
              className="text-sm font-semibold"
              style={{ color: '#FFD700' }}
            >
              {displayTrait?.name || '???'}
            </motion.div>
          ) : locked ? (
            <motion.div
              key="locked"
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="text-sm font-semibold slot-flash"
              style={{ color: rarityColor }}
            >
              {displayTrait?.name || '—'}
            </motion.div>
          ) : (
            <div className="text-sm" style={{ color: '#333' }}>—</div>
          )}
        </AnimatePresence>
      </div>

      {/* Rarity indicator */}
      <div className="flex-shrink-0 w-20 text-right">
        {locked && displayTrait && (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: rarityColor + '22',
              border: `1px solid ${rarityColor}55`,
              color: rarityColor,
            }}
          >
            {rarity}
          </motion.span>
        )}
        {spinning && (
          <span className="text-xs" style={{ color: '#FFD700', opacity: 0.7 }}>▶▶▶</span>
        )}
      </div>

      {/* Lock icon */}
      <div className="w-4 flex-shrink-0">
        {locked && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 600, damping: 18 }}
            className="text-sm"
          >
            🔒
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
