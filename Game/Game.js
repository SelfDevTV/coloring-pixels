import Tile from "./Tile";

class Game {
  tiles = [];
  constructor(width, height, canvas) {
    var rect = canvas.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.mouse = {
      x: undefined,
      y: undefined,
      down: false,
    };
    window.addEventListener("mousedown", (e) => {
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.down = true;
    });
    window.addEventListener("mouseup", () => {
      this.mouse.down = false;
    });
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
  }

  updateTiles = (ctx) => {
    this.tiles.forEach((tile) => {
      tile.paintTile(ctx, this);
    });
  };

  drawDebugBg = (ctx, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.width, this.height);
  };

  getRandomColor = () => {
    return Math.floor(Math.random() * 220);
  };

  init = (tileSize, gap) => {
    for (let i = 20; i < this.width; i += tileSize) {
      for (let j = 20; j < this.height; j += tileSize) {
        const tile = new Tile(
          i,
          j,
          tileSize - gap,
          tileSize - gap,
          `white`,
          "black"
        );
        this.tiles.push(tile);
      }
    }
  };

  draw = (ctx) => {
    this.tiles.forEach((tile) => {
      tile.draw(ctx);
    });
  };
}

export default Game;
