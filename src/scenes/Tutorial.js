class Tutorial extends Phaser.Scene{
    constructor() {
        super("tutorialScene");
    }

    preload(){
        this.cameras.main.fadeIn(500, 0, 0, 0)
        this.add.image(0,0,"sky").setOrigin(0);
        this.add.image(0,0,"tutorialText").setOrigin(0);
    }


    create(){
        this.utilities = new utilities(this); // add utils example: this.utilities.crissCross();

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




        // add player to scene
        this.playerOne = new Runner(this, 832, 288, 'playerRun', 0, 30, false).setScale(1.5, 1.5).setOrigin(0, 0);
        this.playerOne.body.setAllowGravity(false)
        this.playerOne.anims.play('playerIdleAni', true);


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

    }

    update(){
        // this.sky.tilePositionX += .5;
         // debug scene change call
        this.utilities.sceneChange();

        if (Phaser.Input.Keyboard.JustDown(keyLEFT) || Phaser.Input.Keyboard.JustDown(keyRIGHT) || Phaser.Input.Keyboard.JustDown(keyUP)){
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