export class Item {
    constructor(public x: number, public y: number, public width: number, public height: number, public healthPoints: number, public isConsumable: boolean, public isAlive: boolean = true) {}

    draw(ctx: CanvasRenderingContext2D | null | undefined, relativePosition: { x: number; y: number }): void {
        ctx!.fillStyle = "green";
        ctx?.fillRect(this.x + relativePosition.x, this.y + relativePosition.y, this.width, this.height);
    }
}
