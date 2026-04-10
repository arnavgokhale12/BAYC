import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleField from './ParticleField';
import AudioVisualizer from './AudioVisualizer';
import Gallery from './Gallery';
import AvatarModal from './AvatarModal';
import MintModal from './MintModal';
import MyCollection from './MyCollection';
import WalletButton from './WalletButton';
import TxToast from './TxToast';
import { loadCollection, hydrateAvatar } from './AvatarGenerator';
import { unmute, mute, sfxSwell } from './AudioEngine';

const OWNED_KEY = 'bayc_owned';

export default function App() {
  const [collection, setCollection]         = useState([]);
  const [owned, setOwned]                   = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showMintModal, setShowMintModal]   = useState(false);
  const [audioMuted, setAudioMuted]         = useState(true);

  // ── Load data on mount ────────────────────────────────────────────────────
  useEffect(() => {
    setCollection(loadCollection());

    try {
      const raw = localStorage.getItem(OWNED_KEY);
      if (raw) {
        const hydrated = JSON.parse(raw)
          .map(a => { try { return hydrateAvatar(a); } catch { return null; } })
          .filter(Boolean);
        setOwned(hydrated);
      }
    } catch {}

    const handleFirst = () => { sfxSwell(); };
    window.addEventListener('click',   handleFirst, { once: true });
    window.addEventListener('keydown', handleFirst, { once: true });
    return () => {
      window.removeEventListener('click',   handleFirst);
      window.removeEventListener('keydown', handleFirst);
    };
  }, []);

  // ── Audio toggle ──────────────────────────────────────────────────────────
  const handleToggleAudio = useCallback(() => {
    if (audioMuted) { unmute(); setAudioMuted(false); }
    else            { mute();   setAudioMuted(true);  }
  }, [audioMuted]);

  // ── Mint callback ─────────────────────────────────────────────────────────
  const handleMinted = useCallback((newAvatar) => {
    setOwned(prev => {
      const next = [newAvatar, ...prev].slice(0, 10);
      try {
        localStorage.setItem(OWNED_KEY, JSON.stringify(
          next.map(a => ({
            id: a.id, name: a.name, traitIds: a.traitIds,
            rarityScore: a.rarityScore, rarityTier: a.rarityTier,
          }))
        ));
      } catch {}
      return next;
    });
  }, []);

  const ownedIds = new Set(owned.map(a => a.id));

  return (
    <div className="relative min-h-screen" style={{ background: '#0a0a0f' }}>
      <ParticleField />

      <div className="relative" style={{ zIndex: 1 }}>

        {/* ── Header ── */}
        <header
          className="px-4 sm:px-8 py-5 flex items-center justify-between gap-4"
          style={{ borderBottom: '1px solid rgba(255,215,0,0.1)' }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0"
          >
            <h1
              className="text-2xl sm:text-3xl font-bold leading-tight"
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                background: 'linear-gradient(90deg,#FFD700,#FFF5A0,#C0A060)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 4s linear infinite',
              }}
            >
              Bored Ape Gallery
            </h1>
            <p
              className="text-xs mt-0.5 tracking-widest"
              style={{ color: '#555', fontFamily: "'Space Grotesk',sans-serif" }}
            >
              GENERATIVE NFT COLLECTION
            </p>
          </motion.div>

          {/* Right controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 flex-wrap justify-end"
          >
            <span className="text-xs hidden md:block" style={{ color: '#444' }}>
              {collection.length} unique apes
            </span>
            <div className="h-5 w-px hidden md:block" style={{ background: 'rgba(255,255,255,0.1)' }} />

            {/* Wallet button */}
            <WalletButton />

            <div className="h-5 w-px hidden sm:block" style={{ background: 'rgba(255,255,255,0.1)' }} />

            {/* Mint CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMintModal(true)}
              className="text-sm font-bold px-4 py-2 rounded-lg hidden sm:block"
              style={{
                background: 'linear-gradient(135deg,#FFD700,#C0A060)',
                color: '#000',
                fontFamily: "'Space Grotesk',sans-serif",
                boxShadow: '0 2px 16px rgba(255,215,0,0.3)',
              }}
            >
              ✦ Mint Yours
            </motion.button>
          </motion.div>
        </header>

        {/* My Collection ribbon */}
        <MyCollection owned={owned} onSelect={setSelectedAvatar} />

        {/* Gallery grid */}
        <Gallery
          avatars={collection}
          owned={owned}
          onCardClick={setSelectedAvatar}
          onMintClick={() => setShowMintModal(true)}
        />
      </div>

      {/* ── Floating audio widget ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
      >
        <AudioVisualizer active={!audioMuted} />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleAudio}
          className="w-10 h-10 rounded-full flex items-center justify-center text-base"
          style={{
            background: audioMuted ? 'rgba(255,255,255,0.07)' : 'rgba(255,215,0,0.15)',
            border: `1px solid ${audioMuted ? 'rgba(255,255,255,0.12)' : 'rgba(255,215,0,0.4)'}`,
            backdropFilter: 'blur(8px)',
            boxShadow: audioMuted ? 'none' : '0 0 16px rgba(255,215,0,0.25)',
            transition: 'all 0.3s ease',
          }}
          title={audioMuted ? 'Unmute ambient music' : 'Mute'}
          aria-label={audioMuted ? 'Unmute' : 'Mute'}
        >
          {audioMuted ? '🔇' : '🔊'}
        </motion.button>
      </motion.div>

      {/* ── Tx toast notifications ── */}
      <TxToast />

      {/* ── Modals ── */}
      <AnimatePresence>
        {selectedAvatar && (
          <AvatarModal
            key="avatar-modal"
            avatar={selectedAvatar}
            onClose={() => setSelectedAvatar(null)}
            onMint={() => { setSelectedAvatar(null); setShowMintModal(true); }}
            isOwned={ownedIds.has(selectedAvatar.id)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMintModal && (
          <MintModal
            key="mint-modal"
            ownedCount={owned.length}
            onMinted={handleMinted}
            onClose={() => setShowMintModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
