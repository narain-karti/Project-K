'use client';

// Sound utility for UI interactions
// Uses Web Audio API for lightweight, instant sound effects

type SoundType = 'click' | 'toggle' | 'success' | 'error' | 'slide' | 'start' | 'stop' | 'reset' | 'mode';

class SoundManager {
    private audioContext: AudioContext | null = null;
    private isEnabled: boolean = true;

    private getContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.audioContext;
    }

    private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.15) {
        if (!this.isEnabled) return;

        try {
            const ctx = this.getContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

            // Envelope for smooth sound
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration);
        } catch (e) {
            // Silently fail if audio not available
        }
    }

    private playMultiTone(tones: { freq: number; delay: number; duration: number }[], type: OscillatorType = 'sine', volume: number = 0.12) {
        if (!this.isEnabled) return;

        try {
            const ctx = this.getContext();

            tones.forEach(({ freq, delay, duration }) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.type = type;
                oscillator.frequency.setValueAtTime(freq, ctx.currentTime + delay);

                gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
                gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

                oscillator.start(ctx.currentTime + delay);
                oscillator.stop(ctx.currentTime + delay + duration);
            });
        } catch (e) {
            // Silently fail
        }
    }

    play(type: SoundType) {
        switch (type) {
            case 'click':
                // Short click sound
                this.playTone(800, 0.08, 'square', 0.08);
                break;

            case 'toggle':
                // Toggle switch sound
                this.playMultiTone([
                    { freq: 600, delay: 0, duration: 0.05 },
                    { freq: 900, delay: 0.03, duration: 0.08 },
                ], 'sine', 0.1);
                break;

            case 'success':
                // Ascending success sound
                this.playMultiTone([
                    { freq: 523, delay: 0, duration: 0.1 },
                    { freq: 659, delay: 0.08, duration: 0.1 },
                    { freq: 784, delay: 0.16, duration: 0.15 },
                ], 'sine', 0.12);
                break;

            case 'error':
                // Error/warning sound
                this.playMultiTone([
                    { freq: 400, delay: 0, duration: 0.15 },
                    { freq: 300, delay: 0.1, duration: 0.15 },
                ], 'sawtooth', 0.1);
                break;

            case 'slide':
                // Slider adjustment sound
                this.playTone(440 + Math.random() * 200, 0.04, 'sine', 0.06);
                break;

            case 'start':
                // Start/play sound - ascending energetic
                this.playMultiTone([
                    { freq: 392, delay: 0, duration: 0.1 },
                    { freq: 523, delay: 0.07, duration: 0.1 },
                    { freq: 659, delay: 0.14, duration: 0.12 },
                    { freq: 784, delay: 0.21, duration: 0.18 },
                ], 'sine', 0.15);
                break;

            case 'stop':
                // Pause sound - descending
                this.playMultiTone([
                    { freq: 600, delay: 0, duration: 0.1 },
                    { freq: 450, delay: 0.08, duration: 0.15 },
                ], 'sine', 0.12);
                break;

            case 'reset':
                // Reset sound - distinctive warning
                this.playMultiTone([
                    { freq: 800, delay: 0, duration: 0.08 },
                    { freq: 600, delay: 0.06, duration: 0.08 },
                    { freq: 400, delay: 0.12, duration: 0.1 },
                    { freq: 600, delay: 0.2, duration: 0.08 },
                ], 'triangle', 0.1);
                break;

            case 'mode':
                // Mode switch sound
                this.playMultiTone([
                    { freq: 500, delay: 0, duration: 0.06 },
                    { freq: 700, delay: 0.05, duration: 0.1 },
                ], 'sine', 0.12);
                break;
        }
    }

    setEnabled(enabled: boolean) {
        this.isEnabled = enabled;
    }
}

// Singleton instance
export const soundManager = new SoundManager();

// React hook for easy usage
export function useSound() {
    return {
        playClick: () => soundManager.play('click'),
        playToggle: () => soundManager.play('toggle'),
        playSuccess: () => soundManager.play('success'),
        playError: () => soundManager.play('error'),
        playSlide: () => soundManager.play('slide'),
        playStart: () => soundManager.play('start'),
        playStop: () => soundManager.play('stop'),
        playReset: () => soundManager.play('reset'),
        playMode: () => soundManager.play('mode'),
    };
}
