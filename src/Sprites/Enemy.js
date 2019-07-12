import 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, frame) {
    super(scene, x, y, 'enemy' + frame);
    console.log("Creating enemy", frame);
    this.scene = scene;
    switch (frame) {
      case 1:
        {
          this.health = 3;
        }
      case 2:
        {
          this.health = 2;
        }
      case 3:
        {
          this.health = 1;
          this.enemy3nextDirection = this.NONE;
        }
    }

    this.enemyType = frame;
    this.mainDirection = -1;
    this.NONE = -1;
    this.UP = 0;
    this.DOWN = 1;
    this.LEFT = 2;
    this.RIGHT = 3;

    // enable physics
    this.scene.physics.world.enable(this);
    // add our player to the scene
    this.scene.add.existing(this);
    // scale our player
    this.setScale(1);

    // move our enemy
    this.timeEvent = this.scene.time.addEvent({
      delay: Math.floor((Math.random() * 5000) + 1000),
      callback: this.move,
      loop: true,
      callbackScope: this
    });
  }

  loseHealth() {
    this.health--;
    this.tint = 0xff0000;
    if (this.health === 0) {
      this.timeEvent.destroy();
      this.destroy();
    } else {
      this.scene.time.addEvent({
        delay: 200,
        callback: () => {
          this.tint = 0xffffff;
        }
      });
    }
  }

  move() {
    switch (this.enemyType) {
      case 1:
        if (this.mainDirection != this.UP) {
          this.mainDirection = this.UP;
          this.setVelocityY(-700);
          this.setTexture('enemy1_up');
        }
        else {
          this.mainDirection = this.DOWN;
          this.setVelocityY(700);
          this.setTexture('enemy1_down');
        }
        break;
      case 2:
        if (this.mainDirection != this.UP) {
          this.mainDirection = this.UP;
          this.setVelocityY(-500);
          this.setTexture('enemy2_left');
        }
        else {
          this.mainDirection = this.DOWN;
          this.setVelocityY(500);
          this.setTexture('enemy2_right');
        }
        break;
      case 3:
        if(this.enemy3nextDirection==this.UP) this.setVelocityY(-100);
        if(this.enemy3nextDirection==this.DOWN) this.setVelocityY(100);
        if(this.enemy3nextDirection==this.LEFT) this.setVelocityX(-100);
        if(this.enemy3nextDirection==this.RIGHT) this.setVelocityX(100);
        //this.setVelocityY(100);
        break;
      default:
        this.setVelocityX(100);
    }

    this.scene.time.addEvent({
      delay: 500,
      callback: () => {
        if (this.active) this.setVelocity(0);
      },
      callbackScope: this
    });
  }
}