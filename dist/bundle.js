/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/character.ts":
/*!*************************************!*\
  !*** ./src/components/character.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Character\": () => (/* binding */ Character)\n/* harmony export */ });\n/* harmony import */ var _services_combat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/combat */ \"./src/services/combat.ts\");\n/* harmony import */ var _services_movement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/movement */ \"./src/services/movement.ts\");\n\n\n// 初始化游戏服务\nconst combatService = new _services_combat__WEBPACK_IMPORTED_MODULE_0__.CombatService();\nconst movementService = new _services_movement__WEBPACK_IMPORTED_MODULE_1__.MovementService();\nconst minDistanceToObstacle = 10;\nclass Character {\n    constructor(x, y, width, height, speed, maxHealth, health = maxHealth, attackPower = 10, defense = 5, isAlive = true) {\n        this.x = x;\n        this.y = y;\n        this.width = width;\n        this.height = height;\n        this.speed = speed;\n        this.maxHealth = maxHealth;\n        this.health = health;\n        this.attackPower = attackPower;\n        this.defense = defense;\n        this.isAlive = isAlive;\n    }\n    move(directionX, directionY, obstacles) {\n        const futureX = this.x + this.speed * directionX;\n        const futureY = this.y + this.speed * directionY;\n        if (!movementService.checkCollision({ x: futureX, y: futureY, width: this.width, height: this.height }, obstacles)) {\n            if (!movementService.checkCollision(this, obstacles)) {\n                this.x = futureX;\n                this.y = futureY;\n            }\n            else {\n                const distance = movementService.calculateDistance(this, obstacles[0]);\n                if (distance >= minDistanceToObstacle) {\n                    this.x = futureX;\n                    this.y = futureY;\n                }\n            }\n        }\n    }\n    attack(target) {\n        if (target === null) {\n            return;\n        }\n        const damage = this.attackPower - target.defense;\n        target.health -= damage;\n        if (target.health <= 0) {\n            target.health = 0;\n            target.isAlive = false;\n        }\n    }\n    defend() {\n        this.defense *= 2;\n    }\n    checkCollision(character, obstacles) {\n        const futureX = character.x + character.width;\n        const futureY = character.y + character.height;\n        for (const obstacle of obstacles) {\n            if (futureX > obstacle.x && character.x < obstacle.x + obstacle.width && futureY > obstacle.y && character.y < obstacle.y + obstacle.height) {\n                return true;\n            }\n        }\n        return false;\n    }\n    calculateDistance(object1, object2) {\n        const dx = object1.x - object2.x;\n        const dy = object1.y - object2.y;\n        return Math.sqrt(dx * dx + dy * dy);\n    }\n}\n\n\n//# sourceURL=webpack://vampire-survivor/./src/components/character.ts?");

/***/ }),

/***/ "./src/components/enemy.ts":
/*!*********************************!*\
  !*** ./src/components/enemy.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Enemy\": () => (/* binding */ Enemy)\n/* harmony export */ });\n/* harmony import */ var _character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./character */ \"./src/components/character.ts\");\n/* harmony import */ var _services_combat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/combat */ \"./src/services/combat.ts\");\n/* harmony import */ var _services_movement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/movement */ \"./src/services/movement.ts\");\n\n\n\n// 初始化游戏服务\nconst combatService = new _services_combat__WEBPACK_IMPORTED_MODULE_1__.CombatService();\nconst movementService = new _services_movement__WEBPACK_IMPORTED_MODULE_2__.MovementService();\nconst TILE_SIZE = 50;\nclass Enemy extends _character__WEBPACK_IMPORTED_MODULE_0__.Character {\n    constructor(x, y, width, height, speed, maxHealth, health = maxHealth, attack = 8, defense = 3, isAlive = true) {\n        super(x, y, width, height, speed, maxHealth, health, attack, defense, isAlive);\n        this.directionX = 0;\n        this.directionY = 0;\n    }\n    draw(ctx) {\n        ctx.fillStyle = \"red\";\n        ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(this.x, this.y, this.width, this.height);\n    }\n    update() {\n        // Update the enemy's position based on its direction and speed\n        this.x += this.directionX * this.speed;\n        this.y += this.directionY * this.speed;\n    }\n    setTargetPosition(targetX, targetY) {\n        // Set the enemy's direction based on its distance from the target position\n        const dx = targetX - this.x;\n        const dy = targetY - this.y;\n        const distance = Math.sqrt(dx ** 2 + dy ** 2);\n        if (distance > 0) {\n            this.directionX = dx / distance;\n            this.directionY = dy / distance;\n        }\n    }\n    updateDirection(player, obstacles) {\n        const dx = player.x - this.x;\n        const dy = player.y - this.y;\n        // Check whether the player is to the left or right of the enemy\n        if (dx < 0 && !this.isObstacleOnLeft(obstacles)) {\n            this.directionX = -1;\n        }\n        else if (dx > 0 && !this.isObstacleOnRight(obstacles)) {\n            this.directionX = 1;\n        }\n        else {\n            this.directionX = 0;\n        }\n        // Check whether the player is above or below the enemy\n        if (dy < 0 && !this.isObstacleOnTop(obstacles)) {\n            this.directionY = -1;\n        }\n        else if (dy > 0 && !this.isObstacleOnBottom(obstacles)) {\n            this.directionY = 1;\n        }\n        else {\n            this.directionY = 0;\n        }\n    }\n    isObstacleOnLeft(obstacles) {\n        return obstacles.some((obstacle) => obstacle.x + obstacle.width === this.x && obstacle.y < this.y + this.height && obstacle.y + obstacle.height > this.y);\n    }\n    isObstacleOnRight(obstacles) {\n        return obstacles.some((obstacle) => obstacle.x === this.x + this.width && obstacle.y < this.y + this.height && obstacle.y + obstacle.height > this.y);\n    }\n    isObstacleOnTop(obstacles) {\n        return obstacles.some((obstacle) => obstacle.y + obstacle.height === this.y && obstacle.x < this.x + this.width && obstacle.x + obstacle.width > this.x);\n    }\n    isObstacleOnBottom(obstacles) {\n        return obstacles.some((obstacle) => obstacle.y === this.y + this.height && obstacle.x < this.x + this.width && obstacle.x + obstacle.width > this.x);\n    }\n    findPath(start, end, obstacles) {\n        var _a, _b;\n        const openList = [new Node(start.x, start.y, 0)];\n        const closedList = [];\n        const cameFrom = new Map();\n        const gScore = new Map();\n        const fScore = new Map();\n        gScore.set(`${start.x},${start.y}`, 0);\n        fScore.set(`${start.x},${start.y}`, this.calculateDistance(start, end));\n        while (openList.length > 0) {\n            const current = openList.reduce((min, node) => { var _a, _b; return (((_b = (_a = fScore.get(`${node.x},${node.y}`)) !== null && _a !== void 0 ? _a : Infinity < fScore.get(`${min.x},${min.y}`)) !== null && _b !== void 0 ? _b : Infinity) ? node : min); }, openList[0]);\n            console.log(current);\n            if (current.x === end.x && current.y === end.y) {\n                const path = [current];\n                while (cameFrom.has(`${path[0].x},${path[0].y}`)) {\n                    path.unshift(cameFrom.get(`${path[0].x},${path[0].y}`));\n                }\n                return path;\n            }\n            openList.splice(openList.indexOf(current), 1);\n            closedList.push(current);\n            for (let dx = -1; dx <= 1; dx++) {\n                for (let dy = -1; dy <= 1; dy++) {\n                    if (dx === 0 && dy === 0) {\n                        continue;\n                    }\n                    const neighbor = new Node(current.x + dx, current.y + dy, current.cost + 1);\n                    if (movementService.checkCollision({ x: neighbor.x, y: neighbor.y, width: this.width, height: this.height }, obstacles) || closedList.some((node) => node.x === neighbor.x && node.y === neighbor.y)) {\n                        continue;\n                    }\n                    const tentativeGScore = ((_a = gScore.get(`${current.x},${current.y}`)) !== null && _a !== void 0 ? _a : Infinity) + 1;\n                    if (!openList.some((node) => node.x === neighbor.x && node.y === neighbor.y)) {\n                        openList.push(neighbor);\n                    }\n                    else if (tentativeGScore >= ((_b = gScore.get(`${neighbor.x},${neighbor.y}`)) !== null && _b !== void 0 ? _b : Infinity)) {\n                        continue;\n                    }\n                    cameFrom.set(`${neighbor.x},${neighbor.y}`, current);\n                    gScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore);\n                    fScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore + this.calculateDistance(neighbor, end));\n                }\n            }\n        }\n        return [];\n    }\n}\nclass Node {\n    constructor(x, y, cost) {\n        this.x = x;\n        this.y = y;\n        this.cost = cost;\n    }\n}\n\n\n//# sourceURL=webpack://vampire-survivor/./src/components/enemy.ts?");

/***/ }),

/***/ "./src/components/item.ts":
/*!********************************!*\
  !*** ./src/components/item.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Item\": () => (/* binding */ Item)\n/* harmony export */ });\nclass Item {\n    constructor(x, y, width, height, healthPoints, isConsumable, isAlive = true) {\n        this.x = x;\n        this.y = y;\n        this.width = width;\n        this.height = height;\n        this.healthPoints = healthPoints;\n        this.isConsumable = isConsumable;\n        this.isAlive = isAlive;\n    }\n    draw(ctx) {\n        ctx.fillStyle = \"green\";\n        ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(this.x, this.y, this.width, this.height);\n    }\n}\n\n\n//# sourceURL=webpack://vampire-survivor/./src/components/item.ts?");

/***/ }),

/***/ "./src/components/player.ts":
/*!**********************************!*\
  !*** ./src/components/player.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Player\": () => (/* binding */ Player)\n/* harmony export */ });\n/* harmony import */ var _character__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./character */ \"./src/components/character.ts\");\n\nclass Player extends _character__WEBPACK_IMPORTED_MODULE_0__.Character {\n    constructor(x, y, width, height, speed, maxHealth, health = maxHealth, attack = 10, defense = 5, isAlive = true) {\n        super(x, y, width, height, speed, maxHealth, health, attack, defense, isAlive);\n        this.directionX = 0;\n        this.directionY = 0;\n        this.isMoving = false;\n        this.isAttacking = false;\n        this.isDefending = false;\n        this.isInteracting = false;\n        this.score = 0;\n    }\n    draw(ctx) {\n        ctx.fillStyle = \"blue\";\n        ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(this.x, this.y, this.width, this.height);\n    }\n    findClosestEnemy(enemies) {\n        let closestEnemy = null;\n        let closestDistance = Infinity;\n        enemies.forEach((enemy) => {\n            if (enemy.isAlive) {\n                const distance = Math.sqrt(Math.pow(this.x - enemy.x, 2) + Math.pow(this.y - enemy.y, 2));\n                if (distance < closestDistance) {\n                    closestEnemy = enemy;\n                    closestDistance = distance;\n                }\n            }\n        });\n        return closestEnemy;\n    }\n}\n\n\n//# sourceURL=webpack://vampire-survivor/./src/components/player.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/player */ \"./src/components/player.ts\");\n/* harmony import */ var _components_enemy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/enemy */ \"./src/components/enemy.ts\");\n/* harmony import */ var _components_item__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/item */ \"./src/components/item.ts\");\n/* harmony import */ var _services_combat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/combat */ \"./src/services/combat.ts\");\n/* harmony import */ var _services_movement__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./services/movement */ \"./src/services/movement.ts\");\n/* harmony import */ var _utils_obstacle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/obstacle */ \"./src/utils/obstacle.ts\");\n// src/index.ts\n\n\n\n\n\n\nclass EnemyGenerator {\n    generateEnemy() {\n        const x = Math.floor(Math.random() * 700) + 50;\n        const y = Math.floor(Math.random() * 400) + 50;\n        const width = 50;\n        const height = 50;\n        const speed = Math.floor(Math.random() * 3) + 1;\n        const health = Math.floor(Math.random() * 100) + 50;\n        return new _components_enemy__WEBPACK_IMPORTED_MODULE_1__.Enemy(x, y, width, height, speed, health);\n    }\n}\n// 初始化游戏场景和角色\nconst player = new _components_player__WEBPACK_IMPORTED_MODULE_0__.Player(50, 50, 50, 50, 10, 100);\nconst portal1 = new _components_item__WEBPACK_IMPORTED_MODULE_2__.Item(0, 150, 50, 50, 10, true);\nconst portal2 = new _components_item__WEBPACK_IMPORTED_MODULE_2__.Item(750, 150, 50, 50, 10, true);\nconst enemyGenerator = new EnemyGenerator();\nconst enemies = [];\n// 初始化游戏服务\nconst combatService = new _services_combat__WEBPACK_IMPORTED_MODULE_3__.CombatService();\nconst movementService = new _services_movement__WEBPACK_IMPORTED_MODULE_4__.MovementService();\n// 初始化障碍物列表\nconst obstacles = [new _utils_obstacle__WEBPACK_IMPORTED_MODULE_5__.Obstacle(0, 0, 800, 20), new _utils_obstacle__WEBPACK_IMPORTED_MODULE_5__.Obstacle(0, 580, 800, 20), new _utils_obstacle__WEBPACK_IMPORTED_MODULE_5__.Obstacle(0, 20, 20, 560), new _utils_obstacle__WEBPACK_IMPORTED_MODULE_5__.Obstacle(780, 20, 20, 560)];\nconst canvas = document.querySelector(\"canvas\");\nconst ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext(\"2d\");\nconst pauseButton = document.querySelector(\"#pause-button\");\nconst restartButton = document.querySelector(\"#restart-button\");\nlet isPaused = false;\nsetInterval(() => {\n    if (isPaused) {\n        return;\n    }\n    if (player.health <= 0) {\n        restartButton === null || restartButton === void 0 ? void 0 : restartButton.setAttribute(\"style\", \"display:block;\");\n        isPaused = true;\n    }\n    // 检查是否需要生成新的敌人\n    if (enemies.filter((e) => e.isAlive).length < 3) {\n        const newEnemy = enemyGenerator.generateEnemy();\n        enemies.push(newEnemy);\n    }\n    player.score = enemies.filter((e) => !e.isAlive).length;\n    // 传送门\n    if (movementService.checkCollision(portal1, [player])) {\n        player.x = portal2.x - 50;\n        player.y = portal2.y;\n    }\n    if (movementService.checkCollision(portal2, [player])) {\n        player.x = portal1.x + 50;\n        player.y = portal1.y;\n    }\n    // 处理玩家输入\n    if (player.isAlive) {\n        if (player.isMoving) {\n            player.move(player.directionX, player.directionY, obstacles);\n        }\n        if (player.isAttacking) {\n            const enemy = player.findClosestEnemy(enemies);\n            player.attack(enemy);\n        }\n        if (player.isDefending) {\n            player.defend();\n        }\n        if (player.isInteracting) {\n            // 处理玩家与物品的交互\n        }\n    }\n    enemies.forEach((enemy) => {\n        // 处理敌人 AI\n        if (enemy.isAlive) {\n            enemy.updateDirection(player, obstacles);\n            enemy.move(enemy.directionX, enemy.directionY, obstacles);\n            if (Math.abs(player.x - enemy.x) < 30 && Math.abs(player.y - enemy.y) < 30) {\n                enemy.attack(player);\n            }\n        }\n    });\n    // 渲染游戏场景和角色\n    ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);\n    if (player.isAlive) {\n        player.draw(ctx);\n    }\n    enemies.forEach((enemy) => {\n        if (enemy.isAlive) {\n            enemy.draw(ctx);\n        }\n    });\n    obstacles.forEach((obstacle) => {\n        obstacle.draw(ctx);\n    });\n    portal1.draw(ctx);\n    portal2.draw(ctx);\n    // 绘制计分板\n    ctx === null || ctx === void 0 ? void 0 : ctx.save();\n    ctx.font = \"bold 16px Arial\";\n    ctx.fillStyle = \"gray\";\n    ctx.textAlign = \"left\";\n    ctx.textBaseline = \"top\";\n    ctx === null || ctx === void 0 ? void 0 : ctx.fillText(`Score: ${player.score} | Health: ${player.health}`, 10, 10);\n    ctx === null || ctx === void 0 ? void 0 : ctx.restore();\n}, 1000 / 60);\n// 暂停游戏\npauseButton === null || pauseButton === void 0 ? void 0 : pauseButton.addEventListener(\"click\", () => {\n    isPaused = !isPaused;\n    pauseButton.innerText = isPaused ? \"Resume\" : \"Pause\";\n});\n// 重开游戏\nrestartButton === null || restartButton === void 0 ? void 0 : restartButton.addEventListener(\"click\", () => {\n    window.location.reload();\n});\n// 处理玩家输入事件\ndocument.addEventListener(\"keydown\", (event) => {\n    switch (event.code) {\n        case \"ArrowUp\":\n            player.directionY = -1;\n            player.isMoving = true;\n            break;\n        case \"ArrowDown\":\n            player.directionY = 1;\n            player.isMoving = true;\n            break;\n        case \"ArrowLeft\":\n            player.directionX = -1;\n            player.isMoving = true;\n            break;\n        case \"ArrowRight\":\n            player.directionX = 1;\n            player.isMoving = true;\n            break;\n        case \"KeyA\":\n            player.isAttacking = true;\n            break;\n        case \"KeyS\":\n            player.isDefending = true;\n            break;\n        case \"KeyD\":\n            player.isInteracting = true;\n            break;\n    }\n});\ndocument.addEventListener(\"keyup\", (event) => {\n    console.log(event.code);\n    switch (event.code) {\n        case \"ArrowUp\":\n        case \"ArrowDown\":\n            player.directionY = 0;\n            player.isMoving = false;\n            break;\n        case \"ArrowLeft\":\n        case \"ArrowRight\":\n            player.directionX = 0;\n            player.isMoving = false;\n            break;\n        case \"KeyA\":\n            player.isAttacking = false;\n            break;\n        case \"KeyS\":\n            player.isDefending = false;\n            break;\n        case \"KeyD\":\n            player.isInteracting = false;\n            break;\n    }\n});\n\n\n//# sourceURL=webpack://vampire-survivor/./src/index.ts?");

/***/ }),

/***/ "./src/services/combat.ts":
/*!********************************!*\
  !*** ./src/services/combat.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"CombatService\": () => (/* binding */ CombatService)\n/* harmony export */ });\n// src/services/combat.ts\nclass CombatService {\n    constructor() { }\n    attack(attacker, target) {\n        const damage = attacker.attackPower - target.defense;\n        if (damage > 0) {\n            target.health -= damage;\n            if (target.health <= 0) {\n                target.health = 0;\n                target.isAlive = false;\n            }\n        }\n    }\n    defend(defender, attacker) {\n        defender.defense *= 2;\n        this.attack(attacker, defender);\n        defender.defense /= 2;\n    }\n    interact(player, item) {\n        if (item.isConsumable) {\n            player.health += item.healthPoints;\n            if (player.health > player.maxHealth) {\n                player.health = player.maxHealth;\n            }\n            item.isAlive = false;\n        }\n    }\n}\n\n\n//# sourceURL=webpack://vampire-survivor/./src/services/combat.ts?");

/***/ }),

/***/ "./src/services/movement.ts":
/*!**********************************!*\
  !*** ./src/services/movement.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MovementService\": () => (/* binding */ MovementService)\n/* harmony export */ });\n/* harmony import */ var _utils_direction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/direction */ \"./src/utils/direction.ts\");\n// src/services/movement.ts\n\nclass MovementService {\n    constructor() { }\n    move(character, direction) {\n        switch (direction) {\n            case _utils_direction__WEBPACK_IMPORTED_MODULE_0__.Direction.Up:\n                character.y -= character.speed;\n                break;\n            case _utils_direction__WEBPACK_IMPORTED_MODULE_0__.Direction.Down:\n                character.y += character.speed;\n                break;\n            case _utils_direction__WEBPACK_IMPORTED_MODULE_0__.Direction.Left:\n                character.x -= character.speed;\n                break;\n            case _utils_direction__WEBPACK_IMPORTED_MODULE_0__.Direction.Right:\n                character.x += character.speed;\n                break;\n        }\n    }\n    checkCollision(character, obstacles) {\n        const futureX = character.x + character.width;\n        const futureY = character.y + character.height;\n        for (const obstacle of obstacles) {\n            if (futureX > obstacle.x && character.x < obstacle.x + obstacle.width && futureY > obstacle.y && character.y < obstacle.y + obstacle.height) {\n                return true;\n            }\n        }\n        return false;\n    }\n    calculateDistance(object1, object2) {\n        const dx = object1.x - object2.x;\n        const dy = object1.y - object2.y;\n        return Math.sqrt(dx * dx + dy * dy);\n    }\n}\n\n\n//# sourceURL=webpack://vampire-survivor/./src/services/movement.ts?");

/***/ }),

/***/ "./src/utils/direction.ts":
/*!********************************!*\
  !*** ./src/utils/direction.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Direction\": () => (/* binding */ Direction)\n/* harmony export */ });\nvar Direction;\n(function (Direction) {\n    Direction[\"Up\"] = \"up\";\n    Direction[\"Down\"] = \"down\";\n    Direction[\"Left\"] = \"left\";\n    Direction[\"Right\"] = \"right\";\n})(Direction || (Direction = {}));\n\n\n//# sourceURL=webpack://vampire-survivor/./src/utils/direction.ts?");

/***/ }),

/***/ "./src/utils/obstacle.ts":
/*!*******************************!*\
  !*** ./src/utils/obstacle.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Obstacle\": () => (/* binding */ Obstacle)\n/* harmony export */ });\nclass Obstacle {\n    constructor(x, y, width, height) {\n        this.x = x;\n        this.y = y;\n        this.width = width;\n        this.height = height;\n    }\n    draw(ctx) {\n        ctx.fillStyle = \"black\";\n        ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(this.x, this.y, this.width, this.height);\n    }\n}\n\n\n//# sourceURL=webpack://vampire-survivor/./src/utils/obstacle.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;