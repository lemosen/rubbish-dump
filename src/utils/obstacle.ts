export class Obstacle {
    constructor(public x: number, public y: number, public width: number, public height: number) {}

    draw(ctx: CanvasRenderingContext2D | null | undefined): void {
        ctx!.fillStyle = "black";
        ctx?.fillRect(this.x, this.y, this.width, this.height);
    }
}
