import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import GameScene from './scenes/GameScene.js';
import FinalScene from './scenes/FinalScene.js';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#1d1d1d',
  scale: {
    mode: Phaser.Scale.FIT,                // Escala proporcionalmente
    autoCenter: Phaser.Scale.CENTER_BOTH,  // Centra horizontal y verticalmente
    width: 1920,
    height: 1080
  },
  render: {
    antialias: true,
    antialiasGL: true,
    pixelArt: false,
    roundPixels: false
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [PreloadScene, BootScene, TitleScene, GameScene, FinalScene]
};

const game = new Phaser.Game(config);
