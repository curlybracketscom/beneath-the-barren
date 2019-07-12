import 'phaser';
import Enemy from '../Sprites/Enemy';

export default class Enemies extends Phaser.Physics.Arcade.Group {
  constructor (world, scene, children, spriteArray,dataArray) {
    console.log("Test",children,spriteArray,dataArray);
    super(world, scene, children);
    this.scene = scene;
    this.spriteFrames = [0, 1, 54, 55, 108, 109, 162, 163];

    // create our enemies from the sprite array
    this.createEnemies(scene, spriteArray,dataArray);
  }

  createEnemies (scene, spriteArray,dataArray) {
    for(var i=0;i<spriteArray.length;i++)
    {
      const randNumber = dataArray[i].properties[0].value
      // create a new enemy
      const enemy = new Enemy(scene, spriteArray[i].x, spriteArray[i].y, randNumber);
      // add to our group
      this.add(enemy);
      // destroy the sprite
      spriteArray[i].destroy();
    }

  }
}