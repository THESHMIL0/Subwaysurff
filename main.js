import * as THREE from 'three';
import { Player } from './js/player.js';
import { Controls } from './js/controls.js';
import { Environment } from './js/environment.js';
import { Physics } from './js/physics.js';
import { ObstacleManager } from './js/obstacles.js';
import { UIManager } from './js/ui.js';
import { AudioManager } from './js/audio.js'; // Import our new audio engine!

class Game {
    constructor() {
        this.initThreeJS();
        
        this.ui = new UIManager();
        this.controls = new Controls();
        this.physics = new Physics();
        this.audio = new AudioManager(); // Initialize audio
        
        this.environment = new Environment(this.scene);
        this.player = new Player(this.scene);
        this.obstacles = new ObstacleManager(this.scene);

        this.clock = new THREE.Clock();
        this.gameState = 'MENU'; // MENU, PLAYING, GAMEOVER
        
        this.baseSpeed = 30;
        this.currentSpeed = this.baseSpeed;
        this.distance = 0;
        this.coinsCollected = 0;

        this.ui.showStartMenu(() => this.startGame());
        
        window.addEventListener('resize', () => this.onWindowResize(), false);
        this.animate();
    }

    initThreeJS() {
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
        // Position camera behind and above the player
        this.camera.position.set(0, 5, 8);
        this.camera.lookAt(0, 0, -10);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Perf optimization
        document.body.appendChild(this.renderer.domElement);
    }

    startGame() {
        // Browsers require user interaction before audio plays. The start button click counts!
        this.audio.resume();
        this.audio.startBGM();

        this.player.reset();
        this.obstacles.reset();
        this.currentSpeed = this.baseSpeed;
        this.distance = 0;
        this.coinsCollected = 0;
        this.gameState = 'PLAYING';
    }

    gameOver() {
        this.gameState = 'GAMEOVER';
        this.audio.stopBGM();
        this.audio.playCrash(); // Play crash sound!
        this.ui.showGameOver(() => this.startGame());
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const deltaTime = Math.min(this.clock.getDelta(), 0.1); // Cap delta time

        if (this.gameState === 'PLAYING') {
            // Gradually increase speed
            this.currentSpeed += deltaTime * 0.5;
            this.distance += this.currentSpeed * deltaTime;

            // Check jump state before updating player
            const wasGrounded = this.player.isGrounded;

            // Update Modules
            this.player.update(this.controls, deltaTime, this.physics);
            
            // If player just left the ground moving up, play jump sound!
            if (wasGrounded && !this.player.isGrounded && this.player.velocity.y > 0) {
                this.audio.playJump();
            }

            this.environment.update(this.currentSpeed, deltaTime);
            
            this.obstacles.update(
                this.currentSpeed, deltaTime, this.player, this.physics,
                () => this.gameOver(), // onHit callback
                () => { 
                    this.coinsCollected++; 
                    this.audio.playCoin(); // Play coin sound!
                } 
            );

            // Subtle camera movement based on player position
            this.camera.position.x += (this.player.mesh.position.x * 0.5 - this.camera.position.x) * 5 * deltaTime;
            
            this.ui.updateHUD(this.distance, this.coinsCollected, this.currentSpeed / this.baseSpeed);
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Boot the game
new Game();
