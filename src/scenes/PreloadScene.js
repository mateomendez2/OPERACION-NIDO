export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Cargar las imágenes del pingüino
        this.load.image('fondotitulo', 'assets/images/Fondo_titulo.jpg');
        this.load.image('boton_jugar', 'assets/images/boton_jugar.png');
        this.load.image('boton_ajustes', 'assets/images/ajustes.png');
        this.load.image('botondeatras', 'assets/images/botondeatras.png');
        this.load.image('background', 'assets/images/Fondo.png');
        this.load.image('informacion_ajustes', 'assets/images/informacion_ajustes.png');
        this.load.image('p1', 'assets/images/pingüino_volando1.png');
        this.load.image('p2', 'assets/images/pingüino_volando2.png');
        this.load.image('p3', 'assets/images/pingüino_volando3.png');
        this.load.image('a1', 'assets/images/aguila_volando1.png');
        this.load.image('a2', 'assets/images/aguila_volando2.png');
        this.load.image('a3', 'assets/images/aguila_volando3.png');
        this.load.image('a4', 'assets/images/aguila_volando4.png');
        this.load.image('a5', 'assets/images/aguila_volando5.png');
        this.load.image('a6', 'assets/images/aguila_volando6.png');
        this.load.image('b1', 'assets/images/bandadadepajaros_1.png');
        this.load.image('b2', 'assets/images/bandadadepajaros_2.png');
        this.load.image('corazon', 'assets/images/corazon.png');
        this.load.image('pinos', 'assets/images/Pinos.png');
        this.load.image('vidallena', 'assets/images/Vida_llena.png');
        this.load.image('unavida', 'assets/images/Vida_unasola.png');
        this.load.image('unpunto', 'assets/images/unpunto.png');
        this.load.image('dospuntos', 'assets/images/dospuntos.png')
        this.load.image('huevos', 'assets/images/huevos.png');
        this.load.image('pata_derecha', 'assets/images/pataderecha.png');
        this.load.image('pata_izquierda', 'assets/images/pataizquierda.png');
        this.load.image('Fondo_gameOver', 'assets/images/Fondo_final.jpg');
        this.load.image('boton_volver', 'assets/images/boton_volver.png');
        this.load.image('nuevopuntaje', 'assets/images/nuevopuntaje.png');
        this.load.image('boton_pausa', 'assets/images/boton_pausa.png');
        this.load.image('fondo_pausa', 'assets/images/fondo_pausa.png');
        this.load.image('fondodevidasyhuevo', 'assets/images/fondodevidasyhuevo.png');

        this.load.audio('movimientodepinguino', 'assets/audio/movimientodepinguino.mp3');
        this.load.audio('musicapuntajesuperado', 'assets/audio/musicapuntajesuperado.mp3');
        this.load.audio('musicapuntajemenor', 'assets/audio/musicapuntajemenor.mp3');
        this.load.audio('sonidoboton', 'assets/audio/sonidoboton.mp3');
        this.load.audio('musicaparatitulo', 'assets/audio/musicaparatitulo.mp3');
        this.load.audio('musicafondogameplay', 'assets/audio/musicaFondoGameplay.mp3');
        this.load.audio('sonidohuevo', 'assets/audio/sonidohuevo.mp3');
        this.load.audio('sonidoperderunavida', 'assets/audio/sonidoperderunavida.mp3');
        this.load.audio('sonidorecolectarvida', 'assets/audio/sonidorecolectarvida.mp3');
        this.load.audio('sonidoaguila', 'assets/audio/sonidoaguila.mp3');
        this.load.audio('sonidobandada', 'assets/audio/sonidobandada.mp3');
        this.load.audio('sonidopino', 'assets/audio/sonidopino.mp3');
    }

    create() {
        // Ir a la escena principal del juego
        this.scene.start('TitleScene');
    }
}