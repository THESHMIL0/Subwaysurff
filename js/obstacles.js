import * as THREE from 'three';

export class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = [];
        this.coins = [];
        this.particles = []; // Array to track our explosion effect
        this.spawnTimer = 0;

        // Shared geometries and materials for high performance
        // 1. Barrier (Jump over)
        this.barrierGeo = new THREE.BoxGeometry(2.5, 1.2, 1.5);
        this.barrierMat = new THREE.MeshLambertMaterial({ color: 0xff3300 });

        // 2. Overhead Obstacle (Slide under)
        this.overheadGeo = new THREE.BoxGeometry(3, 1.5, 2);
        this.overheadMat = new THREE.MeshLambertMaterial({ color: 0x0066ff });

        // 3. Coin
        this.coinGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
        this.coinMat = new THREE.MeshStandardMaterial({ 
            color: 0xffcc00, metalness: 0.8, roughness: 0.2 
        });

        // 4. Particle (For the coin burst)
        this.particleGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        this.particleMat = new THREE.MeshLambertMaterial({ color: 0xffcc00 });
    }

    reset() {
        // Clean up all objects when the game restarts
        [...this.obstacles, ...this.coins, ...this.particles].forEach(obj => {
            this.scene.remove(obj.mesh);
        });
        this.obstacles = [];
        this.coins = [];
        this.particles = [];
        this.spawnTimer = 0;
    }

    update(speed, deltaTime, player, physics, onHit, onCoin) {
        this.spawnTimer += deltaTime;
        
        // Spawn objects progressively faster as the game speeds up
        const spawnRate = Math.max(0.4, 1.5 - (speed * 0.02));
        if (this.spawnTimer > spawnRate) {
            this.spawn();
            this.spawnTimer = 0;
        }

        // 1. Move & Collide Obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.mesh.position.z += speed * deltaTime;

            if (physics.checkCollision(player.mesh, obs.mesh)) {
                onHit();
            }

            // Cleanup passed obstacles
            if (obs.mesh.position.z > 10) {
                this.scene.remove(obs.mesh);
                this.obstacles.splice(i, 1);
            }
        }

        // 2. Move & Collide Coins
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            coin.mesh.position.z += speed * deltaTime;
            coin.mesh.rotation.x += 5 * deltaTime; // spin
            coin.mesh.rotation.y += 2 * deltaTime; // double spin
            
            if (physics.checkCollision(player.mesh, coin.mesh)) {
                onCoin();
                this.createParticleBurst(coin.mesh.position);
                this.scene.remove(coin.mesh);
                this.coins.splice(i, 1);
            } else if (coin.mesh.position.z > 10) {
                this.scene.remove(coin.mesh);
                this.coins.splice(i, 1);
            }
        }

        // 3. Update Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            // Move particle along its velocity vector
            p.mesh.position.addScaledVector(p.velocity, deltaTime);
            p.life -= deltaTime;
            p.mesh.scale.multiplyScalar(0.9); // Shrink over time

            if (p.life <= 0) {
                this.scene.remove(p.mesh);
                this.particles.splice(i, 1);
            }
        }
    }

    spawn() {
        // Pick a random lane: -3 (left), 0 (center), or 3 (right)
        const laneX = (Math.floor(Math.random() * 3) - 1) * 3;
        const rand = Math.random();
        
        if (rand > 0.6) {
            // 40% chance: Spawn Coin
            const mesh = new THREE.Mesh(this.coinGeo, this.coinMat);
            mesh.rotation.z = Math.PI / 2;
            mesh.position.set(laneX, 1, -100);
            this.scene.add(mesh);
            this.coins.push({ mesh });
        } else if (rand > 0.3) {
            // 30% chance: Spawn Barrier (Jump Over)
            const mesh = new THREE.Mesh(this.barrierGeo, this.barrierMat);
            mesh.position.set(laneX, 0.6, -100); // Placed low to the ground
            this.scene.add(mesh);
            this.obstacles.push({ mesh });
        } else {
            // 30% chance: Spawn Overhead Obstacle (Slide Under)
            const mesh = new THREE.Mesh(this.overheadGeo, this.overheadMat);
            mesh.position.set(laneX, 2.2, -100); // Placed high up
            this.scene.add(mesh);
            this.obstacles.push({ mesh });
        }
    }

    createParticleBurst(position) {
        // Spawn 8 tiny cubes that explode outward
        for (let i = 0; i < 8; i++) {
            const mesh = new THREE.Mesh(this.particleGeo, this.particleMat);
            mesh.position.copy(position);

            // Give them a random burst velocity
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15 + 5,
                (Math.random() - 0.5) * 15
            );

            this.scene.add(mesh);
            this.particles.push({ mesh, velocity, life: 0.4 }); // 0.4 seconds of life
        }
    }
}
