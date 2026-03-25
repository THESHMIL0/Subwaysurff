export class Physics {
    constructor() {
        this.gravity = -50;
    }

    applyGravity(player, deltaTime) {
        if (!player.isGrounded) {
            player.velocity.y += this.gravity * deltaTime;
            player.mesh.position.y += player.velocity.y * deltaTime;

            // Basic floor collision
            if (player.mesh.position.y <= player.baseY) {
                player.mesh.position.y = player.baseY;
                player.velocity.y = 0;
                player.isGrounded = true;
            }
        }
    }

    checkCollision(playerMesh, obstacleMesh) {
        // Simple Axis-Aligned Bounding Box (AABB) collision
        const pBox = new THREE.Box3().setFromObject(playerMesh);
        const oBox = new THREE.Box3().setFromObject(obstacleMesh);
        
        // Make player hit box slightly smaller to be forgiving
        pBox.expandByScalar(-0.2); 
        
        return pBox.intersectsBox(oBox);
    }
}
