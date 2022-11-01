import Tile from "./Tile";

class Game {
  tiles = [];
  gap = 2;
  cameraZoom = 2;
  lastZoom = this.cameraZoom;
  SCROLL_SENSITIVITY = 0.0005;
  zoom = 5;
  tileSize = 30;
  oldTileSize = 30;
  isDragging = false;
  wantsToDrag = false;
  dragStart = {
    x: 0,
    y: 0,
  };
  dragEnd = {
    x: 0,
    y: 0,
  };
  cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  constructor(width, height, canvas) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.mouse = {
      x: undefined,
      y: undefined,
      down: false,
    };
  }

  getEventLocation = (e) => {
    if (e.touches && e.touches.length == 1) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.clientX && e.clientY) {
      return { x: e.clientX, y: e.clientY };
    }
  };

  onPointerDown = (e) => {
    // if mouse is down start draggin, but only if space bar is hit

    if (this.wantsToDrag) {
      this.isDragging = true;
      this.dragStart.x =
        this.getEventLocation(e).x / this.cameraZoom - this.cameraOffset.x;
      this.dragStart.y =
        this.getEventLocation(e).y / this.cameraZoom - this.cameraOffset.y;
    }
  };

  onPointerUp = (e) => {
    if (this.wantsToDrag) {
      this.dragEnd.x =
        this.getEventLocation(e).x / this.cameraZoom - this.cameraOffset.x;
      this.dragEnd.y =
        this.getEventLocation(e).y / this.cameraZoom - this.cameraOffset.y;
    }

    this.isDragging = false;
    this.lastZoom = this.cameraZoom;
    this.wantsToDrag = false;
  };

  onPointerMove = (e) => {
    console.log(this.isDragging, this.wantsToDrag);
    if (this.isDragging && this.wantsToDrag) {
      this.cameraOffset.x =
        this.getEventLocation(e).x / this.cameraZoom - this.dragStart.x;
      this.cameraOffset.y =
        this.getEventLocation(e).y / this.cameraZoom - this.dragStart.y;
    }
  };

  addEventListeners = (ctx) => {
    var rect = this.canvas.getBoundingClientRect();
    window.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.mouse.x = e.pageX - rect.left;
      this.mouse.y = e.pageY - rect.top;
      // this.mouse.x = e.clientX;
      // this.mouse.y = e.clientY;
      this.mouse.down = true;
      this.onPointerDown(e);
    });
    window.addEventListener("mouseup", (e) => {
      e.preventDefault();
      this.mouse.down = false;
      this.onPointerUp(e);
    });
    window.addEventListener("mousemove", (e) => {
      e.preventDefault();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.onPointerMove(e);
    });
    window.addEventListener("wheel", (e) => {
      this.adjustZoom(e.deltaY * this.SCROLL_SENSITIVITY);
    });
    window.addEventListener("keydown", this.handleWantsToDrag);
    window.addEventListener("keyup", this.handleWantsToDrag);
  };

  handleWantsToDrag = (e) => {
    if (e.keyCode === 32 && e.type === "keydown") {
      this.wantsToDrag = true;
    } else if (e.keyCode === 32 && e.type === "keyup") {
      this.wantsToDrag = false;
    }

    console.log(this.wantsToDrag);
  };

  adjustZoom = (zoomAmount, zoomFactor) => {
    this.cameraZoom -= zoomAmount;
  };

  update = (ctx) => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
    ctx.scale(this.cameraZoom, this.cameraZoom);
    ctx.translate(
      -window.innerWidth / 2 + this.cameraOffset.x,
      -window.innerHeight / 2 + this.cameraOffset.y
    );
    ctx.clearRect(0, 0, window.width, window.height);
    // this.drawDebugBg(ctx, "blue");
    this.drawTiles(ctx);
  };

  drawTiles = (ctx) => {
    this.tiles.forEach((tile) => {
      tile.draw(ctx, this);
    });
  };

  updateTiles = (ctx) => {
    ctx.clearRect(0, 0, window.width, window.height);

    this.tiles.forEach((tile) => {
      tile.updateTile(ctx, tile.x, tile.y, tile.width, tile.height);
    });
  };

  zoomTiles = (ctx) => {
    ctx.clearRect(0, 0, this.width, this.height);

    this.tiles.forEach((tile) => {
      const newX = (tile.x / this.oldTileSize) * this.tileSize;
      const newY = (tile.y / this.oldTileSize) * this.tileSize;

      if (!(newX > this.width || newY > this.height)) {
        // only draw if we are inside bounds
        tile.updateTile(
          ctx,
          newX,
          newY,
          this.tileSize - this.gap,
          this.tileSize - this.gap
        );
      }
    });
  };

  paintTiles = (ctx) => {
    this.tiles.forEach((tile) => {
      tile.paintTile(ctx, this);
    });
  };

  drawDebugBg = (ctx, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  getRandomColor = () => {
    return Math.floor(Math.random() * 220);
  };

  init = (tileSize, gap) => {
    this.gap = gap;
    this.tileSize = tileSize;
    for (let i = this.tileSize; i < this.width; i += tileSize) {
      for (let j = this.tileSize; j < this.height; j += tileSize) {
        const tile = new Tile(
          i,
          j,
          tileSize - this.gap,
          tileSize - this.gap,
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
