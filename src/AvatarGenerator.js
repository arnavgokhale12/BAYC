import { TRAIT_CATEGORIES, pickTrait, calcRarityScore, rarityTier } from './traitData';

const COLLECTION_KEY = 'bayc_collection';
const COLLECTION_SIZE = 20;

// Draw a complete avatar to a canvas context
export function drawAvatar(ctx, size, traits) {
  ctx.clearRect(0, 0, size, size);
  // draw each layer in order
  const order = ['background', 'body', 'clothing', 'eyes', 'mouth', 'hat', 'accessory'];
  for (const key of order) {
    const trait = traits[key];
    if (trait && trait.draw) {
      ctx.save();
      trait.draw(ctx, size);
      ctx.restore();
    }
  }
}

// Generate a single random avatar
function generateAvatar(id) {
  const traits = {};
  for (const cat of TRAIT_CATEGORIES) {
    traits[cat.key] = pickTrait(cat.traits);
  }
  const score = calcRarityScore(traits);
  const tier  = rarityTier(score);

  // Convert draw functions to serializable form (store only ids)
  const traitIds = {};
  for (const [k, v] of Object.entries(traits)) {
    traitIds[k] = v.id;
  }

  return {
    id,
    name: `Ape #${String(id).padStart(4, '0')}`,
    traitIds,
    rarityScore: score,
    rarityTier: tier,
  };
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
  localStorage.setItem(COLLECTION_KEY, JSON.stringify(fresh.map(a => ({
    id: a.id, name: a.name, traitIds: a.traitIds, rarityScore: a.rarityScore, rarityTier: a.rarityTier,
  }))));
  return fresh.map(hydrateAvatar);
}

// Mint a new random avatar
export function mintAvatar(existingCount) {
  const newId = 1000 + existingCount + 1;
  const raw = generateAvatar(newId);
  return hydrateAvatar(raw);
}

// Render avatar to a data URL string for caching
export function avatarToDataURL(traits, size = 200) {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  drawAvatar(ctx, size, traits);
  return canvas.toDataURL('image/png');
}
