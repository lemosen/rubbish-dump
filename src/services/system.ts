import { Player } from "../components/player";
import { Enemy } from "../components/enemy";
import { Item } from "../components/item";
import { MovementService } from "../services/movement";
import { Obstacle } from "../utils/obstacle";

class EnemyGenerator {
    generateEnemy(playerPosition: [number, number], spawnRadius: number = 2000): Enemy {
        const enemyDistance = spawnRadius + Math.random() * 100;
        const enemyAngle = Math.random() * Math.PI * 2;
        const spawnX = playerPosition[0] + Math.cos(enemyAngle) * enemyDistance;
        const spawnY = playerPosition[1] + Math.sin(enemyAngle) * enemyDistance;
        const width = 50;
        const height = 50;
        const speed = Math.floor(Math.random() * 2) + 1;
        const health = Math.floor(Math.random() * 100) + 50;

        return new Enemy(spawnX, spawnY, width, height, speed, health);
    }
}

export class System {
    player!: Player;
    portal1!: Item;
    portal2!: Item;
    enemyGenerator!: EnemyGenerator;
    enemies!: Enemy[];
    obstacles!: Obstacle[];
    movementService!: MovementService;
    constructor() {
        this.init();
    }
    calculate() {
        // 检查是否需要生成新的敌人
        if (this.enemies.filter((e) => e.isAlive).length < 200) {
            const newEnemy = this.enemyGenerator.generateEnemy([this.player.x, this.player.y]);
            this.enemies.push(newEnemy);
        }
        this.player.score = this.enemies.filter((e) => !e.isAlive).length;
        // 传送门
        if (this.movementService.checkCollision(this.portal1, [this.player])) {
            this.player.x = this.portal2.x - 50;
            this.player.y = this.portal2.y;
        }
        if (this.movementService.checkCollision(this.portal2, [this.player])) {
            this.player.x = this.portal1.x + 50;
            this.player.y = this.portal1.y;
        }

        // 处理玩家输入
        if (this.player.isAlive) {
            if (this.player.isMoving) {
                this.player.move(this.player.directionX, this.player.directionY, this.obstacles);
            }

            if (this.player.isAttacking) {
                const enemy = this.player.findClosestEnemy(this.enemies);
                // player.attack(enemy, relativePosition);
                this.player.shoot(enemy);
            }

            this.player.bullets = this.player.bullets.filter((bullet) => !bullet.isDestroy);

            // 更新子弹位置
            this.player.bullets.forEach((bullet) => {
                bullet.x += bullet.speed * bullet.directionX;
                bullet.y += bullet.speed * bullet.directionY;

                // 移除超出画布范围的子弹
                if (bullet.x < this.player.x - 1500 || bullet.y < this.player.y - 1500 || bullet.x > this.player.x + 1500 || bullet.y > this.player.y + 1500) {
                    // player.bullets.splice(player.bullets.indexOf(bullet), 1);
                    bullet.isDestroy = true;
                }

                // 检测子弹是否击中敌人
                this.enemies.forEach((enemy) => {
                    if (bullet.x >= enemy.x && bullet.x <= enemy.x + enemy.width && bullet.y >= enemy.y && bullet.y <= enemy.y + enemy.height) {
                        const damage = this.player.attackPower - enemy.defense;
                        enemy.health -= damage;
                        // bullet.isDestroy = true;
                        // player.bullets.splice(player.bullets.indexOf(bullet), 1);
                        if (enemy.health <= 0) {
                            enemy.isAlive = false;
                        }
                    }
                    if (this.player.sword.x >= enemy.x && this.player.sword.x <= enemy.x + enemy.width && this.player.sword.y >= enemy.y && this.player.sword.y <= enemy.y + enemy.height) {
                        const damage = this.player.attackPower - enemy.defense;
                        enemy.health -= damage;
                        // bullet.isDestroy = true;
                        // player.bullets.splice(player.bullets.indexOf(bullet), 1);
                        if (enemy.health <= 0) {
                            enemy.isAlive = false;
                        }
                    }
                });
            });

            if (this.player.isDefending) {
                this.player.defend();
            }

            if (this.player.isInteracting) {
                // 处理玩家与物品的交互
            }
        }
        this.enemies.forEach((enemy) => {
            // 处理敌人 AI
            if (enemy.isAlive) {
                enemy.updateDirection(this.player, this.obstacles);
                enemy.move(enemy.directionX, enemy.directionY, this.obstacles);
                if (Math.abs(this.player.x - enemy.x) < 30 && Math.abs(this.player.y - enemy.y) < 30) {
                    enemy.attack(this.player);
                }
            }
        });
    }
    init() {
        // 初始化游戏场景和角色
        this.player = new Player(1000, 1000, 50, 50, 5, 100);
        this.portal1 = new Item(0, 150, 50, 50, 10, true);
        this.portal2 = new Item(750, 150, 50, 50, 10, true);
        this.enemyGenerator = new EnemyGenerator();
        this.enemies = [];

        this.movementService = new MovementService();

        // 初始化障碍物列表
        this.obstacles = [];
    }
}
