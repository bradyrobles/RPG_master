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
    this.createGroups();
    this.createInput();

    this.createGameManager();
    
  }

  update() {
    if (this.player) this.player.update(this.cursors);
  }

  createAudio() {
    this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.2 });
  }

  createPlayer(location) {
    this.player = new Player(this, location[0] *2, location[1] *2, 'characters', 7);
  }

  createGroups() {
    // create a chest group
    this.chests = this.physics.add.group();

    // create a monster group
    this.monsters = this.physics.add.group();
    
  }

  spawnChest(chestObject) {
    let chest = this.chests.getFirstDead();

    if (!chest) {
      chest = new Chest(this, 
        chestObject.x * scaleFactor, 
        chestObject.y * scaleFactor, 
        'items', 
        0, 
        chestObject.gold, 
        chestObject.id);
        
      // add chest to chests group
      this.chests.add(chest);
    } else {
      chest.coins = chestObject.gold;
      chest.id = chestObject.id;
      chest.setPosition(chestObject.x * scaleFactor, chestObject.y * scaleFactor);
      chest.makeActive();
    }
  }

  spawnMonster(monsterObject){
    let monster = this.monsters.getFirstDead();

    if (!monster) {
      monster = new Monster(this, 
        monsterObject.x * scaleFactor, 
        monsterObject.y * scaleFactor, 
        'monsters', 
        monsterObject.frame, 
        monsterObject.id,
        monsterObject.health,
        monsterObject.maxHealth,
        );

      // add monster to monsters group
      this.monsters.add(monster);
    } else {
      monster.id = monsterObject.id;
      monster.health = monsterObject.health;
      monster.maxHealth = monsterObject.maxHealth;
      monster.setTexture('monsters', monsterObject.frame);
      monster.setPosition(monsterObject.x * scaleFactor, monsterObject.y * scaleFactor);
      monster.makeActive();
    }
  }


  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  addCollisions() {
    // check for collisions between player and Tiled blocked layer
    this.physics.add.collider(this.player, this.map.blockedLayer);
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
    this.events.emit('pickupChest', chest.id);
  }

  createMap(){
    // create map
    this.map = new Map(this, 'map', 'background', 'background', 'blocked');
  }

  createGameManager(){
    // Listener Event for spawning player
    this.events.on('spawnPlayer', (location) => {
      this.createPlayer(location);
      this.addCollisions();
    });

    // Listener Event for spawning chests
    this.events.on('chestSpawned', (chest) => {
      this.spawnChest(chest);
      //console.log(chest);
    });

    // Listener Event for spawning monsters
    this.events.on('monsterSpawned', (monster) => {
      this.spawnMonster(monster);
    });

    // create the game manager
    this.gameManager = new GameManager(this, this.map.map.objects) //.map field of this.map is the .json tilemap
    this.gameManager.setup();
  }
}
