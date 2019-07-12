import 'phaser';

export default class Bullets extends Phaser.Physics.Arcade.Group {
  constructor (world, scene, children) {
    super(world, scene, children);
    this.scene = scene;

    this.createMultiple({
      frameQuantity: 5,
      key: 'bullet',
      active: false,
      visible: false
    });
  }

  enemyCollision (bullet, enemy) {
    console.log("enemyCollision",bullet,enemy);
    bullet.active = false;
    bullet.visible = false;
    bullet.disableBody();
    enemy.loseHealth();
  }

  bossCollision (boss,bullet) {
    console.log("Boss Collision",bullet,boss);
    bullet.active = false;
    bullet.visible = false;
    bullet.disableBody();
    console.log(boss);
    if(boss) if(boss.loseHealth) boss.loseHealth();
  }

  batteryCollision (battery,bullet) {
    console.log("Battery Collision",bullet,battery);
    battery.active = false;
    battery.visible = false;
    //battery.disableBody();
    //battery.loseHealth();
  }

  fireBullet (x, y, direction) {
    const bullet = this.getFirstDead(false);
    if (bullet) {
      bullet.enableBody(true);
      bullet.active = true;
      bullet.visible = true;
      bullet.setPosition(x, y);
      bullet.setScale(0.8);

      switch (direction) {
        case 'up':
          bullet.setVelocityY(-300);
          break;
        case 'down':
          bullet.setVelocityY(300);
          break;
        case 'left':
          bullet.setVelocityX(-300);
          break;
        case 'right':
          bullet.setVelocityX(300);
          break;
        default:
          bullet.setVelocityY(-300);
      }

      this.scene.time.addEvent({
        delay: 1500,
        callback: () => {
          bullet.disableBody();
          bullet.active = false;
          bullet.visible = false;
          bullet.setVelocity(0);
        }
      });
    }
  }
}