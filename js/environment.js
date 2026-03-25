import * as THREE from 'three';

export class Environment {
    constructor(scene) {
        this.scene = scene;
        this.scene.fog = new THREE.FogExp2(0x000000, 0.015);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(-10, 20, -10);
        this.scene.add(dirLight);

        // Ground track pooling
        this.trackLength = 100;
        this.segments = [];
        const geo = new THREE.PlaneGeometry(15, this.trackLength);
        
        // Grid texture illusion
        const mat = new THREE.MeshLambertMaterial({ color: 0x333333, wireframe: true });

        for (let i = 0; i < 3; i++) {
            const plane = new THREE.Mesh(geo, mat);
            plane.rotation.x = -Math.PI / 2;
            plane.position.z = -i * this.trackLength;
            this.scene.add(plane);
            this.segments.push(plane);
        }
    }

    update(speed, deltaTime) {
        // Move ground towards camera to create illusion of player moving forward
        this.segments.forEach(segment => {
            segment.position.z += speed * deltaTime;
            if (segment.position.z > this.trackLength) {
                segment.position.z -= this.trackLength * this.segments.length;
            }
        });
    }
}
