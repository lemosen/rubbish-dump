// src/services/movement.ts

import { Character } from "../components/character";
import { Player } from "../components/player";
import { Direction } from "../utils/direction";
import { Obstacle } from "../utils/obstacle";

export class MovementService {
    constructor() {}

    move(character: Character, direction: Direction): void {
        switch (direction) {
            case Direction.Up:
                character.y -= character.speed;
                break;
            case Direction.Down:
                character.y += character.speed;
                break;
            case Direction.Left:
                character.x -= character.speed;
                break;
            case Direction.Right:
                character.x += character.speed;
                break;
        }
    }

    checkCollision(character: Character | { x: number; y: number; width: number; height: number }, obstacles: Obstacle[] | Player[]): boolean {
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
}
