import * as THREE from 'three';

export class Environment {
    constructor(scene) {
        this.scene = scene;
        // Thicker fog to hide building generation in the distance
        this.scene.fog = new THREE.FogExp2(0x000000, 0.02);

        // Neon Lighting Setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0x00ffff, 0.8); // Cyan light
        dirLight.position.set(-10, 20, -10);
        this.scene.add(dirLight);
        
        const pinkLight = new THREE.PointLight(0xff00ff, 1, 50); // Pink light
        pinkLight.position.set(0, 5, -20);
        this.scene.add(pinkLight);

        // Ground track setup
        this.trackLength = 100;
        this.segments = [];
        this.buildings = [];
        
        const geo = new THREE.PlaneGeometry(15, this.trackLength);
        const mat = new THREE.MeshLambertMaterial({ color: 0x111111, wireframe: true });

        // Generate the 3 initial floor segments and buildings
        for (let i = 0; i < 3; i++) {
            const plane = new THREE.Mesh(geo, mat);
            plane.rotation.x = -Math.PI / 2;
            plane.position.z = -i * this.trackLength;
            this.scene.add(plane);
            this.segments.push(plane);

            this.spawnBuildings(plane.position.z);
        }
    }

    spawnBuildings(startZ) {
        // Create 5 buildings on the left and 5 on the right per segment
        for(let j = 0; j < 5; j++) {
            const zPos = startZ - (j * 20);
            
            // Left building
            const heightLeft = Math.random() * 20 + 10;
            const bLeft = new THREE.Mesh(
                new THREE.BoxGeometry(4, heightLeft, 6), 
                new THREE.MeshLambertMaterial({ color: 0x111122 })
            );
            bLeft.position.set(-12, heightLeft / 2, zPos);
            this.scene.add(bLeft);
            this.buildings.push(bLeft);

            // Right building
            const heightRight = Math.random() * 20 + 10;
            const bRight = new THREE.Mesh(
                new THREE.BoxGeometry(4, heightRight, 6), 
                new THREE.MeshLambertMaterial({ color: 0x111122 })
            );
            bRight.position.set(12, heightRight / 2, zPos);
            this.scene.add(bRight);
            this.buildings.push(bRight);
        }
    }

    update(speed, deltaTime) {
        // Move ground segments towards camera
        this.segments.forEach(segment => {
            segment.position.z += speed * deltaTime;
            if (segment.position.z > this.trackLength) {
                segment.position.z -= this.trackLength * this.segments.length;
            }
        });

        // Move buildings towards camera
        this.buildings.forEach(building => {
            building.position.z += speed * deltaTime;
            if (building.position.z > 20) {
                // Loop them back into the fog and randomize their height again
                building.position.z -= this.trackLength * 3; 
                building.scale.y = Math.random() * 1.5 + 0.5; 
            }
        });
    }
}
