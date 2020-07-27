class Fashion extends Phaser.Scene{

    constructor() {
        super("fashionScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('redHeart', './assets/redHeart.png');
        this.load.image('sidewalk', './assets/sidewalk.png');
        this.load.image('hills', './assets/hills.png');
        this.load.image('day', './assets/day.jpg');
        this.load.image('nightSky', './assets/starfield.png');
        this.load.image('circle', './assets/circle-8x8.png');
        this.load.image('moon', './assets/moon.png');
        this.load.image('staryNight', './assets/staryNight.png');
        this.load.image('fields', './assets/fields.png');
        this.load.image('bridge', './assets/bridge.png');

        // load spritesheets
        this.load.spritesheet('kittyRun', './assets/miaSprite.png', {
            // frameWidth: 115,
            // frameHeight: 64,
            frameWidth: 128,
            frameHeight: 202,
            startFrame: 0,
            endFrame: 7
        });

        // tile map assets
        this.load.image('grass', './assets/grasstp.png');                   // grass tile sheet
        this.load.tilemapTiledJSON('artMap', './assets/artMap.json');  // Tiled JSON file desu
    }

    create() {
        this.utilities = new utilities(this); // add utils

        // collectable flight path zones
        this.top = 128;
        this.middle = 320;
        this.bottom = 512;

        // place tile sprite/ on background
        this.nightSky = this.add.tileSprite(0, 0, 934, 500, 'nightSky').setOrigin(0, 0).setVisible(false);
        var moon = this.add.sprite(48, 32, 'moon').setScale(1, 1).setOrigin(0, 0); // moon desu
        this.sky = this.add.tileSprite(0, 0, 934, 500, 'sky').setOrigin(0, 0).setVisible(false);
        this.day = this.add.tileSprite(0, 0, 1912, 1024, 'day').setOrigin(0, 0).setVisible(true);
        // this.sidewalk = this.add.tileSprite(0, 0, 934, 500, 'sidewalk').setOrigin(0, 0);

        this.nightSky.alpha = 0;

        // BGM config
        this.BGMconfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0.5
        }
        // BGM play, this was really tricky Big thanks to Ben and Darcy!
        if (this.sound.get('fashionbgm') == null) {
            this.BGMmusic = this.sound.add('fashionbgm', this.BGMconfig);
            this.BGMmusic.play(this.BGMconfig);
        }

        // add ground/grass tile map
        const groundMap = this.add.tilemap('artMap');
        const tileset = groundMap.addTilesetImage('akgrass', 'grass');
        const worldLayer = groundMap.createStaticLayer('grassLayer', tileset, 0, 0);
        console.log('groundMap ', groundMap, 'tileset ', tileset, 'worldLayer', worldLayer)


        // add playerOne
        this.playerOne = new Runner(this, 704, 575, 'kittyRun', 0, 30, false).setScale(1, 1).setOrigin(0, 0);
        this.myKokoro = new Kokoro(this, this.playerOne.x, this.playerOne.y, 'redHeart', 0).setScale(0.5, 0.5).setOrigin(0, 0);
        this.myKokoro.alpha = 0;

        // add collectables
        this.hearts = [new Collectable(this, 192, this.top, 'staryNight', 0, 10, false).setScale(2, 2).setOrigin(0, 0),
            new Collectable(this, 96, this.middle, 'fields', 0, 10, false).setScale(2, 2).setOrigin(0, 0),
            new Collectable(this, 0, this.bottom, 'bridge', 0, 10, false).setScale(2, 2).setOrigin(0, 0)];

        // add display hearts - normally these are setVisibale to false
        this.displayKokoro = [this.add.sprite(1528, 48, 'bridge').setScale(1, 1).setOrigin(0, 0).setVisible(true),
            this.add.sprite(1568, 48, 'redHeart').setScale(0.75, 0.75).setOrigin(0, 0).setVisible(true),
            this.add.sprite(1608, 48, 'redHeart').setScale(0.75, 0.75).setOrigin(0, 0).setVisible(true),
            this.add.sprite(1648, 48, 'redHeart').setScale(0.75, 0.75).setOrigin(0, 0).setVisible(true),
            this.add.sprite(1688, 48, 'redHeart').setScale(0.75, 0.75).setOrigin(0, 0).setVisible(true)];


        // kitty animation config
        this.anims.create({
            key: 'kittyAni',
            frames: this.anims.generateFrameNumbers('kittyRun', {start: 0, end: 8, first: 0}),
            repeat: -1,
            frameRate: 15
        });
        this.playerOne.anims.play('kittyAni');

        // Particle System
        // some of this came from this video by Mitchell Hudson on YouTube
        // https://youtu.be/JSrafZXuehQ

        // this.particles = this.add.particles('circle');
        // this.particles.createEmitter({
        //     speed: 100,
        //     gravity: { x: 0, y: 200 },
        //     scale: { start: 0.1, end: 1 },
        //     tint: [0x008080, 0x008B8B, 0x00FFFF, 0xff0000],
        //     // follow: this.miku
        // }).startFollow(this.miku, 32, 32); // Thanks to Darcy for this line!

        // define control keys
        keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // debug scene change keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); // art
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F); // fashion
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M); // music

        // score
        this.p1Score = 0;

        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#f00',
            color: '#000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(96, 48, this.p1Score, scoreConfig);
        this.capturedHearts = 0;
        this.kokoros = 0;

        // game over flag
        this.gameOver = false;

        // play clock
        this.moreTime = 0;
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer + this.moreTime, () => {
            this.add.text(game.config.width / 2, game.config.height / 2, 'おわい!', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, '(L)ove to Play or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() { // ideally every frame
        // check key input for restart, keyUP for one handed play
        if (this.gameOver && (Phaser.Input.Keyboard.JustDown(keyL))) {
            this.time.removeAllEvents();
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.time.removeAllEvents();
            this.scene.start("menuScene");
        }

        // debug scene change call
        this.utilities.sceneChange();
        // if (this.BGMmusic.mute){
        //     this.BGMmusic.mute = false;
        // }

        // console.log(this.moreTime);
        // console.log(this.capturedHearts, this.kokoros);

        // this.sidewalk.tilePositionX += 4;
        this.day.tilePositionX += 1;
        this.sky.tilePositionX += .5;
        this.nightSky.tilePositionX += .5;

        if (!this.gameOver) {
            this.myKokoro.update();     // update kokoro
            this.playerOne.update();        // update playerOne
            this.hearts[0].update();
            this.hearts[1].update();
            this.hearts[2].update();
        }

        // crissCross - evasive pattern for collectables
        if (this.clock.getElapsedSeconds() > 5) {
            this.utilities.crissCross(this.hearts[0]);
            this.utilities.crissCross(this.hearts[1]);
            this.utilities.crissCross(this.hearts[2]);
        }

        // crossfade the sky images
        this.utilities.changeTheSky();

        // Love ani movement
        // if (this.boom){ // explosion movement
        //     this.boom.x -= game.settings.spaceshipSpeed - 3;
        // }

        // check heart collection
        if (this.checkCollision(this.playerOne, this.hearts[0])) {
            this.collected(this.hearts[0]);
        }
        if (this.checkCollision(this.playerOne, this.hearts[1])) {
            this.collected(this.hearts[1]);
        }
        if (this.checkCollision(this.playerOne, this.hearts[2])) {
            this.collected(this.hearts[2]);
        }

        // check kokoro playerOne collision
        // if (this.checkCollision(this.playerOne, this.myKokoro)){
        //     console.log('playerOne Loved');
        //     this.myKokoro.reset();
        //     this.letsExplode(this.playerOne);
        // }
    }

    checkCollision(sprite, collectable) {
        // AABB bounds checking - simple AABB checking
        if (sprite.x < collectable.x + collectable.width &&
            sprite.x + sprite.width > collectable.x &&
            sprite.y < collectable.y + collectable.height &&
            sprite.height + sprite.y > collectable.y) {
            return true;
        } else {
            return false;
        }
    }

    letsExplode(collectable) {
        // collectable.alpha = 0;                             // temporarily hid ship
        // create explosion sprite at ship's position
        this.boom = this.add.sprite(collectable.x, collectable.y, 'explosion').setOrigin(0, 0);

        this.boom.anims.play('explode');            // play explode animation
        this.boom.on('animationcomplete', () => {   // callback after animation completes
            // collectable.reset();                           // reset ship position
            // collectable.alpha = 1;                         // make ship visible again
            this.boom.destroy();                    // remove explosion sprite
        });
        this.p1Score += collectable.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }

    collected(collectable) {
        collectable.alpha = 0;
        this.p1Score += collectable.points;
        this.scoreLeft.text = this.p1Score;
        if (this.kokoros <= 5) {
            this.capturedHearts += 1;
            this.kokoroMeter(this.capturedHearts);
        } else {
            this.capturedHearts = 0;
        }

        this.sound.play('beem');
        collectable.reset(); // reset ship position
    }

    // display kokoro - this should probably have been a switch statement
    kokoroMeter(capturedHearts) {
        if (capturedHearts == 10) {
            this.displayKokoro[0].setVisible(true);
            this.kokoros += 1;
        } else if (capturedHearts == 20) {
            this.displayKokoro[1].setVisible(true);
            this.kokoros += 1;
        } else if (capturedHearts == 30) {
            this.displayKokoro[2].setVisible(true);
            this.kokoros += 1;
        } else if (capturedHearts == 40) {
            this.displayKokoro[3].setVisible(true);
            this.kokoros += 1;
        } else if (capturedHearts == 50) {
            this.displayKokoro[4].setVisible(true);
            this.kokoros += 1;
        }
    }

    kokoroDropped() {
        console.log('the kokoro has been dropped')
        this.displayKokoro[this.kokoros - 1].setVisible(false);
        this.kokoros -= 1;
        this.capturedHearts -= 10;
        if (this.capturedHearts < 0) {
            this.capturedHearts = 0;
        }
    }

}
