class Bunkakai extends Phaser.Scene{

    constructor() {
        super({key:"bunkakaiScene",
            pack: {
                files: [
                    { type: 'image', key: 'gameTitleImage', url: './assets/bunkakaiText.png' },
                    { type: 'image', key: 'background', url: './assets/day.jpg' }
                ]
            }});
    }

    preload(){
        this.cameras.main.fadeIn(500, 0, 0, 0)
        this.add.image(0,0,"background").setOrigin(0);
        this.add.image(0,0,"gameTitleImage").setOrigin(0);

        var progressBar = this.add.graphics();
        // var progressBox = this.add.graphics();
        // progressBox.fillStyle(0x222222, 0.8);
        // progressBox.fillRect(centerX - 160, 930, 320, 50);

        this.load.on('progress', function (value) {
            console.log(value);
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(centerX - 160, 930, 300 * value, 30);
        });

        this.load.on('fileprogress', function (file) {
            console.log(file.src);
        });

        this.load.on('complete', function () {
            console.log('complete');
        })

        // load splash screen
        // this.load.image('splash_screen', './assets/bunkakaiText.png');
        // this.load.image('background', './assets/day.jpg')

        // load audio files
        this.load.audio('sfx_select', './assets/iPhoneCameraSound.mp3');
        this.load.audio('sfx_explosion', './assets/sagoi.wav');
        this.load.audio('sagoi', './assets/sagoi.wav');
        this.load.audio('sfx_rocket', './assets/yeah.wav');
        this.load.audio('beem', './assets/yeah.wav');
        this.load.audio('artbgm', './assets/artbgm.ogg');
        this.load.audio('fashionbgm', './assets/bunkakaiFashionGroove.mp3');
        this.load.audio('musicbgm', './assets/bunkakaiFashionGroove.mp3');
        this.load.audio('ohno', './assets/ohno.wav');

        // background images and decorations
        this.load.image('redHeart', './assets/redHeart.png');
        this.load.image('hills', './assets/hills.png');
        this.load.image('sky', './assets/sky.png');
        this.load.image('nightSky', './assets/starryBackground.jpg');
        this.load.image('moon', './assets/moon.png');
        this.load.image('tutorialText', './assets/tutorialText.png');

        // particle images
        this.load.image('circle', './assets/circle-8x8.png');

        // items
        this.load.spritesheet('cItems', './assets/collectableItems.png', {
            frameWidth: 64,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 2
        });

        // art images
        this.load.image('starryNight', './assets/starryNight.png');
        this.load.image('fields', './assets/fields.png');
        this.load.image('bridge', './assets/bridge.png');

        // tile map assets
        this.load.image('grass', './assets/grassTiles192x192.png');                   // grass tile sheet
        this.load.tilemapTiledJSON('grassLayerMap', './assets/artSceneMap.json');  // Tiled JSON file desu

        // player spritesheets
        this.load.spritesheet('playerRun', './assets/miaSprite.png', {
            frameWidth: 128,
            frameHeight: 202,
            startFrame: 0,
            endFrame: 7
        });

        this.load.spritesheet('playerIdle', './assets/miaIdleForward.png', {
            frameWidth: 128,
            frameHeight: 202,
            startFrame: 0,
            endFrame: 3
        });

        this.load.spritesheet('playerVictory', './assets/miaVictoryPose.png', {
            frameWidth: 128,
            frameHeight: 202,
            startFrame: 0,
            endFrame: 16
        });

        this.load.spritesheet('playerjump', './assets/miaInAir.png', {
            frameWidth: 128,
            frameHeight: 202,
            startFrame: 0,
            endFrame: 3
        });

        // thief walk
        this.load.spritesheet('antagonistWalk', './assets/thiefWalk.png', {
            frameWidth: 128,
            frameHeight: 176,
            startFrame: 0,
            endFrame: 3
        });

    }


    create(){
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);


        // display splash screen
        this.add.tileSprite(0, 0, 1912, 1024, 'background').setOrigin(0, 0);
        this.add.tileSprite(0, 0, 1912, 1024, 'gameTitleImage').setOrigin(0, 0);

        // cue the tutorial scene
        this.scene.start("tutorialScene");
    }

    update(){ // ideally every frame

        if (Phaser.Input.Keyboard.JustDown(keyLEFT) || Phaser.Input.Keyboard.JustDown(keyRIGHT)){
            // yasashi modo desu
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 600000
            }
            // this.cameras.main.fadeOut(1500, 0, 0, 0)
            this.sound.play('sfx_select');
            this.scene.start("artScene");
        }

    }
}


