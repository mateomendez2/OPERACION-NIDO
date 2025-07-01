export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Podés cargar aquí una imagen de loading si querés
    }

    create() {
        this.scene.start('PreloadScene'); // Pasa a la escena de precarga
    }
}