class Tile {
  constructor(x, y, width, height, color, strokeColor) {
    this.x = x;
    this.y = y;
    this.id = this.x.toString() + this.y.toString();
    this.width = width;
    this.height = height;
    this.color = color;
    this.debugColor = "orange";
    this.strokeColor = undefined;
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

  // TODO: Fixme

  debugPosition = (ctx, game) => {
    if (game.wantsToDrag) {
      return;
    }
    const distanceMovedX = game.dragStart.x - game.dragEnd.x;
    const distanceMovedY = game.dragStart.y - game.dragEnd.y;
    const minX = (this.x - game.gap) * game.cameraZoom;
    const maxX =
      (this.x - game.gap) * game.cameraZoom + this.width - distanceMovedX;

    const minY = (this.y - game.gap) * game.cameraZoom;
    const maxY =
      (this.y - game.gap) * game.cameraZoom + this.height - distanceMovedY;
    ctx.fillStyle = this.debugColor;
    ctx.strokeStyle = this.debugColor;
    ctx.strokeRect(
      this.x,
      this.y,
      this.width * game.cameraZoom,
      this.height * game.cameraZoom
    );
  };

  setPaintingColor = (game) => {
    if (game.wantsToDrag) {
      return;
    }
    const distanceMovedX = game.dragStart.x - game.dragEnd.x;
    const distanceMovedY = game.dragStart.y - game.dragEnd.y;
    const minX = (this.x - game.gap) * game.cameraZoom;
    const maxX = (this.x + this.width - game.gap) * game.cameraZoom;

    const minY = (this.y - game.gap) * game.cameraZoom;
    const maxY = (this.y + this.height - game.gap) * game.cameraZoom;

    if (this.id === "5050") {
      console.log(minX, maxX, minY, maxY, game.mouse.x);
    }

    if (!game.mouse.down) {
      return;
    }

    if (
      game.mouse.x >= minX &&
      game.mouse.x <= maxX &&
      game.mouse.y >= minY &&
      game.mouse.y <= maxY
    ) {
      this.color = "yellow";
    }
  };
}

export default Tile;
