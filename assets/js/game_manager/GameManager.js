class GameManager {
    constructor(scene, mapData){
        this.scene = scene;
        this.mapData = mapData;

        this.spawners = {};
        this.chests = {};

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
                    this.playerLocations.push([obj.x, obj.y])
                });
            }else if (layer.name == 'chest_locations'){
                layer.objects.forEach((obj) => {
                    // dictionary logic, if exists - add to entry; if dne - add to dic
                    // using custom properties.spawner field for key
                    if (this.chestLocations[obj.properties.spawner]){
                        this.chestLocations[obj.properties.spawner].push([obj.x, obj.y]);
                    } else {
                        this.chestLocations[obj.properties.spawner] = [[obj.x, obj.y]]
                    }
                });
            }else if (layer.name == 'monster_locations'){
                layer.objects.forEach((obj) => {
                    // dictionary logic, if exists - add to entry; if dne - add to dic
                    // using custom properties.spawner field for key
                    if (this.monsterLocations[obj.properties.spawner]){
                        this.monsterLocations[obj.properties.spawner].push([obj.x, obj.y]);
                    } else {
                        this.monsterLocations[obj.properties.spawner] = [[obj.x, obj.y]]
                    }
                });
            }
        });
        //console.log(this.playerLocations);
        //console.log(this.monsterLocations);
        //console.log(this.chestLocations);
    }

    setupEventListeners(){

    }

    setupSpawners(){

    }
    spawnPlayer(){
        const location = this.playerLocations[Math.floor(Math.random() * this.playerLocations.length)];
        this.scene.events.emit('spawnPlayer', location);
    }
}