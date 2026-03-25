import * as THREE from 'three';

export class Player {
    constructor(scene) {
        // Create a Group to hold our complex character
        this.mesh = new THREE.Group();
        
        // 1. Create the Body
        const bodyGeo = new THREE.BoxGeometry(0.8, 1.2, 0.6);
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.6; // Shift up so bottom is at 0
        this.mesh.add(body);

        // 2. Create the Head
        const headGeo = new THREE.BoxGeometry(0.9, 0.8, 0.7);
        const headMat = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.6; // Place on top of body
        this.mesh.add(head);

        // 3. Create a Glowing Visor (Eyes)
        const visorGeo = new THREE.BoxGeometry(0.7, 0.2, 0.1);
        const visorMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc }); // BasicMaterial glows!
        const visor = new THREE.Mesh(visorGeo, visorMat);
        visor.position.set(0, 1.6, 0.36); // Front of the head
        this.mesh.add(visor);
        
        this.laneWidth = 3; 
        this.currentLane = 0; 
        this.targetX = 0;
        this.baseY = 0; // Our group's origin is now at its feet
        
        this.mesh.position.set(0, this.baseY, 0);
        scene.add(this.mesh);

        this.velocity = new THREE.Vector3();
        this.isGrounded = true;
        this.isSliding = false;
        this.canSwitchLane = true;
    }
    
    // ... keep the rest of your update(), reset(), and slide() methods exactly the same!
