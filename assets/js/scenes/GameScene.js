class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    this.scene.launch('Ui');
    this.score = 0;
  }

  create() {
    this.createMap();
    this.createAudio();
    this.createChests();
    this.createPlayer();
    this.addCollisions();
    this.createInput();
    
  }

  update() {
    this.player.update(this.cursors);
  }

  createAudio() {
    this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.2 });
  }

  createPlayer() {
    this.player = new Player(this, 32, 32, 'characters', 0);
  }

  createChests() {
    // create a chest group
    this.chests = this.physics.add.group();
    // create chest positions array
    this.chestPositions = [[100, 100], [200, 200], [300, 300], [400, 400], [500, 500]];
    // specify the max number of chest we can have
    this.maxNumberOfChests = 3;
    // spawn a chest
    for (let i = 0; i < this.maxNumberOfChests; i += 1) {
      this.spawnChest();
    }
  }

  spawnChest() {
    const location = this.chestPositions[Math.floor(Math.random() * this.chestPositions.length)];

    let chest = this.chests.getFirstDead();

    if (!chest) {
      const chest = new Chest(this, location[0], location[1], 'items', 0);
      // add chest to chests group
      this.chests.add(chest);
    } else {
      chest.setPosition(location[0], location[1]);
      chest.makeActive();
    }
  }


  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  addCollisions() {
    // check for collisions between player and wall objects
    this.physics.add.collider(this.player, this.wall);
    // check for overlaps between player and chest game objects
    this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this);
  }

  collectChest(player, chest) {
    // play gold pickup sound
    this.goldPickupAudio.play();
    // update our score
    this.score += chest.coins;
    // update score in the ui
    this.events.emit('updateScore', this.score);
    // make chest game object inactive
    chest.makeInactive();
    // spawn a new chest
    this.time.delayedCall(1000, this.spawnChest, [], this);
  }

  createMap(){
    // create the tile map, 'map' refers to variable assigned in BootScene.loadTileMap()
    this.map = this.make.tilemap({ key: 'map'});
    // add tileset image to map
    this.tiles = this.map.addTilesetImage('background', 'background', 32, 32, 1, 2);
    // create background layer
    this.backgroundLayer = this.map.createStaticLayer('background', this.tiles, 0, 0);
    this.backgroundLayer.setScale(2);
    // create blocked layer
    this.blockedLayer = this.map.createStaticLayer('blocked', this.tiles, 0, 0);
    this.blockedLayer.setScale(2);
    
    // update world bounds; *2 because we already scaled up map
    this.physics.world.bounds.width = this.map.widthInPixels *2;
    this.physics.world.bounds.height = this.map.heightInPixels *2;

    // limit camera to (x,y) of our map
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels *2, this.map.heightInPixels *2);
  }
}
