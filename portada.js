document.addEventListener("DOMContentLoaded", function () {
    var juego = new Phaser.Game(370, 768, Phaser.CANVAS, "bloque_juego");

    var estadoPortada = {
        preload: function () {
            juego.load.image("fondo", "img/fondo-semana4.png");
            juego.load.image("boton", "img/button_start-game.png");
            juego.load.image("boton_player1", "img/button_player1.png");
            juego.load.image("boton_player2", "img/button_player2.png");
            juego.load.image("boton_creditos", "img/button_credis-game.png");
            juego.load.audio("audio", "audio/audio.mp3");
        },
        create: function () {
            var fondo = juego.add.tileSprite(0, 0, 370, 768, "fondo");

            var x = (juego.width - 150) / 2;
            var y = (juego.height - 50) / 2;

            var botonJugar = juego.add.button(
                x - 20,
                y,
                "boton",
                this.iniciarJuego,
                this,
                2,
                1,
                0
            );
            botonJugar.fixedToCamera = true;
            botonJugar.events.onInputOver.add(this.hoverOver, this);
            botonJugar.events.onInputOut.add(this.hoverOut, this);

            var distanciaEntreBotones = 10;

            var botonPlayer1 = juego.add.button(
                juego.world.centerX,
                botonJugar.y + botonJugar.height + distanciaEntreBotones,
                "boton_player1",
                this.iniciarPlayer1,
                this,
                2,
                1,
                0
            );
            botonPlayer1.fixedToCamera = true;
            botonPlayer1.anchor.setTo(0.5, 0);
            botonPlayer1.events.onInputOver.add(this.hoverOver, this);
            botonPlayer1.events.onInputOut.add(this.hoverOut, this);

            var botonPlayer2 = juego.add.button(
                juego.world.centerX,
                botonPlayer1.y + botonPlayer1.height + distanciaEntreBotones,
                "boton_player2",
                this.iniciarPlayer2,
                this,
                2,
                1,
                0
            );
            botonPlayer2.fixedToCamera = true;
            botonPlayer2.anchor.setTo(0.5, 0);
            botonPlayer2.events.onInputOver.add(this.hoverOver, this);
            botonPlayer2.events.onInputOut.add(this.hoverOut, this);

            var botonCreditos = juego.add.button(
                juego.world.centerX,
                botonPlayer2.y + botonPlayer2.height + distanciaEntreBotones,
                "boton_creditos",
                this.mostrarCreditos,
                this,
                2,
                1,
                0
            );
            botonCreditos.fixedToCamera = true;
            botonCreditos.anchor.setTo(0.5, 0);
            botonCreditos.events.onInputOver.add(this.hoverOver, this);
            botonCreditos.events.onInputOut.add(this.hoverOut, this);

            var texto = juego.add.text(
                juego.world.centerX,
                juego.world.height - 20,
                "Diseñado por Sergio Alexander Huayllas ©",
                { font: "bold 13px Arial", fill: "black" }
            );
            texto.anchor.setTo(0.5);
            var titulo = juego.add.text(
                juego.world.centerX,
                100,
                "Space Shooter",
                {
                    font: "bold 48px Arial",
                    fill: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 6,
                    shadowOffsetX: 3,
                    shadowOffsetY: 3,
                    shadowColor: "#000000",
                }
            );
            titulo.anchor.setTo(0.5);

            var audio = juego.add.audio("audio");
            audio.play();
        },
        iniciarJuego: function () {
            window.location.href = "index.html";
        },
        iniciarPlayer1: function () {
            console.log("Iniciar Jugador 1");
        },
        iniciarPlayer2: function () {
            console.log("Iniciar Jugador 2");
        },
        mostrarCreditos: function () {
            console.log("Mostrar Créditos");
        },
        salirJuego: function () {
            console.log("Salir del juego");
        },
        hoverOver: function (button) {
            button.scale.setTo(1.1, 1.1);
        },
        hoverOut: function (button) {
            button.scale.setTo(1, 1);
        },
    };

    juego.state.add("portada", estadoPortada);
    juego.state.start("portada");
});
