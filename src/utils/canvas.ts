/**
 * 画布工具类
 */
export class CanvasUtils {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    listeners: Function[] = [];

    constructor(canvas: HTMLCanvasElement | null) {
        if (!canvas) {
            throw new Error("Canvas not found");
        }
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        const rect = canvas.getBoundingClientRect(); // 获取 Canvas 元素的位置和大小

        // 添加点击事件监听器
        this.canvas?.addEventListener("click", async (event) => {
            const mouseX = event.clientX - rect.left; // 计算鼠标点击位置相对于 Canvas 元素的位置
            const mouseY = event.clientY - rect.top;
            console.log(rect.left, rect.top, event);
            this.listeners.forEach((listener) => {
                listener(mouseX, mouseY);
            });
        });
    }

    /**
     * 注册一个监听器函数，在指定类型的事件发生时会被调用。
     * @param listener - 监听器函数
     */
    addEventListener(listener: Function) {
        this.listeners.push(listener);
    }

    /**
     * 清空画布
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * 画圆形
     * @param {number} x - 圆心横坐标
     * @param {number} y - 圆心纵坐标
     * @param {number} radius - 圆半径
     * @param {string} color - 填充颜色
     */
    drawCircle(x: number, y: number, radius: number, color: string) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
    }

    /**
     * 画矩形
     * @param {number} x - 左上角横坐标
     * @param {number} y - 左上角纵坐标
     * @param {number} width - 矩形宽度
     * @param {number} height - 矩形高度
     * @param {string} color - 填充颜色
     */
    drawRect(x: number, y: number, width: number, height: number, color: string) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    /**
     * 画文字
     * @param {string} text - 文字内容
     * @param {number} x - 左上角横坐标
     * @param {number} y - 左上角纵坐标
     * @param {string} color - 填充颜色
     * @param {string} font - 字体样式
     * @param {CanvasTextAlign} textAlign - 文字水平对齐方式
     * @param {CanvasTextBaseline} textBaseline - 文字垂直对齐方式
     */
    drawText(text: string, x: number, y: number, color: string = "black", font: string = "16px", textAlign: CanvasTextAlign = "left", textBaseline: CanvasTextBaseline = "top") {
        this.ctx.save();
        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = textBaseline;
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }

    /**
     * 画图片
     * @param {HTMLImageElement} image - 图片对象
     * @param {number} x - 左上角横坐标
     * @param {number} y - 左上角纵坐标
     * @param {number} width - 矩形宽度
     * @param {number} height - 矩形高度
     */
    drawImage(image: HTMLImageElement, x: number, y: number, width: number, height: number) {
        this.ctx.drawImage(image, x, y, width, height);
    }

    /**
     * 画精灵图
     * @param {HTMLImageElement} image - 图片对象
     * @param {object} params - 绘制参数
     */
    drawSprite(image: HTMLImageElement, params: { sprite: { x: number; y: number; width: number; height: number }; x: number; y: number; width: number; height: number }) {
        this.ctx.drawImage(image, params.sprite.x, params.sprite.y, params.sprite.width, params.sprite.height, params.x, params.y, params.width, params.height);
    }

    /**
     * 设置线条宽度
     * @param {number} width - 线条宽度
     */
    setLineWidth(width: number) {
        this.ctx.lineWidth = width;
    }

    /**
     * 画线段
     * @param {number} x1 - 起始点横坐标
     * @param {number} y1 - 起始点纵坐标
     * @param {number} x2 - 结束点横坐标
     * @param {number} y2 - 结束点纵坐标
     * @param {string} color - 线条颜色
     */
    drawLine(x1: number, y1: number, x2: number, y2: number, color: string) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    /**
     * 画路径
     * @param {Array<{ x: number; y: number }>} points - 点的坐标数组
     * @param {string} color - 线条颜色
     */
    drawPath(points: { x: number; y: number }[], color: string) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.stroke();
    }

    /**
     * 设置字体样式
     * @param {string} font - 字体样式
     */
    setFont(font: string) {
        this.ctx.font = font;
    }

    /**
     * 设置文字水平对齐方式
     * @param {CanvasTextAlign} align - 文字水平对齐方式
     */
    setTextAlign(align: CanvasTextAlign) {
        this.ctx.textAlign = align;
    }

    /**
     * 设置文字垂直对齐方式
     * @param {CanvasTextBaseline} baseline - 文字垂直对齐方式
     */
    setTextBaseline(baseline: CanvasTextBaseline) {
        this.ctx.textBaseline = baseline;
    }

    /**
     * 播放动画
     * @param {Function} drawFunction - 绘制函数
     * @param {number} startIndex - 起始索引
     * @param {number} endIndex - 结束索引
     * @param {number} interval - 帧间隔时间（毫秒）
     */
    async playAnimation(drawFunction: Function, startIndex: number, endIndex: number, interval: number) {
        for (let i = startIndex; i <= endIndex; i++) {
            drawFunction(i);
            await new Promise<void>((resolve) => setTimeout(resolve, interval));
        }
    }
}
