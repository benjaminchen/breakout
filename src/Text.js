class Text {
    constructor(content, x, y) {
        this.content = content;
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.fillText(this.content, this.x, this.y);
    }
}

export default Text;