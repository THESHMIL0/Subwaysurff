# Neon Runner - 3D Endless Runner

A production-ready, pure frontend 3D endless runner built using ES6 Modules and Three.js.

## 🚀 How to Run Locally

Because this project uses native ES6 Modules (`<script type="module">`), it cannot be run by directly double-clicking `index.html`. It must be served via HTTP to avoid CORS security blocks.

1. Install **VS Code**.
2. Install the **Live Server** extension.
3. Open the `subway-runner` folder in VS Code.
4. Right-click `index.html` and select **"Open with Live Server"**.
5. The game will automatically open in your browser at `http://127.0.0.1:5500`.

## 🎮 Controls
* **Left / Right Arrow**: Switch lanes
* **Up Arrow**: Jump over low obstacles
* **Down Arrow**: Slide under high obstacles
* **Touch/Mobile**: Swipe left, right, up, or down.

## 📁 Architecture & Technologies
* Pure HTML5/CSS3/JavaScript (ES6). No build tools (Webpack/Vite) required.
* **Three.js** loaded via CDN Import Maps.
* Object Pooling used for memory efficiency (60 FPS target).

## 🌐 GitHub Pages Deployment
1. Initialize a git repository: `git init`
2. Commit your files: `git add . && git commit -m "Initial commit"`
3. Push to a new GitHub repository.
4. Go to Repo Settings -> Pages -> Deploy from Branch -> Select `main` -> Save.
5. Your game will be live within minutes!
