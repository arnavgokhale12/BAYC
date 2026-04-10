import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AvatarCard from './AvatarCard';
import { TRAIT_CATEGORIES } from './traitData';

const SORT_OPTIONS = [
  { value: 'rarity', label: '⭐ Rarity' },
  { value: 'id',     label: '# ID' },
  { value: 'random', label: '🎲 Random' },
];

const RARITY_TIERS = ['All', 'Common', 'Uncommon', 'Rare', 'Legendary'];

export default function Gallery({ avatars, owned, onCardClick, onMintClick }) {
  const [sortBy, setSortBy] = useState('rarity');
  const [filterTier, setFilterTier] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterTraitValue, setFilterTraitValue] = useState('All');
  const [randomSeed] = useState(() => Math.random());

  // Build trait value options for selected category
  const traitValueOptions = useMemo(() => {
    if (filterCategory === 'All') return ['All'];
    const cat = TRAIT_CATEGORIES.find(c => c.label === filterCategory);
    if (!cat) return ['All'];
    return ['All', ...cat.traits.map(t => t.name)];
  }, [filterCategory]);

  const handleCategoryChange = useCallback((cat) => {
    setFilterCategory(cat);
    setFilterTraitValue('All');
  }, []);

  const filtered = useMemo(() => {
    let list = [...avatars];

    if (filterTier !== 'All') {
      list = list.filter(a => a.rarityTier === filterTier);
    }

    if (filterCategory !== 'All' && filterTraitValue !== 'All') {
      const catKey = TRAIT_CATEGORIES.find(c => c.label === filterCategory)?.key;
      if (catKey) {
        list = list.filter(a => a.traits?.[catKey]?.name === filterTraitValue);
      }
    }

    if (sortBy === 'rarity') {
      list.sort((a, b) => b.rarityScore - a.rarityScore);
    } else if (sortBy === 'id') {
      list.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'random') {
      list.sort((a, b) => {
        const ha = (a.id * 1234567 + randomSeed * 9999999) % 1;
        const hb = (b.id * 1234567 + randomSeed * 9999999) % 1;
        return ha - hb;
      });
    }

    return list;
  }, [avatars, filterTier, filterCategory, filterTraitValue, sortBy, randomSeed]);

  const ownedIds = useMemo(() => new Set((owned || []).map(a => a.id)), [owned]);

  return (
    <div className="w-full space-y-6">
      {/* ── Filter + Sort bar ── */}
      <div
        className="sticky top-0 z-20 px-4 sm:px-8 py-4 flex flex-wrap gap-3 items-center"
        style={{
          background: 'rgba(10,10,15,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,215,0,0.1)',
        }}
      >
        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider" style={{ color: '#888' }}>Sort</span>
          <div className="flex gap-1">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                style={{
                  background: sortBy === opt.value ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${sortBy === opt.value ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: sortBy === opt.value ? '#FFD700' : '#888',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-5 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />

        {/* Tier filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider" style={{ color: '#888' }}>Tier</span>
          <div className="flex flex-wrap gap-1">
            {RARITY_TIERS.map(tier => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all"
                style={{
                  background: filterTier === tier ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${filterTier === tier ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: filterTier === tier ? '#FFD700' : '#888',
                }}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        <div className="h-5 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />

        {/* Category + trait filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs uppercase tracking-wider" style={{ color: '#888' }}>Trait</span>
          <select
            value={filterCategory}
            onChange={e => handleCategoryChange(e.target.value)}
            className="text-xs rounded-lg px-2.5 py-1.5 outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: filterCategory !== 'All' ? '#FFD700' : '#888',
            }}
          >
            <option value="All">All Categories</option>
            {TRAIT_CATEGORIES.map(cat => (
              <option key={cat.key} value={cat.label}>{cat.label}</option>
            ))}
          </select>

          {filterCategory !== 'All' && (
            <select
              value={filterTraitValue}
              onChange={e => setFilterTraitValue(e.target.value)}
              className="text-xs rounded-lg px-2.5 py-1.5 outline-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: filterTraitValue !== 'All' ? '#FFD700' : '#888',
              }}
            >
              {traitValueOptions.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          )}
        </div>

        {/* Results count + mint CTA */}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs" style={{ color: '#555' }}>
            {filtered.length} ape{filtered.length !== 1 ? 's' : ''}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMintClick}
            className="text-xs font-bold px-4 py-2 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #C0A060)',
              color: '#000',
              fontFamily: "'Space Grotesk',sans-serif",
              boxShadow: '0 2px 12px rgba(255,215,0,0.3)',
            }}
          >
            🎲 Mint Yours
          </motion.button>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="px-4 sm:px-8 pb-12">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
              style={{ color: '#444' }}
            >
              <div className="text-5xl mb-4">🐒</div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif" }}>No apes match those filters</p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid gap-4"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,260px),1fr))',
              }}
            >
              {filtered.map((avatar, i) => (
                <AvatarCard
                  key={avatar.id}
                  avatar={avatar}
                  index={i}
                  onClick={onCardClick}
                  isOwned={ownedIds.has(avatar.id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
