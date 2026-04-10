import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import AvatarCanvas from './AvatarCanvas';
import { RARITIES } from './traitData';

const CONTRACT = '0x0000000000000000000000000000000000000001';

function openSeaUrl(tokenId) {
  return `https://opensea.io/assets/ethereum/${CONTRACT}/${tokenId}`;
}

function truncate(addr) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function MyCollection({ owned, onSelect }) {
  const scrollRef                = useRef(null);
  const { address, isConnected } = useAccount();

  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
    query: { enabled: isConnected && !!address },
  });

  if (!owned || owned.length === 0) return null;

  const displayName = ensName || (address ? truncate(address) : null);

  return (
    <div className="w-full py-4" style={{ borderBottom: '1px solid rgba(255,215,0,0.12)' }}>
      <div className="px-4 sm:px-8 mb-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
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

        {/* Wallet address shown when connected */}
        {isConnected && displayName && (
          <div
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(255,215,0,0.07)',
              border: '1px solid rgba(255,215,0,0.2)',
              color: '#C0A060',
              fontFamily: 'monospace',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#FFD700', boxShadow: '0 0 4px #FFD700' }}
            />
            {displayName}
          </div>
        )}
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
              isConnected={isConnected}
              onClick={() => onSelect(avatar)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function OwnedCard({ avatar, index, isConnected, onClick }) {
  const tierColor = RARITIES[avatar.rarityTier]?.color || '#888';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 400, damping: 28 }}
      className="relative flex-shrink-0 group"
      style={{ width: 88 }}
    >
      {/* Card */}
      <motion.div
        whileHover={{ y: -4, scale: 1.05 }}
        onClick={onClick}
        className="cursor-pointer rounded-xl overflow-hidden"
        style={{
          border: `1px solid ${tierColor}44`,
          background: '#1a1a2e',
          boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 14px ${tierColor}33`,
            transition: 'opacity 0.2s ease',
          }}
        />
        <AvatarCanvas traits={avatar.traits} size={88} className="w-full block" />
        <div
          className="text-center py-0.5"
          style={{ background: 'rgba(0,0,0,0.75)', fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', color: '#FFD700' }}
        >
          OWNED
        </div>
      </motion.div>

      {/* OpenSea link — shown below card when wallet is connected */}
      {isConnected && (
        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          href={openSeaUrl(avatar.id)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="mt-1 w-full flex items-center justify-center gap-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            fontSize: 9,
            color: '#4a9eff',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
          title="View on OpenSea"
        >
          <span>OpenSea</span>
          <span style={{ fontSize: 8 }}>↗</span>
        </motion.a>
      )}
    </motion.div>
  );
}
