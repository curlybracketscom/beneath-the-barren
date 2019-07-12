import 'phaser';
import Player from '../Sprites/Player';
import Portal from '../Sprites/Portal';
import Boss from '../Sprites/Boss';
import Door from '../Sprites/Door';
import Treasure from '../Sprites/Treasure';
import Coins from '../Groups/Coins';
import Enemies from '../Groups/Enemies';
import Bullets from '../Groups/Bullets';
import Batteries from '../Groups/Batteries';
import PressurePlates from '../Groups/PressurePlates';

export default class GameScene extends Phaser.Scene {
  constructor (key) {
    super(key);
  }

  init (data) {
    this._LEVEL = data.level;
    this._LEVELS = data.levels;
    this._NEWGAME = data.newGame;
    this.loadingLevel = false;
    this.BATTERIES_TO_HIT = 2;
    this.batteriesLeftToHit = this.BATTERIES_TO_HIT;
    this.platesPressed = 0;
    if (this._NEWGAME) this.events.emit('newGame');
    var self = this;
  }

  addPropertiesToObject( gid, objGroup )
{
    var props = this.map.filterObjects('Enemies', (obj) => {if (obj.id === gid) return obj} ) 
    console.log("Props",props);
    for (var index in objGroup)
    {
      if(props)
      if(props[index])
        if(props[index].properties)
        {
          Object.assign( objGroup[index], props[index].properties );
          console.log(props[index].properties)
        }
    }
}

  create () {
    // listen for the resize event
    this.events.on('resize', this.resize, this);
    // listen for player input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // create our tilemap
    this.createMap();
    this.createDoor();
    // creating the portal
    this.createPortal();
    // creating the boss
    this.createBoss();
    // creating the treasure
    this.createTreasure();
    // creating the batteries
    //this.createBatteries();
    // creating the coins
    this.coins = this.map.createFromObjects('Coins', 'Coin', { key: 'coin' });
    this.coinsGroup = new Coins(this.physics.world, this, [], this.coins);
    // creating the enemies
    this.enemies = this.map.createFromObjects('Enemies', 'Enemy');
    this.enemiesGroup = new Enemies(this.physics.world, this, [], this.enemies,this.map.filterObjects('Enemies', (object) => object.type === 'Enemy'));
    // creating the bullets
    this.bullets = new Bullets(this.physics.world, this, []);

    this.batteries = this.map.createFromObjects('Batteries', 'Battery', { key: 'battery' });
   console.log(this.batteries)
    if(this.batteries!=undefined) this.batteriesGroup = new Batteries(this.physics.world,this,[],this.batteries);

    this.pressurePlates = this.map.createFromObjects('PressurePlates', 'PressurePlate', { key: 'pressurePlate' });
   console.log(this.batteries)
    if(this.pressurePlates!=undefined) this.pressurePlatesGroup = new PressurePlates(this.physics.world,this,[],this.pressurePlates);

    // create our player
    this.createPlayer();
    // add collisions
    this.addCollisions();

    this.level1Music = this.sound.add('level1Music')
    this.level1Music.setLoop(true);
    this.level1Music.stop();

    this.level2Music = this.sound.add('level2Music')
    this.level2Music.setLoop(true);
    this.level2Music.stop();

    this.bossMusic = this.sound.add('bossMusic');
    this.bossMusic.setLoop(true);
    this.bossMusic.stop();

    if(this._LEVEL === 1) this.level1Music.play();
    if(this._LEVEL === 2) this.level2Music.play();

    

    // update our camera
    this.cameras.main.startFollow(this.player);

    this.events.on('batteryDestroyed', () => {
      this.batteriesLeftToHit--;
      if(this.batteriesLeftToHit==0) this.boss.activateBoss();
    });

    this.events.on('platePressed', () => {
      this.platesPressed++;
      console.log("Plates Pressed:",this.platesPressed);
      if(this.mainDoor)
      {
        if(this.platesPressed==2)
        {
          this.mainDoor.visible = false;
        }
      }
    });
    
  }

  update () {
    this.player.update(this.cursors);
    if(this.player.health==0)
    {
      if(this.bossMusic.isPlaying)
      {
        this.bossMusic.stop();
        if(this._LEVEL === 1) this.level1Music.play();
        if(this._LEVEL === 2) this.level2Music.play();
      }
    }
    this.player.checkIfEnemy3IsClose(this.enemiesGroup.children.entries);
    if(this.player.checkIfUserIsCloseToTheBoss(this.boss))
    {
      console.log("Why Here?");
      if(!this.bossMusic.isPlaying)
      {
        if(this.player.health!=0) 
        {
          this.bossMusic.play();
          this.level1Music.stop();
          this.level2Music.stop();
        }
        
        
        
      }

      if(this.boss.shootingEnabled)
      {
        this.bossBullet.visible = true;
        this.bossBullet.x = this.boss.x;
        this.bossBullet.y = this.boss.y;
        this.boss.shoot();
        var xSpeed = this.player.x-this.boss.x;
        var ySpeed = this.player.y-this.boss.y;

        this.bossBullet.setVelocityX(xSpeed);
        this.bossBullet.setVelocityY(ySpeed);
        console.log(xSpeed,ySpeed)
        this.bossBullet.rotation = Math.atan2(this.bossBullet.body.velocity.y,this.bossBullet.body.velocity.x)
        let newVelocity = this.physics.velocityFromAngle(this.bossBullet.angle,200);
        this.bossBullet.setVelocityX(newVelocity.x);
        this.bossBullet.setVelocityY(newVelocity.y);
      }
      
    }
    else
    {
      if(this.bossMusic.isPlaying)
      {
        this.bossMusic.stop();
      }
    }
    

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.bullets.fireBullet(this.player.x, this.player.y, this.player.lastDirection);
    }
    if(this.treasure) this.physics.world.collide(this.player, this.treasure, this.treasure.collectTreasure, null, this.treasure)
  }

  bossBulletHitPlayer(bossBullet,player,scope)
  {
    console.log(bossBullet,player);
    bossBullet.x = bossBullet.scene.boss.x;
    bossBullet.y = bossBullet.scene.boss.y;
    bossBullet.setVelocityX(0);
    bossBullet.setVelocityY(0);
    bossBullet.visible=false;

    player.enemyCollision();
  }

  addCollisions () {
    this.physics.add.collider(this.player, this.blockedLayer);
    this.physics.add.collider(this.bullets, this.blockedLayer);
    this.physics.add.collider(this.enemiesGroup, this.blockedLayer);
    this.physics.add.overlap(this.player, this.enemiesGroup, this.player.enemyCollision.bind(this.player));
    this.physics.add.overlap(this.player, this.portal, this.loadNextLevel.bind(this, false));
    this.physics.add.overlap(this.coinsGroup, this.player, this.coinsGroup.collectCoin.bind(this.coinsGroup));
    this.physics.add.overlap(this.pressurePlatesGroup, this.player, this.pressurePlatesGroup.stepOnPlate.bind(this.pressurePlatesGroup));
    if(this.batteriesGroup!=undefined) this.physics.add.overlap(this.batteriesGroup, this.bullets, this.batteriesGroup.shootBattery.bind(this.batteriesGroup));
    this.physics.add.overlap(this.bullets, this.enemiesGroup, this.bullets.enemyCollision);
    if(this.boss) this.physics.add.overlap(this.bullets, this.boss, this.bullets.bossCollision);
    if(this.bossBullet) this.physics.add.overlap(this.bossBullet, this.player, this.bossBulletHitPlayer);

    
  }

  createPlayer () {
    this.map.findObject('Player', (obj) => {
      if (this._NEWGAME && this._LEVEL === 1) {
        if (obj.type === 'StartingPosition') {
          this.player = new Player(this, obj.x, obj.y);
        }
      } else {
        this.player = new Player(this, obj.x, obj.y);
      }
    });
  }

  /*createBatteries()
  {
    this.map.findObject('Battery', (obj) => {
        this.battery = new Battery(this, obj.x, obj.y - 68);
    });
  }*/

  createTreasure()
  {
    this.map.findObject('Treasure', (obj) => {
        this.treasure = new Treasure(this, obj.x, obj.y - 68);
    });
  }

  createBoss()
  {
    this.map.findObject('Boss', (obj) => {
        this.boss = new Boss(this, obj.x, obj.y - 68);
    });

    if(this.boss==undefined) return;

    this.bossBullet = this.physics.add.sprite(this.boss.x,this.boss.y,'bossFire');
    this.bossBullet.angle = 90;
    this.bossBullet.visible=false;
    this.physics.world.enable(this.bossBullet);
    this.add.existing(this.bossBullet);
    console.log(this.bossBullet)
    this.anims.create({
      key: 'bossFireAnim',
      frames: this.anims.generateFrameNumbers('bossFire'),
      frameRate: 5,
      repeat: -1
  });
  this.bossBullet.anims.play('bossFireAnim');
  }

  createDoor()
  {
    this.map.findObject('Door', (obj) => {
      this.mainDoor = new Door(this, obj.x, obj.y);
    });
  }

  createPortal () {
    this.map.findObject('Portal', (obj) => {
      if (this._LEVEL === 1) {
        this.portal = new Portal(this, obj.x, obj.y - 68);
      } else if (this._LEVEL === 2) {
        this.portal = new Portal(this, obj.x, obj.y + 70);
      }
    });
  }

  resize (width, height) {
    if (width === undefined) {
      width = this.sys.game.config.width;
    }
    if (height === undefined) {
      height = this.sys.game.config.height;
    }
    this.cameras.resize(width, height);
  }

  createMap () {
    // add water background
    this.add.tileSprite(0, 0, 8000, 8000, 'RPGpack_sheet', 31);
    // create the tilemap
    this.map = this.make.tilemap({ key: this._LEVELS[this._LEVEL] });
    console.log(this.map);
    // add tileset image
    this.tiles = this.map.addTilesetImage('RPGpack_sheet');
    // create our layers
    this.backgroundLayer = this.map.createStaticLayer('Background', this.tiles, 0, 0);
    this.blockedLayer = this.map.createStaticLayer('Blocked', this.tiles, 0, 0);
    this.blockedLayer.setCollisionByExclusion([-1]);
  }

  loadNextLevel (endGame) {
    this.bossMusic.stop();
    this.level1Music.stop();
    this.level2Music.stop();
    console.log(this);
    if (!this.loadingLevel) {
      this.cameras.main.fade(500, 0, 0, 0);
      this.cameras.main.on('camerafadeoutcomplete', () => {
        if (endGame) {
          this.scene.restart({ level: 1, levels: this._LEVELS, newGame: true });
        } else if (this._LEVEL === 1) {
          this.scene.restart({ level: 2, levels: this._LEVELS, newGame: false });
        } else if (this._LEVEL === 2) {
          this.scene.restart({ level: 1, levels: this._LEVELS, newGame: false });
        }
      });
      this.loadingLevel = true;
    }
  }
};
