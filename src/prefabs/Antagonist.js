// Antagonist prefab
class Antagonist extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame, pointValue, direction) {
        super(scene, x, y, texture, frame);
        this.direction = direction;
        // add object to the existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.ACCELERATION = 500;
        this.MAX_X_VEL = 300;   // pixels/second
        this.MAX_Y_VEL = 1500;
        this.DRAG = 600;
        this.JUMP_VELOCITY = -650;

        this.body.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);
        this.setVelocityX(this.scene.antagonistVelocityX);

        // allow player to jump through platforms
        this.body.checkCollision.up = false;
        // set the double jump state
        this.doubleJump = false;

        // playerOne animation config
        this.scene.anims.create({
            key: 'antagonistWalkAni',
            frames: this.scene.anims.generateFrameNumbers('antagonistWalk', {start: 0, end: 3, first: 0}),
            repeat: -1,
            frameRate: 6,
        });

        this.body.checkCollision.left = false;
    }

    update() {
        this.moveForward();
        this.unTunnel();
    }

    reset() {

    }

    unTunnel(){
        if (this.y >= 764){
            this.y = 764;
        }
    }

    moveForward() { // this allows the runner to not run into platforms during a jump
        this.body.checkCollision.left = false;
    }
}