import * as THREE from 'three';

export class Player {
    constructor(scene) {
        // Group allows us to stick multiple shapes together
        this.mesh = new THREE.Group(); 

        // 1. Robot Body
        const bodyGeo = new THREE.BoxGeometry(1, 1.2, 1);
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x00ffcc });
        this.body = new THREE.Mesh(bodyGeo, bodyMat);
        this.body.position.y = 0.6;
        this.mesh.add(this.body);

        // 2. Robot Head
        const headGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const headMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        this.head = new THREE.Mesh(headGeo, headMat);
        this.head.position.y = 1.6;
        this.mesh.add(this.head);

        this.laneWidth = 3; // Distance between lanes
        this.currentLane = 0; // -1 (left), 0 (center), 1 (right)
        this.targetX = 0;
        this.baseY = 0.5; // Hover slightly off the ground
        
        this.mesh.position.set(0, this.baseY, 0);
        scene.add(this.mesh);

        this.velocity = new THREE.Vector3();
        this.isGrounded = true;
        this.isSliding = false;
        this.canSwitchLane = true;
    }

    reset() {
        this.currentLane = 0;
        this.targetX = 0;
        this.mesh.position.set(0, this.baseY, 0);
        this.velocity.set(0,0,0);
        this.isGrounded = true;
        
        // Reset sliding visuals
        this.head.position.y = 1.6;
        this.body.scale.y = 1;
        this.body.position.y = 0.6;
        this.isSliding = false;
    }

    update(controls, deltaTime, physics) {
        // Handle Lane Switching Input
        if (controls.keys.left && this.canSwitchLane && this.currentLane > -1) {
            this.currentLane--;
            this.canSwitchLane = false;
        } else if (controls.keys.right && this.canSwitchLane && this.currentLane < 1) {
            this.currentLane++;
            this.canSwitchLane = false;
        }

        if (!controls.keys.left && !controls.keys.right) {
            this.canSwitchLane = true;
        }

        // Handle Jump
        if (controls.keys.up && this.isGrounded) {
            this.velocity.y = 18; // Upward force
            this.isGrounded = false;
        }

        // Handle Slide
        if (controls.keys.down && this.isGrounded && !this.isSliding) {
            this.slide();
        }

        // Smoothly interpolate (lerp) X position for lane switching
        this.targetX = this.currentLane * this.laneWidth;
        this.mesh.position.x += (this.targetX - this.mesh.position.x) * 10 * deltaTime;

        // Apply gravity from physics system
        physics.applyGravity(this, deltaTime);
    }

    slide() {
        this.isSliding = true;
        
        // Compress the robot programmatically to duck
        this.head.position.y = 0.8;
        this.body.scale.y = 0.2;
        this.body.position.y = 0.1;
        
        // Stand back up after 600ms
        setTimeout(() => {
            if(this.isSliding) { // Check just in case the game reset
                this.isSliding = false;
                this.head.position.y = 1.6;
                this.body.scale.y = 1;
                this.body.position.y = 0.6;
            }
        }, 600);
    }
}
