class Art extends Phaser.Scene {

    constructor() {
        super("artScene");
    }

    preload() {
        
    }

    create() {
        this.utilities = new utilities(this); // add utils example: this.utilities.crissCross();

        // set camera viewports
        const viewportW = game.config.width;
        const viewportH = game.config.height;

        // set runner values
        this.runnerAccelerationX = 150;
        this.runnerVelocityX = 200;
        this.jumpVelocity = -680;
        this.doublejumpVelocity = -350;
        this.miniJumpVelocity = -350;
        this.pixelLength = 15296;

        // set antagonist values
        this.antagonistVelocityX = -255

        // collectable flight path zones
        this.top = 256;
        this.middle = 384;
        this.bottom = 512;

        // collectable Item points
        this.collectableItemPoints = 50;

        // BGM config
        this.BGMconfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 2.5 // start after half a second
        }
        // BGM play, this was really tricky Big thanks to Ben and Darcy!
        if (this.sound.get('artbgm') == null) { // check to see if it exists
            this.BGMmusic = this.sound.add('artbgm', this.BGMconfig); // add music
            this.BGMmusic.play(this.BGMconfig); // play music
        }


        // place background images
        this.nightSky = this.add.tileSprite(0, 0, 1912, 1024, 'nightSky').setOrigin(0, 0).setVisible(true);
        this.nightSky.setScrollFactor(0);
        this.nightSky.alpha = 1;
        this.day = this.add.tileSprite(0, 0, 1912, 1024, 'day').setOrigin(0, 0).setVisible(true);
        this.day.setScrollFactor(0);

        // score
        var theScoreFrame = this.add.sprite(64, 46, 'scoreFrame').setScale(1.5, 1).setOrigin(0, 0); // scoreFrame desu
        theScoreFrame.setScrollFactor(0);

        this.playerOneScore = 0;

        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '32px',
            // backgroundColor: '#f00',
            color: '#000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(96, 48, this.playerOneScore, scoreConfig).setScrollFactor(0);
        this.capturedHearts = 0;
        this.kokoros = 0;


        // tile sets, maps, and collisions
        const groundMap = this.add.tilemap('grassLayerMap');
        const tileset = groundMap.addTilesetImage('vgGrass64x64', 'grass');

        const worldLayer = groundMap.createStaticLayer('theGrassyKnoll', tileset, 0, 0);
        // console.log('groundMap', groundMap, 'tileset ', tileset, 'worldLayer', worldLayer)

        // victory dialog box at end of level
        this.dialogBox = this.add.tileSprite(15404, -32, 259, 308, 'dialogBox').setOrigin(0, 0).setVisible(false);


        // add collectableItems
        // generate item objects from object data
        // .createFromObjects(name, id, spriteConfig [, scene])
        // make pallets
        this.pallets = groundMap.createFromObjects("collectableItems", "pallet", {
            key: "cItems",
            frame: 0
        }, this);
        // make brushes
        this.brushes = groundMap.createFromObjects("collectableItems", "brush", {
            key: "cItems",
            frame: 1
        }, this);
        // make notes
        this.notes = groundMap.createFromObjects("collectableItems", "note", {
            key: "cItems",
            frame: 2
        }, this);

        // createFromObjects can't add Physics Sprites, so we add physics manually
        // https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.World.html#enable__anchor
        // second parameter is 0: DYNAMIC_BODY or 1: STATIC_BODY
        this.physics.world.enable(this.pallets, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.brushes, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.notes, Phaser.Physics.Arcade.STATIC_BODY);

        // now use JS .map method to set a more accurate circle body on each sprite
        this.pallets.map((pallet) => {
            pallet.body.setCircle(32).setOffset(2, -1);
        });
        this.brushes.map((brush) => {
            brush.body.setCircle(32).setOffset(2, -1);
        });
        this.notes.map((note) => {
            note.body.setCircle(32).setOffset(2, -1);
        });

        // then add the items to a group
        this.palletsGroup = this.add.group(this.pallets);
        this.brushesGroup = this.add.group(this.brushes);
        this.notesGroup = this.add.group(this.notes);

        // set collisions of world and player
        worldLayer.setCollisionByProperty({ collides: true });
        this.physics.world.TILE_BIAS = 39;  // increase to prevent sprite tunneling through tiles

        // add collectable Items
        this.collectableItem = [new Collectable(this, 1024, this.top, 'starryNight', 0, 10, false),
            new Collectable(this, 256, this.middle, 'fields', 0, 10, false),
            new Collectable(this, 0, this.bottom, 'bridge', 0, 10, false)];

        // add player to scene 576
        this.playerOne = new Runner(this, 576, 512, 'playerRun', 0, 30, false).setScale(.75, .75).setOrigin(0, 0);

        // add antagonist to the scene
        this.foeOne = new Antagonist(this, 1024, 512, 'antagonistWalk', 0, 10, true).setScale(.75, .75).setOrigin(0,0).setVisible(false);

        // create collider for playerOne and collectableItems
        this.physics.add.overlap(this.playerOne, this.palletsGroup, (obj1, obj2) => {
            obj2.destroy(); // remove item on overlap
            // sound
            this.sound.play('yeah');
            // other events
            console.log('pallet points ', this.collectableItemPoints)
            this.playerOneScore += this.collectableItemPoints;
            this.scoreLeft.text = this.playerOneScore;
        });
        this.physics.add.overlap(this.playerOne, this.brushesGroup, (obj1, obj2) => {
            obj2.destroy(); // remove item on overlap
            // sound
            this.sound.play('yeah');
            // other events
            console.log('brush points ', this.collectableItemPoints)
            this.playerOneScore += (this.collectableItemPoints * 2);
            this.scoreLeft.text = this.playerOneScore;
        });
        this.physics.add.overlap(this.playerOne, this.notesGroup, (obj1, obj2) => {
            obj2.destroy(); // remove item on overlap
            // sound
            this.sound.play('yeah');
            // other events
            console.log('note points ', this.collectableItemPoints)
            this.playerOneScore += (this.collectableItemPoints * 3);
            this.scoreLeft.text = this.playerOneScore;
        });

        // add player world collider
        this.physics.add.collider(this.playerOne, worldLayer);
        this.physics.add.collider(this.foeOne, worldLayer);

        // start character animation
        this.playerOne.anims.play('playerWalkAni');
        this.foeOne.anims.play('antagonistWalkAni');

        // add display hearts - normally these are setVisibale to false
        this.displayKokoro = [this.add.sprite(1528, 48, 'bridge').setScale(1, 1).setOrigin(0, 0).setVisible(false).setScrollFactor(0),
            this.add.sprite(1568, 48, 'starryNight').setScale(1, 1).setOrigin(0, 0).setVisible(false).setScrollFactor(0),
            this.add.sprite(1608, 48, 'fields').setScale(1, 1).setOrigin(0, 0).setVisible(false).setScrollFactor(0),
            this.add.sprite(1648, 48, 'bridge').setScale(1, 1).setOrigin(0, 0).setVisible(false).setScrollFactor(0),
            this.add.sprite(1688, 48, 'starryNight').setScale(1, 1).setOrigin(0, 0).setVisible(false).setScrollFactor(0)];

        // graphics debug call - uncomment to use
        // this.utilities.graphicsDebug();

        // Particle System
        this.particles = this.add.particles('circle');
        this.particles.createEmitter({
            speed: 100,
            gravity: { x: 0, y: 200 },
            scale: { start: 0.1, end: 1 },
            tint: [0x008080, 0x008B8B, 0x00FFFF, 0xff0000],
        }).startFollow(this.miku, 32, 32); // particle offset from followee


        // make the sine tracker
        this.sineCounter = this.tweens.addCounter({
            from: 1,
            to: this.VEL_Y,
            duration: this.SINE_DURATION,
            ease: 'Sine.easeInOut',
            repeat: 10,
            yoyo: true
        });

        //make the particle emitter
        const particleManager = this.add.particles('circle');
        // create an emitter
        this.collectionParticles = particleManager.createEmitter();
        // give the emitter some properties
        // this.centerEmitter.setPosition(centerX, centerY);
        // this.centerEmitter.setSpeed(this.SPEED);
        // this.centerEmitter.setLifespan(500);
        // this.centerEmitter.frequency = -1;


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
        keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T); // tutorial
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T); // mute audio

        // game over flag
        this.gameOver = false;

        // Camera
        this.cameras.main.startFollow(this.playerOne);
        this.cameras.main.followOffset.set(-448, 64);
        this.cameras.main.setDeadzone(640, 1536); //
        this.cameras.main.fadeIn(1500, 0, 0, 0)
        // console.log(this.cameras); // for debugging - uncomment to use

        // play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer + this.moreTime, () => {
            this.gameOver = true;
        }, null, this);
    }

    update() { // ideally every frame
        // check key input for restart, keyUP for one handed play
        if (this.gameOver && (Phaser.Input.Keyboard.JustDown(keyL))) {
            this.time.removeAllEvents();
            this.scene.restart(this.playerOneScore);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.time.removeAllEvents();
            this.scene.start("menuScene");
        }

        // update player
        this.playerOne.update();
        this.foeOne.update();
        this.kokoroStolen();

        // debug scene change call
        this.utilities.sceneChange();

        // global audio mute - commented out because I couldn't get it to work yet. Will be implemented in a
        // future update. The code is very close, so I've left it in.
        // this.utilities.muteAudio();

        if (this.playerOne.body.velocity.y != 0){
            this.playerOne.anims.play('playerJumpAni', true);
        } else  if (this.playerOne.x >= this.pixelLength){
            this.playerOne.anims.play('playerVictoryAni', true);
            // this.sound.play('sagoi');
        } else if (this.playerOne.body.velocity.x == 0){
            this.playerOne.anims.play('playerIdleAni', true);
        } else {
            this.playerOne.anims.play('playerWalkAni', true);
        }

        // background animation
        this.nightSky.tilePositionX += .5;
        this.day.tilePositionX += .5;

        // crossfade the sky images
        this.utilities.changeTheSky();

        // update collectables
        if (!this.gameOver) {
            // this.myKokoro.update();
            this.collectableItem[0].update();
            this.collectableItem[1].update();
            this.collectableItem[2].update();
        }

        // crissCross - evasive pattern for collectables
        if (this.clock.getElapsedSeconds() > 5) {
            this.utilities.crissCross(this.collectableItem[0]);
            this.utilities.crissCross(this.collectableItem[1]);
            this.utilities.crissCross(this.collectableItem[2]);
        }

        // check heart collection
        if (this.checkCollision(this.playerOne, this.collectableItem[0])) {
            this.collected(this.collectableItem[0]);
        }
        if (this.checkCollision(this.playerOne, this.collectableItem[1])) {
            this.collected(this.collectableItem[1]);
        }
        if (this.checkCollision(this.playerOne, this.collectableItem[2])) {
            this.collected(this.collectableItem[2]);
        }

        // camera zoom testing - This is commented out, but left in because after I get some sleep
        // I intend to get it working.
        // this.cameras.main.zoomTo(1.5, 0, 'Sine.easeIn', false).centerOn(this.playerOne.x + 512, this.playerOne.y);
        // if (this.clock.getElapsedSeconds() > 1) {
        //     this.cameras.main.zoomTo(1, 2000, 'Sine.easeOut', true);
        //     this.cameras.main.followOffset.set(-756, 64);
        //     this.cameras.main.setDeadzone(1024, 1912);
        // }
        // this.cameras.main.centerToBounds();

    }

    checkCollision(objectOne, objectTwo) {
        // AABB bounds checking - simple AABB checking
        if (objectOne.x < objectTwo.x + objectTwo.width &&
            objectOne.x + objectOne.width > objectTwo.x &&
            objectOne.y < objectTwo.y + objectTwo.height &&
            objectOne.height + objectOne.y > objectTwo.y) {
            return true;
        } else {
            return false;
        }
    }

    collected(collectable) {
        // collectable.alpha = 0;
        this.playerOneScore += collectable.points;
        this.scoreLeft.text = this.playerOneScore;
        // this.centerEmitter.explode(23);
        if (this.kokoros <= 5) {
            this.capturedHearts += 1;
            this.kokoroMeter(this.capturedHearts);
        } else {
            this.capturedHearts = 0;
        }
        this.sound.play('beem');
        // collectable.reset(); // reset position
    }

    kokoroMeter(capturedHearts) {
        if (capturedHearts % 500 == 0 && capturedHearts <= 3000) {
            this.displayKokoro[capturedHearts/5 - 1].setVisible(true);
            this.kokoros += 1;
        }
    }

    kokoroStolen() {
        if (this.checkCollision(this.playerOne, this.foeOne)) {
            console.log('the kokoro has been stolen');
            // this.displayKokoro[this.kokoros - 1].setVisible(false);
            this.kokoros -= 1;
            this.capturedHearts -= 5;
            if (this.capturedHearts < 0) {
                this.capturedHearts = 0;
            }
            this.sound.play('ohno');
        }
    }

}