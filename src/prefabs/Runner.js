// Runner prefab
class Runner extends Phaser.Physics.Arcade.Sprite{
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
        // this.setAccelerationX(this.scene.runnerAccelerationX);

        // allow player to jump through platforms
        this.body.checkCollision.up = false;
        // set the double jump state
        this.doubleJump = false;

        // playerOne animation config
        this.scene.anims.create({
            key: 'playerWalkAni',
            frames: this.scene.anims.generateFrameNumbers('playerRun', {start: 0, end: 8, first: 0}),
            repeat: -1,
            frameRate: 15
        });

        this.scene.anims.create({
            key: 'playerIdleAni',
            frames: this.scene.anims.generateFrameNumbers('playerIdle', {start: 0, end: 3, first: 0}),
            repeat: -1,
            frameRate: 1
        });

        this.scene.anims.create({
            key: 'playerVictoryAni',
            frames: this.scene.anims.generateFrameNumbers('playerVictory', {start: 0, end: 16, first: 0}),
            repeat: 0,
            frameRate: 5
        });

        this.scene.anims.create({
            key: 'playerJumpAni',
            frames: this.scene.anims.generateFrameNumbers('playerjump', {start: 0, end: 3, first: 0}),
            repeat: 0,
            frameRate: 15
        });

    }

    update() {

        this.running();
        this.moveForward();
        this.directionChange();
        this.unTunnel();

        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.jump();
        }
        this.levelFinish();
    }

    reset() {

    }

    moveForward() { // this allows the runner to not run into platforms during a jump
        if (this.body.velocity.y != 0) {
            this.body.checkCollision.right = false;
        } else {
            this.body.checkCollision.right = true;
        }
    }

    running(){
        let keyDown = Phaser.Input.Keyboard.JustDown(keyRIGHT); // because justDown can only be called once per loop

        if (keyDown && this.body.onWall()) {
            console.log('miniJump ', this.body.velocity.y);
            this.setVelocityY(this.scene.miniJumpVelocity);
        } else if (keyDown){
            this.setVelocityX(this.scene.runnerVelocityX);
        }

        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.setVelocityX(-this.scene.runnerVelocityX);
        }
    }

    // this.body.blocked().right

    jump() {
        // make runner go up
        if (this.body.velocity.y == 0) { // the main jump code
            console.log('jump one ', this.body.velocity.y)
            this.setVelocityY(this.scene.jumpVelocity);
            this.doubleJump = true;

        } else if (this.doubleJump) { // a second press gives a boost jump
            console.log('jump two ', this.body.velocity.y)
            this.setVelocityY(this.scene.doublejumpVelocity);
            this.doubleJump = false;
        }
    }

    directionChange(){
        if (this.body.velocity.x >= 0){
            this.flipX = false;
        } else if (this.body.velocity.x < 0){
            this.flipX = true;
        }
    }

    unTunnel(){
        if (this.y >= 821){
            this.y = 380;
            this.x -= 64;
            this.body.velocity.x = -200;
            this.body.velocity.y-200;
            this.scene.sound.play('cameraSound');
        }
    }

    levelFinish(){
        if (this.x >= this.scene.pixelLength) { // stop the runner at level end
            this.setAccelerationX(0);
            this.setVelocityX(0);
        }
        // victory dance

    }

}