class Tile {
  constructor(x, y, width, height, color, correctColor, strokeColor, colorKey) {
    this.x = x;
    this.y = y;
    this.id = this.x.toString() + this.y.toString();
    this.width = width;
    this.height = height;
    this.color = color;
    this.correctColor = correctColor;

    this.debugColor = "orange";
    this.strokeColor = strokeColor;
    this.paintedCorrectly = false;
    this.colorKey = colorKey;
  }

  drawRect = (ctx) => {
    try {
      ctx.fillStyle = this.color.hex;
    } catch (e) {
      console.log(this);
    }
    ctx.strokeStyle = this.strokeColor;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  drawText = (ctx) => {
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // if the color key = 0 it's an empty tile, dont draw text
    ctx.fillText(
      this.correctColor.key === 0 ? "" : this.correctColor.key,
      this.x + this.width / 2,
      this.y + this.height / 2
    );
  };

  draw = (ctx, game) => {
    this.setPaintingColor(game);
    this.drawRect(ctx);
    if (!game.playMode || this.paintedCorrectly) return;
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
      if (game.currentColor === undefined) {
        console.log("game.currentColor is undefined?", game);
      }

      if (!game.playMode) {
        this.correctColor = game.currentColor;
      } else {
        if (this.color.hex == this.correctColor.hex) {
          console.log(
            "CORRECT",
            this.correctColor,
            this.color,
            game.currentColor
          );
          this.paintedCorrectly = true;
        } else {
          console.log(
            "INCORRECT",
            this.correctColor,
            this.color,
            game.currentColor
          );
          this.paintedCorrectly = false;
        }
      }
    }
  };
}

export default Tile;
