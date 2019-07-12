import 'phaser';

export default class Treasure extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'treasure');
        this.scene = scene;

        // enable physics
        this.scene.physics.world.enable(this);
        // add our player to the scene
        this.scene.add.existing(this);
    }

    collectTreasure() {
        console.log(this);
        this.destroy();
        alert("Game Completed")
    }
}