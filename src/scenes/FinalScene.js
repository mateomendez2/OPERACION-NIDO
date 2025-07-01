export default class FinalScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FinalScene' }); // Le asigna el nombre a esta escena para poder accederla desde otras
  }

  init(data) {
    // Recibe y guarda los datos que vienen desde la escena del juego
    this.huevosRecolectados = data.huevos || 0;
    this.tiempoFinal = data.tiempo || 0;

    // Busca el mejor puntaje guardado en el registro (persistente entre escenas)
    this.puntajeAnterior = this.registry.get('mejorPuntaje') || { huevos: 0, tiempo: 0 };

    // Detecta si es la primera vez que se juega (para evitar mostrar "nuevo récord" si no había ninguno antes)
    this.esPrimeraVez = this.puntajeAnterior.huevos === 0 && this.puntajeAnterior.tiempo === 0;

    // Compara si hay un nuevo récord en cantidad de huevos o tiempo
    this.nuevoRecord =
      this.huevosRecolectados > this.puntajeAnterior.huevos ||
      this.tiempoFinal > this.puntajeAnterior.tiempo;

    // Si hay nuevo récord, lo guarda en el registro
    if (this.nuevoRecord) {
      this.registry.set('mejorPuntaje', {
        huevos: this.huevosRecolectados,
        tiempo: this.tiempoFinal
      });
    }
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    // Carga el sonido del botón para reproducirlo luego
    this.sonidoBoton = this.sound.add('sonidoboton', { volume: 0.4 });

    // Fondo de la pantalla final
    this.add.image(0, 0, 'Fondo_gameOver').setOrigin(0).setDisplaySize(width, height);

    // Posición de los números en pantalla
    const yPosNumeros = height * 0.68;
    const offsetX = 660;

    // Muestra la cantidad de huevos y el tiempo, con formato de 3 cifras (ej: 007)
    const huevosTexto = String(this.huevosRecolectados).padStart(3, '0');
    const tiempoTexto = String(Math.floor(this.tiempoFinal / 1000)).padStart(3, '0');

    // Texto de huevos recolectados
    this.add.text(width / 2 - offsetX, yPosNumeros, huevosTexto, {
      fontSize: '90px',
      fill: '#003366',
      fontFamily: 'Impact',
      align: 'center'
    }).setOrigin(0.5);

    // Texto del tiempo final
    this.add.text(width / 2 + offsetX, yPosNumeros, tiempoTexto, {
      fontSize: '90px',
      fill: '#003366',
      fontFamily: 'Impact',
      align: 'center'
    }).setOrigin(0.5);

    // Muestra la imagen de "nuevo puntaje" solo si superaste un récord (pero no la primera vez)
    if (this.nuevoRecord && this.puntajeAnterior.tiempo > 0) {
      this.add.image(width / 2, height * 0.49, 'nuevopuntaje')
        .setOrigin(0.5)
        .setScale(0.7)
        .setDepth(10);
    }

    // Elige la música final dependiendo si hiciste o no un nuevo récord
    if (this.nuevoRecord || this.esPrimeraVez) {
      this.musicaPuntaje = this.sound.add('musicapuntajesuperado', { loop: true, volume: 0.2 });
    } else {
      this.musicaPuntaje = this.sound.add('musicapuntajemenor', { loop: true, volume: 0.2 });
    }
    this.musicaPuntaje.play();

    // Muestra las huellas animadas y luego los botones
    this.mostrarRastroPatitas(() => {
      this.mostrarBotones();
    });
  }

  mostrarRastroPatitas(callback) {
    const cantidadPasos = 10;
    const espacio = 60;
    const yBase = this.sys.game.canvas.height * 0.73;
    const xInicio = this.sys.game.canvas.width / 2 - (cantidadPasos / 2) * espacio + 40;

    // Muestra una serie de patitas (animación visual)
    for (let i = 0; i < cantidadPasos; i++) {
      this.time.delayedCall(200 * i, () => {
        const x = xInicio + i * espacio;
        const y = yBase + (i % 2 === 0 ? -10 : 10);
        const textura = (i % 2 === 0) ? 'pata_izquierda' : 'pata_derecha';

        const patita = this.add.image(x, y, textura).setScale(0.4).setAlpha(0);

        // Efecto de aparición suave
        this.tweens.add({
          targets: patita,
          alpha: 1,
          duration: 300,
          ease: 'Power1'
        });
      });
    }

    // Cuando termina la animación, llama al callback (mostrar botones)
    const tiempoTotal = 200 * cantidadPasos + 300;
    this.time.delayedCall(tiempoTotal, () => {
      if (callback) callback();
    });
  }

  mostrarBotones() {
    const { width, height } = this.sys.game.canvas;
    const espacioEntreBotones = 250;
    const y = height - 110;

    // Botón para volver al título
    const botonTitulo = this.add.image(width / 2 - espacioEntreBotones / 2, y, 'boton_volver')
      .setOrigin(0.5)
      .setScale(0.32)
      .setInteractive({ useHandCursor: true });

    // Efectos visuales del botón
    botonTitulo.on('pointerover', () => botonTitulo.setTint(0xcccccc));
    botonTitulo.on('pointerdown', () => botonTitulo.setTint(0x888888));
    botonTitulo.on('pointerup', () => {
      this.sonidoBoton.play();
      if (this.musicaPuntaje) this.musicaPuntaje.stop();
      this.scene.start('TitleScene'); // Vuelve al menú principal
    });
    botonTitulo.on('pointerout', () => botonTitulo.clearTint());

    // Botón para reintentar (jugar de nuevo)
    const botonReintentar = this.add.image(width / 2 + espacioEntreBotones / 2, y, 'botondeatras')
      .setOrigin(0.5)
      .setScale(0.5)
      .setInteractive({ useHandCursor: true });

    // Efectos visuales del botón
    botonReintentar.on('pointerover', () => botonReintentar.setTint(0xcccccc));
    botonReintentar.on('pointerdown', () => botonReintentar.setTint(0x888888));
    botonReintentar.on('pointerup', () => {
      this.sonidoBoton.play();
      if (this.musicaPuntaje) this.musicaPuntaje.stop();
      this.scene.start('GameScene'); // Reinicia el juego
    });
    botonReintentar.on('pointerout', () => botonReintentar.clearTint());
  }
}
