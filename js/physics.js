class Physics {
    constructor() {
        this.gravity = 9.8; // m/s²
        this.velocity = { x: 0, y: 0 };
    }

    applyGravity(time) {
        this.velocity.y += this.gravity * time;
    }

    updatePosition(position, time) {
        position.x += this.velocity.x * time;
        position.y += this.velocity.y * time;
    }

    checkCollision(rectA, rectB) {
        return !(
            rectA.right < rectB.left ||
            rectA.left > rectB.right ||
            rectA.bottom < rectB.top ||
            rectA.top > rectB.bottom
        );
    }

    calculateArcadePhysics(input) {
        const acceleration = 10; // some arbitrary acceleration value
        this.velocity.x += input * acceleration;
        // Limit velocity to some max value
        const maxVelocity = 100;
        if (this.velocity.x > maxVelocity) this.velocity.x = maxVelocity;
    }
}

export default Physics;