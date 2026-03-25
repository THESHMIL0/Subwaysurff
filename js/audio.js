export class AudioManager {
    constructor() {
        // Initialize the Web Audio API
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.bgmOscillator = null;
        this.isMuted = false;
    }

    // Browsers block audio until the user interacts with the page
    resume() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playJump() {
        if (this.isMuted) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        // A quick upward pitch sweep for a "boing" jump sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);

        // Fade out quickly
        gainNode.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }

    playCoin() {
        if (this.isMuted) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        // High pitched "ding"
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // Note B5
        osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.05); // Note E6

        // Sharp attack, quick decay
        gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playCrash() {
        if (this.isMuted) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        // A rough, descending sawtooth wave for a crash
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.5);

        gainNode.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }

    startBGM() {
        if (this.isMuted) return;
        this.resume();
        this.stopBGM(); // Stop any existing BGM

        this.bgmOscillator = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        this.bgmOscillator.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        // A low drone sound for a "cyberpunk" feel
        this.bgmOscillator.type = 'square';
        this.bgmOscillator.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

        // Keep volume very low so it stays in the background
        gainNode.gain.setValueAtTime(0.05, this.ctx.currentTime);

        this.bgmOscillator.start();
    }

    stopBGM() {
        if (this.bgmOscillator) {
            this.bgmOscillator.stop();
            this.bgmOscillator.disconnect();
            this.bgmOscillator = null;
        }
    }
}
