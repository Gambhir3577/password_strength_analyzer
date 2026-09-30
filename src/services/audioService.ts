/**
 * Zero-asset Web Audio synthesizer for tactile acoustic feedback.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;

  constructor() {
    // Check localStorage preference if available
    try {
      const stored = localStorage.getItem('cipherguard_sound_enabled');
      this.isMuted = stored !== 'true';
    } catch {
      this.isMuted = true;
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return !this.isMuted;
  }

  public setEnabled(enabled: boolean): void {
    this.isMuted = !enabled;
    try {
      localStorage.setItem('cipherguard_sound_enabled', enabled ? 'true' : 'false');
    } catch {
      // ignore storage limitations
    }
  }

  /**
   * Play short pleasant melodic tone based on strength score (0 to 4).
   */
  public playScoreMilestone(score: number): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const frequencies = [220, 277.18, 329.63, 440, 554.37]; // A3, C#4, E4, A4, C#5
    const freq = frequencies[Math.min(score, frequencies.length - 1)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = score >= 3 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  }

  /**
   * Play gentle high chime for generator actions.
   */
  public playGenerate(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  /**
   * Play crisp click sound for clipboard copy.
   */
  public playCopy(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }
}

export const soundEngine = new SoundEngine();
