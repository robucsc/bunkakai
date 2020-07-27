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
        this.top = 128;
        this.middle = 320;
        this.bottom = 512;

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

        // BGM config
        this.BGMconfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0.5 // start after half a second
        }
        // BGM play, this was really tricky Big thanks to Ben and Darcy!
        if (this.sound.get('artbgm') == null) { // check to see if it exists
            this.BGMmusic = this.sound.add('artbgm', this.BGMconfig); // add music
            this.BGMmusic.play(this.BGMconfig); // play music
        }

        // place background images
        this.nightSky = this.add.tileSprite(0, 0, 1912, 1024, 'nightSky').setOrigin(0, 0).setVisible(true);
        this.nightSky.setScrollFactor(0);
        var moon = this.add.sprite(48, 32, 'moon').setScale(1, 1).setOrigin(0, 0); // moon desu
        moon.setScrollFactor(0);

        // tile sets, maps, and collisions
        const groundMap = this.add.tilemap('grassLayerMap');
        const tileset = groundMap.addTilesetImage('vgGrass64x64', 'grass');

        const worldLayer = groundMap.createStaticLayer('theGrassyKnoll', tileset, 0, 0);
        console.log('groundMap', groundMap, 'tileset ', tileset, 'worldLayer', worldLayer)

        // add collectableItems
        // generate coin objects from object data
        // .createFromObjects(name, id, spriteConfig [, scene])
        this.pallets = groundMap.createFromObjects("collectableItems", "pallet", {
            key: "cItems",
            frame: 0
        }, this);
        // createFromObjects can't add Physics Sprites, so we add physics manually
        // https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.World.html#enable__anchor
        // second parameter is 0: DYNAMIC_BODY or 1: STATIC_BODY
        this.physics.world.enable(this.pallets, Phaser.Physics.Arcade.STATIC_BODY);
        // now use JS .map method to set a more accurate circle body on each sprite
        this.pallets.map((pallet) => {
            pallet.body.setCircle(32).setOffset(2, -1);
        });
        // then add the items to a group
        this.palletsGroup = this.add.group(this.pallets);

        // set collisions of world and player
        worldLayer.setCollisionByProperty({ collides: true });
        this.physics.world.TILE_BIAS = 39;  // increase to prevent sprite tunneling through tiles

        // add player to scene
        this.playerOne = new Runner(this, 256, 512, 'playerRun', 0, 30, false).setScale(.75, .75).setOrigin(0, 0);

        // add antagonist to the scene
        this.thief = new Antagonist(this, 1024, 512, 'antagonistRun', 0, 10, true).setScale(1, 1).setOrigin(0,0);

        // create collider for playerOne and collectableItems
        this.physics.add.overlap(this.playerOne, this.palletsGroup, (obj1, obj2) => {
            obj2.destroy(); // remove item on overlap
            // sound
            // other events
        });


        //make the particle emitter follow the player
        // this.collectionParticles.startFollow(this.playerOne);

        // add player world collider
        this.physics.add.collider(this.playerOne, worldLayer);
        this.physics.add.collider(this.thief, worldLayer);

        // start playerOne animation
        this.playerOne.anims.play('playerWalkAni');

        // add kokoro
        // this.myKokoro = new Kokoro(this, this.playerOne.x, this.playerOne.y, 'redHeart', 0).setScale(0.5, 0.5).setOrigin(0, 0);
        // this.myKokoro.alpha = 0;

        // add collectable Items
        this.collectableItem = [new Collectable(this, 192, this.top, 'starryNight', 0, 10, false),
            new Collectable(this, 96, this.middle, 'fields', 0, 10, false).setScale(2, 2).setOrigin(0, 0).body.setAllowGravity(false),
            new Collectable(this, 0, this.bottom, 'bridge', 0, 10, false).setScale(2, 2).setOrigin(0, 0).body.setAllowGravity(false)];

        for (let step = 0; step < this.collectableItem.length; step++){
            // this.collectableItem[step].setScrollFactor(0);
            // console.log(this.collectableItem[step])
        }
        // this.collectableItem[0].setScrollFactor(0);
        // this.collectableItem[1].setScrollFactor(0);
        // this.collectableItem[2].setScrollFactor(0);


        // this.collectableItem.setScrollFactor(0);

        // add display hearts - normally these are setVisibale to false
        this.displayKokoro = [this.add.sprite(1528, 48, 'bridge').setScale(1, 1).setOrigin(0, 0).setVisible(true).setScrollFactor(0),
            this.add.sprite(1568, 48, 'redHeart').setScale(0.75, 0.75).setOrigin(0, 0).setVisible(false).setScrollFactor(0),
            this.add.sprite(1608, 48, 'redHeart').setScale(0.75, 0.75).setOrigin(0, 0).setVisible(false).setScrollFactor(0),
            this.add.sprite(1648, 48, 'redHeart').setScale(0.75, 0.75).setOrigin(0, 0).setVisible(false).setScrollFactor(0),
            this.add.sprite(1688, 48, 'redHeart').setScale(0.75, 0.75).setOrigin(0, 0).setVisible(false).setScrollFactor(0)];

        // graphics debug code
        // this.utilities.graphicsDebug();

        // Particle System
        this.particles = this.add.particles('circle');
        this.particles.createEmitter({
            speed: 100,
            gravity: { x: 0, y: 200 },
            scale: { start: 0.1, end: 1 },
            tint: [0x008080, 0x008B8B, 0x00FFFF, 0xff0000],
        }).startFollow(this.miku, 32, 32); // particle offset from followee

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

        // score
        this.playerOneScore = 0;

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
        this.scoreLeft = this.add.text(96, 48, this.playerOneScore, scoreConfig).setScrollFactor(0);
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

        // Camera
        this.cameras.main.startFollow(this.playerOne);
        this.cameras.main.followOffset.set(-756, 64);
        this.cameras.main.setDeadzone(1280, 1536);
        this.cameras.main.fadeIn(1500, 0, 0, 0)
        // console.log(this.cameras);
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

        // debug scene change call
        this.utilities.sceneChange();

        // global audio mute
        this.muteAudio();

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


        // camera zoom testing
        // this.cameras.main.zoomTo(1.5, 0, 'Sine.easeIn', false).centerOn(this.playerOne.x + 512, this.playerOne.y);
        // if (this.clock.getElapsedSeconds() > 1) {
        //     this.cameras.main.zoomTo(1, 2000, 'Sine.easeOut', true);
        //     this.cameras.main.followOffset.set(-756, 64);
        //     this.cameras.main.setDeadzone(1024, 1912);
        // }
        // this.cameras.main.centerToBounds();





        // background animation
        this.nightSky.tilePositionX += .5;

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


        // Love ani movement
        // if (this.boom){ // explosion movement
        //     this.boom.x -= game.settings.spaceshipSpeed - 3;
        // }

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

        // check kokoro playerOne collision
        // if (this.checkCollision(this.playerOne, this.myKokoro)){
        //     console.log('playerOne Loved');
        //     this.myKokoro.reset();
        //     this.letsExplode(this.playerOne);
        // }
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
        this.playerOneScore += collectable.points;
        this.scoreLeft.text = this.playerOneScore;
        this.sound.play('sfx_explosion');
    }

    collected(collectable) {
        collectable.alpha = 0;
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
        collectable.reset(); // reset ship position
    }


    // display kokoro - this should probably have been a switch statement
    kokoroMeter(capturedHearts) {
        if (capturedHearts == 10) {
            this.displayKokoro[0].setVisible(true);
            setScale(0.75, 0.75)
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

    // kokoroMeter(capturedHearts) {
    //     if (capturedHearts % 10 == 0 && capturedHearts < 55) {
    //         this.displayKokoro[capturedHearts/10 - 1].setVisible(true);
    //         this.kokoros += 1;
    //         this.displayKokoro[capturedHearts/10 - 1].setScale(this.sineCounter.getValue(), this.sineCounter.getValue());
    //     }
    // }

    kokoroDropped() {
        console.log('the kokoro has been dropped');
        this.displayKokoro[this.kokoros - 1].setVisible(false);
        this.kokoros -= 1;
        this.capturedHearts -= 10;
        if (this.capturedHearts < 0) {
            this.capturedHearts = 0;
        }
    }
    
    
    muteAudio(){ // found info for this on https://gist.github.com/zackproser/1aa1ee41f326fc00dfb4
        // if (Phaser.Input.Keyboard.JustDown(keyX)) {
        //     if (!this.game.sound.mute) {
        //         this.game.sound.mute = true;
        //     } else {
        //         this.game.sound = false;
        //     }
        // }
    }
}