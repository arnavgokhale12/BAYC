// ─── AUDIO ENGINE ─────────────────────────────────────────────────────────────
// All audio synthesized with Web Audio API — no external files required.

let ctx = null;
let ambientNodes = [];
let analyserNode = null;
let ambientGainNode = null;
let isMuted = true;
let isInitialized = false;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 64;
    analyserNode.smoothingTimeConstant = 0.8;
    ambientGainNode = ctx.createGain();
    ambientGainNode.gain.value = 0;
    ambientGainNode.connect(analyserNode);
    analyserNode.connect(ctx.destination);
  }
  return ctx;
}

// ─── NOISE BUFFER ─────────────────────────────────────────────────────────────
function createNoiseBuffer(duration = 1) {
  const audioCtx = getCtx();
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

// ─── AMBIENT DRONE ────────────────────────────────────────────────────────────
export function startAmbient() {
  if (isInitialized) return;
  const audioCtx = getCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  isInitialized = true;

  const freqs = [55, 82.5, 110, 165]; // low A, E, A, E harmonics
  freqs.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gainN = audioCtx.createGain();
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();

    osc.type = i % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.value = freq;

    lfo.type = 'sine';
    lfo.frequency.value = 0.05 + i * 0.03;
    lfoGain.gain.value = freq * 0.015;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gainN.gain.value = 0.12 / (i + 1);
    osc.connect(gainN);
    gainN.connect(ambientGainNode);

    lfo.start();
    osc.start();
    ambientNodes.push(osc, gainN, lfo, lfoGain);
  });

  // Sub bass pulse
  const sub = audioCtx.createOscillator();
  const subGain = audioCtx.createGain();
  const subLfo = audioCtx.createOscillator();
  const subLfoGain = audioCtx.createGain();
  sub.type = 'sine';
  sub.frequency.value = 27.5;
  subLfo.type = 'sine';
  subLfo.frequency.value = 0.1;
  subLfoGain.gain.value = 0.08;
  subLfo.connect(subLfoGain);
  subLfoGain.connect(subGain.gain);
  subGain.gain.value = 0.18;
  sub.connect(subGain);
  subGain.connect(ambientGainNode);
  subLfo.start(); sub.start();
  ambientNodes.push(sub, subGain, subLfo, subLfoGain);
}

export function unmute() {
  const audioCtx = getCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  if (!isInitialized) startAmbient();
  isMuted = false;
  ambientGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
  ambientGainNode.gain.setTargetAtTime(0.5, audioCtx.currentTime, 0.15);
}

export function mute() {
  if (!ambientGainNode) return;
  isMuted = true;
  const audioCtx = getCtx();
  ambientGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
  ambientGainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
}

export function getIsMuted() { return isMuted; }

// ─── ANALYSER ─────────────────────────────────────────────────────────────────
export function getAnalyserData() {
  if (!analyserNode) return new Uint8Array(8).fill(0);
  const data = new Uint8Array(analyserNode.frequencyBinCount);
  analyserNode.getByteFrequencyData(data);
  return data;
}

// ─── SFX ──────────────────────────────────────────────────────────────────────

// Soft vinyl crackle (hover)
export function sfxHover() {
  if (isMuted) return;
  const audioCtx = getCtx();
  const noiseBuffer = createNoiseBuffer(0.12);
  const source = audioCtx.createBufferSource();
  source.buffer = noiseBuffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 3000;
  filter.Q.value = 0.5;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  source.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  source.start(); source.stop(audioCtx.currentTime + 0.12);
}

// Deep bass thud (click/modal open)
export function sfxThud() {
  const audioCtx = getCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.35);
}

// Shimmer/sparkle (trait reveal)
export function sfxSparkle() {
  const audioCtx = getCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const freqs = [1200, 1600, 2000, 2600];
  freqs.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = audioCtx.currentTime + i * 0.04;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.15);
  });
}

// Slot spin tick
export function sfxSlotTick() {
  const audioCtx = getCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.value = 400 + Math.random() * 200;
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.05);
}

// Slot lock-in (satisfying click)
export function sfxSlotLock() {
  const audioCtx = getCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  // mechanical thud
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.1);
}

// Coin chime (mint complete)
export function sfxCoinChime() {
  const audioCtx = getCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const notes = [523, 659, 784, 1047, 1319]; // C5 E5 G5 C6 E6
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = audioCtx.currentTime + i * 0.1;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.4);
  });
}

// Page load ambient swell
export function sfxSwell() {
  const audioCtx = getCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(200, audioCtx.currentTime);
  filter.frequency.linearRampToValueAtTime(2000, audioCtx.currentTime + 1.5);
  osc.type = 'sine';
  osc.frequency.value = 110;
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.8);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.0);
  osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 2.0);
}
