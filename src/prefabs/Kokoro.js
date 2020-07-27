// Rocket prefab
class Kokoro extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // when not adding stuff using Phaser's built in tools
        scene.add.existing(this);   // add object to the existing scene

        // create a custom property for the rocket
        this.isFiring = false;      // track the rocket's firing status—don't let the ship move
        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }
    update(){

        this.moveHeart();

        // fire button
        // if (Phaser.Input.Keyboard.JustDown(keyL)  && !this.isFiring && (this.scene.kokoros > 0){
        if ((Phaser.Input.Keyboard.JustDown(keyL) || Phaser.Input.Keyboard.JustDown(keyLEFT))  && !this.isFiring && (this.scene.kokoros > 0)){
                console.log('kokoro dropped');

                this.isFiring = true;
                this.alpha = 1;
                // console.log('alpha state ', this.alpha);
                this.sfxRocket.play(); // play sfx
                this.scene.kokoroDropped(); // update the
        }

        // if fired move bullet up
        // if (this.isFiring && this.y >= 108){
        if (this.isFiring){
            this.y += 2;
            this.x -= 2;
        }
        // reset on miss
        if (this.y >= 475){
                // this.alpha = 0;
                this.reset();
        }

        if (!this.isFiring){
            this.x = this.scene.playerOne.x + 30;
            this.y = this.scene.playerOne.y + 34;
        }
    }
    // reset rocket to the "ground" (bottom of the screen)
    reset(){
        this.isFiring = false;
        // this.y = 100;
        this.alpha = 0;
        // console.log('reset alpha', this.alpha)
    }

    moveHeart(){
        if (keyLEFT.isDown && this.x >= 47){ // is the player moving past the left boundry
            this.x -= 2;
        } else if (keyRIGHT.isDown && this.x <= 598) {
            this.x += 2;
        }
    }

}