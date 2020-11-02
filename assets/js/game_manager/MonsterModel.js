class MonsterModel {
    constructor(x, y, gold, spawnerID, frame, health, attackV){
        this.id = `${spawnerID}-${uuid.v4()}`;
        this.spawnerID = spawnerID;
        this.x = x;
        this.y = y;
        this.gold = gold;
        this.frame = frame;
        this.health = health;
        this.maxHealth = health;
        this.attackV = attackV;
    }
}