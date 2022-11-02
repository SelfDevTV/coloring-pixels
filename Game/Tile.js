class Tile {
  constructor(x, y, width, height, color, correctColor, strokeColor, colorKey) {
    this.x = x;
    this.y = y;
    this.id = this.x.toString() + this.y.toString();
    this.width = width;
    this.height = height;
    this.color = color;
    this.correctColor = {
      key: correctColor.key,
      hex: correctColor.hex,
    };

    this.debugColor = "orange";
    this.strokeColor = strokeColor;
    this.paintedCorrectly = false;
    this.colorKey = colorKey;
  }

  drawRect = (ctx) => {
    ctx.fillStyle = this.color.hex;
    ctx.strokeStyle = this.strokeColor;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  drawText = (ctx) => {
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      this.colorKey,
      this.x + this.width / 2,
      this.y + this.height / 2
    );
  };

  draw = (ctx, game) => {
    this.setPaintingColor(game);
    this.drawRect(ctx);

    this.drawText(ctx);
    // this.debugPosition(ctx, game);
  };

  getRandomColor = () => {
    return Math.floor(Math.random() * 220);
  };

  updateTile = (ctx, x, y, width, height) => {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.draw(ctx);
  };

  setPaintingColor = (game) => {
    if (game.wantsToDrag) {
      return;
    }

    const minX = (this.x - game.gap + game.translateX) * game.cameraZoom;
    const maxX =
      (this.x + this.width - game.gap + game.translateX) * game.cameraZoom;

    const minY = (this.y - game.gap + game.translateY) * game.cameraZoom;
    const maxY =
      (this.y + this.height - game.gap + game.translateY) * game.cameraZoom;

    if (!game.mouse.down) {
      return;
    }

    if (
      game.mouse.x >= minX &&
      game.mouse.x <= maxX &&
      game.mouse.y >= minY &&
      game.mouse.y <= maxY
    ) {
      this.color = game.currentColor;

      if (this.color === this.correctColor) {
        this.paintedCorrectly = true;
      } else {
        this.paintedCorrectly = false;
      }
    }
  };
}

export default Tile;
