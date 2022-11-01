class Tile {
  constructor(x, y, width, height, color, strokeColor) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.strokeColor = strokeColor;
  }

  drawRect = (ctx) => {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  drawText = (ctx) => {
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("1", this.x + this.width / 2, this.y + this.height / 2);
  };

  draw = (ctx) => {
    this.drawRect(ctx);
    this.drawText(ctx);
  };

  getRandomColor = () => {
    return Math.floor(Math.random() * 220);
  };

  paintTile = (ctx, game) => {
    ctx.fillStyle = "yellow";

    const minX = this.x;
    const maxX = this.x + this.width;

    const minY = this.y;
    const maxY = this.y + this.height;

    if (!game.mouse.down) {
      return;
    }

    if (
      game.mouse.x >= minX &&
      game.mouse.x <= maxX &&
      game.mouse.y >= minY &&
      game.mouse.y <= maxY
    ) {
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
}

export default Tile;
