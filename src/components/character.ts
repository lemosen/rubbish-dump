import { CombatService } from "../services/combat";
import { MovementService } from "../services/movement";
import { Direction } from "../utils/direction";
import { Obstacle } from "../utils/obstacle";
// 初始化游戏服务
const combatService = new CombatService();
const movementService = new MovementService();
const minDistanceToObstacle = 10;
export abstract class Character {
    constructor(public x: number, public y: number, public width: number, public height: number, public speed: number, public maxHealth: number, public health: number = maxHealth, public attackPower: number = 10, public defense: number = 5, public isAlive: boolean = true) {}

    abstract draw(ctx: CanvasRenderingContext2D | null | undefined, relativePosition: { x: number; y: number }): void;

    drawHealthBar(ctx: CanvasRenderingContext2D | null | undefined, x: number, y: number, width: number, height: number, health: number, maxHealth: number) {
        const barHeight = 10;
        const barWidth = width;
        const barX = x;
        const barY = y - barHeight;

        // 绘制背景矩形
        ctx!.fillStyle = "#000";
        ctx?.fillRect(barX, barY, barWidth, barHeight);

        // 绘制进度条
        const progressWidth = barWidth * (health / maxHealth);
        ctx!.fillStyle = "#f00";
        ctx?.fillRect(barX, barY, progressWidth, barHeight);
    }

    move(directionX: number, directionY: number, obstacles: Obstacle[]): void {
        const futureX = this.x + this.speed * directionX;
        const futureY = this.y + this.speed * directionY;

        if (!movementService.checkCollision({ x: futureX, y: futureY, width: this.width, height: this.height }, obstacles)) {
            if (!movementService.checkCollision(this, obstacles)) {
                this.x = futureX;
                this.y = futureY;
            } else {
                const distance = movementService.calculateDistance(this, obstacles[0]);

                if (distance >= minDistanceToObstacle) {
                    this.x = futureX;
                    this.y = futureY;
                }
            }
        }
    }

    attack(target: Character | null) {
        if (target) {
            const isHit = combatService.attack(this, target);
            if (isHit) {
                target.health -= this.attackPower - target.defense;
                if (target.health <= 0) {
                    target.isAlive = false;
                }
            }
        }
    }

    defend(): void {
        this.defense *= 2;
    }

    checkCollision(character: Character | { x: number; y: number; width: number; height: number }, obstacles: Obstacle[]): boolean {
        const futureX = character.x + character.width;
        const futureY = character.y + character.height;

        for (const obstacle of obstacles) {
            if (futureX > obstacle.x && character.x < obstacle.x + obstacle.width && futureY > obstacle.y && character.y < obstacle.y + obstacle.height) {
                return true;
            }
        }

        return false;
    }
    calculateDistance(object1: { x: number; y: number }, object2: { x: number; y: number }): number {
        const dx = object1.x - object2.x;
        const dy = object1.y - object2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 其他属性和方法
}
