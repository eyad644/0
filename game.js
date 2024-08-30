const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainScene]
};

const game = new Phaser.Game(config);

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.player;
        this.cursors;
        this.enemies = [];
        this.level = 1;
        this.health = 100;
        this.maxHealth = 100;
        this.weapons = ['sword', 'pistol', 'rifle'];
        this.currentWeaponIndex = 0;
        this.inventory = ['sword'];
    }

    preload() {
        // تحميل الصور والأصول
        this.load.image('player', 'assets/player.png');
        this.load.image('smallEnemy', 'assets/small_enemy.png');
        this.load.image('bigEnemy', 'assets/big_enemy.png');
    }

    create() {
        // إعداد اللاعب
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.cursors = this.input.keyboard.createCursorKeys();

        // إعداد الأعداء للمستوى الأول
        this.loadLevel(this.level);

        // إعداد مفتاح تبديل السلاح
        this.input.keyboard.on('keydown-W', () => this.switchWeapon());
    }

    update() {
        // تحكم بحركة اللاعب
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
        } else {
            this.player.setVelocityY(0);
        }

        // منطق الهجوم
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.attack();
        }
    }

    loadLevel(level) {
        // تفريغ الأعداء من المرحلة السابقة
        this.enemies.forEach(enemy => enemy.destroy());
        this.enemies = [];

        // إعداد المرحلة بناءً على المستوى الحالي
        let smallEnemies = level < 5 ? 10 : 50;
        let bigEnemies = level < 5 ? 1 : 3;

        this.spawnEnemies(smallEnemies, 'smallEnemy');
        this.spawnEnemies(bigEnemies, 'bigEnemy', true);
    }

    spawnEnemies(count, type, isBig = false) {
        for (let i = 0; i < count; i++) {
            let x = Phaser.Math.Between(0, 800);
            let y = Phaser.Math.Between(0, 600);
            let enemy = this.physics.add.sprite(x, y, type);
            enemy.isBig = isBig;
            enemy.health = isBig ? 100 : 25;
            enemy.damage = isBig ? 25 : 10;
            this.enemies.push(enemy);

            this.physics.add.collider(this.player, enemy, () => {
                this.takeDamage(enemy.damage);
                this.checkEnemyDeath(enemy);
            });
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.scene.restart();
        }
    }

    checkEnemyDeath(enemy) {
        enemy.health -= 50;  // افتراض أن اللاعب يسبب ضررًا بقيمة 50
        if (enemy.health <= 0) {
            enemy.destroy();
            this.health = Math.min(this.maxHealth, this.health + 20);  // شفاء اللاعب بعد كل قتل
        }
    }

    switchWeapon() {
        this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.inventory.length;
        console.log("Current weapon:", this.inventory[this.currentWeaponIndex]);
    }

    attack() {
        console.log("Attacking with", this.inventory[this.currentWeaponIndex]);
        // يمكن تحسين منطق الهجوم حسب نوع السلاح
    }
}
