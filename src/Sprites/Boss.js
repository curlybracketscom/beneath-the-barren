import 'phaser';

export default class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'boss');
        this.scene = scene;
        this.health = 5;

        // enable physics
        this.scene.physics.world.enable(this);
        // add our player to the scene
        this.scene.add.existing(this);
        this.setScale(0.5); //
        this.deactivated = true;
        this.shootingEnabled = true;

        var timer = scene.time.addEvent({
            delay: 5000,                // ms
            callback: this.enableShooting,
            //args: [],
            callbackScope: this,
            loop: true
        });
    }
    shoot()
    {
        this.shootingEnabled = false;
    }

    enableShooting()
    {
        console.log("Enable Shooting");
        this.shootingEnabled = true;
    }

    activateBoss()
    {
        this.deactivated = false;
    }

    loseHealth() {
        if(this.deactivated) return;

        this.health--;
        console.log("Boss Hit / Health: ", this.health);
        this.tint = 0xff0000;
        if (this.health === 0) {
            this.destroy();
            alert("Game Completed")
        } else {
            this.scene.time.addEvent({
                delay: 200,
                callback: () => {
                    this.tint = 0xffffff;
                }
            });
        }

    }
}