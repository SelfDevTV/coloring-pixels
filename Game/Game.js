import Tile from "./Tile";
import _ from "lodash";

class Game {
  playMode;
  currentColor;
  tiles = [];
  gap = 2;
  cameraZoom = 1;
  lastZoom = this.cameraZoom;
  SCROLL_SENSITIVITY = 0.00009;
  zoom = 5;
  tileSize = 30;
  oldTileSize = 30;
  isDragging = false;
  wantsToDrag = false;
  translateX = 0;
  translateY = 0;
  colorKeys = [];
  // array of hex codes of used colors
  colors = [];

  dragStart = {
    x: 0,
    y: 0,
  };
  dragEnd = {
    x: 0,
    y: 0,
  };

  constructor(width, height, canvas) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.playMode = false;
    this.cameraOffset = {
      x: window.innerWidth / 2 + this.width / 2,
      y: window.innerHeight / 2,
    };
    this.mouse = {
      x: undefined,
      y: undefined,
      down: false,
    };
  }

  init = (tileSize, gap, ctx) => {
    this.cameraOffset = {
      x: window.innerWidth / 2 + this.width / 2,
      y: window.innerHeight / 2,
    };
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.gap = gap;
    this.tileSize = tileSize;
    for (let i = this.tileSize; i < this.width; i += tileSize) {
      for (let j = this.tileSize; j < this.height; j += tileSize) {
        // const correctColor = {
        //   key: i > 100 ? 1 : 2,
        //   hex: i > 100 ? "#fffeee" : "#cccddd",
        // };
        // const color = {
        //   key: i > 100 ? 1 : 2,
        //   hex: i > 100 ? "#fffeee" : "#cccddd",
        // };
        const tile = new Tile(
          i,
          j,
          tileSize - this.gap,
          tileSize - this.gap,
          { key: 0, hex: "#ffffff" },
          null,
          "black",
          null
        );
        this.tiles.push(tile);
      }
    }
    this.generateUniqueColors();
  };

  update = (ctx) => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.translateX = window.innerWidth / 2;
    this.translateY = window.innerHeight / 2;

    // ctx.translate(this.translateX, this.translateY);
    this.translateX = -window.innerWidth / 2 + this.cameraOffset.x;
    this.translateY = -window.innerHeight / 2 + this.cameraOffset.y;

    ctx.scale(this.cameraZoom, this.cameraZoom);
    ctx.translate(this.translateX, this.translateY);
    ctx.clearRect(0, 0, window.width, window.height);
    // if (this.currentColor === undefined) {
    //   console.log("why no currentcolor", this);
    // }

    this.generateUniqueColors();

    this.drawTiles(ctx);
  };

  addUsedColors = () => {
    // loop over all tiles and add each unique color to it
  };

  getOnlyPaintedTiles = () => {
    if (this.playMode) {
      return this.tiles.filter((tile) => {
        if (tile.correctColor.key !== 0 && tile.correctColor.key !== -1) {
          return tile;
        }
      });
    } else {
      return this.tiles.filter((tile) => {
        if (tile.color.key !== 0 && tile.color.key !== -1) {
          return tile;
        }
      });
    }
  };

  loadFromJson = (json) => {
    // TODO: Load from supabase?

    const tiles = JSON.parse(json);

    // adding the first color in

    tiles.forEach((tile) => {
      const newTile = new Tile(
        tile.x,
        tile.y,
        tile.width,
        tile.height,
        { key: -1, hex: "#ffffff" },
        tile.color,
        tile.strokeColor,
        tile.color.key
      );
      this.tiles.push(newTile);
    });

    // Find unique color keys

    this.generateUniqueColors();

    this.currentColor = this.colors[0];

    // sort it

    // save it
  };

  generateUniqueColors = () => {
    let allColors;
    const paintedTilesColors = this.getOnlyPaintedTiles();

    if (this.playMode) {
      allColors = paintedTilesColors.map((tile) => tile.correctColor);
    } else {
      allColors = paintedTilesColors.map((tile) => tile.color);
    }

    this.colors = this.getUniqueColors(allColors).sort((a, b) => a.key - b.key);
  };

  getUniqueColors = (colors) => {
    return _.uniqWith(colors, _.isEqual);
  };

  getEventLocation = (e) => {
    if (e.touches && e.touches.length == 1) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.clientX && e.clientY) {
      return { x: this.mouse.x, y: this.mouse.y };
    }
  };

  onPointerDown = (e) => {
    // if mouse is down start draggin, but only if space bar is hit

    if (e.which === 2) {
      this.wantsToDrag = true;
    }

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
  };

  adjustZoom = (zoomAmount) => {
    this.cameraZoom -= zoomAmount;
  };

  drawTiles = (ctx) => {
    this.tiles.forEach((tile) => {
      tile.draw(ctx, this);
    });
  };

  draw = (ctx) => {
    this.tiles.forEach((tile) => {
      tile.draw(ctx);
    });
  };

  drawDebugBg = (ctx, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  getRandomColor = () => {
    return Math.floor(Math.random() * 220);
  };
}

export default Game;
