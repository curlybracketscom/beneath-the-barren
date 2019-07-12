import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'playerIdle');
    this.scene = scene;
    this.health = 1;
    this.hitDelay = false;
    this.direction = 'none';
    this.lastDirection = 'up';
    

    // enable physics
    this.scene.physics.world.enable(this);
    // add our player to the scene
    this.scene.add.existing(this);
    // scale our player
    this.setScale(1);
    console.log(this);
    this.scene.anims.create({
      key: "walkUp",
      frames: this.anims.animationManager.generateFrameNumbers("playerWalkingUp", {
        start: 0,
        end: 2
      }),
      frameRate: 15,
      repeat: -1
    });
    this.scene.anims.create({
      key: "walkDown",
      frames: this.anims.animationManager.generateFrameNumbers("playerWalkingDown", {
        start: 0,
        end: 2
      }),
      frameRate: 15,
      repeat: -1
    });
    this.scene.anims.create({
      key: "walkSideways",
      frames: this.anims.animationManager.generateFrameNumbers("playerWalkingSideways", {
        start: 0,
        end: 3
      }),
      frameRate: 15,
      repeat: -1
    });
    this.scene.anims.create({
      key: "dead",
      frames: this.anims.animationManager.generateFrameNumbers("playerDead", {
        start: 0,
        end: 4
      }),
      frameRate: 15
    });
  } 

  checkIfUserIsCloseToTheBoss(boss)
  {
    if(!boss) return;
    if(boss.health==0) return;
    var a = boss.x - this.x;
    var b = boss.y-this.y;
    var c = Math.sqrt( a*a + b*b );
    if(c<400) return true;
    return false;
  }

  checkIfEnemy3IsClose(enemyGroup)
  {
    for(var i=0;i<enemyGroup.length;i++)
    {
      if(enemyGroup[i].enemyType==3)
      {
        var a = enemyGroup[i].x - this.x;
        var b = enemyGroup[i].y-this.y;
        var c = Math.sqrt( a*a + b*b );
        if(c>500) enemyGroup[i].enemy3nextDirection = enemyGroup[i].NONE;
        else
        {
          if(Math.abs(b)>Math.abs(a))
          {
            if(b<0) enemyGroup[i].enemy3nextDirection = enemyGroup[i].DOWN;
            else if(b>0) enemyGroup[i].enemy3nextDirection = enemyGroup[i].UP;
          }
          else
          {
            if(a<0) enemyGroup[i].enemy3nextDirection = enemyGroup[i].RIGHT;
          else if(a>0)  enemyGroup[i].enemy3nextDirection = enemyGroup[i].LEFT;
          }

        }
      }
    }
  }

  update(cursors) {
    this.setVelocity(0);
    if(this.dead) 
    {
      return;
    }

    var somethingClicked = false;
    // check if the up or down key is pressed
    if (cursors.up.isDown) {
      if (this.direction != "up") this.anims.play("walkUp");
      this.direction = 'up';
      this.setVelocityY(-300);
      somethingClicked = true;
      this.setScale(1);
      this.body.offset.x = 0

    } else if (cursors.down.isDown) {
      if (this.direction != "down") this.anims.play("walkDown");
      this.direction = 'down';
      this.setVelocityY(300);
      somethingClicked = true;
      this.setScale(1);
      this.body.offset.x = 0
      
    }
    // check if the left or right key is pressed
    if (cursors.left.isDown) {
      if (this.direction != "left") this.anims.play("walkSideways");
      this.direction = 'left';
      this.setVelocityX(-300);
      somethingClicked = true;
      //this.angle = 180;
      this.setScale(-1,1);
      this.body.offset.x = this.body.width;
      //this.setScale(-1, 1);
      //this.setOrigin(0);

    } else if (cursors.right.isDown) {
      if (this.direction != "right") this.anims.play("walkSideways");
      this.direction = 'right';
      this.setVelocityX(300);
      somethingClicked = true;
      this.setScale(1);
      this.body.offset.x = 0

    }

    if(this.direction!='none')
    {
      this.lastDirection = this.direction;
    }

    if (!somethingClicked) {
      this.direction = 'none';
      this.setTexture('playerIdle');
    }

  }

  loseHealth() {
    if(this.dead) return;
    this.health--;
    this.scene.events.emit('loseHealth', this.health);
    if (this.health === 0) {
      this.dead = true;
      console.log("Dead",this);
      this.anims.play("dead");
      var self = this;
      var timer = this.scene.time.delayedCall(1000, this.scene.loadNextLevel, [true], this.scene);  // delay in ms
      this.setScale(0.5);
    }
  }

  enemyCollision(player, enemy) {
    if (!this.hitDelay) {
      this.loseHealth();
      this.hitDelay = true;
      this.tint = 0xff0000;
      this.scene.time.addEvent({
        delay: 1200,
        callback: () => {
          this.hitDelay = false;
          this.tint = 0xffffff;
        },
        callbackScope: this
      });
    }
  }
}