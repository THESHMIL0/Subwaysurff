export class Controls {
    constructor() {
        this.keys = { left: false, right: false, up: false, down: false };
        this.touchStart = { x: 0, y: 0 };
        this.swipeThreshold = 30;

        window.addEventListener('keydown', (e) => this.handleKey(e, true));
        window.addEventListener('keyup', (e) => this.handleKey(e, false));
        
        window.addEventListener('touchstart', (e) => {
            this.touchStart.x = e.changedTouches[0].screenX;
            this.touchStart.y = e.changedTouches[0].screenY;
        }, { passive: true });

        window.addEventListener('touchend', (e) => this.handleSwipe(e));
    }

    handleKey(e, isDown) {
        if (e.code === 'ArrowLeft') this.keys.left = isDown;
        if (e.code === 'ArrowRight') this.keys.right = isDown;
        if (e.code === 'ArrowUp') this.keys.up = isDown;
        if (e.code === 'ArrowDown') this.keys.down = isDown;
    }

    handleSwipe(e) {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const dx = touchEndX - this.touchStart.x;
        const dy = touchEndY - this.touchStart.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > this.swipeThreshold) this.triggerAction('right');
            else if (dx < -this.swipeThreshold) this.triggerAction('left');
        } else {
            if (dy > this.swipeThreshold) this.triggerAction('down');
            else if (dy < -this.swipeThreshold) this.triggerAction('up');
        }
    }

    triggerAction(action) {
        // Simulates a quick keypress for touch
        this.keys[action] = true;
        setTimeout(() => this.keys[action] = false, 100);
    }
}
