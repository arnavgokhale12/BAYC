import { TRAIT_CATEGORIES, pickTrait, calcRarityScore, rarityTier } from './traitData';

const COLLECTION_KEY  = 'bayc_collection';
const COLLECTION_SIZE = 20;

// Generate a single random avatar (serialisable form only — no draw functions)
function generateAvatar(id) {
  const traits    = {};
  const traitIds  = {};

  for (const cat of TRAIT_CATEGORIES) {
    const t = pickTrait(cat.traits);
    traits[cat.key]   = t;
    traitIds[cat.key] = t.id;
  }

  const score = calcRarityScore(traits);
  const tier  = rarityTier(score);

  return { id, name: `Ape #${String(id).padStart(4, '0')}`, traitIds, rarityScore: score, rarityTier: tier };
}

// Rebuild full trait objects from stored ids
export function hydrateAvatar(stored) {
  const traits = {};
  for (const cat of TRAIT_CATEGORIES) {
    const tid = stored.traitIds[cat.key];
    traits[cat.key] = cat.traits.find(t => t.id === tid) || cat.traits[0];
  }
  return { ...stored, traits };
}

// Load or generate the collection
export function loadCollection() {
  try {
    const raw = localStorage.getItem(COLLECTION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === COLLECTION_SIZE) {
        return parsed.map(hydrateAvatar);
      }
    }
  } catch {}

  // Generate fresh
  const fresh = Array.from({ length: COLLECTION_SIZE }, (_, i) => generateAvatar(i + 1));
  try {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(
      fresh.map(({ id, name, traitIds, rarityScore, rarityTier }) =>
        ({ id, name, traitIds, rarityScore, rarityTier })
      )
    ));
  } catch {}
  return fresh.map(hydrateAvatar);
}

// Mint a new random avatar
export function mintAvatar(existingCount) {
  const newId = 1000 + existingCount + 1;
  return hydrateAvatar(generateAvatar(newId));
}
