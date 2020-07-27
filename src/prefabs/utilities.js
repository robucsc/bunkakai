// utilities prefab
class utilities {

    constructor(scene) {
        this.scene = scene;
    }

    // How to use:
    // these are functions that are used in, and available to all scenes
    // this -> utilities
    // this.scene -> the scene of which this object is part
    // this.scene.scene -> the object within the scene that has scene-related methods
    // this.scene.scene.start -> the actual method within the object that deals with scenes
    // example call:
    // this.utilities.crissCross(this.collectableItem[0]);


    // crossfade the sky images
    changeTheSky(){
        if (this.scene.clock.getElapsedSeconds() > 10 && this.scene.clock.getElapsedSeconds() < 40) {
            this.scene.nightSky.alpha = 1;
            this.scene.sky.alpha -= .001;
        } else {
            this.scene.sky.alpha += .001;
            this.scene.nightSky.alpha -= .005;
        }
    }

    // evasive pattern for flying collectables
    crissCross(collectable) {
        if (collectable.direction) {
            // make collectable go up - later this could be a function
            collectable.y -= .5;
            if (collectable.y <= this.top) {
                collectable.direction = false;
            }
            return;

        } else if (!collectable.direction) {
            // make collectable go down - later this could be a function
            collectable.y += .5;
            if (collectable.y >= this.bottom) {
                collectable.direction = true;
            }
            return;
        }
    }

    // crissCross(collectable) { // special thanks to Darcy for helping me with this one!!!
    //     collectable.y = (Math.sin(collectable.x) * 10 + collectable.y) ;
    // }

    // debug scene change keys
    sceneChange() {

        if (Phaser.Input.Keyboard.JustDown(keyA)) {
            this.scene.time.now = 0;
            if (this.scene.sound.get('artbgm') == null) {
                this.scene.BGMmusic.mute = true;
            }
            this.scene.sound.play('sfx_select');
            this.scene.scene.start("artScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.time.now = 0;
            if (this.scene.sound.get('artbgm') == null) {
                this.scene.BGMmusic.mute = true;
            }
            this.scene.sound.play('sfx_select');
            this.scene.scene.start("fashionScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyM)) {
            this.scene.time.now = 0;
            if (this.scene.sound.get('artbgm') == null) {
                this.scene.BGMmusic.mute = true;
            }
            this.scene.sound.play('sfx_select');
            this.scene.scene.start("musicScene");
        }
        if (Phaser.Input.Keyboard.JustDown(keyT)) {
            this.scene.time.now = 0;
            if (this.scene.sound.get('artbgm') == null) {
                this.scene.BGMmusic.mute = true;
            }
            this.scene.sound.play('sfx_select');
            this.scene.scene.start("tutorialScene");
        }
    }

    graphicsDebug() {
        const debugGraphics = this.scene.add.graphics().setAlpha(0.75);
        this.scene.worldLayer.renderDebug(debugGraphics, {
            tileColor: null,    // color of non-colliding tiles 
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),    // color of colliding tiles 
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)                // color of colliding face edges 
            //
        });
    }

// mutes all audio including music and sound effects
    muteAudio() { // found info for this on https://gist.github.com/zackproser/1aa1ee41f326fc00dfb4
        // if (Phaser.Input.Keyboard.JustDown(keyX)) {
        //     if (!this.game.sound.mute) {
        //         this.game.sound.mute = true;
        //     } else {
        //         this.game.sound = false;
        //     }
        // }
    }

}