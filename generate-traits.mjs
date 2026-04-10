#!/usr/bin/env node
/**
 * generate-traits.mjs
 * Generates 600×600 placeholder PNG trait layers — 8 per category, 56 total.
 * Run once:  node generate-traits.mjs
 * Replace with AI art via:  node generate-ai-traits.mjs
 */

import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'public', 'traits');
const S   = 600;

// ─── SHARED ANATOMY (used for precise layer alignment) ──────────────────────
const HEAD   = { x: 300, y: 225, r: 155 };
const EAR_L  = { x: 137, y: 178, r: 50 };
const EAR_R  = { x: 463, y: 178, r: 50 };
const MUZZLE = { x: 300, y: 310, rx: 92,  ry: 63  };
const EYE_L  = { x: 232, y: 198 };
const EYE_R  = { x: 368, y: 198 };
const EYE_ER = 28; // eye outer radius
const MOUTH  = { x: 300, y: 315 };
const TORSO  = { x: 88,  y: 368, w: 424, h: 232, r: 45 };
const STROKE = '#1a0d00';

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function make()   { const c = createCanvas(S, S); return [c, c.getContext('2d')]; }
function makeT()  { const [c, x] = make(); x.clearRect(0, 0, S, S); return [c, x]; }

function save(cat, file, canvas) {
  const dir = join(OUT, cat);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, file), canvas.toBuffer('image/png'));
  process.stdout.write(`  ✓ ${cat}/${file}\n`);
}

function rr(ctx, x, y, w, h, r = 20) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);      ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r);  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);      ctx.arcTo(x, y + h,     x, y + h - r,     r);
  ctx.lineTo(x, y + r);          ctx.arcTo(x, y,         x + r, y,         r);
  ctx.closePath();
}

function circ(ctx, cx, cy, r) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); }
function ell(ctx, cx, cy, rx, ry) { ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); }

function bold(ctx, w = 5, color = STROKE) { ctx.lineWidth = w; ctx.strokeStyle = color; }

// ─── BACKGROUNDS ─────────────────────────────────────────────────────────────
function genBackgrounds() {
  console.log('\n📦 Backgrounds');

  const defs = [
    { file: 'bg_01.png', fn: (ctx) => {
      const g = ctx.createLinearGradient(0, 0, S, S);
      g.addColorStop(0, '#0a6880'); g.addColorStop(1, '#15c8dc');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 2;
      for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        for (let x = 0; x <= S; x += 8) {
          const y = i * 70 + Math.sin(x / 45) * 18;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }},
    { file: 'bg_02.png', fn: (ctx) => {
      const g = ctx.createLinearGradient(0, 0, S, S);
      g.addColorStop(0, '#1c3a0e'); g.addColorStop(1, '#3a6420');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      for (let row = 0; row < 10; row++) for (let col = 0; col < 10; col++) {
        circ(ctx, col * 65 + 30, row * 65 + 30, 4);
        ctx.fill();
      }
    }},
    { file: 'bg_03.png', fn: (ctx) => {
      const g = ctx.createLinearGradient(S, S, 0, 0);
      g.addColorStop(0, '#6b2000'); g.addColorStop(0.5, '#d44e00'); g.addColorStop(1, '#ff8800');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    }},
    { file: 'bg_04.png', fn: (ctx) => {
      const g = ctx.createLinearGradient(0, 0, S, S);
      g.addColorStop(0, '#160630'); g.addColorStop(1, '#5c1a90');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
      // stars
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      for (let i = 0; i < 60; i++) {
        const sx = (Math.sin(i * 137.5) * 0.5 + 0.5) * S;
        const sy = (Math.cos(i * 137.5 + 1) * 0.5 + 0.5) * S;
        circ(ctx, sx, sy, 1.5 + (i % 3) * 0.8);
        ctx.fill();
      }
    }},
    { file: 'bg_05.png', fn: (ctx) => {
      const g = ctx.createRadialGradient(S/2, S/2, 0, S/2, S/2, S * 0.85);
      g.addColorStop(0, '#e0a800'); g.addColorStop(0.5, '#b07800'); g.addColorStop(1, '#3d2200');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
      // rays
      ctx.strokeStyle = 'rgba(255,215,0,0.12)'; ctx.lineWidth = 18;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(S/2, S/2);
        ctx.lineTo(S/2 + Math.cos(a) * S, S/2 + Math.sin(a) * S);
        ctx.stroke();
      }
    }},
    { file: 'bg_06.png', fn: (ctx) => {
      const g = ctx.createRadialGradient(S/2, S/2, 0, S/2, S/2, S * 0.8);
      g.addColorStop(0, '#001533'); g.addColorStop(1, '#000a1e');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = 'rgba(0,100,255,0.09)'; ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        ctx.beginPath(); ctx.moveTo(i * 60, 0); ctx.lineTo(i * 60, S); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * 60); ctx.lineTo(S, i * 60); ctx.stroke();
      }
    }},
    { file: 'bg_07.png', fn: (ctx) => {
      const g = ctx.createLinearGradient(0, 0, S, S);
      g.addColorStop(0,    '#ff006e'); g.addColorStop(0.17, '#8338ec');
      g.addColorStop(0.34, '#3a86ff'); g.addColorStop(0.5,  '#06d6a0');
      g.addColorStop(0.67, '#ffb703'); g.addColorStop(0.84, '#ff4e00');
      g.addColorStop(1,    '#ff006e');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
      // shimmer stripes
      ctx.fillStyle = 'rgba(255,255,255,0.13)';
      for (let i = 0; i < 6; i++) {
        ctx.fillRect(i * 110, 0, 28, S);
      }
    }},
    { file: 'bg_08.png', fn: (ctx) => {
      const g = ctx.createLinearGradient(0, S, S, 0);
      g.addColorStop(0, '#6b4e1e'); g.addColorStop(1, '#c8a45a');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) {
        circ(ctx, col * 80 + 40, row * 80 + 40, 5);
        ctx.fill();
      }
    }},
  ];

  defs.forEach(({ file, fn }) => {
    const [canvas, ctx] = make();
    fn(ctx);
    save('background', file, canvas);
  });
}

// ─── BODY (ape silhouette) ────────────────────────────────────────────────────
function drawApe(ctx, fur, furDark, muzzleClr, earInner, opts = {}) {
  bold(ctx, 5);

  // Torso
  rr(ctx, TORSO.x, TORSO.y, TORSO.w, TORSO.h, TORSO.r);
  ctx.fillStyle = fur; ctx.fill(); ctx.stroke();

  // Ears (behind head — draw first)
  [EAR_L, EAR_R].forEach(e => {
    circ(ctx, e.x, e.y, e.r);
    ctx.fillStyle = furDark; ctx.fill(); ctx.stroke();
    circ(ctx, e.x, e.y, e.r * 0.52);
    ctx.fillStyle = earInner; ctx.fill();
  });

  // Head
  circ(ctx, HEAD.x, HEAD.y, HEAD.r);
  ctx.fillStyle = fur; ctx.fill(); ctx.stroke();

  // Muzzle
  ell(ctx, MUZZLE.x, MUZZLE.y, MUZZLE.rx, MUZZLE.ry);
  ctx.fillStyle = muzzleClr; ctx.fill(); ctx.stroke();

  // Optional effects
  if (opts.shine) {
    const shine = ctx.createRadialGradient(260, 165, 0, 260, 165, 110);
    shine.addColorStop(0, 'rgba(255,255,210,0.38)');
    shine.addColorStop(1, 'rgba(255,255,210,0)');
    ctx.fillStyle = shine;
    circ(ctx, HEAD.x, HEAD.y, HEAD.r); ctx.fill();
  }
  if (opts.patches) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    [[255, 195, 28, 20], [345, 230, 22, 16], [305, 165, 14, 10]].forEach(([x, y, rx, ry]) => {
      ell(ctx, x, y, rx, ry); ctx.fill();
    });
  }
  if (opts.stripes) {
    // tiger-like dark stripes
    ctx.strokeStyle = opts.stripeColor || 'rgba(0,0,0,0.25)'; ctx.lineWidth = 10;
    ctx.save(); ctx.beginPath(); circ(ctx, HEAD.x, HEAD.y, HEAD.r); ctx.clip();
    for (let i = -3; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(HEAD.x - HEAD.r + i * 55, HEAD.y - HEAD.r);
      ctx.lineTo(HEAD.x - HEAD.r + i * 55 + 30, HEAD.y + HEAD.r);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function genBodies() {
  console.log('\n📦 Bodies');
  const defs = [
    { file: 'body_01.png', fur: '#8B5E3C', furDark: '#5A3B1E', muzzle: '#B07850', ear: '#7A4A2A' },
    { file: 'body_02.png', fur: '#6B7280', furDark: '#3F4652', muzzle: '#9CA3AF', ear: '#545B67' },
    { file: 'body_03.png', fur: '#F0EBE0', furDark: '#C5B89A', muzzle: '#FFFFFF', ear: '#DACEBC' },
    { file: 'body_04.png', fur: '#2A5FBF', furDark: '#16337A', muzzle: '#4A7FDF', ear: '#1E4A98' },
    { file: 'body_05.png', fur: '#4C7A44', furDark: '#2A4424', muzzle: '#6AAA60', ear: '#3A5C34', opts: { patches: true } },
    { file: 'body_06.png', fur: '#D4A017', furDark: '#8A5C00', muzzle: '#F0C840', ear: '#B07C0A', opts: { shine: true } },
    { file: 'body_07.png', fur: '#2A1E1A', furDark: '#0A0808', muzzle: '#453030', ear: '#1A1010' },
    { file: 'body_08.png', fur: '#D4788A', furDark: '#9A3A50', muzzle: '#E89AAA', ear: '#B85A70' },
  ];

  defs.forEach(({ file, fur, furDark, muzzle, ear, opts = {} }) => {
    const [canvas, ctx] = makeT();
    drawApe(ctx, fur, furDark, muzzle, ear, opts);
    save('body', file, canvas);
  });
}

// ─── EYES ─────────────────────────────────────────────────────────────────────
function drawEyeBase(ctx, cx, cy, irisColor, pupilOffset = { x: 3, y: -2 }, opts = {}) {
  // sclera
  circ(ctx, cx, cy, EYE_ER);
  ctx.fillStyle = '#fff'; ctx.fill();
  bold(ctx, 4); ctx.stroke();
  // iris
  circ(ctx, cx, cy, EYE_ER * 0.72);
  ctx.fillStyle = irisColor; ctx.fill();
  // pupil
  circ(ctx, cx + pupilOffset.x, cy + pupilOffset.y, EYE_ER * 0.38);
  ctx.fillStyle = '#050505'; ctx.fill();
  // highlight
  circ(ctx, cx + EYE_ER * 0.28, cy - EYE_ER * 0.28, EYE_ER * 0.16);
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fill();
}

function genEyes() {
  console.log('\n📦 Eyes');

  // 1. Bored — brown irises, pupils centred slightly down
  const e1 = () => {
    const [canvas, ctx] = makeT();
    [EYE_L, EYE_R].forEach(e => {
      drawEyeBase(ctx, e.x, e.y, '#7a5035', { x: 2, y: 4 });
      // heavy bored upper-lid overlay (dark arc)
      ctx.save();
      ctx.beginPath(); ctx.rect(e.x - 35, e.y - 38, 70, 36); ctx.clip();
      ctx.beginPath(); circ(ctx, e.x, e.y - 2, EYE_ER + 2);
      ctx.fillStyle = 'rgba(20,10,5,0.55)'; ctx.fill();
      ctx.restore();
    });
    save('eyes', 'eyes_01.png', canvas);
  };

  // 2. Angry — red irises + brow lines
  const e2 = () => {
    const [canvas, ctx] = makeT();
    [EYE_L, EYE_R].forEach((e, i) => {
      drawEyeBase(ctx, e.x, e.y, '#cc1a1a', { x: 2, y: 1 });
      // angled brow
      bold(ctx, 7, '#1a0d00');
      ctx.beginPath();
      const d = i === 0 ? -1 : 1;
      ctx.moveTo(e.x - 32, e.y - EYE_ER - 14 + d * 12);
      ctx.lineTo(e.x + 32, e.y - EYE_ER - 14 - d * 12);
      ctx.stroke();
    });
    save('eyes', 'eyes_02.png', canvas);
  };

  // 3. Happy — bright green irises, crinkle at bottom
  const e3 = () => {
    const [canvas, ctx] = makeT();
    [EYE_L, EYE_R].forEach(e => {
      drawEyeBase(ctx, e.x, e.y, '#22aa55', { x: 0, y: -2 });
      // crinkle lines
      bold(ctx, 3, '#1a0d00');
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(e.x + i * 12, e.y + EYE_ER + 2);
        ctx.lineTo(e.x + i * 12, e.y + EYE_ER + 9);
        ctx.stroke();
      }
    });
    save('eyes', 'eyes_03.png', canvas);
  };

  // 4. Sleepy — squinted ovals
  const e4 = () => {
    const [canvas, ctx] = makeT();
    [EYE_L, EYE_R].forEach(e => {
      ell(ctx, e.x, e.y + 4, EYE_ER * 1.1, EYE_ER * 0.5);
      ctx.fillStyle = '#fff'; ctx.fill();
      bold(ctx, 4); ctx.stroke();
      ell(ctx, e.x, e.y + 4, EYE_ER * 0.72, EYE_ER * 0.35);
      ctx.fillStyle = '#5a4030'; ctx.fill();
      circ(ctx, e.x + 2, e.y + 5, 7);
      ctx.fillStyle = '#050505'; ctx.fill();
      // heavy droopy lid
      ctx.fillStyle = 'rgba(20,10,5,0.6)';
      ctx.beginPath();
      ctx.ellipse(e.x, e.y - 2, EYE_ER * 1.15, EYE_ER * 0.45, 0, Math.PI, 0);
      ctx.fill();
    });
    save('eyes', 'eyes_04.png', canvas);
  };

  // 5. 3D Glasses
  const e5 = () => {
    const [canvas, ctx] = makeT();
    const gy = EYE_L.y; const glx = EYE_L.x; const grx = EYE_R.x;
    const lw = 68, lh = 48, lr = 10;
    // frame bar connecting lenses
    ctx.fillStyle = '#111'; bold(ctx, 4, '#111');
    ctx.fillRect(glx + lw/2 - 4, gy - 4, grx - glx - lw + 8, 8);
    // lenses
    [{ x: glx, clr: 'rgba(220,40,40,0.75)' }, { x: grx, clr: 'rgba(40,80,220,0.75)' }].forEach(({ x, clr }) => {
      rr(ctx, x - lw/2, gy - lh/2, lw, lh, lr);
      ctx.fillStyle = clr; ctx.fill();
      bold(ctx, 4, '#111'); ctx.stroke();
      // lens glare
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(x - lw/2 + 8, gy - lh/2 + 6, 20, 8);
    });
    // side arms
    bold(ctx, 4, '#111');
    [[glx - lw/2, gy, -80, gy - 8], [grx + lw/2, gy, 80, gy - 8]].forEach(([x1,y1,dx,y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + dx, y2); ctx.stroke();
    });
    save('eyes', 'eyes_05.png', canvas);
  };

  // 6. Hypnotized — concentric spiral rings
  const e6 = () => {
    const [canvas, ctx] = makeT();
    [EYE_L, EYE_R].forEach(e => {
      circ(ctx, e.x, e.y, EYE_ER);
      ctx.fillStyle = '#fff'; ctx.fill();
      bold(ctx, 4); ctx.stroke();
      // spiral rings
      const rings = 4;
      for (let r = EYE_ER * 0.9; r > 2; r -= EYE_ER * 0.9 / rings) {
        const hue = 360 * (r / EYE_ER);
        circ(ctx, e.x, e.y, r);
        ctx.strokeStyle = `hsl(${hue},90%,55%)`; ctx.lineWidth = EYE_ER * 0.9 / rings - 1;
        ctx.stroke();
      }
      circ(ctx, e.x, e.y, 5); ctx.fillStyle = '#000'; ctx.fill();
    });
    save('eyes', 'eyes_06.png', canvas);
  };

  // 7. Laser Eyes — Legendary
  const e7 = () => {
    const [canvas, ctx] = makeT();
    [EYE_L, EYE_R].forEach((e, i) => {
      // glow halo
      ctx.shadowBlur = 28; ctx.shadowColor = '#ff2200';
      const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, EYE_ER * 2.5);
      g.addColorStop(0, 'rgba(255,60,0,0.55)'); g.addColorStop(1, 'rgba(255,60,0,0)');
      circ(ctx, e.x, e.y, EYE_ER * 2.5); ctx.fillStyle = g; ctx.fill();
      ctx.shadowBlur = 0;
      // eye
      circ(ctx, e.x, e.y, EYE_ER);
      ctx.fillStyle = '#ff1a00'; ctx.fill();
      bold(ctx, 4, '#800000'); ctx.stroke();
      circ(ctx, e.x, e.y, EYE_ER * 0.45);
      ctx.fillStyle = '#fff'; ctx.fill();
      // laser beam
      const dir = i === 0 ? -1 : 1;
      ctx.save(); ctx.shadowBlur = 14; ctx.shadowColor = '#ff4400';
      ctx.strokeStyle = 'rgba(255,60,0,0.8)'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(e.x + dir * EYE_ER, e.y);
      ctx.lineTo(e.x + dir * 340, e.y - 18);
      ctx.stroke(); ctx.restore();
    });
    save('eyes', 'eyes_07.png', canvas);
  };

  // 8. Dollar Sign Eyes — Legendary
  const e8 = () => {
    const [canvas, ctx] = makeT();
    [EYE_L, EYE_R].forEach(e => {
      circ(ctx, e.x, e.y, EYE_ER);
      const g = ctx.createRadialGradient(e.x - 6, e.y - 6, 0, e.x, e.y, EYE_ER);
      g.addColorStop(0, '#ffe566'); g.addColorStop(1, '#c8860a');
      ctx.fillStyle = g; ctx.fill();
      bold(ctx, 4, '#5a3a00'); ctx.stroke();
      ctx.fillStyle = '#3a2400';
      ctx.font = `bold ${EYE_ER * 1.3}px Arial`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('$', e.x, e.y + 1);
    });
    save('eyes', 'eyes_08.png', canvas);
  };

  e1(); e2(); e3(); e4(); e5(); e6(); e7(); e8();
}

// ─── MOUTHS ───────────────────────────────────────────────────────────────────
function genMouths() {
  console.log('\n📦 Mouths');
  const mx = MOUTH.x, my = MOUTH.y;

  // 1. Bored
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5);
    ctx.strokeStyle = STROKE;
    ctx.beginPath(); ctx.moveTo(mx - 55, my); ctx.lineTo(mx + 55, my); ctx.stroke();
    // slight downturn
    ctx.beginPath();
    ctx.moveTo(mx - 55, my); ctx.quadraticCurveTo(mx, my + 8, mx + 55, my);
    ctx.stroke();
    save('mouth', 'mouth_01.png', c);
  })();

  // 2. Grin
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5);
    ctx.beginPath(); ctx.arc(mx, my - 18, 70, 0.2, Math.PI - 0.2);
    ctx.fillStyle = '#0d0500'; ctx.fill(); ctx.strokeStyle = STROKE; ctx.stroke();
    // teeth
    ctx.fillStyle = '#f5f0e8';
    for (let i = 0; i < 6; i++) {
      rr(ctx, mx - 52 + i * 18, my - 24, 15, 18, 3);
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath(); ctx.moveTo(mx - 52 + i * 18, my - 24);
      ctx.lineTo(mx - 52 + i * 18, my - 6); ctx.stroke();
    }
    save('mouth', 'mouth_02.png', c);
  })();

  // 3. Cigarette
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5);
    // bored lips
    ctx.beginPath(); ctx.arc(mx - 18, my - 14, 52, 0.2, Math.PI - 0.2);
    ctx.fillStyle = '#0d0500'; ctx.fill(); ctx.strokeStyle = STROKE; ctx.stroke();
    // cigarette body
    rr(ctx, mx + 18, my - 24, 115, 13, 5);
    ctx.fillStyle = '#f0f0e8'; ctx.fill();
    bold(ctx, 2, '#888'); ctx.stroke();
    // filter
    rr(ctx, mx + 111, my - 24, 20, 13, 4);
    ctx.fillStyle = '#cc8855'; ctx.fill();
    // ember
    circ(ctx, mx + 135, my - 18, 7);
    ctx.fillStyle = '#ff4400'; ctx.fill();
    circ(ctx, mx + 135, my - 18, 3);
    ctx.fillStyle = '#ffaa00'; ctx.fill();
    // smoke wisp
    ctx.strokeStyle = 'rgba(200,200,200,0.45)'; ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(mx + 135, my - 25);
    ctx.bezierCurveTo(mx + 135, my - 55, mx + 125, my - 65, mx + 128, my - 85);
    ctx.stroke();
    save('mouth', 'mouth_03.png', c);
  })();

  // 4. Grimace
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5, STROKE);
    ctx.beginPath();
    ctx.moveTo(mx - 65, my - 8);
    ctx.quadraticCurveTo(mx, my + 22, mx + 65, my - 8);
    ctx.stroke();
    // grimace lines
    ctx.strokeStyle = 'rgba(20,10,0,0.4)'; ctx.lineWidth = 3;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(mx + i * 18, my + 5); ctx.lineTo(mx + i * 18, my + 18);
      ctx.stroke();
    }
    save('mouth', 'mouth_04.png', c);
  })();

  // 5. Open O
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5);
    ell(ctx, mx, my - 5, 42, 50);
    ctx.fillStyle = '#0d0500'; ctx.fill(); ctx.strokeStyle = STROKE; ctx.stroke();
    ell(ctx, mx, my - 5, 28, 36);
    ctx.fillStyle = '#111'; ctx.fill();
    save('mouth', 'mouth_05.png', c);
  })();

  // 6. Zombie Drool
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5);
    ctx.beginPath(); ctx.arc(mx, my - 12, 58, 0, Math.PI);
    ctx.fillStyle = '#050d05'; ctx.fill(); ctx.strokeStyle = STROKE; ctx.stroke();
    // drool
    ctx.strokeStyle = '#33bb44'; ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(mx - 8, my - 12);
    ctx.bezierCurveTo(mx - 12, my + 30, mx + 14, my + 50, mx + 5, my + 78);
    ctx.stroke();
    ctx.beginPath(); circ(ctx, mx + 5, my + 85, 9);
    ctx.fillStyle = '#33bb44'; ctx.fill();
    save('mouth', 'mouth_06.png', c);
  })();

  // 7. Rainbow Vomit — Legendary
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5);
    ctx.beginPath(); ctx.arc(mx, my - 12, 58, 0, Math.PI);
    ctx.fillStyle = '#050005'; ctx.fill(); ctx.strokeStyle = STROKE; ctx.stroke();
    const cols = ['#ff2200','#ff8800','#ffdd00','#22cc22','#2266ff','#9922ff'];
    cols.forEach((col, i) => {
      ctx.strokeStyle = col; ctx.lineWidth = 14; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(mx, my - 12);
      ctx.bezierCurveTo(
        mx - 60 - i * 22, my + 50,
        mx - 80 - i * 25, my + 130,
        mx - 95 - i * 30, my + 200
      );
      ctx.stroke();
    });
    save('mouth', 'mouth_07.png', c);
  })();

  // 8. Smile
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5, STROKE);
    ctx.beginPath();
    ctx.moveTo(mx - 52, my - 8);
    ctx.quadraticCurveTo(mx, my + 28, mx + 52, my - 8);
    ctx.stroke();
    save('mouth', 'mouth_08.png', c);
  })();
}

// ─── HATS ─────────────────────────────────────────────────────────────────────
function genHats() {
  console.log('\n📦 Hats');

  // 1. None — empty transparent
  (() => { const [c] = makeT(); save('hat', 'hat_01.png', c); })();

  // 2. Beanie
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5, STROKE);
    // pompom
    circ(ctx, 300, 45, 28); ctx.fillStyle = '#eee'; ctx.fill(); ctx.stroke();
    // cap body
    ctx.beginPath();
    ctx.arc(300, 195, HEAD.r + 8, Math.PI, 0);
    ctx.lineTo(300 + HEAD.r + 8, 155);
    ctx.arc(300, 155, HEAD.r + 8, 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = '#cc2222'; ctx.fill(); ctx.stroke();
    // stripe
    ctx.strokeStyle = '#ff5555'; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(300, 195, HEAD.r + 2, Math.PI + 0.15, -0.15); ctx.stroke();
    bold(ctx, 5, STROKE);
    save('hat', 'hat_02.png', c);
  })();

  // 3. Cowboy
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5, STROKE);
    // brim ellipse
    ell(ctx, 300, 108, HEAD.r + 60, 28);
    ctx.fillStyle = '#7B3F10'; ctx.fill(); ctx.stroke();
    // crown
    rr(ctx, 215, 10, 170, 105, 16);
    ctx.fillStyle = '#5c2a08'; ctx.fill(); ctx.stroke();
    // band
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(215, 94, 170, 16);
    // brim inner shadow
    ell(ctx, 300, 108, HEAD.r + 10, 14);
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fill();
    save('hat', 'hat_03.png', c);
  })();

  // 4. Baseball cap
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5, STROKE);
    // cap dome
    ctx.beginPath();
    ctx.arc(300, 200, HEAD.r + 6, Math.PI, 0);
    ctx.lineTo(300 + HEAD.r + 6, 140); ctx.arc(300, 140, HEAD.r + 6, 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = '#1a3a8a'; ctx.fill(); ctx.stroke();
    // brim
    rr(ctx, 390, 130, 110, 30, 8);
    ctx.fillStyle = '#152d6e'; ctx.fill(); ctx.stroke();
    // button on top
    circ(ctx, 300, 78, 12); ctx.fillStyle = '#1a3a8a'; ctx.fill(); ctx.stroke();
    // vent holes
    ctx.fillStyle = '#0f2458';
    for (let i = 0; i < 3; i++) {
      ell(ctx, 310 + i * 14, 165, 3, 6); ctx.fill();
    }
    save('hat', 'hat_04.png', c);
  })();

  // 5. Headband
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5, STROKE);
    ctx.beginPath(); ctx.arc(300, 225, HEAD.r + 2, Math.PI + 0.35, -0.35);
    ctx.strokeStyle = '#cc0000'; ctx.lineWidth = 24; ctx.stroke();
    ctx.strokeStyle = STROKE; ctx.lineWidth = 5; ctx.stroke();
    // knot on right side
    circ(ctx, 466, 185, 14);
    ctx.fillStyle = '#dd1111'; ctx.fill();
    bold(ctx, 4, STROKE); ctx.stroke();
    // ribbon tails
    ctx.strokeStyle = '#cc0000'; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(474, 178); ctx.lineTo(510, 145); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(474, 192); ctx.lineTo(515, 210); ctx.stroke();
    save('hat', 'hat_05.png', c);
  })();

  // 6. Top Hat — Rare
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5, STROKE);
    // brim
    ell(ctx, 300, 110, HEAD.r + 45, 22);
    ctx.fillStyle = '#111'; ctx.fill(); ctx.stroke();
    // crown
    rr(ctx, 225, 5, 150, 108, 8);
    ctx.fillStyle = '#0a0a0a'; ctx.fill(); ctx.stroke();
    // gold band
    ctx.fillStyle = '#FFD700'; ctx.fillRect(225, 91, 150, 18);
    // sheen highlight
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(236, 8, 30, 80);
    save('hat', 'hat_06.png', c);
  })();

  // 7. Captain's Hat — Rare
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5, STROKE);
    // brim
    ell(ctx, 300, 118, HEAD.r + 40, 20);
    ctx.fillStyle = '#0a1a3a'; ctx.fill(); ctx.stroke();
    // body
    rr(ctx, 218, 22, 164, 100, 12);
    ctx.fillStyle = '#0f2255'; ctx.fill(); ctx.stroke();
    // white band
    ctx.fillStyle = '#f0f0f0'; ctx.fillRect(218, 95, 164, 24);
    bold(ctx, 2, STROKE); ctx.strokeRect(218, 95, 164, 24);
    // anchor emblem
    ctx.fillStyle = '#FFD700';
    ctx.font = `bold 38px Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('⚓', 300, 65);
    save('hat', 'hat_07.png', c);
  })();

  // 8. Gold Crown — Legendary
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5, '#8a5c00');
    // crown base
    const points = [
      [215, 148], [215, 52], [248, 98], [300, 38],
      [352, 98], [385, 52], [385, 148],
    ];
    ctx.beginPath(); ctx.moveTo(...points[0]);
    points.slice(1).forEach(p => ctx.lineTo(...p));
    ctx.closePath();
    const g = ctx.createLinearGradient(215, 38, 385, 148);
    g.addColorStop(0, '#ffe066'); g.addColorStop(0.4, '#c8860a'); g.addColorStop(1, '#7a4a00');
    ctx.fillStyle = g; ctx.fill(); ctx.stroke();
    // gems
    const gems = [['#ee3333', 248, 90], ['#4444ff', 300, 50], ['#33cc33', 352, 90]];
    gems.forEach(([clr, gx, gy]) => {
      circ(ctx, gx, gy, 12); ctx.fillStyle = clr; ctx.fill();
      bold(ctx, 2, '#fff'); ctx.stroke();
    });
    save('hat', 'hat_08.png', c);
  })();
}

// ─── CLOTHING ─────────────────────────────────────────────────────────────────
function drawShirt(ctx, color, opts = {}) {
  bold(ctx, 5, STROKE);
  const { x, y, w, h, r } = TORSO;
  rr(ctx, x, y, w, h, r);
  ctx.fillStyle = color; ctx.fill(); ctx.stroke();

  if (opts.stripes) {
    ctx.save(); rr(ctx, x, y, w, h, r); ctx.clip();
    ctx.strokeStyle = opts.stripeColor || '#ccc'; ctx.lineWidth = 14;
    for (let sy = y; sy < y + h; sy += 32) {
      ctx.beginPath(); ctx.moveTo(x, sy); ctx.lineTo(x + w, sy); ctx.stroke();
    }
    ctx.restore();
  }
  if (opts.plaid) {
    ctx.save(); rr(ctx, x, y, w, h, r); ctx.clip();
    ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 16;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.moveTo(x + i * 90, y); ctx.lineTo(x + i * 90, y + h); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 8;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.moveTo(x, y + i * 55); ctx.lineTo(x + w, y + i * 55); ctx.stroke();
    }
    ctx.restore();
  }
  if (opts.flowers) {
    ctx.save(); rr(ctx, x, y, w, h, r); ctx.clip();
    const flColors = ['#ffaa00','#ff6622','#ff3388','#aaff00'];
    for (let i = 0; i < 20; i++) {
      const fx = x + 30 + (i * 85) % (w - 50);
      const fy = y + 20 + Math.floor(i / (w / 85)) * 70;
      ctx.fillStyle = flColors[i % flColors.length];
      for (let p = 0; p < 5; p++) {
        const a = (p / 5) * Math.PI * 2;
        circ(ctx, fx + Math.cos(a) * 10, fy + Math.sin(a) * 10, 7);
        ctx.fill();
      }
      circ(ctx, fx, fy, 5); ctx.fillStyle = '#fff'; ctx.fill();
    }
    ctx.restore();
  }

  // collar V-notch
  if (opts.collar !== false) {
    bold(ctx, 5, STROKE);
    ctx.beginPath();
    ctx.moveTo(260, y + 4); ctx.lineTo(300, y + 40); ctx.lineTo(340, y + 4);
    ctx.strokeStyle = opts.collarColor || 'rgba(0,0,0,0.3)'; ctx.lineWidth = 4;
    ctx.stroke();
  }
}

function genClothing() {
  console.log('\n📦 Clothing');

  (() => { const [c] = makeT(); save('clothing', 'clothing_01.png', c); })();

  // Striped tee
  (() => {
    const [c, ctx] = makeT();
    drawShirt(ctx, '#f5f5f5', { stripes: true, stripeColor: '#dd3333' });
    save('clothing', 'clothing_02.png', c);
  })();

  // Hoodie
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5, STROKE);
    const { x, y, w, h, r } = TORSO;
    rr(ctx, x, y, w, h, r);
    ctx.fillStyle = '#2e2e45'; ctx.fill(); ctx.stroke();
    // hood outline at top
    ctx.strokeStyle = '#3a3a55'; ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 5); ctx.quadraticCurveTo(300, y - 30, x + w - 20, y + 5);
    ctx.stroke();
    // pocket
    rr(ctx, 210, y + h - 88, 180, 72, 12);
    ctx.fillStyle = '#232338'; ctx.fill();
    bold(ctx, 3, '#1a1a2e'); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(300, y + h - 88); ctx.lineTo(300, y + h - 16);
    ctx.strokeStyle = '#1a1a2e'; ctx.lineWidth = 3; ctx.stroke();
    save('clothing', 'clothing_03.png', c);
  })();

  // Flannel
  (() => {
    const [c, ctx] = makeT();
    drawShirt(ctx, '#8B2020', { plaid: true, collar: false });
    // open collar (flannel-style)
    bold(ctx, 5, STROKE);
    ctx.beginPath();
    ctx.moveTo(255, TORSO.y + 5); ctx.lineTo(300, TORSO.y + 55);
    ctx.lineTo(345, TORSO.y + 5); ctx.strokeStyle = '#6a1515'; ctx.lineWidth = 3; ctx.stroke();
    save('clothing', 'clothing_04.png', c);
  })();

  // Hawaiian
  (() => {
    const [c, ctx] = makeT();
    drawShirt(ctx, '#1a7acc', { flowers: true });
    save('clothing', 'clothing_05.png', c);
  })();

  // Tuxedo — Rare
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5, STROKE);
    const { x, y, w, h, r } = TORSO;
    // jacket
    rr(ctx, x, y, w, h, r); ctx.fillStyle = '#111'; ctx.fill(); ctx.stroke();
    // white shirt front
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.moveTo(300, y + 8); ctx.lineTo(270, y + 55);
    ctx.lineTo(270, y + h - 10); ctx.lineTo(330, y + h - 10);
    ctx.lineTo(330, y + 55); ctx.closePath(); ctx.fill();
    bold(ctx, 2, '#ccc'); ctx.stroke();
    // bow tie
    ctx.fillStyle = '#FFD700';
    [[270, y + 55, -1], [330, y + 55, 1]].forEach(([bx, by, dir]) => {
      ctx.beginPath();
      ctx.moveTo(bx, by - 12); ctx.lineTo(300, by + 2); ctx.lineTo(bx, by + 14); ctx.closePath();
      ctx.fill();
    });
    circ(ctx, 300, y + 55 + 2, 7); ctx.fillStyle = '#FFD700'; ctx.fill();
    save('clothing', 'clothing_06.png', c);
  })();

  // Black Tee
  (() => {
    const [c, ctx] = makeT();
    drawShirt(ctx, '#1a1a1a', { collarColor: '#333' });
    save('clothing', 'clothing_07.png', c);
  })();

  // BAYC Leather Jacket — Legendary
  (() => {
    const [c, ctx] = makeT(); bold(ctx, 5, STROKE);
    const { x, y, w, h, r } = TORSO;
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, '#2a1500'); g.addColorStop(0.5, '#5a3200'); g.addColorStop(1, '#2a1500');
    rr(ctx, x, y, w, h, r); ctx.fillStyle = g; ctx.fill(); ctx.stroke();
    // gold lapels
    ctx.fillStyle = '#FFD700';
    ctx.beginPath(); ctx.moveTo(255, y + 8); ctx.lineTo(215, y + 80); ctx.lineTo(275, y + 80); ctx.closePath(); ctx.fill();
    bold(ctx, 2, '#8a5c00'); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(345, y + 8); ctx.lineTo(385, y + 80); ctx.lineTo(325, y + 80); ctx.closePath(); ctx.fill();
    bold(ctx, 2, '#8a5c00'); ctx.stroke();
    // BAYC patch
    rr(ctx, 365, y + h - 90, 98, 44, 8);
    ctx.fillStyle = '#FFD700'; ctx.fill(); bold(ctx, 2, '#8a5c00'); ctx.stroke();
    ctx.fillStyle = '#1a0800'; ctx.font = 'bold 18px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('BAYC', 414, y + h - 68);
    ctx.fillText('☠', 414, y + h - 88 + 22);
    save('clothing', 'clothing_08.png', c);
  })();
}

// ─── ACCESSORIES ──────────────────────────────────────────────────────────────
function genAccessories() {
  console.log('\n📦 Accessories');

  // 1. None
  (() => { const [c] = makeT(); save('accessory', 'acc_01.png', c); })();

  // 2. Gold hoop earring (right side of head)
  (() => {
    const [c, ctx] = makeT();
    const ex = EAR_R.x + 14, ey = EAR_R.y + 58;
    circ(ctx, ex, ey, 22); ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 9; ctx.stroke();
    bold(ctx, 3, '#8a5c00'); ctx.stroke();
    save('accessory', 'acc_02.png', c);
  })();

  // 3. Gold chain
  (() => {
    const [c, ctx] = makeT();
    const cy = 415;
    // chain arc
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(300, cy, 125, 0.3, Math.PI - 0.3); ctx.stroke();
    // links
    ctx.lineWidth = 4; ctx.strokeStyle = '#c8860a';
    for (let i = 0; i < 10; i++) {
      const a = 0.3 + (i / 9) * (Math.PI - 0.6);
      const lx = 300 + Math.cos(a) * 125, ly = cy + Math.sin(a) * 125;
      ell(ctx, lx, ly, 7, 4); ctx.stroke();
    }
    // pendant
    ctx.fillStyle = '#FFD700'; ctx.font = 'bold 28px Arial'; ctx.textAlign = 'center';
    ctx.fillText('✦', 300, cy + 135);
    save('accessory', 'acc_03.png', c);
  })();

  // 4. Silver stud earring
  (() => {
    const [c, ctx] = makeT();
    const ex = EAR_R.x + 10, ey = EAR_R.y + 52;
    circ(ctx, ex, ey, 10);
    const g = ctx.createRadialGradient(ex - 3, ey - 3, 0, ex, ey, 10);
    g.addColorStop(0, '#fff'); g.addColorStop(1, '#888');
    ctx.fillStyle = g; ctx.fill();
    bold(ctx, 2, '#555'); ctx.stroke();
    save('accessory', 'acc_04.png', c);
  })();

  // 5. Hoodie strings
  (() => {
    const [c, ctx] = makeT();
    const ty = TORSO.y;
    ctx.strokeStyle = '#888'; ctx.lineWidth = 7; ctx.lineCap = 'round';
    [-1, 1].forEach(side => {
      const sx = 300 + side * 24, sy = ty + 12;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(sx, sy + 80, sx + side * 22, sy + 140, sx + side * 22, sy + 200);
      ctx.stroke();
      // tip
      rr(ctx, sx + side * 18 - 8, sy + 196, 16, 22, 6);
      ctx.fillStyle = '#666'; ctx.fill();
      bold(ctx, 2, '#444'); ctx.stroke();
    });
    save('accessory', 'acc_05.png', c);
  })();

  // 6. Diamond ring — Rare
  (() => {
    const [c, ctx] = makeT();
    const rx = 155, ry = 500;
    circ(ctx, rx, ry, 18); ctx.strokeStyle = '#aaa'; ctx.lineWidth = 8; ctx.stroke();
    // diamond
    ctx.fillStyle = 'rgba(180,220,255,0.9)';
    ctx.beginPath();
    ctx.moveTo(rx, ry - 36); ctx.lineTo(rx + 20, ry - 14);
    ctx.lineTo(rx, ry + 8);  ctx.lineTo(rx - 20, ry - 14);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 1.5; ctx.stroke();
    // facet lines
    ctx.beginPath(); ctx.moveTo(rx, ry - 36); ctx.lineTo(rx, ry + 8); ctx.strokeStyle = 'rgba(100,180,255,0.5)'; ctx.lineWidth = 1; ctx.stroke();
    // sparkles
    ctx.fillStyle = '#fff'; ctx.font = '16px Arial'; ctx.textAlign = 'center';
    ctx.fillText('✦', rx + 28, ry - 38); ctx.fillText('✦', rx - 18, ry - 42);
    save('accessory', 'acc_06.png', c);
  })();

  // 7. Watch — Rare
  (() => {
    const [c, ctx] = makeT();
    const wx = 148, wy = 465;
    // strap
    ctx.fillStyle = '#333'; rr(ctx, wx - 20, wy - 70, 40, 140, 8); ctx.fill();
    // watch face
    circ(ctx, wx, wy, 30);
    const wg = ctx.createRadialGradient(wx - 5, wy - 5, 0, wx, wy, 30);
    wg.addColorStop(0, '#1a1a1a'); wg.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = wg; ctx.fill();
    ctx.strokeStyle = '#888'; ctx.lineWidth = 4; ctx.stroke();
    // gold bezel
    circ(ctx, wx, wy, 34); ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 5; ctx.stroke();
    // clock hands
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx, wy - 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + 14, wy); ctx.stroke();
    circ(ctx, wx, wy, 4); ctx.fillStyle = '#FFD700'; ctx.fill();
    save('accessory', 'acc_07.png', c);
  })();

  // 8. Diamond chain — Legendary
  (() => {
    const [c, ctx] = makeT();
    const cy = 415;
    // thick diamond-link chain
    for (let i = 0; i <= 14; i++) {
      const a  = 0.2 + (i / 14) * (Math.PI - 0.4);
      const lx = 300 + Math.cos(a) * 130, ly = cy + Math.sin(a) * 130;
      ell(ctx, lx, ly, 9, 6);
      ctx.fillStyle = i % 2 === 0 ? '#dde8ff' : '#8899cc';
      ctx.fill();
      ctx.strokeStyle = '#556688'; ctx.lineWidth = 1.5; ctx.stroke();
    }
    // large diamond pendant
    const px = 300, py = cy + 148;
    ctx.fillStyle = 'rgba(200,230,255,0.95)';
    ctx.beginPath();
    ctx.moveTo(px, py - 28); ctx.lineTo(px + 24, py - 8);
    ctx.lineTo(px, py + 26);  ctx.lineTo(px - 24, py - 8);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#aaccff'; ctx.lineWidth = 2; ctx.stroke();
    // internal facets
    ctx.strokeStyle = 'rgba(150,200,255,0.6)'; ctx.lineWidth = 1;
    [[px, py-28, px, py+26], [px-24, py-8, px+24, py-8]].forEach(([x1,y1,x2,y2]) => {
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    });
    ctx.fillStyle = '#fff'; ctx.font = '18px Arial'; ctx.textAlign = 'center';
    ctx.fillText('✦', px + 32, py - 28); ctx.fillText('✦', px - 26, py - 32);
    save('accessory', 'acc_08.png', c);
  })();
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────
console.log('🎨 Generating BAYC trait PNGs…');
console.log(`   Output: ${OUT}\n`);

genBackgrounds();
genBodies();
genClothing();
genEyes();
genMouths();
genHats();
genAccessories();

console.log('\n✅ Done — 56 trait PNGs generated.');
console.log('   Replace with AI art:  node generate-ai-traits.mjs\n');
