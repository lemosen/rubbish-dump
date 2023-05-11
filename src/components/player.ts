import { Character } from "./character";
import { Enemy } from "./enemy";
import { spriteSheet, SPRITE_MAP } from "../utils/sprite";

export class Bullet {
    public x: number;
    public y: number;
    public speed: number;
    public directionX: number;
    public directionY: number;
    public size: number;
    public isDestroy: boolean;
    angle: number = 0;
    radius: number = 100;

    constructor(x: number, y: number, speed: number, directionX: number, directionY: number, size: number = 5) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.isDestroy = false;
    }

    draw(ctx: CanvasRenderingContext2D | null | undefined, relativePosition: { x: number; y: number }, spriteSheet: HTMLImageElement): void {
        const sprite = SPRITE_MAP["bullet"];
        const frameX = sprite.x;
        const frameY = sprite.y;
        const frameWidth = sprite.width;
        const frameHeight = sprite.height;
        ctx?.save();
        ctx?.translate(this.x + relativePosition.x, this.y + relativePosition.y);
        const angle = Math.atan2(this.directionY, this.directionX);
        ctx?.rotate(Math.PI / 2 + angle);
        ctx?.drawImage(spriteSheet, frameX, frameY, frameWidth, frameHeight, -this.size / 2, -this.size / 2, this.size + 10, this.size + 10);
        ctx?.restore();
    }

    update(target: Enemy, deltaTime: number): void {
        // 计算新的角度
        const angle = this.angle + this.speed;
        this.angle = angle;

        const directionX = target.x + target.width / 2 - this.x;
        const directionY = target.y + target.height / 2 - this.y;
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        this.directionX = directionX / length;
        this.directionY = directionY / length;
        console.log(this);
        // 更新位置
        this.x += this.speed * this.directionX * deltaTime;
        this.y += this.speed * this.directionY * deltaTime;
    }
}

export class Player extends Character {
    public directionX: number = 0;
    public directionY: number = 0;
    public isMoving: boolean = false;
    public isAttacking: boolean = true;
    public isDefending: boolean = false;
    public isInteracting: boolean = false;
    public bullets: Bullet[] = [];
    score: number;
    attackSpeed: number = 400;
    lastShotTime: number = 0;
    sword: Bullet;

    constructor(x: number, y: number, width: number, height: number, speed: number, maxHealth: number, health: number = maxHealth, attack: number = 10, defense: number = 5, isAlive: boolean = true) {
        super(x, y, width, height, speed, maxHealth, health, attack, defense, isAlive);
        this.score = 0;
        this.sword = new Bullet(x, y, 10, 0, 1, 5);
    }

    shoot(target: Enemy | null) {
        if (target) {
            this.sword.update(target, 1);

            const currentTime = Date.now();
            if (currentTime - this.lastShotTime < this.attackSpeed) {
                return;
            }
            const bulletSpeed = 10;
            const bulletSize = 5;
            const bulletX = this.x + this.width / 2 - bulletSize;
            const bulletY = this.y + this.height / 2 - bulletSize;

            // 计算方向向量
            const directionX = target.x + target.width / 2 - bulletX;
            const directionY = target.y + target.height / 2 - bulletY;
            const length = Math.sqrt(directionX * directionX + directionY * directionY);
            const normalizedDirectionX = directionX / length;
            const normalizedDirectionY = directionY / length;

            const bullet = new Bullet(bulletX, bulletY, bulletSpeed, normalizedDirectionX, normalizedDirectionY);
            this.bullets.push(bullet);
            this.lastShotTime = currentTime;
        }
    }

    draw(ctx: CanvasRenderingContext2D | null | undefined, relativePosition: { x: number; y: number }): void {
        const sprite = SPRITE_MAP["player"];
        const frameX = sprite.x;
        const frameY = sprite.y;
        const frameWidth = sprite.width;
        const frameHeight = sprite.height;
        ctx?.drawImage(spriteSheet, frameX, frameY, frameWidth, frameHeight, this.x + relativePosition.x, this.y + relativePosition.y, this.width, this.height);
        // 绘制子弹
        this.bullets.forEach((bullet) => {
            bullet.draw(ctx, relativePosition, spriteSheet);
        });
        this.sword.draw(ctx, relativePosition, spriteSheet);
    }

    findClosestEnemy(enemies: Enemy[]): Enemy | null {
        let closestEnemy: Enemy | null = null;
        let closestDistance = Infinity;

        enemies.forEach((enemy) => {
            if (enemy.isAlive) {
                const distance = Math.sqrt(Math.pow(this.x - enemy.x, 2) + Math.pow(this.y - enemy.y, 2));
                if (distance < closestDistance) {
                    closestEnemy = enemy;
                    closestDistance = distance;
                }
            }
        });

        return closestEnemy;
    }
}
