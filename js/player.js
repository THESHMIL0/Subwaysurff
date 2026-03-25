import * as THREE from 'three';

export class Player {
    constructor(scene) {
        // Placeholder procedural character
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ffcc });
        this.mesh = new THREE.Mesh(geometry, material);
        
        this.laneWidth = 3; // Distance between lanes
        this.currentLane = 0; // -1 (left), 0 (center), 1 (right)
        this.targetX = 0;
        this.baseY = 1; // Half of height
        
        this.mesh.position.set(0, this.baseY, 0);
        scene.add(this.mesh);

        this.velocity = new THREE.Vector3();
        this.isGrounded = true;
        this.isSliding = false;
        
        // Cooldowns
        this.canSwitchLane = true;
    }

    reset() {
        this.currentLane = 0;
        this.targetX = 0;
        this.mesh.position.set(0, this.baseY, 0);
        this.velocity.set(0,0,0);
        this.isGrounded = true;
        this.mesh.scale.y = 1;
    }

    update(controls, deltaTime, physics) {
        // Handle Input
        if (controls.keys.left && this.canSwitchLane && this.currentLane > -1) {
            this.currentLane--;
            this.canSwitchLane = false;
        } else if (controls.keys.right && this.canSwitchLane && this.currentLane < 1) {
            this.currentLane++;
            this.canSwitchLane = false;
        }

        // Reset lane switch cooldown
        if (!controls.keys.left && !controls.keys.right) {
            this.canSwitchLane = true;
        }

        if (controls.keys.up && this.isGrounded) {
            this.velocity.y = 18; // Jump force
            this.isGrounded = false;
        }

        if (controls.keys.down && this.isGrounded && !this.isSliding) {
            this.slide();
        }

        // Smoothly interpolate (lerp) X position for lane switching
        this.targetX = this.currentLane * this.laneWidth;
        this.mesh.position.x += (this.targetX - this.mesh.position.x) * 10 * deltaTime;

        // Apply physics
        physics.applyGravity(this, deltaTime);
    }

    slide() {
        this.isSliding = true;
        this.mesh.scale.y = 0.5;
        this.mesh.position.y = this.baseY / 2;
        setTimeout(() => {
            this.isSliding = false;
            this.mesh.scale.y = 1;
            this.mesh.position.y = this.baseY;
        }, 600);
    }
}
