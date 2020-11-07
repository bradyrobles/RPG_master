

class PlayerContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, frame) {
      super(scene, x, y);
      this.scene = scene; // the scene this container will be added to
      this.velocity = 300; // the velocity when moving our player
      this.currentDir = Direction.RIGHT;
      this.playerAttacking = false;
      this.flipX = true;
      this.weaponHit = false;

      // set a size on the container
      this.setSize(64, 64);
      // enable physics
      this.scene.physics.world.enable(this);
      // collide with world bounds
      this.body.setCollideWorldBounds(true);
      // add the player container to our existing scene
      this.scene.add.existing(this);
      // let camera follow player
      this.scene.cameras.main.startFollow(this);

      // create the player at (0,0) in the container
      this.player = new Player(this.scene, 0, 0, key, frame);
      this.add(this.player);

      // create the weapon game object
      this.weapon = this.scene.add.image(40, 0, 'items', 4);
      this.scene.add.existing(this.weapon);
      this.weapon.setScale(1.5);
      this.scene.physics.world.enable(this.weapon);
      this.add(this.weapon);
      this.weapon.alpha = 0; // 0: only shown when player swinging, 1: always show
    }
  
    update(cursors) {
      this.body.setVelocity(0);
      
  
      if (cursors.left.isDown) {
        this.body.setVelocityX(-this.velocity);
        this.currentDir = Direction.LEFT;
        this.weapon.setPosition(-40, 0)
      } else if (cursors.right.isDown) {
        this.body.setVelocityX(this.velocity);
        this.currentDir = Direction.RIGHT;
        this.weapon.setPosition(40, 0)
      }
  
      if (cursors.up.isDown) {
        this.body.setVelocityY(-this.velocity);
        this.currentDir = Direction.UP;
        this.weapon.setPosition(0, -40)

      } else if (cursors.down.isDown) {
        this.body.setVelocityY(this.velocity);
        this.currentDir = Direction.DOWN;
        this.weapon.setPosition(0, 40)
      }

      if (Phaser.Input.Keyboard.JustDown(cursors.space) && !this.playerAttacking){
        this.weapon.alpha = 1; // make weapon visible
        this.playerAttacking = true;

        // delay call to give weapon time to hit
        this.scene.time.delayedCall(150, () => {
          this.weapon.alpha = 0;
          this.playerAttacking = false;
          this.swordHit = false;
        }, [], this);
      }

      // change angle of weapon when moving in a direction
      if (this.playerAttacking){
        if (this.weapon.flipX){
          this.weapon.angle -= 10;
        } else {
          this.weapon.angle += 10;
        }
      }else{
        if (this.currentDir === Direction.DOWN){
          this.weapon.setAngle(90); 
        } else if (this.currentDir === Direction.UP){
          this.weapon.setAngle(-90);
        } else{
          this.weapon.setAngle(0);
        }

        this.weapon.flipX = false;
        if (this.currentDir === Direction.LEFT){
          this.weapon.flipX = true;
        }
      }
    }
  }
  