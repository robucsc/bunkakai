// Group9 Alex Borlin, Amanda Koepp, Rob Lodes, and Nicholas Shupe

// create game configuration object
let config = {
    type: Phaser.WEBGL,
    width: 1912,
    height: 1152, // 1024

    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 900
            }
        }
    },
    scene: [ Bunkakai, Art, Fashion, Music, Tutorial],
};

// create main game object
let game = new Phaser.Game(config);


// define game settings
game.settings = {
    spaceshipSpeed: 5,
    gameTimer: 600000
}

// globals
const centerX = game.config.width / 2;
const centerY = game.config.height / 2;
const w = game.config.width;
const h = game.config.height;
let cursors = null;


// reserve some keyboard bindings
let keyL, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyA, keyF, keyM, keyT, keyX;
