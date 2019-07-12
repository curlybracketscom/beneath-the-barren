import 'phaser';

// export default class Coins extends Phaser.Physics.Arcade.StaticGroup {
//   constructor (world, scene, children, spriteArray) {
//     super(world, scene, children);

export default class Batteries extends Phaser.Physics.Arcade.StaticGroup {

 constructor (world, scene, children, spriteArray) {



   super(world, scene);
    this.scene = scene;

    // add coins to our group
    spriteArray.forEach((battery) => {
      battery.setScale(1);
      battery.width = 70;
      battery.height = 80;
      console.log(battery)
      //battery.body.setSize(battery.width*0.2,battery.height*0.2);
      this.add(battery);
    });
    this.refresh();
  }

  shootBattery (battery,bullet) {
    console.log("Shoot Battery",battery);
    this.remove(battery);
    battery.destroy();
    // dispatch an event
    this.scene.events.emit('batteryDestroyed');
  }
}
