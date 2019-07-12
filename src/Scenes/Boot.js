import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor (key) {
    super(key);
  }

  preload () {
    this.levels = {
      1: 'level1',
      2: 'level2'
    };
    // load in the tilemap
    this.load.tilemapTiledJSON('level1', 'assets/tilemaps/level1.json');
    this.load.tilemapTiledJSON('level2', 'assets/tilemaps/level2.json');
    // load in the spritesheet
    this.load.spritesheet('RPGpack_sheet', 'assets/images/RPGpack_sheet.png', { frameWidth: 64, frameHeight: 64 });
    // load in our character spritesheet
    this.load.spritesheet('characters', 'assets/images/roguelikeChar_transparent.png', { frameWidth: 17, frameHeight: 17 });
    // load our portal sprite
    this.load.image('portal', 'assets/images/raft.png');
    this.load.image('creditsScreen', 'assets/images/credits_screen.png');
    this.load.image('storyScreen', 'assets/images/story_screen.png');
    this.load.image('startButton', 'assets/images/start_button.png');
    this.load.image('creditsButton', 'assets/images/credits_button.png');
    this.load.image('storyButton', 'assets/images/story_button.png');
    this.load.image('enemy1', 'assets/images/enemy1.png');
    this.load.image('enemy1_down', 'assets/images/enemy1_down.png');
    this.load.image('enemy1_up', 'assets/images/enemy1_up.png');
    this.load.image('enemy2', 'assets/images/enemy2.png');
    this.load.image('enemy2_left', 'assets/images/enemy2_left.png');
    this.load.image('enemy2_right', 'assets/images/enemy2_right.png');
    this.load.image('enemy3', 'assets/images/enemy3.png');
    this.load.image('enemy3', 'assets/images/enemy3.png');
    this.load.image('door', 'assets/images/door.png');
    this.load.image('pressurePlate', 'assets/images/pressure_plate.png');
    this.load.image('door', 'assets/images/pressure_plate.png');
    this.load.image('treasure', 'assets/images/treasure.png');
    this.load.image('battery', 'assets/images/battery.png');
    this.load.audio('bossMusic', 'assets/boss_music.mp3');
    this.load.audio('level1Music', 'assets/level1.mp3');
    this.load.audio('level2Music', 'assets/level2.mp3');
    this.load.image('playerIdle', 'assets/images/player_standing.png');
    this.load.image('titleScreen', 'assets/images/title_screen.png');
    this.load.spritesheet('playerDead', 'assets/images/player_death.png', { frameWidth: 200, frameHeight: 200 });
    this.load.spritesheet('bossFire', 'assets/images/boss_fire.png', { frameWidth: 98, frameHeight: 200 });
    this.load.spritesheet('boss', 'assets/images/boss.png', { frameWidth: 500, frameHeight: 356 });
    this.load.spritesheet('playerWalkingUp', 'assets/images/player_walking_up.png', { frameWidth: 44, frameHeight: 100 });
    this.load.spritesheet('playerWalkingDown', 'assets/images/player_walking_down.png', { frameWidth: 44, frameHeight: 100 });
    this.load.spritesheet('playerWalkingSideways', 'assets/images/player_walking_left_right.png', { frameWidth: 67, frameHeight: 100 });
    // load in our coin sprite
    this.load.image('coin', 'assets/images/coin_01.png');
    // load in our bullet sprite
    this.load.image('bullet', 'assets/images/ballBlack_04.png');
  }

  create () {
    //this.scene.start('Game', { level: 1, newGame: true, levels: this.levels });
    this.scene.start('Title');
  }
};
