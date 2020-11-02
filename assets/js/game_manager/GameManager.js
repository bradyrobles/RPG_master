class GameManager {
    constructor(scene, mapData){
        this.scene = scene; //'GameScene'
        this.mapData = mapData;

        this.spawners = {};
        this.chests = {};
        this.monsters = {};

        this.playerLocations = [];
        this.chestLocations = {}; // chests need a key associated with [x,y]
        this.monsterLocations = {};

    }

    setup(){
        this.parseMapData();
        this.setupEventListeners();
        this.setupSpawners();
        this.spawnPlayer();
    }

    parseMapData(){
        console.log(this.mapData)
        // var layer 
        this.mapData.forEach((layer) => {
            if (layer.name == 'player_locations'){
                // capture x and y coords from each object in player_locations
                layer.objects.forEach((obj) => {
                    this.playerLocations.push([obj.x + (obj.width / 2), obj.y - (obj.height / 2)])
                });
            }else if (layer.name == 'chest_locations'){
                layer.objects.forEach((obj) => {
                    // dictionary logic, if exists - add to entry; if dne - add to dic
                    // using custom properties.spawner field for key
                    if (this.chestLocations[obj.properties.spawner]){
                        this.chestLocations[obj.properties.spawner].push([obj.x + (obj.width / 2), obj.y - (obj.height / 2)]);
                    } else {
                        this.chestLocations[obj.properties.spawner] = [[obj.x + (obj.width / 2), obj.y - (obj.height / 2)]];
                    }
                });
            }else if (layer.name == 'monster_locations'){
                layer.objects.forEach((obj) => {
                    // dictionary logic, if exists - add to entry; if dne - add to dic
                    // using custom properties.spawner field for key
                    if (this.monsterLocations[obj.properties.spawner]){
                        this.monsterLocations[obj.properties.spawner].push([obj.x + (obj.width / 2), obj.y - (obj.height / 2)]);
                    } else {
                        this.monsterLocations[obj.properties.spawner] = [[obj.x + (obj.width / 2), obj.y - (obj.height / 2)]];
                    }
                });
            }
        });
        //console.log(this.playerLocations);
        //console.log(this.monsterLocations);
        //console.log(this.chestLocations);
    }

    setupSpawners(){
        const config = {
            spawnInterval: 3000,
            limit: 3,
            id: ``,
        };
        let spawner;
        // create chest spawners
        Object.keys(this.chestLocations).forEach((key) => {
            config.id = `chest-${key}`;
            config.spawnerType = SpawnerType.CHEST;
            spawner = new Spawner(
                config, 
                this.chestLocations[key], 
                this.addChest.bind(this), // allows Spawner to call addObject, redirect to addChest
                this.deleteChest.bind(this), // allows Spawner to call deleteObject, "" 
            );
            this.spawners[spawner.id] = spawner; // adds spawner_id: spawner object to spawner dict
        });

        // create monster spawners
        Object.keys(this.monsterLocations).forEach((key) => {
            config.id = `monster-${key}`;
            config.spawnerType = SpawnerType.MONSTER;
            spawner = new Spawner(
                config, 
                this.monsterLocations[key], 
                this.addMonster.bind(this), // allows Spawner to call addObject, redirect to addChest
                this.deleteMonster.bind(this), // allows Spawner to call deleteObject, "" 
            );
            this.spawners[spawner.id] = spawner; // adds spawner_id: spawner object to spawner dict
        });
        
    }
    spawnPlayer(){
        const location = this.playerLocations[Math.floor(Math.random() * this.playerLocations.length)];
        this.scene.events.emit('spawnPlayer', location); // emit event for parent scene 
    }

    setupEventListeners(){
        this.scene.events.on('pickupChest', (chestID) => {
            //update the spawner
            if (this.chests[chestID]){
                this.spawners[this.chests[chestID].spawnerID].removeObject(chestID);
            }
        })
    }

    addChest(chestID, chest){
        this.chests[chestID] = chest; // adds chestID: chest object to chest dict
        this.scene.events.emit('chestSpawned', chest); // emit event for parent scene

    }
    deleteChest(chestID){
        delete this.chests[chestID]; // deletes entry in chest dict
    }

    addMonster(monsterID, monster){
        this.monsters[monsterID] = monster; // adds monsterID: monster object to monster dict
        this.scene.events.emit('monsterSpawned', monster); // emit event for parent scene
    }
    deleteMonster(monsterID){
        delete this.monsters[monsterID];
    }
}