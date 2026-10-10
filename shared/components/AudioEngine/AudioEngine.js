/**
 * AudioEngine: motor de síntesis de cuerdas pulsadas (Web Audio API)
 *
 * Genera notas con osciladores (triángulo y armónicos) y un pulso de ruido
 * filtrado para simular la pulsación. Sin dependencias de DOM.
 *
 * Uso: cargar ../../shared/components/AudioEngine/AudioEngine.js con una etiqueta script
 *   const audio = new AudioEngine({ volumePercent: 70, sustainPercent: 45 });
 *   audio.playMidi(60, 0.8);      // Do central, 0.8 s
 *   audio.playMidi(64, 0.8, 0.2); // Mi, con retardo de 0.2 s
 *
 * El contexto de audio se crea en la primera llamada a playMidi, porque los
 * navegadores exigen una interacción del usuario antes de reproducir sonido.
 */

function midiToFrequency(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

class AudioEngine {
  constructor({ volumePercent = 70, sustainPercent = 45 } = {}) {
    this.ctx = null;
    this.masterGain = null;
    this.activeOscillators = [];
    this.volumePercent = volumePercent;
    this.sustainPercent = sustainPercent;
  }

  ensure() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volumePercent / 100;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    if (this.masterGain) this.masterGain.gain.value = this.volumePercent / 100;
  }

  createPluckNoise(now, duration = 0.05) {
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const noiseGain = this.ctx.createGain();
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(900, now);
    noiseFilter.Q.setValueAtTime(0.8, now);

    noiseGain.gain.setValueAtTime(0.10, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    source.start(now);
    source.stop(now + duration + 0.01);
  }

  playMidi(midi, duration = 0.8, delay = 0) {
    this.ensure();
    const now = this.ctx.currentTime + delay;
    const freq = midiToFrequency(midi);
    const sustainFactor = Math.max(0.1, Math.min(1, this.sustainPercent / 100));
    const releaseTime = 0.05 + sustainFactor * 0.18;
    const endTime = now + duration + releaseTime + 0.04;

    const output = this.ctx.createGain();
    const bodyFilter = this.ctx.createBiquadFilter();
    const lowBody = this.ctx.createBiquadFilter();

    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(1200, now);
    bodyFilter.frequency.exponentialRampToValueAtTime(650, now + Math.max(0.08, duration * 0.55));
    bodyFilter.Q.setValueAtTime(0.85, now);

    lowBody.type = 'peaking';
    lowBody.frequency.setValueAtTime(95, now);
    lowBody.Q.setValueAtTime(0.9, now);
    lowBody.gain.setValueAtTime(4.5, now);

    output.gain.setValueAtTime(0.0001, now);
    output.gain.exponentialRampToValueAtTime(0.34, now + 0.018);
    output.gain.exponentialRampToValueAtTime(0.20, now + Math.max(0.08, duration * 0.33));
    output.gain.exponentialRampToValueAtTime(0.0001, now + duration + releaseTime);

    const partials = [
      { type: 'triangle', ratio: 1, gain: 0.72, detune: 0 },
      { type: 'sawtooth', ratio: 1, gain: 0.10, detune: -3 },
      { type: 'sine', ratio: 2, gain: 0.18, detune: 0 },
      { type: 'sine', ratio: 3, gain: 0.08, detune: 2 }
    ];

    partials.forEach(partial => {
      const osc = this.ctx.createOscillator();
      const partialGain = this.ctx.createGain();
      osc.type = partial.type;
      osc.frequency.setValueAtTime(freq * partial.ratio, now);
      osc.detune.setValueAtTime(partial.detune, now);
      partialGain.gain.setValueAtTime(partial.gain, now);
      osc.connect(partialGain);
      partialGain.connect(bodyFilter);
      osc.start(now);
      osc.stop(endTime);
      this.activeOscillators.push(osc);
      osc.onended = () => {
        this.activeOscillators = this.activeOscillators.filter(item => item !== osc);
      };
    });

    bodyFilter.connect(lowBody);
    lowBody.connect(output);
    output.connect(this.masterGain);

    this.createPluckNoise(now, 0.045);
  }
}
