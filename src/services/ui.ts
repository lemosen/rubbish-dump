// 引入需要使用的类和工具
import { Enemy } from "../components/enemy";
import { Item } from "../components/item";
import { Player } from "../components/player";
import { spriteSheet, SPRITE_MAP, uiSpriteSheet, UI_SPRITE_MAP, bg } from "../utils/sprite";
import { CanvasUtils } from "../utils/canvas";
enum Status {
    PLAYING,
    WAIT_START,
    PAUSED,
    GAME_OVER,
}
// 定义 UIService 类
export class UIService extends CanvasUtils {
    isRestart = false; // 游戏是否暂停，初始值为 true
    status: Status = Status.WAIT_START;
    // 定义地图数组
    map = [
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // 地图数组的第一行
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 地图数组的第二行
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 地图数组的第三行
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 地图数组的第四行
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 地图数组的第五行
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 地图数组的第六行
        [2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 地图数组的第七行
        [2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 地图数组的第八行
    ];

    operateCanvasUtil: CanvasUtils;

    animations: { [key: string]: { x: number; y: number; width: number; height: number; isPlay: boolean; time: number; frame: number; interval: number } } = {
        startButton: {
            x: -70,
            y: 70,
            width: 180,
            height: 180,
            isPlay: false,
            time: Date.now(),
            frame: 2,
            interval: 100,
        },
        stopButton: {
            x: 0,
            y: 0,
            width: 180,
            height: 180,
            isPlay: false,
            time: Date.now(),
            frame: 2,
            interval: 100,
        },
    };

    controls: { x: number; y: number } = { x: 0, y: 0 };

    constructor() {
        super(document.querySelector("canvas"));
        const canvas = document.getElementById("operate-canvas") as HTMLCanvasElement;
        canvas.height = document.body.clientHeight;
        canvas.width = document.body.clientWidth;
        this.operateCanvasUtil = new CanvasUtils(canvas);
        this.animations.stopButton.x += this.operateCanvasUtil.canvas.width - 180;
        this.animations.startButton.x += this.operateCanvasUtil.canvas.width / 2;
        this.animations.startButton.y += this.operateCanvasUtil.canvas.height / 2;
        this.operateCanvasUtil.addEventListener(async (clickX: number, clickY: number) => {
            Object.keys(this.animations).forEach((key) => {
                const { x, y, width, height } = this.animations[key];
                if (clickX >= x && clickX <= x + width && clickY >= y && clickY <= y + height) {
                    this.animations[key].isPlay = true;
                    this.animations[key].time = Date.now();
                }
            });
        });
        this.initJoystick(); // 初始化虚拟摇杆
        this.handleButtonAndKeyEvent(); // 处理按钮和键盘事件
    }
    /**
     * 初始化玩家的摇杆。
     */
    initJoystick() {
        // 判断是否为移动设备
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        // 获取摇杆容器
        const joystickContainer = document.querySelector("#joystick-container") as HTMLElement;
        if (isMobile) {
            // 创建虚拟摇杆
            const joystick = window.nipplejs.create({
                zone: joystickContainer,
                color: "white",
                position: { left: "50%", top: "50%" },
                size: 150,
            });

            // 处理虚拟摇杆的移动事件
            joystick.on("move", (event: any, data: any) => {
                // 根据摇杆向量设置玩家移动方向
                this.controls = {
                    x: data.vector.x > 0 ? 1 : -1,
                    y: data.vector.y > 0 ? -1 : 1,
                };
            });

            // 处理虚拟摇杆的结束事件
            joystick.on("end", (event: any, data: any) => {
                // 玩家停止移动
                this.controls = {
                    x: 0,
                    y: 0,
                };
            });
        } else {
            // 隐藏虚拟摇杆
            joystickContainer.style.display = "none";
        }
    }
    hiddenJoystick() {
        // 隐藏虚拟摇杆
        const joystickContainer = document.querySelector("#joystick-container") as HTMLElement;
        joystickContainer.style.visibility = "hidden";
    }
    showJoystick() {
        // 显示虚拟摇杆
        const joystickContainer = document.querySelector("#joystick-container") as HTMLElement;
        joystickContainer.style.visibility = "visible";
    }
    /**
     * 处理玩家的按钮和键盘事件。
     */
    handleButtonAndKeyEvent() {
        // // 获取暂停和重开按钮
        // const pauseButton = document.querySelector("#pause-button");
        // const restartButton = document.querySelector("#restart-button");

        // // 获取攻击按钮
        // const attackButton = document.querySelector("#attack-button");

        // // 处理攻击按钮的点击事件
        // attackButton?.addEventListener("click", () => {
        //     player.isAttacking = !player.isAttacking;
        //     attackButton.innerHTML = player.isAttacking ? "Stop" : "Attack";
        // });

        // pauseButton!.innerHTML = "Start";
        // // 处理暂停按钮的点击事件
        // pauseButton?.addEventListener("click", () => {
        //     this.isPaused = !this.isPaused;
        //     pauseButton.innerHTML = this.isPaused ? "Resume" : "Pause";
        // });

        // // 处理重开按钮的点击事件
        // restartButton?.addEventListener("click", () => {
        //     window.location.reload();
        // });

        // 处理玩家输入事件
        document.addEventListener("keydown", (event) => {
            switch (event.code) {
                case "ArrowUp":
                    this.controls.y = -1;
                    break;
                case "ArrowDown":
                    this.controls.y = 1;
                    break;
                case "ArrowLeft":
                    this.controls.x = -1;
                    break;
                case "ArrowRight":
                    this.controls.x = 1;
                    break;
                // case "KeyA":
                //     player.isAttacking = true;
                //     break;
                // case "KeyS":
                //     player.isDefending = true;
                //     break;
                // case "KeyD":
                //     player.isInteracting = true;
                //     break;
            }
        });

        document.addEventListener("keyup", (event) => {
            switch (event.code) {
                case "ArrowUp":
                case "ArrowDown":
                    this.controls.y = 0;
                    break;
                case "ArrowLeft":
                case "ArrowRight":
                    this.controls.x = 0;
                    break;
                // case "KeyA":
                //     player.isAttacking = false;
                //     break;
                // case "KeyS":
                //     player.isDefending = false;
                //     break;
                // case "KeyD":
                //     player.isInteracting = false;
                //     break;
            }
        });
    }

    /**
     * 显示重新开始按钮，将其样式设置为 "display:block;"。
     */
    showRestartBtn() {
        // 获取重新开始按钮元素。
        const restartButton = document.querySelector("#restart-button");

        // 如果重新开始按钮存在，则将其样式设置为 "display:block;"。
        restartButton?.setAttribute("style", "display:block;");
    }

    drawButton(index: number, position: { x: number; y: number }, width: number = 60, height: number = 60, text: string = "Start") {
        let key;
        switch (index) {
            case 0:
                key = 1;
                break;
            case 1:
                key = 2;
                break;
        }
        const button1 = UI_SPRITE_MAP[`button1-${key}-1` as keyof typeof UI_SPRITE_MAP];
        const button2 = UI_SPRITE_MAP[`button1-${key}-2` as keyof typeof UI_SPRITE_MAP];
        const button3 = UI_SPRITE_MAP[`button1-${key}-3` as keyof typeof UI_SPRITE_MAP];

        this.operateCanvasUtil.drawSprite(uiSpriteSheet, { sprite: button1, x: position.x + 0, y: position.y, width: width, height: height });
        this.operateCanvasUtil.drawSprite(uiSpriteSheet, { sprite: button2, x: position.x + 1 * width - 4, y: position.y, width: width, height: height });
        this.operateCanvasUtil.drawSprite(uiSpriteSheet, { sprite: button3, x: position.x + 2 * width - 8, y: position.y, width: width, height: height });
        this.operateCanvasUtil.drawText(text, position.x + 45, position.y + 5, "white", "bold 32px Kenney");
    }
    get isPaused() {
        return this.status === Status.PAUSED;
    }
    get isWaitStart() {
        return this.status === Status.WAIT_START;
    }
    get isGameOver() {
        return this.status === Status.GAME_OVER;
    }
    get isPlaying() {
        return this.status === Status.PLAYING;
    }
    /**
     * 渲染按钮场景
     */
    renderOperate() {
        this.operateCanvasUtil.clear();
        if (this.isPaused || this.isGameOver) {
            // 设置透明度和颜色
            const color = "rgba(0, 0, 0, 0.5)";
            this.operateCanvasUtil.drawRect(0, 0, this.operateCanvasUtil.canvas.width, this.operateCanvasUtil.canvas.height, color);
        }

        if (this.isPaused || this.isPlaying) {
            const stopButtonPosition = {
                x: this.animations.stopButton.x,
                y: this.animations.stopButton.y,
            };
            const text = this.status === Status.PLAYING ? "Stop" : "Play";
            // 如果显示默认按钮，则绘制默认按钮
            if (!this.animations?.stopButton?.isPlay) {
                this.drawButton(0, stopButtonPosition, 60, 60, text);
            } else {
                const currentDate = Date.now();
                const index = Math.ceil((currentDate - this.animations.stopButton.time) / 100);
                if (index >= 2) {
                    this.status = this.status === Status.PLAYING ? Status.PAUSED : Status.PLAYING;
                    this.animations.stopButton.isPlay = false;
                    this.drawButton(0, stopButtonPosition, 60, 60, text);
                } else {
                    // 设置按钮坐标
                    this.drawButton(index, stopButtonPosition, 60, 60, text);
                }
            }
            return;
        }

        if (this.isWaitStart || this.isGameOver) {
            const startButtonPosition = {
                x: this.animations.startButton.x,
                y: this.animations.startButton.y,
            };
            // 如果显示默认按钮，则绘制默认按钮
            if (!this.animations?.startButton?.isPlay) {
                this.drawButton(0, startButtonPosition);
            } else {
                const currentDate = Date.now();
                const index = Math.ceil((currentDate - this.animations.startButton.time) / 100);
                if (index >= 2) {
                    this.status = Status.PLAYING;
                    this.isRestart = true;
                    this.animations.startButton.isPlay = false;
                    this.drawButton(0, startButtonPosition);
                } else {
                    // 设置按钮坐标
                    this.drawButton(index, startButtonPosition);
                }
            }
        }
    }

    /**
     * 渲染游戏场景和角色。
     */
    render(player: Player, enemies: Enemy[], portal1: Item, portal2: Item) {
        if (player.health <= 0) {
            this.status = Status.GAME_OVER;
            this.showRestartBtn();
        }
        if (this.isWaitStart) {
            this.drawImage(bg, 0, 0, this.canvas.width, this.canvas.height);
        }
        this.renderOperate();
        if (this.isPaused || this.isWaitStart || this.isGameOver) {
            this.hiddenJoystick();
        }

        if (this.isPlaying) {
            this.showJoystick();
            if (this.controls.x !== 0 && this.controls.y !== 0) {
                player.directionX = this.controls.x;
                player.directionY = this.controls.y;
                player.isMoving = true;
            } else {
                player.directionX = 0;
                player.directionY = 0;
                player.isMoving = false;
            }
            // 计算相对位置
            const relativePosition = {
                x: this.canvas.width / 2 - player.x,
                y: this.canvas.height / 2 - player.y,
            };

            // 清空画布并渲染地图
            this.clear();
            this.renderMap(player);

            // 绘制敌人
            enemies.forEach((enemy) => {
                if (enemy.isAlive) {
                    enemy.draw(this.ctx, relativePosition);
                }
            });

            // 绘制玩家
            if (player.isAlive) {
                player.draw(this.ctx, relativePosition);
            }

            // 绘制传送门
            portal1.draw(this.ctx, relativePosition);
            portal2.draw(this.ctx, relativePosition);

            // 绘制计分板
            this.drawText(`Score: ${player.score} | Health: ${player.health} | Position: (${player.x}, ${player.y})`, 10, 10, "gray", "bold 32px Arial");
        }
    }

    /**
     * 渲染游戏地图
     * @param {Player} player - 玩家对象
     */
    renderMap(player: Player) {
        // 定义图块的大小
        const tileSize: number = 200;

        // 定义地图偏移量
        let mapOffset = { x: 0, y: 0 };
        // 根据玩家位置更新地图偏移量
        mapOffset.x = -player.x % tileSize;
        mapOffset.y = -player.y % tileSize;

        let playerX, playerY;
        if (player.x > 0) {
            playerX = Math.floor(player.x / tileSize) % this.map[0].length;
        } else {
            playerX = Math.ceil(player.x / tileSize) % this.map[0].length;
        }
        if (player.y > 0) {
            playerY = Math.floor(player.y / tileSize) % this.map.length;
        } else {
            playerY = Math.ceil(player.y / tileSize) % this.map.length;
        }

        // 滚动地图
        const rowIndex = (playerX + this.map[0].length + 1) % this.map[0].length;
        const colIndex = (playerY + this.map.length + 1) % this.map.length;
        const rollMap = JSON.parse(JSON.stringify(this.map));
        const middle = rollMap.splice(colIndex, rollMap.length);
        rollMap.unshift(...middle);
        rollMap.forEach((row: any) => {
            const middle1 = row.splice(rowIndex, row.length);
            row.unshift(...middle1);
        });

        // 绘制地图图块
        for (let row = 0; row < rollMap.length; row++) {
            for (let col = 0; col < rollMap[row].length; col++) {
                const tile = rollMap[row][col];
                const x: number = (col - 1) * tileSize + mapOffset.x;
                const y: number = (row - 1) * tileSize + mapOffset.y;
                const sprite = SPRITE_MAP[("map" + tile) as keyof typeof SPRITE_MAP];
                this.drawSprite(spriteSheet, {
                    sprite,
                    x,
                    y,
                    width: tileSize,
                    height: tileSize,
                });
            }
        }
    }
}
