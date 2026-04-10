// ─── TRAIT DEFINITIONS ────────────────────────────────────────────────────────
// Each trait has: id, name, rarity, weight, and a draw function
// draw(ctx, size) — all drawing is done on a square canvas of `size` pixels

export const RARITIES = {
  Common:     { label: 'Common',     color: '#6b7280', glow: 'rgba(107,114,128,0.4)', weight: 50 },
  Uncommon:   { label: 'Uncommon',   color: '#22c55e', glow: 'rgba(34,197,94,0.4)',   weight: 30 },
  Rare:       { label: 'Rare',       color: '#3b82f6', glow: 'rgba(59,130,246,0.4)',  weight: 15 },
  Legendary:  { label: 'Legendary',  color: '#FFD700', glow: 'rgba(255,215,0,0.6)',   weight: 5  },
};

// ─── HELPER DRAW UTILITIES ────────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function circle(ctx, cx, cy, r, fill, stroke, strokeW) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  if (fill)   { ctx.fillStyle = fill;   ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = strokeW || 2; ctx.stroke(); }
}

function ellipse(ctx, cx, cy, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

// ─── BACKGROUNDS ──────────────────────────────────────────────────────────────
export const backgrounds = [
  {
    id: 'bg_aqua', name: 'Aqua', rarity: 'Common',
    draw(ctx, s) {
      const g = ctx.createLinearGradient(0, 0, s, s);
      g.addColorStop(0, '#0d4f6e'); g.addColorStop(1, '#1a8fa0');
      ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
    },
  },
  {
    id: 'bg_army', name: 'Army Green', rarity: 'Common',
    draw(ctx, s) {
      const g = ctx.createLinearGradient(0, 0, s, s);
      g.addColorStop(0, '#2d4a1e'); g.addColorStop(1, '#4a6b2e');
      ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
    },
  },
  {
    id: 'bg_orange', name: 'Orange', rarity: 'Common',
    draw(ctx, s) {
      const g = ctx.createLinearGradient(0, s, s, 0);
      g.addColorStop(0, '#7a2c00'); g.addColorStop(1, '#d44f00');
      ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
    },
  },
  {
    id: 'bg_purple', name: 'Purple', rarity: 'Uncommon',
    draw(ctx, s) {
      const g = ctx.createLinearGradient(0, 0, s, s);
      g.addColorStop(0, '#2a0a4a'); g.addColorStop(1, '#6b1fa0');
      ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
    },
  },
  {
    id: 'bg_gold', name: 'Gold', rarity: 'Rare',
    draw(ctx, s) {
      const g = ctx.createLinearGradient(0, 0, s, s);
      g.addColorStop(0, '#5a3a00'); g.addColorStop(0.5, '#c8860a'); g.addColorStop(1, '#5a3a00');
      ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
    },
  },
  {
    id: 'bg_new_punk', name: 'New Punk Blue', rarity: 'Rare',
    draw(ctx, s) {
      const g = ctx.createRadialGradient(s/2, s/2, 0, s/2, s/2, s*0.8);
      g.addColorStop(0, '#0a1a4a'); g.addColorStop(1, '#001133');
      ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
      // subtle grid lines
      ctx.strokeStyle = 'rgba(0,100,255,0.08)'; ctx.lineWidth = 1;
      for (let i = 0; i < s; i += s/8) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, s); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(s, i); ctx.stroke();
      }
    },
  },
  {
    id: 'bg_holographic', name: 'Holographic', rarity: 'Legendary',
    draw(ctx, s) {
      const g = ctx.createLinearGradient(0, 0, s, s);
      g.addColorStop(0,   '#ff006e'); g.addColorStop(0.2, '#8338ec');
      g.addColorStop(0.4, '#3a86ff'); g.addColorStop(0.6, '#06d6a0');
      g.addColorStop(0.8, '#ffb703'); g.addColorStop(1,   '#ff006e');
      ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
      // shimmer overlay
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(i * (s/7), 0, s/16, s);
      }
    },
  },
];

// ─── BODY / FUR ───────────────────────────────────────────────────────────────
export const bodies = [
  {
    id: 'body_brown', name: 'Brown', rarity: 'Common',
    draw(ctx, s) {
      const bx = s * 0.15, by = s * 0.38, bw = s * 0.7, bh = s * 0.62;
      // torso/neck area
      const g = ctx.createRadialGradient(s/2, s*0.75, 0, s/2, s*0.75, s*0.5);
      g.addColorStop(0, '#6b3a1f'); g.addColorStop(1, '#3d1f0a');
      roundRect(ctx, bx, by, bw, bh, s * 0.12);
      ctx.fillStyle = g; ctx.fill();
      // head
      const hg = ctx.createRadialGradient(s/2, s*0.35, 0, s/2, s*0.35, s*0.3);
      hg.addColorStop(0, '#7d4525'); hg.addColorStop(1, '#4a2510');
      circle(ctx, s/2, s*0.35, s*0.27, null, null);
      ctx.beginPath(); ctx.arc(s/2, s*0.35, s*0.27, 0, Math.PI*2);
      ctx.fillStyle = hg; ctx.fill();
      // muzzle
      ellipse(ctx, s/2, s*0.46, s*0.14, s*0.09, '#8a5030');
      // ears
      circle(ctx, s*0.23, s*0.22, s*0.08, '#5a3015', null);
      circle(ctx, s*0.77, s*0.22, s*0.08, '#5a3015', null);
      circle(ctx, s*0.23, s*0.22, s*0.05, '#7a4520', null);
      circle(ctx, s*0.77, s*0.22, s*0.05, '#7a4520', null);
    },
  },
  {
    id: 'body_grey', name: 'Grey', rarity: 'Common',
    draw(ctx, s) {
      const g = ctx.createRadialGradient(s/2, s*0.5, 0, s/2, s*0.5, s*0.55);
      g.addColorStop(0, '#666677'); g.addColorStop(1, '#333340');
      roundRect(ctx, s*0.15, s*0.38, s*0.7, s*0.62, s*0.12);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(s/2, s*0.35, s*0.27, 0, Math.PI*2);
      ctx.fillStyle = '#555566'; ctx.fill();
      ellipse(ctx, s/2, s*0.46, s*0.14, s*0.09, '#777788');
      circle(ctx, s*0.23, s*0.22, s*0.08, '#444455', null);
      circle(ctx, s*0.77, s*0.22, s*0.08, '#444455', null);
      circle(ctx, s*0.23, s*0.22, s*0.05, '#666677', null);
      circle(ctx, s*0.77, s*0.22, s*0.05, '#666677', null);
    },
  },
  {
    id: 'body_solid_gold', name: 'Solid Gold', rarity: 'Legendary',
    draw(ctx, s) {
      const g = ctx.createRadialGradient(s*0.35, s*0.3, 0, s/2, s*0.5, s*0.6);
      g.addColorStop(0, '#ffe066'); g.addColorStop(0.4, '#c8860a'); g.addColorStop(1, '#7a4a00');
      roundRect(ctx, s*0.15, s*0.38, s*0.7, s*0.62, s*0.12);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(s/2, s*0.35, s*0.27, 0, Math.PI*2);
      ctx.fillStyle = '#d4900a'; ctx.fill();
      // shine
      ctx.beginPath(); ctx.arc(s*0.4, s*0.28, s*0.08, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,200,0.3)'; ctx.fill();
      ellipse(ctx, s/2, s*0.46, s*0.14, s*0.09, '#e0a020');
      circle(ctx, s*0.23, s*0.22, s*0.08, '#b07800', null);
      circle(ctx, s*0.77, s*0.22, s*0.08, '#b07800', null);
      circle(ctx, s*0.23, s*0.22, s*0.05, '#e0a020', null);
      circle(ctx, s*0.77, s*0.22, s*0.05, '#e0a020', null);
    },
  },
  {
    id: 'body_blue', name: 'Blue', rarity: 'Uncommon',
    draw(ctx, s) {
      const g = ctx.createRadialGradient(s/2, s*0.5, 0, s/2, s*0.5, s*0.55);
      g.addColorStop(0, '#2244aa'); g.addColorStop(1, '#0a1555');
      roundRect(ctx, s*0.15, s*0.38, s*0.7, s*0.62, s*0.12);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(s/2, s*0.35, s*0.27, 0, Math.PI*2);
      ctx.fillStyle = '#1a3388'; ctx.fill();
      ellipse(ctx, s/2, s*0.46, s*0.14, s*0.09, '#2255bb');
      circle(ctx, s*0.23, s*0.22, s*0.08, '#0f2266', null);
      circle(ctx, s*0.77, s*0.22, s*0.08, '#0f2266', null);
      circle(ctx, s*0.23, s*0.22, s*0.05, '#2244aa', null);
      circle(ctx, s*0.77, s*0.22, s*0.05, '#2244aa', null);
    },
  },
  {
    id: 'body_zombie', name: 'Zombie', rarity: 'Rare',
    draw(ctx, s) {
      const g = ctx.createRadialGradient(s/2, s*0.5, 0, s/2, s*0.5, s*0.55);
      g.addColorStop(0, '#3a6640'); g.addColorStop(1, '#1a3320');
      roundRect(ctx, s*0.15, s*0.38, s*0.7, s*0.62, s*0.12);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(s/2, s*0.35, s*0.27, 0, Math.PI*2);
      ctx.fillStyle = '#2d5535'; ctx.fill();
      // zombie patches
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      circle(ctx, s*0.42, s*0.32, s*0.05, 'rgba(0,0,0,0.3)', null);
      circle(ctx, s*0.58, s*0.28, s*0.03, 'rgba(0,0,0,0.25)', null);
      ellipse(ctx, s/2, s*0.46, s*0.14, s*0.09, '#3a7040');
      circle(ctx, s*0.23, s*0.22, s*0.08, '#1f4428', null);
      circle(ctx, s*0.77, s*0.22, s*0.08, '#1f4428', null);
      circle(ctx, s*0.23, s*0.22, s*0.05, '#3a6640', null);
      circle(ctx, s*0.77, s*0.22, s*0.05, '#3a6640', null);
    },
  },
  {
    id: 'body_white', name: 'White', rarity: 'Uncommon',
    draw(ctx, s) {
      const g = ctx.createRadialGradient(s*0.35, s*0.3, 0, s/2, s*0.5, s*0.6);
      g.addColorStop(0, '#f0f0f0'); g.addColorStop(1, '#aaaaaa');
      roundRect(ctx, s*0.15, s*0.38, s*0.7, s*0.62, s*0.12);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(s/2, s*0.35, s*0.27, 0, Math.PI*2);
      ctx.fillStyle = '#dddddd'; ctx.fill();
      ellipse(ctx, s/2, s*0.46, s*0.14, s*0.09, '#eeeeee');
      circle(ctx, s*0.23, s*0.22, s*0.08, '#bbbbbb', null);
      circle(ctx, s*0.77, s*0.22, s*0.08, '#bbbbbb', null);
      circle(ctx, s*0.23, s*0.22, s*0.05, '#dddddd', null);
      circle(ctx, s*0.77, s*0.22, s*0.05, '#dddddd', null);
    },
  },
];

// ─── EYES ─────────────────────────────────────────────────────────────────────
export const eyes = [
  {
    id: 'eyes_bored', name: 'Bored', rarity: 'Common',
    draw(ctx, s) {
      // half-closed bored eyes
      const ey = s * 0.33;
      [-1, 1].forEach(side => {
        const ex = s/2 + side * s * 0.1;
        circle(ctx, ex, ey, s*0.04, '#111', null);
        circle(ctx, ex, ey, s*0.025, '#fff', null);
        circle(ctx, ex + s*0.008, ey - s*0.005, s*0.01, '#000', null);
        // bored eyelid
        ctx.beginPath(); ctx.ellipse(ex, ey - s*0.01, s*0.05, s*0.025, 0, Math.PI, 0);
        ctx.fillStyle = '#7d4525'; ctx.fill();
      });
    },
  },
  {
    id: 'eyes_angry', name: 'Angry', rarity: 'Common',
    draw(ctx, s) {
      const ey = s * 0.33;
      [-1, 1].forEach(side => {
        const ex = s/2 + side * s * 0.1;
        circle(ctx, ex, ey, s*0.04, '#111', null);
        circle(ctx, ex, ey, s*0.025, '#ff4400', null);
        circle(ctx, ex + s*0.01, ey - s*0.008, s*0.01, '#000', null);
        // angry brow
        ctx.beginPath();
        ctx.moveTo(ex - s*0.05, ey - s*0.06 + side*s*0.02);
        ctx.lineTo(ex + s*0.05, ey - s*0.06 - side*s*0.02);
        ctx.strokeStyle = '#3d1f0a'; ctx.lineWidth = s*0.018; ctx.stroke();
      });
    },
  },
  {
    id: 'eyes_laser', name: 'Laser Eyes', rarity: 'Legendary',
    draw(ctx, s) {
      const ey = s * 0.33;
      [-1, 1].forEach(side => {
        const ex = s/2 + side * s * 0.1;
        // glow
        const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, s*0.08);
        g.addColorStop(0, '#ff4400'); g.addColorStop(0.5, '#ff0000'); g.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(ex, ey, s*0.08, 0, Math.PI*2);
        ctx.fillStyle = g; ctx.fill();
        circle(ctx, ex, ey, s*0.04, '#ff0000', '#ff8800', 2);
        // laser beam
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex + side * s * 0.6, ey - s*0.05);
        ctx.strokeStyle = 'rgba(255,50,0,0.7)'; ctx.lineWidth = s*0.015; ctx.stroke();
      });
    },
  },
  {
    id: 'eyes_3d', name: '3D Glasses', rarity: 'Rare',
    draw(ctx, s) {
      const ey = s * 0.32;
      // frame
      roundRect(ctx, s*0.3, ey - s*0.06, s*0.4, s*0.12, s*0.03);
      ctx.fillStyle = '#111'; ctx.fill();
      ctx.strokeStyle = '#FFD700'; ctx.lineWidth = s*0.01; ctx.stroke();
      // lenses
      roundRect(ctx, s*0.31, ey - s*0.055, s*0.17, s*0.11, s*0.025);
      ctx.fillStyle = 'rgba(255,0,0,0.6)'; ctx.fill();
      roundRect(ctx, s*0.51, ey - s*0.055, s*0.17, s*0.11, s*0.025);
      ctx.fillStyle = 'rgba(0,100,255,0.6)'; ctx.fill();
    },
  },
  {
    id: 'eyes_happy', name: 'Happy', rarity: 'Uncommon',
    draw(ctx, s) {
      const ey = s * 0.33;
      [-1, 1].forEach(side => {
        const ex = s/2 + side * s * 0.1;
        circle(ctx, ex, ey, s*0.04, '#111', null);
        circle(ctx, ex, ey, s*0.025, '#88eeaa', null);
        circle(ctx, ex + s*0.01, ey - s*0.008, s*0.01, '#000', null);
        // happy crinkle
        ctx.beginPath(); ctx.arc(ex, ey + s*0.01, s*0.035, 0, Math.PI);
        ctx.strokeStyle = '#3d1f0a'; ctx.lineWidth = s*0.015; ctx.stroke();
      });
    },
  },
  {
    id: 'eyes_sleepy', name: 'Sleepy', rarity: 'Common',
    draw(ctx, s) {
      const ey = s * 0.33;
      [-1, 1].forEach(side => {
        const ex = s/2 + side * s * 0.1;
        // mostly closed
        ctx.beginPath(); ctx.ellipse(ex, ey, s*0.04, s*0.02, 0, 0, Math.PI*2);
        ctx.fillStyle = '#111'; ctx.fill();
        // heavy lid
        ctx.fillStyle = 'rgba(61,31,10,0.8)';
        ctx.fillRect(ex - s*0.05, ey - s*0.04, s*0.1, s*0.03);
      });
    },
  },
  {
    id: 'eyes_hypno', name: 'Hypnotized', rarity: 'Rare',
    draw(ctx, s) {
      const ey = s * 0.33;
      [-1, 1].forEach(side => {
        const ex = s/2 + side * s * 0.1;
        for (let r = s*0.045; r > 0; r -= s*0.013) {
          const hue = r * 900;
          ctx.beginPath(); ctx.arc(ex, ey, r, 0, Math.PI*2);
          ctx.strokeStyle = `hsl(${hue},80%,50%)`; ctx.lineWidth = s*0.008; ctx.stroke();
        }
      });
    },
  },
  {
    id: 'eyes_coins', name: 'Money Eyes', rarity: 'Legendary',
    draw(ctx, s) {
      const ey = s * 0.33;
      [-1, 1].forEach(side => {
        const ex = s/2 + side * s * 0.1;
        circle(ctx, ex, ey, s*0.045, '#FFD700', '#c8860a', 2);
        ctx.fillStyle = '#5a3a00';
        ctx.font = `bold ${s*0.05}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', ex, ey + s*0.005);
      });
    },
  },
];

// ─── MOUTHS ───────────────────────────────────────────────────────────────────
export const mouths = [
  {
    id: 'mouth_bored', name: 'Bored', rarity: 'Common',
    draw(ctx, s) {
      const my = s * 0.47;
      ctx.beginPath(); ctx.ellipse(s/2, my, s*0.07, s*0.035, 0, 0, Math.PI);
      ctx.fillStyle = '#1a0800'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(s/2 - s*0.07, my);
      ctx.lineTo(s/2 + s*0.07, my);
      ctx.strokeStyle = '#3d1f0a'; ctx.lineWidth = s*0.015; ctx.stroke();
    },
  },
  {
    id: 'mouth_grin', name: 'Grin', rarity: 'Common',
    draw(ctx, s) {
      const my = s * 0.46;
      ctx.beginPath(); ctx.arc(s/2, my - s*0.02, s*0.09, 0.1, Math.PI - 0.1);
      ctx.fillStyle = '#1a0800'; ctx.fill();
      // teeth
      ctx.fillStyle = '#f0f0e0';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(s/2 - s*0.055 + i*s*0.022, my - s*0.03, s*0.019, s*0.02);
      }
    },
  },
  {
    id: 'mouth_cigarette', name: 'Cigarette', rarity: 'Uncommon',
    draw(ctx, s) {
      const my = s * 0.47;
      ctx.beginPath(); ctx.ellipse(s/2 - s*0.02, my, s*0.06, s*0.025, 0, 0, Math.PI);
      ctx.fillStyle = '#1a0800'; ctx.fill();
      // cigarette
      roundRect(ctx, s*0.52, my - s*0.015, s*0.14, s*0.014, s*0.005);
      ctx.fillStyle = '#f0f0e0'; ctx.fill();
      roundRect(ctx, s*0.64, my - s*0.015, s*0.024, s*0.014, s*0.005);
      ctx.fillStyle = '#ff6633'; ctx.fill();
      // smoke
      ctx.strokeStyle = 'rgba(200,200,200,0.5)'; ctx.lineWidth = s*0.01;
      ctx.beginPath(); ctx.moveTo(s*0.67, my - s*0.015);
      ctx.bezierCurveTo(s*0.67, my - s*0.06, s*0.64, my - s*0.08, s*0.65, my - s*0.12);
      ctx.stroke();
    },
  },
  {
    id: 'mouth_discomfort', name: 'Discomfort', rarity: 'Uncommon',
    draw(ctx, s) {
      const my = s * 0.47;
      ctx.beginPath();
      ctx.moveTo(s/2 - s*0.08, my - s*0.01);
      ctx.quadraticCurveTo(s/2, my + s*0.025, s/2 + s*0.08, my - s*0.01);
      ctx.strokeStyle = '#3d1f0a'; ctx.lineWidth = s*0.02; ctx.stroke();
      // grimace lines
      ctx.strokeStyle = 'rgba(61,31,10,0.4)'; ctx.lineWidth = s*0.01;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(s/2 + i*s*0.025, my + s*0.005);
        ctx.lineTo(s/2 + i*s*0.025, my + s*0.025);
        ctx.stroke();
      }
    },
  },
  {
    id: 'mouth_phoneme', name: 'Phoneme Oh', rarity: 'Common',
    draw(ctx, s) {
      const my = s * 0.46;
      ctx.beginPath(); ctx.ellipse(s/2, my, s*0.05, s*0.06, 0, 0, Math.PI*2);
      ctx.fillStyle = '#1a0800'; ctx.fill();
      ctx.strokeStyle = '#3d1f0a'; ctx.lineWidth = s*0.015; ctx.stroke();
    },
  },
  {
    id: 'mouth_zombie', name: 'Zombie Drool', rarity: 'Rare',
    draw(ctx, s) {
      const my = s * 0.46;
      ctx.beginPath(); ctx.arc(s/2, my, s*0.07, 0, Math.PI);
      ctx.fillStyle = '#0d1a10'; ctx.fill();
      // drool
      ctx.beginPath();
      ctx.moveTo(s/2 - s*0.01, my);
      ctx.bezierCurveTo(s/2 - s*0.02, my + s*0.05, s/2 + s*0.02, my + s*0.06, s/2, my + s*0.09);
      ctx.strokeStyle = '#22aa44'; ctx.lineWidth = s*0.018; ctx.stroke();
    },
  },
  {
    id: 'mouth_rainbow', name: 'Rainbow Vomit', rarity: 'Legendary',
    draw(ctx, s) {
      const my = s * 0.46;
      ctx.beginPath(); ctx.arc(s/2, my, s*0.07, 0, Math.PI);
      ctx.fillStyle = '#111'; ctx.fill();
      // rainbow stream
      const colors = ['#ff0000','#ff8800','#ffff00','#00ff00','#0088ff','#8800ff'];
      colors.forEach((c, i) => {
        ctx.beginPath();
        ctx.moveTo(s/2, my);
        ctx.bezierCurveTo(s/2 - s*0.15 - i*s*0.03, my + s*0.08, s/2 - s*0.18 - i*s*0.03, my + s*0.2, s/2 - s*0.2 - i*s*0.04, my + s*0.3);
        ctx.strokeStyle = c; ctx.lineWidth = s*0.02; ctx.stroke();
      });
    },
  },
];

// ─── HATS ─────────────────────────────────────────────────────────────────────
export const hats = [
  {
    id: 'hat_none', name: 'No Hat', rarity: 'Common',
    draw() {},
  },
  {
    id: 'hat_beanie', name: 'Beanie', rarity: 'Common',
    draw(ctx, s) {
      // red beanie
      ctx.beginPath();
      ctx.ellipse(s/2, s*0.13, s*0.27, s*0.08, 0, Math.PI, 0, true);
      ctx.fillStyle = '#cc2222'; ctx.fill();
      roundRect(ctx, s*0.23, s*0.07, s*0.54, s*0.1, s*0.04);
      ctx.fillStyle = '#cc2222'; ctx.fill();
      // pompom
      circle(ctx, s/2, s*0.07, s*0.05, '#eeeeee', null);
      // stripes
      ctx.strokeStyle = '#ff4444'; ctx.lineWidth = s*0.02;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.moveTo(s*0.25, s*(0.09 + i*0.025)); ctx.lineTo(s*0.75, s*(0.09 + i*0.025));
        ctx.stroke();
      }
    },
  },
  {
    id: 'hat_cowboy', name: 'Cowboy', rarity: 'Uncommon',
    draw(ctx, s) {
      // brim
      ctx.beginPath(); ctx.ellipse(s/2, s*0.16, s*0.35, s*0.05, 0, 0, Math.PI*2);
      ctx.fillStyle = '#8B4513'; ctx.fill();
      // crown
      roundRect(ctx, s*0.3, s*0.02, s*0.4, s*0.15, s*0.04);
      ctx.fillStyle = '#6B3410'; ctx.fill();
      // band
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(s*0.3, s*0.13, s*0.4, s*0.025);
    },
  },
  {
    id: 'hat_tophat', name: 'Top Hat', rarity: 'Rare',
    draw(ctx, s) {
      // brim
      ctx.beginPath(); ctx.ellipse(s/2, s*0.17, s*0.3, s*0.045, 0, 0, Math.PI*2);
      ctx.fillStyle = '#1a1a1a'; ctx.fill();
      // crown
      roundRect(ctx, s*0.33, s*0.01, s*0.34, s*0.17, s*0.02);
      ctx.fillStyle = '#111111'; ctx.fill();
      // gold band
      ctx.fillStyle = '#FFD700'; ctx.fillRect(s*0.33, s*0.14, s*0.34, s*0.02);
    },
  },
  {
    id: 'hat_crown', name: 'Gold Crown', rarity: 'Legendary',
    draw(ctx, s) {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.moveTo(s*0.28, s*0.18); ctx.lineTo(s*0.28, s*0.06);
      ctx.lineTo(s*0.37, s*0.13); ctx.lineTo(s/2, s*0.04);
      ctx.lineTo(s*0.63, s*0.13); ctx.lineTo(s*0.72, s*0.06);
      ctx.lineTo(s*0.72, s*0.18); ctx.closePath();
      ctx.fill(); ctx.strokeStyle = '#c8860a'; ctx.lineWidth = s*0.015; ctx.stroke();
      // jewels
      const gems = [['#ff4444', s*0.37, s*0.12], ['#4444ff', s/2, s*0.1], ['#44ff44', s*0.63, s*0.12]];
      gems.forEach(([c, gx, gy]) => circle(ctx, gx, gy, s*0.02, c, '#fff', 1));
    },
  },
  {
    id: 'hat_cap', name: 'Cap', rarity: 'Common',
    draw(ctx, s) {
      // brim
      ctx.beginPath(); ctx.ellipse(s*0.62, s*0.18, s*0.2, s*0.04, -0.3, 0, Math.PI*2);
      ctx.fillStyle = '#2244aa'; ctx.fill();
      // panel
      ctx.beginPath();
      ctx.arc(s/2, s*0.14, s*0.27, Math.PI, 0);
      ctx.fillStyle = '#2244aa'; ctx.fill();
      // button
      circle(ctx, s/2, s*0.08, s*0.025, '#1133aa', null);
    },
  },
  {
    id: 'hat_headband', name: 'Headband', rarity: 'Uncommon',
    draw(ctx, s) {
      ctx.fillStyle = '#cc0000';
      ctx.fillRect(s*0.2, s*0.17, s*0.6, s*0.04);
      // knot
      circle(ctx, s/2, s*0.19, s*0.03, '#dd1111', null);
      // trailing ribbons
      ctx.strokeStyle = '#cc0000'; ctx.lineWidth = s*0.015;
      ctx.beginPath(); ctx.moveTo(s/2, s*0.19); ctx.lineTo(s*0.6, s*0.14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s/2, s*0.19); ctx.lineTo(s*0.65, s*0.22); ctx.stroke();
    },
  },
];

// ─── ACCESSORIES ──────────────────────────────────────────────────────────────
export const accessories = [
  {
    id: 'acc_none', name: 'None', rarity: 'Common',
    draw() {},
  },
  {
    id: 'acc_earring', name: 'Gold Earring', rarity: 'Uncommon',
    draw(ctx, s) {
      circle(ctx, s*0.77, s*0.3, s*0.025, null, '#FFD700', s*0.018);
      circle(ctx, s*0.77, s*0.33, s*0.01, '#FFD700', null);
    },
  },
  {
    id: 'acc_necklace', name: 'Gold Chain', rarity: 'Uncommon',
    draw(ctx, s) {
      ctx.strokeStyle = '#FFD700'; ctx.lineWidth = s*0.015;
      ctx.beginPath(); ctx.arc(s/2, s*0.52, s*0.14, 0.2, Math.PI - 0.2);
      ctx.stroke();
      // pendant
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.moveTo(s/2, s*0.65); ctx.lineTo(s/2 - s*0.02, s*0.62); ctx.lineTo(s/2 + s*0.02, s*0.62);
      ctx.closePath(); ctx.fill();
    },
  },
  {
    id: 'acc_hoodie_strings', name: 'Hoodie Strings', rarity: 'Common',
    draw(ctx, s) {
      ctx.strokeStyle = '#555'; ctx.lineWidth = s*0.012;
      [-1, 1].forEach(side => {
        ctx.beginPath();
        ctx.moveTo(s/2 + side*s*0.04, s*0.58);
        ctx.bezierCurveTo(s/2 + side*s*0.04, s*0.7, s/2 + side*s*0.07, s*0.75, s/2 + side*s*0.07, s*0.85);
        ctx.stroke();
        // tip
        circle(ctx, s/2 + side*s*0.07, s*0.86, s*0.015, '#444', null);
      });
    },
  },
  {
    id: 'acc_bayc_hat', name: 'BAYC Hat', rarity: 'Rare',
    draw(ctx, s) {
      // boat captain hat base
      ctx.beginPath(); ctx.ellipse(s/2, s*0.15, s*0.28, s*0.05, 0, 0, Math.PI*2);
      ctx.fillStyle = '#000'; ctx.fill();
      roundRect(ctx, s*0.3, s*0.04, s*0.4, s*0.12, s*0.02);
      ctx.fillStyle = '#111'; ctx.fill();
      // BAYC logo placeholder (skull shape)
      ctx.fillStyle = '#FFD700';
      ctx.font = `bold ${s*0.07}px Arial`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('☠', s/2, s*0.1);
    },
  },
  {
    id: 'acc_diamond', name: 'Diamond Ring', rarity: 'Legendary',
    draw(ctx, s) {
      const dx = s*0.78, dy = s*0.45;
      // ring band
      circle(ctx, dx, dy, s*0.03, null, '#aaaaaa', s*0.015);
      // diamond
      ctx.fillStyle = 'rgba(150,200,255,0.9)';
      ctx.beginPath();
      ctx.moveTo(dx, dy - s*0.04); ctx.lineTo(dx + s*0.025, dy - s*0.02);
      ctx.lineTo(dx, dy + s*0.02); ctx.lineTo(dx - s*0.025, dy - s*0.02);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke();
      // sparkle
      ctx.fillStyle = '#fff';
      ctx.font = `${s*0.04}px Arial`; ctx.textAlign = 'center';
      ctx.fillText('✦', dx + s*0.03, dy - s*0.05);
    },
  },
];

// ─── CLOTHING ─────────────────────────────────────────────────────────────────
export const clothing = [
  {
    id: 'cloth_naked', name: 'No Clothes', rarity: 'Common',
    draw() {},
  },
  {
    id: 'cloth_striped', name: 'Striped Tee', rarity: 'Common',
    draw(ctx, s) {
      roundRect(ctx, s*0.15, s*0.55, s*0.7, s*0.45, s*0.08);
      ctx.fillStyle = '#f0f0f0'; ctx.fill();
      const stripeColors = ['#cc4444', '#f0f0f0'];
      for (let i = 0; i < 8; i++) {
        roundRect(ctx, s*0.15, s*0.55 + i*s*0.055, s*0.7, s*0.057, i===0?s*0.08:0);
        ctx.fillStyle = stripeColors[i%2]; ctx.fill();
      }
      // collar
      ctx.beginPath(); ctx.moveTo(s*0.4, s*0.55); ctx.lineTo(s/2, s*0.62); ctx.lineTo(s*0.6, s*0.55);
      ctx.strokeStyle = '#ddd'; ctx.lineWidth = s*0.015; ctx.stroke();
    },
  },
  {
    id: 'cloth_hoodie', name: 'Hoodie', rarity: 'Uncommon',
    draw(ctx, s) {
      roundRect(ctx, s*0.15, s*0.55, s*0.7, s*0.45, s*0.08);
      ctx.fillStyle = '#333344'; ctx.fill();
      // hood outline
      ctx.beginPath();
      ctx.moveTo(s*0.28, s*0.55); ctx.quadraticCurveTo(s/2, s*0.4, s*0.72, s*0.55);
      ctx.strokeStyle = '#444455'; ctx.lineWidth = s*0.02; ctx.stroke();
      // pocket
      roundRect(ctx, s*0.38, s*0.72, s*0.24, s*0.15, s*0.04);
      ctx.fillStyle = '#2a2a3a'; ctx.fill();
      // kangaroo divider
      ctx.beginPath(); ctx.moveTo(s/2, s*0.72); ctx.lineTo(s/2, s*0.87);
      ctx.strokeStyle = '#444455'; ctx.lineWidth = s*0.01; ctx.stroke();
    },
  },
  {
    id: 'cloth_tuxedo', name: 'Tuxedo', rarity: 'Rare',
    draw(ctx, s) {
      roundRect(ctx, s*0.15, s*0.55, s*0.7, s*0.45, s*0.08);
      ctx.fillStyle = '#1a1a1a'; ctx.fill();
      // white shirt
      ctx.fillStyle = '#f0f0f0';
      ctx.beginPath();
      ctx.moveTo(s/2, s*0.56); ctx.lineTo(s*0.42, s*0.62);
      ctx.lineTo(s*0.42, s*0.85); ctx.lineTo(s*0.58, s*0.85);
      ctx.lineTo(s*0.58, s*0.62); ctx.closePath();
      ctx.fill();
      // bow tie
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.moveTo(s*0.42, s*0.62); ctx.lineTo(s*0.48, s*0.65); ctx.lineTo(s*0.42, s*0.68); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(s*0.58, s*0.62); ctx.lineTo(s*0.52, s*0.65); ctx.lineTo(s*0.58, s*0.68); ctx.closePath(); ctx.fill();
      circle(ctx, s/2, s*0.65, s*0.015, '#FFD700', null);
    },
  },
  {
    id: 'cloth_bored_yacht', name: 'BAYC Jacket', rarity: 'Legendary',
    draw(ctx, s) {
      roundRect(ctx, s*0.15, s*0.55, s*0.7, s*0.45, s*0.08);
      // gradient leather
      const g = ctx.createLinearGradient(0, s*0.55, 0, s);
      g.addColorStop(0, '#2a1500'); g.addColorStop(1, '#5a3000');
      ctx.fillStyle = g; ctx.fill();
      // gold lapels
      ctx.fillStyle = '#FFD700';
      ctx.beginPath(); ctx.moveTo(s*0.38, s*0.56); ctx.lineTo(s*0.45, s*0.72); ctx.lineTo(s*0.28, s*0.56); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(s*0.62, s*0.56); ctx.lineTo(s*0.55, s*0.72); ctx.lineTo(s*0.72, s*0.56); ctx.closePath(); ctx.fill();
      // "BAYC" patch
      roundRect(ctx, s*0.59, s*0.67, s*0.16, s*0.08, s*0.02);
      ctx.fillStyle = '#FFD700'; ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = `bold ${s*0.04}px Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('BAYC', s*0.67, s*0.71);
    },
  },
  {
    id: 'cloth_flannel', name: 'Flannel', rarity: 'Uncommon',
    draw(ctx, s) {
      roundRect(ctx, s*0.15, s*0.55, s*0.7, s*0.45, s*0.08);
      ctx.fillStyle = '#8B2020'; ctx.fill();
      // plaid pattern
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = s*0.025;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath(); ctx.moveTo(s*0.15 + i*s*0.12, s*0.55); ctx.lineTo(s*0.15 + i*s*0.12, s); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(s*0.15, s*0.55 + i*s*0.08); ctx.lineTo(s*0.85, s*0.55 + i*s*0.08); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = s*0.012;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath(); ctx.moveTo(s*0.21 + i*s*0.12, s*0.55); ctx.lineTo(s*0.21 + i*s*0.12, s); ctx.stroke();
      }
    },
  },
];

// ─── TRAIT CATEGORIES ─────────────────────────────────────────────────────────
export const TRAIT_CATEGORIES = [
  { key: 'background', label: 'Background', traits: backgrounds },
  { key: 'body',       label: 'Body',       traits: bodies },
  { key: 'clothing',   label: 'Clothing',   traits: clothing },
  { key: 'eyes',       label: 'Eyes',       traits: eyes },
  { key: 'mouth',      label: 'Mouth',      traits: mouths },
  { key: 'hat',        label: 'Hat',        traits: hats },
  { key: 'accessory',  label: 'Accessory',  traits: accessories },
];

// weighted random pick
export function pickTrait(traitList) {
  const totalWeight = traitList.reduce((sum, t) => sum + RARITIES[t.rarity].weight, 0);
  let rand = Math.random() * totalWeight;
  for (const t of traitList) {
    rand -= RARITIES[t.rarity].weight;
    if (rand <= 0) return t;
  }
  return traitList[traitList.length - 1];
}

// rarity score: higher = rarer
export function calcRarityScore(traitsObj) {
  let score = 0;
  const weights = { Common: 1, Uncommon: 4, Rare: 10, Legendary: 30 };
  Object.values(traitsObj).forEach(t => {
    if (t) score += weights[t.rarity] || 0;
  });
  return score;
}

export function rarityTier(score) {
  if (score >= 80) return 'Legendary';
  if (score >= 40) return 'Rare';
  if (score >= 20) return 'Uncommon';
  return 'Common';
}
