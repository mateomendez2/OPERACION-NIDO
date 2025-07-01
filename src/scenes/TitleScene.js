export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' }); // Le da un nombre a esta escena para poder llamarla después
  }

  create() {
    const { width, height } = this.sys.game.canvas; // Tamaño de la pantalla

    // Música de fondo para el menú principal
    this.musicaTitulo = this.sound.add('musicaparatitulo', { loop: true, volume: 0.2 });
    this.musicaTitulo.play();

    // Sonido que se reproduce al tocar botones
    this.sonidoBoton = this.sound.add('sonidoboton', { volume: 0.4 });

    // Fondo de imagen para la pantalla del título
    this.add.image(0, 0, 'fondotitulo')
      .setOrigin(0)
      .setDisplaySize(width, height);

    // Botón que inicia el juego
    this.botonJugar = this.add.image(width / 2, height * 0.80, 'boton_jugar')
      .setOrigin(0.5)
      .setScale(0.7)
      .setInteractive({ useHandCursor: true });

    // Efectos visuales al pasar o hacer clic sobre el botón "Jugar"
    this.botonJugar.on('pointerover', () => this.botonJugar.setTint(0xcccccc));
    this.botonJugar.on('pointerdown', () => this.botonJugar.setTint(0x888888));
    this.botonJugar.on('pointerout', () => this.botonJugar.clearTint());

    // Cuando se suelta el botón "Jugar": suena el clic, se detiene la música, y se va al juego
    this.botonJugar.on('pointerup', () => {
      this.sonidoBoton.play();
      this.musicaTitulo.stop();
      this.scene.start('GameScene');
    });

    // Botón para abrir la pantalla de ajustes/información
    this.botonAjustes = this.add.image(width - 20, 20, 'boton_ajustes')
      .setOrigin(1, 0)
      .setScale(0.8)
      .setInteractive({ useHandCursor: true });

    // Efectos visuales al pasar o hacer clic sobre "Ajustes"
    this.botonAjustes.on('pointerover', () => this.botonAjustes.setTint(0xcccccc));
    this.botonAjustes.on('pointerdown', () => this.botonAjustes.setTint(0x888888));
    this.botonAjustes.on('pointerout', () => this.botonAjustes.clearTint());

    // Al hacer clic en ajustes: se muestra una pantalla con información
    this.botonAjustes.on('pointerup', () => {
      this.sonidoBoton.play();
      this.botonAjustes.clearTint();

      // Se desactivan los botones para evitar errores mientras se ve la info
      this.botonAjustes.disableInteractive();
      this.botonJugar.disableInteractive();

      // Fondo oscuro para resaltar la pantalla de información
      this.fondoOscuro = this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
        .setOrigin(0)
        .setDepth(19);

      // Imagen con los textos o íconos de la pantalla de ajustes
      this.info = this.add.image(width / 2, height / 2, 'informacion_ajustes')
        .setOrigin(0.5)
        .setScale(1)
        .setDepth(20);

      // Cursor vuelve al normal
      this.input.setDefaultCursor('default');

      // Botón para salir de la pantalla de info y volver al menú
      this.botonAtras = this.add.image(width - 1000, height / 1.25, 'botondeatras')
        .setOrigin(0.1)
        .setScale(0.6)
        .setInteractive({ useHandCursor: true })
        .setDepth(21);

      // Efectos visuales al pasar o hacer clic sobre el botón "Atrás"
      this.botonAtras.on('pointerover', () => this.botonAtras.setTint(0xcccccc));
      this.botonAtras.on('pointerdown', () => this.botonAtras.setTint(0x888888));
      this.botonAtras.on('pointerout', () => this.botonAtras.clearTint());

      // Al presionar "Atrás": se cierra la info y se reactivan los botones del menú
      this.botonAtras.on('pointerup', () => {
        this.sonidoBoton.play();

        // Se eliminan los elementos de la pantalla de ajustes
        this.info.destroy();
        this.fondoOscuro.destroy();
        this.botonAtras.destroy();

        // Se vuelve a activar el botón "Jugar" y "Ajustes"
        this.botonAjustes.setInteractive({ useHandCursor: true });
        this.botonJugar.setInteractive({ useHandCursor: true });

        this.input.setDefaultCursor('default');
      });
    });
  }
}
