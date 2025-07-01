export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });  
    // Constructor de la escena, le da una clave 'GameScene' para identificarla
  }

  create() {
  this.events.on('shutdown', () => {
    this.sound.stopAll();
  });

    const { width, height } = this.sys.game.canvas; 
    // Obtiene el ancho y alto del canvas/juego para usar en posiciones

    this.juegoIniciado = false;   
    // Variable para saber si el juego ya comenzó (después de cuenta regresiva)
    this.juegoPausado = false;    
    // Variable para controlar si el juego está pausado
    this.tiempoInicioReal = 0;    
    // Guarda el tiempo en que empezó el juego (en ms)
    this.tiempoPausaAcumulado = 0; 
    // Guarda la suma total del tiempo que el juego estuvo pausado
    this.tiempoInicioPausa = 0;    
    // Guarda el instante en que se pausó para calcular pausa acumulada

    this.huevosRecolectados = 0;  
    // Contador de huevos (puntos) recolectados

    // 🔊 Sonidos con volumen ajustado
    this.sonidoMovimiento = this.sound.add('movimientodepinguino', { volume: 0.3 });
    // Sonido para cuando el pingüino se mueve, con volumen bajo
    this.sonidoBoton = this.sound.add('sonidoboton', { volume: 0.4 });
    // Sonido para los clics en botones
    this.musicaGameplay = this.sound.add('musicafondogameplay', { loop: true, volume: 0.2 });
    // Música de fondo que se repite en loop, volumen muy bajo para no molestar
    this.sonidoHuevo = this.sound.add('sonidohuevo', { volume: 0.9 });
    // Sonido para cuando se recolecta un huevo, volumen alto
    this.sonidoPerderVida = this.sound.add('sonidoperderunavida', { volume: 0.4 });
    // Sonido cuando el jugador pierde una vida
    this.sonidoRecolectarVida = this.sound.add('sonidorecolectarvida', { volume: 0.5 });
    // Sonido cuando el jugador recoge un corazón (vida)
    this.sonidoAguila = this.sound.add('sonidoaguila', { volume: 0.2 });
    // Sonido para choque o interacción con águila
    this.sonidoBandada = this.sound.add('sonidobandada', { volume: 1 });
    // Sonido para choque con bandada, volumen alto
    this.sonidoPino = this.sound.add('sonidopino', { volume: 0.8 });
    // Sonido para choque con pino (obstáculo)

    this.reproduciendoSonido = false;  
    // Variable para controlar si el sonido movimiento está sonando

    this.velocidadFactor = 1;
    // Factor multiplicador para velocidad, aumenta con el tiempo
    this.velocidadIncrementoPorSegundo = 0.010;  
    // Incremento de velocidad por segundo de juego

    this.fondo = this.add.image(0, 0, 'background').setOrigin(0);
    // Agrega la imagen de fondo en la posición 0,0 con origen en la esquina superior izquierda
    this.fondo.setDisplaySize(width, height);
    // Ajusta tamaño de fondo para que ocupe todo el canvas

    this.pinguino = this.physics.add.sprite(width / 2, height / 2, 'p1').setScale(0.6);
    // Crea el sprite del pingüino en el centro de la pantalla y lo escala al 60%
    this.pinguino.body.setGravityY(30);
    // Aplica gravedad vertical leve al pingüino (caerá hacia abajo)
    this.pinguino.body.setSize(this.pinguino.width * 0.8, this.pinguino.height, true);
    // Ajusta el tamaño del cuerpo físico para colisiones, un poco más angosto que el sprite
    this.pinguino.body.enable = false;
    // Inicialmente desactiva la física para que no se mueva hasta que inicie el juego

    // Animación 'volar' del pingüino (solo si no existe)
    if (!this.anims.exists('volar')) {
      this.anims.create({
        key: 'volar',  // Nombre de la animación
        frames: [{ key: 'p1' }, { key: 'p2' }, { key: 'p3' }],  // Frames de la animación
        frameRate: 6,  // 6 frames por segundo
        repeat: -1     // Repite infinitamente
      });
    }
    this.pinguino.play('volar');
    // Inicia la animación 'volar' del pingüino

    // Overlay negro semitransparente para cuenta regresiva
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.4).setOrigin(0).setDepth(20);
    // Texto grande para mostrar cuenta regresiva (3,2,1)
    const textoCuenta = this.add.text(width / 2, height / 2, '', {
      fontSize: '300px',
      fill: '#000000',
      fontFamily: 'Impact'
    }).setOrigin(0.5).setDepth(21);

    const cuenta = ["3", "2", "1"]; 
    // Array con los números de la cuenta regresiva
    let i = 0;  // Índice para recorrer la cuenta

    const mostrarNumero = () => {
      if (i < cuenta.length) {
        textoCuenta.setText(cuenta[i]);  // Muestra el número actual
        i++;
        this.temporizadorCuenta = this.time.delayedCall(1000, mostrarNumero);
        // Espera 1 segundo y llama otra vez para siguiente número
      } else {
        textoCuenta.destroy();   // Elimina texto
        overlay.destroy();       // Elimina overlay
        this.juegoIniciado = true;  // Marca que el juego ya inició
        this.tiempoInicioReal = this.time.now;  // Guarda instante de inicio
        this.pinguino.body.enable = true;       // Habilita física del pingüino para que se mueva
        this.pinguino.setVelocity(0, 0);        // Establece velocidad inicial 0
        this.temporizadorCuenta = null;          // Limpia temporizador
        this.musicaGameplay.play();              // Comienza la música de fondo
      }
    };
    mostrarNumero();
    // Lanza la cuenta regresiva

    // Animación 'volarAguila' (solo si no existe)
    if (!this.anims.exists('volarAguila')) {
      this.anims.create({
        key: 'volarAguila',
        frames: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'].map(key => ({ key })),
        frameRate: 11,
        repeat: -1,
        yoyo: true
      });
    }

    // Animación 'volarBandada' (solo si no existe)
    if (!this.anims.exists('volarBandada')) {
      this.anims.create({
        key: 'volarBandada',
        frames: ['b1', 'b2'].map(key => ({ key })),
        frameRate: 4,
        repeat: -1,
        yoyo: true
      });
    }

    // Grupos para enemigos, objetos y puntos
    this.aguilas = this.physics.add.group();
    this.bandadas = this.physics.add.group();
    this.corazones = this.physics.add.group();
    this.puntos = this.physics.add.group();
    this.pinos = this.physics.add.group();

    // Tiempos para controlar cuándo generar enemigos/objetos
    this.tiempoProximaAguila = 0;
    this.tiempoProximaBandada = 0;
    this.tiempoProximoCorazon = this.time.now + Phaser.Math.Between(10000, 20000);
    this.tiempoProximoPinos = this.time.now + Phaser.Math.Between(3000, 6000);
    this.tiempoProximoPunto = this.time.now + Phaser.Math.Between(3000, 6000);
    // Guarda tiempo (ms) para la próxima aparición de cada tipo

    // Variables para guardar la última posición Y generada para evitar repetición cercana
    this.ultimaYAguila = null;
    this.ultimaYBandada = null;
    this.ultimaYPunto = null;

    this.vidas = 2;  // Número inicial de vidas
    this.invulnerable = false;  // Controla si el jugador está temporalmente invulnerable tras daño
    this.gameOver = false;      // Controla si el juego terminó

    // Elementos de interfaz para mostrar vidas y puntos
    this.fondoVidasHuevos = this.add.image(10, 10, 'fondodevidasyhuevo').setOrigin(0).setScrollFactor(0).setDepth(9).setScale(0.3);
    // Fondo para íconos de vidas y huevos, fija en pantalla (scrollFactor 0)
    this.huevosIcon = this.add.image(40, 20, 'huevos').setOrigin(0).setScale(0.24).setScrollFactor(0).setDepth(10);
    // Icono de huevo
    this.huevosContador = this.add.text(125, 27, '000', {
      fontFamily: 'impact',
      fontSize: '40px',
      color: '#000000'
    }).setScrollFactor(0).setDepth(10);
    // Texto que muestra la cantidad de huevos recolectados (3 dígitos)

    this.vidaIcon = this.add.image(250, 25, 'vidallena').setOrigin(0).setScale(0.5).setScrollFactor(0).setDepth(10);
    // Icono que muestra las vidas restantes, inicialmente llena

    // Botón para pausar el juego, fijado arriba a la derecha
    this.botonPausa = this.add.image(width - 20, 20, 'boton_pausa')
      .setOrigin(1, 0)
      .setScale(0.25)
      .setInteractive({ useHandCursor: true })
      .setScrollFactor(0)
      .setDepth(30);

    // Cambios visuales al pasar el mouse o tocar el botón
    this.botonPausa.on('pointerover', () => this.botonPausa.setTint(0xcccccc));
    this.botonPausa.on('pointerdown', () => this.botonPausa.setTint(0x888888));
    this.botonPausa.on('pointerout', () => this.botonPausa.clearTint());
    this.botonPausa.on('pointerup', () => {
      this.sonidoBoton.play(); // Sonido al clicar el botón
      this.botonPausa.clearTint();
      this.togglePause();       // Cambia entre pausa y reanudar
    });

    // Fondo de pantalla para mostrar cuando está pausado (cubre todo)
    this.fondoPausa = this.add.image(width / 2, height / 2, 'fondo_pausa')
      .setOrigin(0.5)
      .setDisplaySize(width, height)
      .setAlpha(1)
      .setDepth(29)
      .setVisible(false);  // Oculto hasta que se pause

    // Botones para volver al título o reintentar, visibles solo en pausa
    const espacioEntreBotones = 250;
    const y = height - 200;

    this.botonTitulo = this.add.image(width / 2 - espacioEntreBotones / 2, y, 'boton_volver')
      .setOrigin(0.5)
      .setScale(0.32)
      .setInteractive({ useHandCursor: true })
      .setDepth(30)
      .setVisible(false);

    this.botonReintentar = this.add.image(width / 2 + espacioEntreBotones / 2, y, 'botondeatras')
      .setOrigin(0.5)
      .setScale(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(30)
      .setVisible(false);

    // Al pulsar volver al título, suena el botón y cambia de escena
    this.botonTitulo.on('pointerup', () => {
      this.sonidoBoton.play();
      this.scene.start('TitleScene');
    });
    // Al pulsar reintentar, suena el botón y reinicia la escena
    this.botonReintentar.on('pointerup', () => {
      this.sonidoBoton.play();
      this.scene.restart();
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    // Detecta las teclas cursor (arriba, abajo, izquierda, derecha)
    this.teclaEspacio = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Configura colisiones para que se detecte cuando el pingüino se cruza con enemigos u objetos
    this.physics.add.overlap(this.pinguino, this.aguilas, this.hitAguila, null, this);
    this.physics.add.overlap(this.pinguino, this.bandadas, this.hitAguila, null, this);
    this.physics.add.overlap(this.pinguino, this.pinos, this.hitAguila, null, this);
    this.physics.add.overlap(this.pinguino, this.corazones, this.recogerCorazon, null, this);
    this.physics.add.overlap(this.pinguino, this.puntos, this.recogerPunto, null, this);
  }

  update() {
// Detectar tecla espacio siempre, incluso si el juego está pausado
if (Phaser.Input.Keyboard.JustDown(this.teclaEspacio)) {
  this.togglePause();
}

// Si el juego terminó o aún no empezó, no continuar con lógica de movimiento
if (this.gameOver || !this.juegoIniciado || this.juegoPausado) return;

    const margen = 40;
    const { width, height } = this.sys.game.canvas;
    // Variables para límites y tamaño pantalla

    const ahora = this.time.now;
    const tiempoJuego = (ahora - this.tiempoInicioReal - this.tiempoPausaAcumulado) / 1000;
    // Calcula el tiempo jugado en segundos (restando pausas)
    const maxTiempo = 210;
    // Tiempo máximo para calcular velocidad
    const tiempoEfectivo = Math.min(tiempoJuego, maxTiempo);
    // Limita el tiempo efectivo a maxTiempo para no aumentar velocidad indefinidamente

    this.velocidadFactor = 1 + tiempoEfectivo * this.velocidadIncrementoPorSegundo;
    // Incrementa la velocidad proporcionalmente al tiempo jugado

    let velX = 0;
    let velY = this.pinguino.body.velocity.y;
    // Variables para velocidad horizontal y vertical

    const izquierda = this.cursors.left.isDown;
    const derecha = this.cursors.right.isDown;
    const arriba = this.cursors.up.isDown;
    const abajo = this.cursors.down.isDown;
    // Detecta qué teclas se están presionando

    if (izquierda) velX = -300 * this.velocidadFactor;
    else if (derecha) velX = 250 * this.velocidadFactor;
    // Velocidad horizontal según teclas, negativo es izquierda, positivo derecha

    if (arriba) velY = -250 * this.velocidadFactor;
    else if (abajo) velY = 240 * this.velocidadFactor;
    else if (velY < 0) velY = 0;
    // Velocidad vertical: subir, bajar o si estaba subiendo (velY<0) y no presiona nada, para

    this.pinguino.setVelocity(velX, velY);
    // Aplica las velocidades calculadas al pingüino

    // Limita que el pingüino no salga de los bordes con margen (excepto abajo)
    if (this.pinguino.x < margen) this.pinguino.x = margen;
    if (this.pinguino.x > width - margen) this.pinguino.x = width - margen;
    if (this.pinguino.y < margen) this.pinguino.y = margen;

    const estaPresionando = izquierda || derecha || arriba || abajo;
    // Si alguna tecla está presionada

    if (estaPresionando && !this.reproduciendoSonido) {
      this.sonidoMovimiento.play({ loop: true });
      this.reproduciendoSonido = true;
      // Si empieza a moverse, activa el sonido movimiento (en loop)
    } else if (!estaPresionando && this.reproduciendoSonido) {
      this.sonidoMovimiento.stop();
      this.reproduciendoSonido = false;
      // Si deja de moverse, para el sonido
    }

    if (this.pinguino.y > height && !this.gameOver) this.showGameOver();
    // Si el pingüino cae fuera de pantalla abajo, termina el juego

    const ahoraMs = this.time.now;
    if (ahoraMs > this.tiempoProximaAguila) {
      this.spawnAguila();
      this.tiempoProximaAguila = ahoraMs + Phaser.Math.Between(1400, 3000);
      // Genera un águila cada 1.4 a 2.8 segundos aprox.
    }

    if (ahoraMs > this.tiempoProximaBandada) {
      this.spawnBandada();
      this.tiempoProximaBandada = ahoraMs + Phaser.Math.Between(2500, 4500);
      // Genera una bandada entre 2.5 y 4.5 segundos aprox.
    }

    if (ahoraMs > this.tiempoProximoCorazon) {
      this.spawnCorazon();
      this.tiempoProximoCorazon = ahoraMs + Phaser.Math.Between(20000, 30000);
      // Corazones cada 20 a 30 segundos
    }

    if (ahoraMs > this.tiempoProximoPinos) {
      this.spawnPinos();
      this.tiempoProximoPinos = ahoraMs + Phaser.Math.Between(1400, 3300);
      // Pinos (obstáculos) cada 1.4 a 3.3 segundos
    }

    if (ahoraMs > this.tiempoProximoPunto) {
      this.spawnPunto();
      this.tiempoProximoPunto = ahoraMs + Phaser.Math.Between(2000, 5000);
      // Puntos/huevos cada 2 a 5 segundos aprox.
    }
    if (Phaser.Input.Keyboard.JustDown(this.teclaEspacio)) {
      this.togglePause();
      // Telca de espacio para pausar
    }
  }

  togglePause() {
    // ⛔ Si todavía no empezó el juego (cuenta regresiva), no se puede pausar
    if (!this.juegoIniciado) return;
    this.juegoPausado = !this.juegoPausado;
    // Cambia el estado de pausa a lo contrario
    this.fondoPausa.setVisible(this.juegoPausado);
    this.botonTitulo.setVisible(this.juegoPausado);
    this.botonReintentar.setVisible(this.juegoPausado);
    // Muestra u oculta el fondo y botones de pausa según el estado

    if (this.juegoPausado) {
      this.tiempoInicioPausa = this.time.now;
      // Marca cuando comienza la pausa

      if (this.reproduciendoSonido) {
        this.sonidoMovimiento.stop();
        this.reproduciendoSonido = false;
        // Para el sonido movimiento si estaba activo
      }
      this.musicaGameplay.pause(); // ⏸️ Pausa la música
    } else {
      this.tiempoPausaAcumulado += this.time.now - this.tiempoInicioPausa;
      // Suma el tiempo que estuvo pausado para descontar del contador de tiempo jugado
      this.musicaGameplay.resume(); // ▶️ Reanuda la música
    }

    this.pinguino.body.moves = !this.juegoPausado;
    // Detiene o reanuda la física del pingüino según pausa

    const grupos = [this.aguilas, this.bandadas, this.pinos, this.corazones, this.puntos];
    grupos.forEach(grupo => {
      grupo.getChildren().forEach(obj => {
        if (obj.body) obj.body.moves = !this.juegoPausado;
        // Detiene o reanuda la física de todos los objetos en los grupos
      });
    });
  }

  showGameOver() {
    this.gameOver = true;
    // Marca que el juego terminó

    if (this.reproduciendoSonido) {
      this.sonidoMovimiento.stop();
      this.reproduciendoSonido = false;
      // Para el sonido movimiento si estaba activo
    }

    this.musicaGameplay.stop(); // 🛑 Detiene la música de fondo al terminar

    // 🛑 Detiene todos los sonidos activos (para limpiar)
    this.sound.stopAll();

    // Cambia a la escena final enviando huevos y tiempo jugado
    this.scene.start('FinalScene', {
      huevos: this.huevosRecolectados,
      tiempo: this.time.now - this.tiempoInicioReal - this.tiempoPausaAcumulado,
    });
  }

  hitAguila(pinguino, enemigo) {
    if (this.invulnerable || this.gameOver) return;
    // Ignora colisiones si está invulnerable o juego terminado

    // 🎵 Reproducir sonido si es águila
    if (this.aguilas.contains(enemigo)) {
      this.sonidoAguila.play();
    }

    // 🎵 Reproducir sonido solo 3 segundos si es bandada
    if (this.bandadas.contains(enemigo)) {
      this.sonidoBandada.play();

      this.time.delayedCall(3000, () => {
        if (this.sonidoBandada.isPlaying) {
          this.sonidoBandada.stop();
        }
      });
    }

    // 🎵 Reproducir sonido si es pino
    if (this.pinos.contains(enemigo)) {
      this.sonidoPino.play();
    }

    this.vidas--;
    // Resta una vida
    this.actualizarIconoVida();
    // Actualiza el ícono que muestra vidas

    this.invulnerable = true;
    // Activa invulnerabilidad temporal para evitar daño repetido

    // Parpadeo del pingüino para indicar daño
    this.tweens.add({
      targets: pinguino,
      alpha: 0,
      duration: 100,
      repeat: 5,
      yoyo: true,
      onComplete: () => pinguino.setAlpha(1)
    });

    // Invulnerabilidad dura 2 segundos
    this.time.delayedCall(2000, () => this.invulnerable = false);

    if (this.vidas <= 0) {
      this.showGameOver();
    }
  }

  recogerCorazon(_, corazon) {
    corazon.destroy();
    // Elimina el corazón del juego
    if (this.vidas < 2) {
      this.vidas++;
      this.actualizarIconoVida();
      this.sonidoRecolectarVida.play();
      // Si tiene menos de 2 vidas, suma una y reproduce sonido de vida
    }
  }

  recogerPunto(_, punto) {
    const clave = punto.texture.key;
    let puntos = clave === 'dospuntos' ? 2 : 1;
    // Determina si el punto vale 1 o 2 según la textura

    punto.destroy();
    // Elimina el punto del juego

    if (typeof this.huevosRecolectados !== 'number' || isNaN(this.huevosRecolectados)) {
      this.huevosRecolectados = 0;
      // Por seguridad, si no es número, lo resetea a 0
    }

    this.huevosRecolectados += puntos;
    // Suma puntos a total de huevos recolectados

    // Actualiza el contador de huevos con ceros delante (3 dígitos)
    this.huevosContador.setText(this.huevosRecolectados.toString().padStart(3, '0'));

    // Reproduce sonido al recolectar huevo
    this.sonidoHuevo.play();
  }

  actualizarIconoVida() {
    if (this.vidas === 2) {
      this.vidaIcon.setTexture('vidallena').setVisible(true);
      // Muestra ícono de vida llena si tiene 2 vidas
    } else if (this.vidas === 1) {
      this.vidaIcon.setTexture('unavida').setVisible(true);
      // Muestra ícono de 1 vida
    } else {
      this.vidaIcon.setVisible(false);
      // Si no tiene vidas, oculta ícono
    }
  }

  spawnAguila() {
    const { width, height } = this.sys.game.canvas;
    const margen = 5;
    let y;
    do {
      y = Phaser.Math.Between(margen, height * 0.75);
      // Genera posición Y aleatoria entre margen y 75% del alto
    } while (this.ultimaYBandada && Math.abs(y - this.ultimaYBandada) < 100);
    // Evita que esté muy cerca verticalmente de la última bandada generada

    this.ultimaYAguila = y;
    // Guarda posición Y de la última águila generada

    const aguila = this.aguilas.create(width + 50, y, 'a1');
    // Crea un águila justo fuera del borde derecho (x=width+50)
    aguila.setScale(Phaser.Math.FloatBetween(1.1, 1.6));
    // Escala aleatoria entre 1.1 y 1.6 para variar tamaños
    aguila.setVelocityX(-280 * this.velocidadFactor);
    // Mueve águila hacia izquierda con velocidad que depende de factor de velocidad
    aguila.play('volarAguila');
    // Inicia la animación de vuelo de águila
    aguila.body.allowGravity = false;
    // El águila no está afectada por gravedad
    aguila.setCollideWorldBounds(false);
    // No colisiona con los bordes del mundo
    aguila.body.setSize(aguila.width * 0.6, aguila.height * 0.6, true);
    // Ajusta el cuerpo físico para colisiones, más pequeño que el sprite
  }

  spawnBandada() {
    const { width, height } = this.sys.game.canvas;
    const margen = 5;
    let y;
    do {
      y = Phaser.Math.Between(margen, height * 0.75);
    } while (this.ultimaYAguila && Math.abs(y - this.ultimaYAguila) < 100);
    // Evita que la bandada esté muy cerca verticalmente del último águila

    this.ultimaYBandada = y;

    const bandada = this.bandadas.create(width + 50, y, 'b1');
    bandada.setScale(Phaser.Math.FloatBetween(1.3, 1.67));
    bandada.setVelocityX(-500 * this.velocidadFactor);
    bandada.play('volarBandada');
    bandada.body.allowGravity = false;
    bandada.setCollideWorldBounds(false);
    bandada.body.setSize(bandada.width * 0.6, bandada.height * 0.6, true);
  }

  spawnPinos() {
    const { width, height } = this.sys.game.canvas;
    const pino = this.pinos.create(width + 50, height + 20, 'pinos');
    // Crea pino fuera del borde derecho, un poco más abajo del límite inferior
    pino.setOrigin(0.5, 1);
    // Ajusta origen para que se posicione desde la base (parte inferior centro)
    pino.setScale(Phaser.Math.FloatBetween(0.45, 0.92));
    // Escala aleatoria para variedad
    pino.setVelocityX(-220 * this.velocidadFactor);
    // Mueve pino hacia la izquierda con velocidad ajustada
    pino.body.allowGravity = false;
    pino.setImmovable(true);
    // Es un objeto estático, no se mueve con impactos

    this.time.delayedCall(10, () => {
      // Ajusta el tamaño y offset del cuerpo físico después de 10 ms para asegurar displayWidth correcto
      const hitboxWidth = pino.displayWidth * 0.8;
      const hitboxHeight = pino.displayHeight * 0.9;
      pino.body.setSize(hitboxWidth, hitboxHeight);
      pino.body.setOffset(
        (pino.width * pino.scaleX - hitboxWidth) / 2,
        pino.height * pino.scaleY - hitboxHeight
      );
    });
  }

  spawnCorazon() {
    const { width, height } = this.sys.game.canvas;
    const margen = 5;
    const y = Phaser.Math.Between(margen, height - margen);
    // Posición Y aleatoria dentro de los márgenes para que no quede fuera de pantalla

    const corazon = this.corazones.create(width + 50, y, 'corazon');
    // Crea corazón fuera del borde derecho
    corazon.setVelocityX(-450 * this.velocidadFactor);
    // Mueve corazón rápido hacia la izquierda
    corazon.setScale(0.09);
    // Lo escala pequeño
    corazon.body.allowGravity = false;
    corazon.setDepth(10);
    // Lo pone en profundidad para que esté visible encima de fondo y demás
  }

  spawnPunto() {
    const { width, height } = this.sys.game.canvas;
    const margen = 5;
    let y;
    do {
      y = Phaser.Math.Between(margen, height * 0.75);
    } while (this.ultimaYPunto && Math.abs(y - this.ultimaYPunto) < 100);
    // Evita que el punto esté muy cerca verticalmente del último punto generado

    this.ultimaYPunto = y;

    const tipo = Phaser.Math.RND.pick(['unpunto', 'dospuntos']);
    // Aleatoriamente elige entre punto que vale 1 o 2
    const punto = this.puntos.create(width + 50, y, tipo);
    punto.setScale(0.22);
    punto.setVelocityX(-300 * this.velocidadFactor);
    punto.body.allowGravity = false;
    punto.body.setSize(punto.width * 0.6, punto.height * 0.6, true);
    // Ajusta tamaño del cuerpo para colisión más exacta
  }
}
