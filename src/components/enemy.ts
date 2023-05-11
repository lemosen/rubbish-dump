import { Character } from "./character";
import { MovementService } from "../services/movement";
import { Obstacle } from "../utils/obstacle";
import { spriteSheet, SPRITE_MAP } from "../utils/sprite";

// 初始化游戏服务
const movementService = new MovementService();

export class Enemy extends Character {
    public directionX: number = 0;
    public directionY: number = 0;

    constructor(x: number, y: number, width: number, height: number, speed: number, maxHealth: number, health: number = maxHealth, attack: number = 8, defense: number = 3, isAlive: boolean = true) {
        super(x, y, width, height, speed, maxHealth, health, attack, defense, isAlive);
    }

    draw(ctx: CanvasRenderingContext2D | null | undefined, relativePosition: { x: number; y: number }): void {
        const sprite = SPRITE_MAP["enemy"];
        const frameX = sprite.x;
        const frameY = sprite.y;
        const frameWidth = sprite.width;
        const frameHeight = sprite.height;
        ctx?.drawImage(spriteSheet, frameX, frameY, frameWidth, frameHeight, this.x + relativePosition.x, this.y + relativePosition.y, this.width, this.height);
        this.drawHealthBar(ctx, this.x + relativePosition.x, this.y + relativePosition.y + this.height + 15, this.width, 20, this.health, this.maxHealth);
    }

    update(): void {
        // Update the enemy's position based on its direction and speed
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;
    }

    setTargetPosition(targetX: number, targetY: number): void {
        // Set the enemy's direction based on its distance from the target position
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);

        if (distance > 0) {
            this.directionX = dx / distance;
            this.directionY = dy / distance;
        }
    }

    updateDirection(player: Character, obstacles: Obstacle[]): void {
        const dx = player.x - this.x;
        const dy = player.y - this.y;

        // Check whether the player is to the left or right of the enemy
        if (dx < 0 && !this.isObstacleOnLeft(obstacles)) {
            this.directionX = -1;
        } else if (dx > 0 && !this.isObstacleOnRight(obstacles)) {
            this.directionX = 1;
        } else {
            this.directionX = 0;
        }

        // Check whether the player is above or below the enemy
        if (dy < 0 && !this.isObstacleOnTop(obstacles)) {
            this.directionY = -1;
        } else if (dy > 0 && !this.isObstacleOnBottom(obstacles)) {
            this.directionY = 1;
        } else {
            this.directionY = 0;
        }
    }

    isObstacleOnLeft(obstacles: Obstacle[]): boolean {
        return obstacles.some((obstacle) => obstacle.x + obstacle.width === this.x && obstacle.y < this.y + this.height && obstacle.y + obstacle.height > this.y);
    }

    isObstacleOnRight(obstacles: Obstacle[]): boolean {
        return obstacles.some((obstacle) => obstacle.x === this.x + this.width && obstacle.y < this.y + this.height && obstacle.y + obstacle.height > this.y);
    }

    isObstacleOnTop(obstacles: Obstacle[]): boolean {
        return obstacles.some((obstacle) => obstacle.y + obstacle.height === this.y && obstacle.x < this.x + this.width && obstacle.x + obstacle.width > this.x);
    }
    isObstacleOnBottom(obstacles: Obstacle[]): boolean {
        return obstacles.some((obstacle) => obstacle.y === this.y + this.height && obstacle.x < this.x + this.width && obstacle.x + obstacle.width > this.x);
    }

    findPath(start: { x: number; y: number }, end: { x: number; y: number }, obstacles: Obstacle[]): Node[] {
        const openList: Node[] = [new Node(start.x, start.y, 0)];
        const closedList: Node[] = [];
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        gScore.set(`${start.x},${start.y}`, 0);
        fScore.set(`${start.x},${start.y}`, this.calculateDistance(start, end));

        while (openList.length > 0) {
            const current = openList.reduce((min, node) => (fScore.get(`${node.x},${node.y}`) ?? Infinity < fScore.get(`${min.x},${min.y}`) ?? Infinity ? node : min), openList[0]);
            console.log(current);
            if (current.x === end.x && current.y === end.y) {
                const path = [current];

                while (cameFrom.has(`${path[0].x},${path[0].y}`)) {
                    path.unshift(cameFrom.get(`${path[0].x},${path[0].y}`));
                }

                return path;
            }

            openList.splice(openList.indexOf(current), 1);
            closedList.push(current);

            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) {
                        continue;
                    }

                    const neighbor = new Node(current.x + dx, current.y + dy, current.cost + 1);

                    if (movementService.checkCollision({ x: neighbor.x, y: neighbor.y, width: this.width, height: this.height }, obstacles) || closedList.some((node) => node.x === neighbor.x && node.y === neighbor.y)) {
                        continue;
                    }

                    const tentativeGScore = (gScore.get(`${current.x},${current.y}`) ?? Infinity) + 1;

                    if (!openList.some((node) => node.x === neighbor.x && node.y === neighbor.y)) {
                        openList.push(neighbor);
                    } else if (tentativeGScore >= (gScore.get(`${neighbor.x},${neighbor.y}`) ?? Infinity)) {
                        continue;
                    }

                    cameFrom.set(`${neighbor.x},${neighbor.y}`, current);
                    gScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore);
                    fScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore + this.calculateDistance(neighbor, end));
                }
            }
        }

        return [];
    }
}
class Node {
    public x: number;
    public y: number;
    public cost: number;

    constructor(x: number, y: number, cost: number) {
        this.x = x;
        this.y = y;
        this.cost = cost;
    }
}
