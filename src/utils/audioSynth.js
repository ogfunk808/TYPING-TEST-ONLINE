// Web Audio API Programmatic Sound Synthesizer
// Synthesizes typing click sounds, laser blasts, errors, and success jingles without audio assets.

let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Helper to create noise buffer for clicks
let noiseBuffer = null;
function getNoiseBuffer() {
  if (noiseBuffer) return noiseBuffer;
  
  initAudio();
  const bufferSize = audioCtx.sampleRate * 0.1; // 100ms
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  noiseBuffer = buffer;
  return noiseBuffer;
}

export const playSound = {
  // Mechanical typewriter key click
  click: (pitch = 1.0) => {
    try {
      initAudio();
      if (!audioCtx) return;

      const buffer = getNoiseBuffer();
      const noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;

      // Filter to make it metallic and crisp
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200 * pitch;
      filter.Q.value = 5;

      // Gain envelope
      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);

      noiseNode.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Add a small metallic sine beep for keyboard impact
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 * pitch, audioCtx.currentTime);
      oscGain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);

      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);

      noiseNode.start();
      osc.start();
      noiseNode.stop(audioCtx.currentTime + 0.06);
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      console.warn("Audio error: ", e);
    }
  },

  // Deeper mechanical spacebar click
  spacebar: () => {
    try {
      initAudio();
      if (!audioCtx) return;

      const buffer = getNoiseBuffer();
      const noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;

      // Lower frequency bandpass for spacebar
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 500;
      filter.Q.value = 3;

      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);

      noiseNode.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Low pitch sine thud
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, audioCtx.currentTime);
      oscGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);

      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);

      noiseNode.start();
      osc.start();
      noiseNode.stop(audioCtx.currentTime + 0.12);
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio error: ", e);
    }
  },

  // Laser sound for firing at words
  laser: () => {
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sawtooth';
      // Pitch sweeps down quickly from 1200Hz to 150Hz
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.18);

      // Bandpass sweep to make it swoosh
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2000, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.18);

      gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.22);
    } catch (e) {
      console.warn("Audio error: ", e);
    }
  },

  // Quick error buzz
  error: () => {
    try {
      initAudio();
      if (!audioCtx) return;

      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(110, audioCtx.currentTime); // Low A

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(115, audioCtx.currentTime); // Detuned buzzing

      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 0.3);
      osc2.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio error: ", e);
    }
  },

  // Success double beep (high pitch)
  success: () => {
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5

      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio error: ", e);
    }
  },

  // Level up arcade retro sound
  levelUp: () => {
    try {
      initAudio();
      if (!audioCtx) return;

      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
      const noteDuration = 0.08;

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * noteDuration);

        gainNode.gain.setValueAtTime(0.0, audioCtx.currentTime + idx * noteDuration);
        gainNode.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + idx * noteDuration + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + idx * noteDuration + noteDuration * 1.5);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + idx * noteDuration);
        osc.stop(audioCtx.currentTime + idx * noteDuration + noteDuration * 2);
      });
    } catch (e) {
      console.warn("Audio error: ", e);
    }
  }
};
