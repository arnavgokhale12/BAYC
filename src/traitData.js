// ─── TRAIT DEFINITIONS ────────────────────────────────────────────────────────
// Each trait has: id, name, rarity, and file (PNG filename inside its category folder)
// PNGs are served from /public/traits/{category}/{file}

export const RARITIES = {
  Common:    { label: 'Common',    color: '#6b7280', glow: 'rgba(107,114,128,0.4)', weight: 50 },
  Uncommon:  { label: 'Uncommon',  color: '#22c55e', glow: 'rgba(34,197,94,0.4)',   weight: 30 },
  Rare:      { label: 'Rare',      color: '#3b82f6', glow: 'rgba(59,130,246,0.4)',  weight: 15 },
  Legendary: { label: 'Legendary', color: '#FFD700', glow: 'rgba(255,215,0,0.6)',   weight: 5  },
};

// ─── BACKGROUNDS ──────────────────────────────────────────────────────────────
export const backgrounds = [
  { id: 'bg_01', name: 'Aqua',        file: 'bg_01.png', rarity: 'Common'    },
  { id: 'bg_02', name: 'Army Green',  file: 'bg_02.png', rarity: 'Common'    },
  { id: 'bg_03', name: 'Orange',      file: 'bg_03.png', rarity: 'Common'    },
  { id: 'bg_04', name: 'Purple',      file: 'bg_04.png', rarity: 'Uncommon'  },
  { id: 'bg_05', name: 'Gold',        file: 'bg_05.png', rarity: 'Rare'      },
  { id: 'bg_06', name: 'Midnight',    file: 'bg_06.png', rarity: 'Uncommon'  },
  { id: 'bg_07', name: 'Desert',      file: 'bg_07.png', rarity: 'Common'    },
  { id: 'bg_08', name: 'Neon Pink',   file: 'bg_08.png', rarity: 'Legendary' },
];

// ─── BODIES ───────────────────────────────────────────────────────────────────
export const bodies = [
  { id: 'body_01', name: 'Brown',   file: 'body_01.png', rarity: 'Common'    },
  { id: 'body_02', name: 'Grey',    file: 'body_02.png', rarity: 'Common'    },
  { id: 'body_03', name: 'White',   file: 'body_03.png', rarity: 'Uncommon'  },
  { id: 'body_04', name: 'Blue',    file: 'body_04.png', rarity: 'Rare'      },
  { id: 'body_05', name: 'Green',   file: 'body_05.png', rarity: 'Uncommon'  },
  { id: 'body_06', name: 'Gold',    file: 'body_06.png', rarity: 'Rare'      },
  { id: 'body_07', name: 'Black',   file: 'body_07.png', rarity: 'Common'    },
  { id: 'body_08', name: 'Pink',    file: 'body_08.png', rarity: 'Legendary' },
];

// ─── CLOTHING ─────────────────────────────────────────────────────────────────
export const clothing = [
  { id: 'cloth_01', name: 'Striped Tee',     file: 'clothing_01.png', rarity: 'Common'    },
  { id: 'cloth_02', name: 'Denim Jacket',    file: 'clothing_02.png', rarity: 'Common'    },
  { id: 'cloth_03', name: 'Biker Jacket',    file: 'clothing_03.png', rarity: 'Uncommon'  },
  { id: 'cloth_04', name: 'Tuxedo',          file: 'clothing_04.png', rarity: 'Rare'      },
  { id: 'cloth_05', name: 'Hawaiian Shirt',  file: 'clothing_05.png', rarity: 'Common'    },
  { id: 'cloth_06', name: 'Lab Coat',        file: 'clothing_06.png', rarity: 'Uncommon'  },
  { id: 'cloth_07', name: 'Space Suit',      file: 'clothing_07.png', rarity: 'Rare'      },
  { id: 'cloth_08', name: 'Samurai Armor',   file: 'clothing_08.png', rarity: 'Legendary' },
];

// ─── EYES ─────────────────────────────────────────────────────────────────────
export const eyes = [
  { id: 'eyes_01', name: 'Bored',        file: 'eyes_01.png', rarity: 'Common'    },
  { id: 'eyes_02', name: 'Bloodshot',    file: 'eyes_02.png', rarity: 'Common'    },
  { id: 'eyes_03', name: 'Sunglasses',   file: 'eyes_03.png', rarity: 'Common'    },
  { id: 'eyes_04', name: 'Sleepy',       file: 'eyes_04.png', rarity: 'Uncommon'  },
  { id: 'eyes_05', name: '3D Glasses',   file: 'eyes_05.png', rarity: 'Uncommon'  },
  { id: 'eyes_06', name: 'Hypnotized',   file: 'eyes_06.png', rarity: 'Rare'      },
  { id: 'eyes_07', name: 'Laser Eyes',   file: 'eyes_07.png', rarity: 'Legendary' },
  { id: 'eyes_08', name: 'Dollar Eyes',  file: 'eyes_08.png', rarity: 'Legendary' },
];

// ─── MOUTH ────────────────────────────────────────────────────────────────────
export const mouth = [
  { id: 'mouth_01', name: 'Bored',        file: 'mouth_01.png', rarity: 'Common'    },
  { id: 'mouth_02', name: 'Cigarette',    file: 'mouth_02.png', rarity: 'Common'    },
  { id: 'mouth_03', name: 'Grin',         file: 'mouth_03.png', rarity: 'Common'    },
  { id: 'mouth_04', name: 'Tongue Out',   file: 'mouth_04.png', rarity: 'Uncommon'  },
  { id: 'mouth_05', name: 'Rainbow',      file: 'mouth_05.png', rarity: 'Rare'      },
  { id: 'mouth_06', name: 'Gold Grillz',  file: 'mouth_06.png', rarity: 'Rare'      },
  { id: 'mouth_07', name: 'Fangs',        file: 'mouth_07.png', rarity: 'Uncommon'  },
  { id: 'mouth_08', name: 'Diamond',      file: 'mouth_08.png', rarity: 'Legendary' },
];

// ─── HATS ─────────────────────────────────────────────────────────────────────
export const hats = [
  { id: 'hat_01', name: 'Baseball Cap',  file: 'hat_01.png', rarity: 'Common'    },
  { id: 'hat_02', name: 'Beanie',        file: 'hat_02.png', rarity: 'Common'    },
  { id: 'hat_03', name: 'Cowboy Hat',    file: 'hat_03.png', rarity: 'Common'    },
  { id: 'hat_04', name: 'Safari Hat',    file: 'hat_04.png', rarity: 'Uncommon'  },
  { id: 'hat_05', name: 'Party Hat',     file: 'hat_05.png', rarity: 'Common'    },
  { id: 'hat_06', name: 'Crown',         file: 'hat_06.png', rarity: 'Rare'      },
  { id: 'hat_07', name: 'Top Hat',       file: 'hat_07.png', rarity: 'Uncommon'  },
  { id: 'hat_08', name: 'Halo',          file: 'hat_08.png', rarity: 'Legendary' },
];

// ─── ACCESSORIES ──────────────────────────────────────────────────────────────
export const accessories = [
  { id: 'acc_01', name: 'Gold Hoop',       file: 'acc_01.png', rarity: 'Common'    },
  { id: 'acc_02', name: 'Pipe',            file: 'acc_02.png', rarity: 'Common'    },
  { id: 'acc_03', name: 'Gold Chain',      file: 'acc_03.png', rarity: 'Uncommon'  },
  { id: 'acc_04', name: 'Bandana',         file: 'acc_04.png', rarity: 'Common'    },
  { id: 'acc_05', name: 'Diamond Stud',    file: 'acc_05.png', rarity: 'Rare'      },
  { id: 'acc_06', name: 'Cross Pendant',   file: 'acc_06.png', rarity: 'Uncommon'  },
  { id: 'acc_07', name: 'Monocle',         file: 'acc_07.png', rarity: 'Rare'      },
  { id: 'acc_08', name: 'ETH Pendant',     file: 'acc_08.png', rarity: 'Legendary' },
];

// ─── TRAIT CATEGORIES (used by generator and UI) ──────────────────────────────
export const TRAIT_CATEGORIES = [
  { key: 'background', label: 'Background', traits: backgrounds },
  { key: 'body',       label: 'Body',       traits: bodies      },
  { key: 'clothing',   label: 'Clothing',   traits: clothing    },
  { key: 'eyes',       label: 'Eyes',       traits: eyes        },
  { key: 'mouth',      label: 'Mouth',      traits: mouth       },
  { key: 'hat',        label: 'Hat',        traits: hats        },
  { key: 'accessory',  label: 'Accessory',  traits: accessories },
];

// ─── RARITY HELPERS ───────────────────────────────────────────────────────────

/** Pick a random trait from an array using rarity weights. */
export function pickTrait(traits) {
  const totalWeight = traits.reduce((sum, t) => sum + (RARITIES[t.rarity]?.weight ?? 1), 0);
  let rand = Math.random() * totalWeight;
  for (const t of traits) {
    rand -= RARITIES[t.rarity]?.weight ?? 1;
    if (rand <= 0) return t;
  }
  return traits[traits.length - 1];
}

const RARITY_SCORES = { Common: 1, Uncommon: 4, Rare: 10, Legendary: 30 };

/** Sum the rarity scores of all traits on an avatar. */
export function calcRarityScore(traits) {
  return Object.values(traits).reduce((sum, t) => sum + (RARITY_SCORES[t?.rarity] ?? 0), 0);
}

/** Map a numeric rarity score to a tier label. */
export function rarityTier(score) {
  if (score >= 80) return 'Legendary';
  if (score >= 40) return 'Rare';
  if (score >= 20) return 'Uncommon';
  return 'Common';
}
