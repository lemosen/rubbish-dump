// src/services/combat.ts

import { Character } from "../components/character";
import { Item } from "../components/item";
import { Player } from "../components/player";

export class CombatService {
    constructor() {}

    attack(attacker: Character, defender: Character): boolean {
        const hitChance = Math.random() * 100; // 命中几率，取值范围为 0 到 100
        if (hitChance > 50) {
            // 攻击命中
            const damage = attacker.attackPower - defender.defense; // 计算伤害值
            defender.health -= damage;
            if (defender.health <= 0) {
                defender.isAlive = false;
            }
            return true;
        } else {
            // 攻击未命中
            return false;
        }
    }

    defend(defender: Character, attacker: Character): void {
        defender.defense *= 2;
        this.attack(attacker, defender);
        defender.defense /= 2;
    }

    interact(player: Player, item: Item): void {
        if (item.isConsumable) {
            player.health += item.healthPoints;
            if (player.health > player.maxHealth) {
                player.health = player.maxHealth;
            }
            item.isAlive = false;
        }
    }
}
