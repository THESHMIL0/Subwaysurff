import * as THREE from 'three';

export class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = [];
        this.coins = [];
        this.spawnTimer = 0;
        
        this.obsGeo = new THREE.BoxGeometry(2.5, 3, 5);
        this.obsMat = new THREE.MeshLambertMaterial({ color: 0xff0055 });
        
        this.coinGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
        this.coinMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.8, roughness: 0.2 });
    }

    reset() {
        [...this.obstacles, ...this.coins].forEach(obj => {
            this.scene.remove(obj.mesh);
        });
        this.obstacles = [];
        this.coins = [];
        this.spawnTimer = 0;
    }

    update(speed, deltaTime, player, physics, onHit, onCoin) {
        this.spawnTimer += deltaTime;
        
        // Spawn objects progressively faster
        const spawnRate = Math.max(0.5, 2.0 - (speed * 0.01));
        if (this.spawnTimer > spawnRate) {
            this.spawn();
            this.spawnTimer = 0;
        }

        // Move & Collide Obstacles
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

        // Move & Collide Coins
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            coin.mesh.position.z += speed * deltaTime;
            coin.mesh.rotation.x += 5 * deltaTime; // spin
            
            if (physics.checkCollision(player.mesh, coin.mesh)) {
                onCoin();
                this.scene.remove(coin.mesh);
                this.coins.splice(i, 1);
            } else if (coin.mesh.position.z > 10) {
                this.scene.remove(coin.mesh);
                this.coins.splice(i, 1);
            }
        }
    }

    spawn() {
        const laneX = (Math.floor(Math.random() * 3) - 1) * 3; // -3, 0, or 3
        const isCoin = Math.random() > 0.7; // 30% chance for coin
        
        if (isCoin) {
            const mesh = new THREE.Mesh(this.coinGeo, this.coinMat);
            mesh.rotation.z = Math.PI / 2;
            mesh.position.set(laneX, 1, -100);
            this.scene.add(mesh);
            this.coins.push({ mesh });
        } else {
            const mesh = new THREE.Mesh(this.obsGeo, this.obsMat);
            mesh.position.set(laneX, 1.5, -100);
            this.scene.add(mesh);
            this.obstacles.push({ mesh });
        }
    }
}
