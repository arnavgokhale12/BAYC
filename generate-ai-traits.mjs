#!/usr/bin/env node
/**
 * generate-ai-traits.mjs
 * Generates 600×600 AI-illustrated PNG trait layers using the Hugging Face
 * Inference API (stabilityai/stable-diffusion-xl-base-1.0).
 *
 * Prerequisites:
 *   VITE_HF_TOKEN=<your huggingface token>  (in .env or shell)
 *
 * Usage:
 *   node generate-ai-traits.mjs
 *
 * Skips files that already exist — safe to re-run after a crash.
 *
 * NOTE: SDXL returns solid-background images. For non-background layers
 * (body, eyes, clothing, etc.) the prompts request "isolated on white".
 * You can post-process with a background-removal tool (e.g. rembg, remove.bg)
 * to convert them to transparent PNGs for proper layer compositing.
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// ── Load token from .env if present ──────────────────────────────────────────
try {
  const { readFileSync } = await import('fs');
  const envPath = join(dirname(fileURLToPath(import.meta.url)), '.env');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const [k, ...v] = line.split('=');
      if (k && v.length && !process.env[k.trim()]) {
        process.env[k.trim()] = v.join('=').trim();
      }
    }
  }
} catch {}

const HF_TOKEN = process.env.VITE_HF_TOKEN;
if (!HF_TOKEN) {
  console.error('❌  VITE_HF_TOKEN not set. Add it to .env or export it in your shell.');
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT       = join(__dirname, 'public', 'traits');
const MODEL_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';
const SIZE      = 600;

// ── Helpers ───────────────────────────────────────────────────────────────────
function outPath(cat, file) { return join(OUT, cat, file); }
function skip(cat, file)    { return existsSync(outPath(cat, file)); }

async function generate(prompt, negativePrompt = '') {
  const payload = {
    inputs: prompt,
    parameters: {
      negative_prompt: negativePrompt,
      width: 1024,
      height: 1024,
      num_inference_steps: 30,
      guidance_scale: 7.5,
    },
  };

  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'image/png',
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 503) {
      // Model still loading — wait and retry
      let waitSec = 30;
      try {
        const j = await res.json();
        waitSec = Math.min(j.estimated_time ?? 30, 60);
      } catch {}
      console.log(`  ⏳ Model loading, waiting ${waitSec}s (attempt ${attempt}/5)…`);
      await new Promise(r => setTimeout(r, waitSec * 1000));
      continue;
    }

    if (res.status === 429) {
      console.log(`  ⚠️  Rate limited — waiting 60s…`);
      await new Promise(r => setTimeout(r, 60_000));
      continue;
    }

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`HF API error ${res.status}: ${body.slice(0, 200)}`);
    }

    // Success — resize to 600×600 via sharp
    const buf    = Buffer.from(await res.arrayBuffer());
    const resized = await sharp(buf).resize(SIZE, SIZE, { fit: 'cover' }).toBuffer();
    return resized;
  }

  throw new Error('Exceeded retry limit for HF API call');
}

async function save(cat, file, prompt, neg = '') {
  const dest = outPath(cat, file);
  if (skip(cat, file)) {
    console.log(`  ⏭️  ${cat}/${file} (already exists)`);
    return;
  }
  mkdirSync(join(OUT, cat), { recursive: true });
  console.log(`  🎨 Generating ${cat}/${file}…`);
  const buf = await generate(prompt, neg);
  writeFileSync(dest, buf);
  console.log(`  ✓  Saved ${cat}/${file}`);
  // Brief pause to respect rate limits
  await new Promise(r => setTimeout(r, 2_000));
}

const NEG_BASE = 'text, watermark, signature, blurry, low quality, cropped';
const NEG_BODY = `${NEG_BASE}, hat, glasses, clothing, background scene`;

// ── Trait definitions ─────────────────────────────────────────────────────────

const BACKGROUNDS = [
  { file: 'bg_01.png', prompt: 'teal aqua solid color NFT background, subtle sine wave pattern, flat digital art, minimalist' },
  { file: 'bg_02.png', prompt: 'army olive green solid color NFT background, subtle dot pattern, flat digital art, minimalist' },
  { file: 'bg_03.png', prompt: 'deep orange fiery gradient NFT background, warm glow, flat digital art, minimalist' },
  { file: 'bg_04.png', prompt: 'deep purple cosmic background, scattered stars, nebula glow, NFT art, flat digital illustration' },
  { file: 'bg_05.png', prompt: 'golden radial burst background, sunray pattern, warm gold and amber, NFT art style, flat digital illustration' },
  { file: 'bg_06.png', prompt: 'midnight dark navy blue background, subtle grid lines, blueprint style, NFT digital art' },
  { file: 'bg_07.png', prompt: 'sandy desert tan beige background, subtle dune texture, warm minimal, NFT digital art' },
  { file: 'bg_08.png', prompt: 'neon hot pink and magenta background, glowing grid, cyberpunk vibe, NFT digital art, flat illustration' },
];

const BODIES = [
  { file: 'body_01.png', prompt: 'cartoon bored ape NFT, brown fur, front-facing portrait, isolated on white, bold outlines, flat color illustration, no background, centered' },
  { file: 'body_02.png', prompt: 'cartoon bored ape NFT, grey fur, front-facing portrait, isolated on white, bold outlines, flat color illustration, no background, centered' },
  { file: 'body_03.png', prompt: 'cartoon bored ape NFT, white cream fur, front-facing portrait, isolated on white, bold outlines, flat color illustration, no background, centered' },
  { file: 'body_04.png', prompt: 'cartoon bored ape NFT, electric blue fur, front-facing portrait, isolated on white, bold outlines, flat color illustration, no background, centered' },
  { file: 'body_05.png', prompt: 'cartoon bored ape NFT, green fur with dark patches, front-facing portrait, isolated on white, bold outlines, flat color illustration, no background, centered' },
  { file: 'body_06.png', prompt: 'cartoon bored ape NFT, shimmering gold fur, front-facing portrait, isolated on white, bold outlines, flat color illustration, no background, centered, glossy sheen' },
  { file: 'body_07.png', prompt: 'cartoon bored ape NFT, jet black fur, front-facing portrait, isolated on white, bold outlines, flat color illustration, no background, centered' },
  { file: 'body_08.png', prompt: 'cartoon bored ape NFT, pink bubblegum fur, front-facing portrait, isolated on white, bold outlines, flat color illustration, no background, centered' },
];

const EYES = [
  { file: 'eyes_01.png', prompt: 'cartoon ape eyes, bored half-closed eyelids, simple round eyes, isolated on transparent, NFT illustration style, centered, no face features except eyes' },
  { file: 'eyes_02.png', prompt: 'cartoon ape eyes, bloodshot red veins, wide open eyes, isolated on transparent, NFT illustration style, centered' },
  { file: 'eyes_03.png', prompt: 'cartoon ape wearing round sunglasses, reflective lenses, isolated on transparent, NFT illustration style, centered, no face' },
  { file: 'eyes_04.png', prompt: 'cartoon ape eyes, heavy droopy eyelids, sleepy expression, isolated on transparent, NFT illustration style, centered' },
  { file: 'eyes_05.png', prompt: 'cartoon ape wearing 3D glasses, red and blue lenses, isolated on transparent, NFT illustration style, centered' },
  { file: 'eyes_06.png', prompt: 'cartoon ape eyes, hypnotized spiral eyes, colorful rings, isolated on transparent, NFT illustration style, centered' },
  { file: 'eyes_07.png', prompt: 'cartoon ape eyes, glowing red laser eyes, fiery beams, isolated on transparent, NFT illustration style, centered, dramatic' },
  { file: 'eyes_08.png', prompt: 'cartoon ape eyes, golden dollar sign pupils, shiny gold iris, isolated on transparent, NFT illustration style, centered, legendary' },
];

const MOUTHS = [
  { file: 'mouth_01.png', prompt: 'cartoon ape mouth, neutral bored expression, thin lips, isolated on transparent, NFT illustration style, centered, only mouth region' },
  { file: 'mouth_02.png', prompt: 'cartoon ape mouth, cigarette dangling from lips, smoking, isolated on transparent, NFT illustration style, centered' },
  { file: 'mouth_03.png', prompt: 'cartoon ape mouth, toothy grin smile, white teeth, isolated on transparent, NFT illustration style, centered' },
  { file: 'mouth_04.png', prompt: 'cartoon ape mouth, open mouth tongue out, playful, isolated on transparent, NFT illustration style, centered' },
  { file: 'mouth_05.png', prompt: 'cartoon ape mouth, small rainbow colored mouth, colorful, isolated on transparent, NFT illustration style, centered' },
  { file: 'mouth_06.png', prompt: 'cartoon ape mouth, gold teeth grillz, bling, isolated on transparent, NFT illustration style, centered' },
  { file: 'mouth_07.png', prompt: 'cartoon ape mouth, fangs vampire teeth, menacing smile, isolated on transparent, NFT illustration style, centered' },
  { file: 'mouth_08.png', prompt: 'cartoon ape mouth, diamond teeth, shiny gems, luxurious, isolated on transparent, NFT illustration style, centered' },
];

const HATS = [
  { file: 'hat_01.png', prompt: 'cartoon ape wearing a baseball cap, side view, isolated on transparent, NFT illustration style, only the hat floating above face level' },
  { file: 'hat_02.png', prompt: 'cartoon ape wearing a beanie wool hat, cozy, isolated on transparent, NFT illustration style, only the hat' },
  { file: 'hat_03.png', prompt: 'cartoon ape wearing a cowboy hat, western style, isolated on transparent, NFT illustration style, only the hat' },
  { file: 'hat_04.png', prompt: 'cartoon ape wearing a safari bush hat, adventurer, isolated on transparent, NFT illustration style, only the hat' },
  { file: 'hat_05.png', prompt: 'cartoon ape wearing a party birthday hat, colorful cone, isolated on transparent, NFT illustration style, only the hat' },
  { file: 'hat_06.png', prompt: 'cartoon ape wearing a golden crown, royalty, isolated on transparent, NFT illustration style, only the crown, shiny gold' },
  { file: 'hat_07.png', prompt: 'cartoon ape wearing a top hat, Victorian elegant, isolated on transparent, NFT illustration style, only the hat' },
  { file: 'hat_08.png', prompt: 'cartoon ape wearing a halo floating ring, angel, isolated on transparent, NFT illustration style, glowing golden halo only' },
];

const CLOTHING = [
  { file: 'clothing_01.png', prompt: 'cartoon ape wearing a striped t-shirt, casual, isolated on transparent, NFT illustration style, only chest and torso clothing' },
  { file: 'clothing_02.png', prompt: 'cartoon ape wearing a blue denim jacket, casual, isolated on transparent, NFT illustration style, only the jacket' },
  { file: 'clothing_03.png', prompt: 'cartoon ape wearing a leather biker jacket, punk, isolated on transparent, NFT illustration style, only the jacket' },
  { file: 'clothing_04.png', prompt: 'cartoon ape wearing a black tuxedo suit with bow tie, formal, isolated on transparent, NFT illustration style, only the suit' },
  { file: 'clothing_05.png', prompt: 'cartoon ape wearing a Hawaiian tropical shirt, colorful print, isolated on transparent, NFT illustration style, only the shirt' },
  { file: 'clothing_06.png', prompt: 'cartoon ape wearing a lab coat with pocket, scientist, isolated on transparent, NFT illustration style, only the coat' },
  { file: 'clothing_07.png', prompt: 'cartoon ape wearing a space suit astronaut uniform, isolated on transparent, NFT illustration style, only the suit' },
  { file: 'clothing_08.png', prompt: 'cartoon ape wearing an ancient samurai armor, legendary, isolated on transparent, NFT illustration style, golden armor only' },
];

const ACCESSORIES = [
  { file: 'acc_01.png', prompt: 'floating small gold hoop earring, jewelry accessory, isolated on transparent, NFT illustration style, simple jewelry' },
  { file: 'acc_02.png', prompt: 'floating wooden pipe accessory, old fashioned pipe, isolated on transparent, NFT illustration style, pipe only' },
  { file: 'acc_03.png', prompt: 'floating gold chain necklace, bling, isolated on transparent, NFT illustration style, chain necklace' },
  { file: 'acc_04.png', prompt: 'floating bandana tied around neck, cool style, isolated on transparent, NFT illustration style, bandana only' },
  { file: 'acc_05.png', prompt: 'floating diamond stud earring, shiny gem, isolated on transparent, NFT illustration style, diamond earring' },
  { file: 'acc_06.png', prompt: 'floating small silver cross pendant necklace, isolated on transparent, NFT illustration style, pendant only' },
  { file: 'acc_07.png', prompt: 'floating monocle eyepiece on gold chain, gentleman, isolated on transparent, NFT illustration style, monocle only' },
  { file: 'acc_08.png', prompt: 'floating glowing ethereum ETH symbol pendant necklace, crypto, isolated on transparent, NFT illustration style, ETH pendant' },
];

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🎨  Generating AI trait PNGs via Hugging Face Inference API');
  console.log(`    Model: stabilityai/stable-diffusion-xl-base-1.0`);
  console.log(`    Output: ${OUT}\n`);

  const cats = [
    { key: 'background', traits: BACKGROUNDS, neg: NEG_BASE  },
    { key: 'body',       traits: BODIES,       neg: NEG_BODY  },
    { key: 'eyes',       traits: EYES,         neg: NEG_BASE  },
    { key: 'mouth',      traits: MOUTHS,        neg: NEG_BASE  },
    { key: 'hat',        traits: HATS,          neg: NEG_BASE  },
    { key: 'clothing',   traits: CLOTHING,      neg: NEG_BASE  },
    { key: 'accessory',  traits: ACCESSORIES,   neg: NEG_BASE  },
  ];

  for (const { key, traits, neg } of cats) {
    console.log(`\n📦 ${key.charAt(0).toUpperCase() + key.slice(1)}`);
    for (const t of traits) {
      await save(key, t.file, t.prompt, neg);
    }
  }

  console.log('\n✅  All done! Generated trait PNGs are in public/traits/');
  console.log('    Tip: run a background-removal tool on non-background layers');
  console.log('    to get transparent PNGs for perfect layer compositing.');
}

main().catch(err => { console.error('\n❌ Fatal error:', err.message); process.exit(1); });
