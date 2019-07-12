import 'phaser';

export default class CreditsScene extends Phaser.Scene {
  constructor (key) {
    super(key);
  }

  preload () {
      var self = this;
      this.levels = {
        1: 'level1',
        2: 'level2'
      };
  }

  create () {
    //this.scene.start('Game', { level: 1, newGame: true, levels: this.levels });
    this.events.on('resize', this.resize, this);
    this.bg = this.add.sprite(game.config.width / 2,game.config.height / 2, 'creditsScreen');
    this.bg.displayWidth = game.config.width;
    this.bg.displayHeight = game.config.height;
    this.resize(game.config.width,game.config.height);

    let startButton = this.add.sprite(game.config.width / 2, 725, 'startButton')
        .setInteractive()
        .on('pointerdown', () => this.scene.start('Game', { level: 1, newGame: true, levels: this.levels }));
}
resize (width, height) {
    console.log("Resize",width, height);
    game.config.width = width;
    game.config.height = height;
    this.bg.displayWidth = game.config.width;
    this.bg.displayHeight = game.config.height;
  }
};
