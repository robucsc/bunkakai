// Collectable prefab
class Collectable extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame, pointValue, direction) {
        super(scene, x, y, texture, frame);
        this.direction = direction;

        // add object to the existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setScale(2, 2);
        this.setOrigin(0, 0);

        // store point value
        this.points = pointValue;
    }
    update(){
        // move Collectable right
        this.x -= game.settings.spaceshipSpeed;
        // wraparound from right to left edge
        if (this.x <= 0 - this.width){
            this.reset();
        }
    }
    reset(){
        this.x = this.scene.cameras.main.scrollX + game.config.width;
        this.alpha = 1;
    }
}

// this.body.setAllowGravity(false) // to turn on/off physics on a sprite