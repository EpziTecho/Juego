var juego = new Phaser.Game(370, 768, Phaser.CANVAS, "bloque_juego");
var fondoJuego;
var persona;
var teclaDerecha;
var teclaIzquierda;
var teclaArriba;
var teclaAbajo;
var nuevo;
var enemigos;
var balas;
var tiempoBala = 0;
var botonDisparo;

var estadoPrincipal = {
    preload: function () {
        juego.load.image("fondo", "img/fondo-semana4.png");
        juego.load.spritesheet("animacion", "img/personaje.png", 48, 58);
        juego.load.spritesheet("enemigo", "img/enemigos.png", 48, 48);
        juego.load.audio("musica", "audio/audio.mp3");
        juego.load.image("laser", "img/laser.png");
        juego.load.audio("disparo", "audio/laser.mp3");
    },
    create: function () {
        // Mostrar pantalla
        fondoJuego = juego.add.tileSprite(0, 0, 370, 768, "fondo");
        // Crear animación del personaje principal
        nuevo = juego.add.sprite(100, 600, "animacion");
        //animacion de movimiento
        nuevo.animations.add("movi", [0, 1, 2], 10, true);
        //animacion de movimiento a la izquierda
        nuevo.animations.add("izquierda", [3, 4, 5], 10, true);
        //animacion de movimiento a la derecha
        nuevo.animations.add("derecha", [6, 7, 8], 10, true);

        // Crear grupo de balas
        botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(20, "laser");
        balas.setAll("anchor.x", 0);
        balas.setAll("anchor.y", 0.2);
        balas.setAll("outOfBoundsKill", true);
        balas.setAll("checkWorldBounds", true);

        // Crear grupo de enemigos
        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;
        var cantidadEnemigos = 12;
        var filasSpritesheet = 3;
        var columnasSpritesheet = 6;

        for (var i = 0; i < cantidadEnemigos; i++) {
            var fila = i % filasSpritesheet;
            var posX = Math.min(
                (i % columnasSpritesheet) * 50,
                juego.width - 48
            ); // Asegura que posX + width del sprite no exceda el ancho del juego
            var posY = Math.min(
                Math.floor(i / columnasSpritesheet) * 50,
                juego.height - 48
            ); // Asegura que posY + height del sprite no exceda el alto del juego
            var enemigo = enemigos.create(posX, posY, "enemigo");
            enemigo.anchor.setTo(0.5);

            var frames = [];
            for (var j = 0; j < columnasSpritesheet; j++) {
                frames.push(fila * columnasSpritesheet + j);
            }
            enemigo.animations.add("mover", frames, 10, true);
            enemigo.animations.play("mover");
        }

        // Ajustar la posición inicial del grupo de enemigos si es necesario
        enemigos.x = 30;
        enemigos.y = 100;

        var animacion = juego.add
            .tween(enemigos)
            .to({ x: 82 }, 300, Phaser.Easing.Linear.None, true, 0, 1000, true); // parametros: (objetivo, duración, tipo de animación, autoiniciar, delay, repeticiones, yoyo)

        teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        teclaArriba = juego.input.keyboard.addKey(Phaser.Keyboard.UP);
        teclaAbajo = juego.input.keyboard.addKey(Phaser.Keyboard.DOWN);

        const musica = juego.sound.add("musica");
        musica.play();
    },
    update: function () {
        fondoJuego.tilePosition.x -= 1;

        var moving = false; // Rastreo de movimiento del personaje

        // Movimiento horizontal del personaje principal
        if (teclaDerecha.isDown && nuevo.x < juego.width - nuevo.width) {
            nuevo.animations.play("derecha");
            nuevo.x++;
            moving = true; // Está en movimiento
        } else if (teclaIzquierda.isDown && nuevo.x > 0) {
            nuevo.animations.play("izquierda");
            nuevo.x--;
            moving = true; // Está en movimiento
        }

        // Movimiento vertical del personaje principal
        if (teclaArriba.isDown && nuevo.y > 0) {
            nuevo.y--;
            if (!moving) {
                // Solo reproducir animación de movi si no se mueve horizontalmente
                nuevo.animations.play("movi");
            }
        } else if (teclaAbajo.isDown && nuevo.y < juego.height - nuevo.height) {
            nuevo.y++;
            if (!moving) {
                // Solo reproducir animación de movi si no se mueve horizontalmente
                nuevo.animations.play("movi");
            }
        }

        // Si no se están presionando teclas de movimiento, reproducir animación de movi
        if (
            !teclaDerecha.isDown &&
            !teclaIzquierda.isDown &&
            !teclaArriba.isDown &&
            !teclaAbajo.isDown
        ) {
            nuevo.animations.play("movi");
        }
        // Disparar
        if (botonDisparo.isDown) {
            this.disparar();
        }
        // Agregar texto de créditos
        var texto = juego.add.text(
            juego.world.centerX,
            juego.world.height - 20,
            "Diseñado por Sergio Alexander Huayllas ©",
            {
                font: "bold 13px Arial",
                fill: "black",
                backgroundColor: "white",
            }
        );
        texto.anchor.setTo(0.5);
        // Verificar colisiones entre balas y enemigos
        juego.physics.arcade.overlap(
            balas,
            enemigos,
            this.colision,
            null,
            this
        );
    },

    disparar: function () {
        if (juego.time.now > tiempoBala) {
            var bala = balas.getFirstExists(false);
            if (bala) {
                bala.reset(
                    nuevo.x + nuevo.width / 2 - bala.width / 2,
                    nuevo.y - bala.height
                );
                bala.body.velocity.y = -300;
                tiempoBala = juego.time.now + 100;
                const sonido_disparo = juego.sound.add("disparo");
                sonido_disparo.play();
            }
        }
    },

    colision: function (bala, enemigo) {
        bala.kill();
        enemigo.kill();
        // Comprobar si todos los enemigos han sido eliminados
        if (enemigos.countLiving() === 0) {
            this.iniciarFadeOut();
        }
    },

    // Función para iniciar la transición de fade out
    iniciarFadeOut: function () {
        var fadeOutSprite = juego.add.sprite(0, 0, "fondo");
        fadeOutSprite.width = juego.width;
        fadeOutSprite.height = juego.height;
        fadeOutSprite.alpha = 0;

        var text = juego.add.text(
            juego.world.centerX,
            juego.world.centerY,
            "Mision cumplida",
            {
                font: "40px Arial",
                fill: "#ffffff",
            }
        );
        text.anchor.setTo(0.5, 0.5);

        var fadeOutTween = juego.add
            .tween(fadeOutSprite)
            .to({ alpha: 1 }, 1500, Phaser.Easing.Linear.None, true); //parametros

        // Crear temporizador para actualizar el texto del contador
        var counter = 2;
        var interval = setInterval(function () {
            counter--;
            if (counter >= 0) {
                text.setText("Game over");
            }
        }, 1000); // Cambia cada 500 ms

        fadeOutTween.onComplete.add(function () {
            window.location.href = "index.html"; // redirigir a la portada
        }, this);
    },
};

juego.state.add("principal", estadoPrincipal);
juego.state.start("principal");
