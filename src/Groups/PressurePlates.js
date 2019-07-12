import 'phaser';

// export default class Coins extends Phaser.Physics.Arcade.StaticGroup {
//   constructor (world, scene, children, spriteArray) {
//     super(world, scene, children);

export default class PressurePlates extends Phaser.Physics.Arcade.StaticGroup {

 constructor (world, scene, children, spriteArray) {



   super(world, scene);
    this.scene = scene;

    // add coins to our group
    spriteArray.forEach((pressurePlate) => {
      pressurePlate.setScale(1.1);
      pressurePlate.width = 70;
      pressurePlate.height = 80;
      console.log(pressurePlate)
      //battery.body.setSize(battery.width*0.2,battery.height*0.2);
      this.add(pressurePlate);
    });
    this.refresh();
  }

  stepOnPlate(player, plate)
  {
    if(!plate.used) this.scene.events.emit('platePressed');
    plate.alpha = 0.5;
    plate.used = true;
    
  }

}
