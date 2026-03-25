export class UIManager {
    constructor() {
        this.scoreEl = document.getElementById('score');
        this.coinsEl = document.getElementById('coins');
        this.speedEl = document.getElementById('speed');
        
        this.hud = document.getElementById('hud');
        this.startMenu = document.getElementById('start-menu');
        this.gameOverMenu = document.getElementById('game-over-menu');
        this.finalScoreEl = document.getElementById('final-score');

        this.score = 0;
        this.coins = 0;
    }

    updateHUD(score, coins, speed) {
        this.score = Math.floor(score);
        this.coins = coins;
        this.scoreEl.innerText = this.score;
        this.coinsEl.innerText = this.coins;
        this.speedEl.innerText = speed.toFixed(1);
    }

    showStartMenu(startCallback) {
        document.getElementById('start-btn').onclick = () => {
            this.startMenu.classList.add('hidden');
            this.hud.classList.remove('hidden');
            startCallback();
        };
    }

    showGameOver(restartCallback) {
        this.hud.classList.add('hidden');
        this.gameOverMenu.classList.remove('hidden');
        this.finalScoreEl.innerText = this.score;
        
        document.getElementById('restart-btn').onclick = () => {
            this.gameOverMenu.classList.add('hidden');
            this.hud.classList.remove('hidden');
            restartCallback();
        };
    }
}
