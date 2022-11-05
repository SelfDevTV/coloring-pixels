import { useEffect, useRef, useState } from "react";
import Game from "../Game/Game";
import { SketchPicker } from "react-color";

import supabaseClient from "../config/supabase";

const GameCanvas = ({ pixelBoard, tileSize = 22, tileGap = 2 }) => {
  const canvasRef = useRef(null);

  const [colors, setColors] = useState([]);
  const [pickedColor, setPickedColor] = useState(colors[0]);
  const [game, setGame] = useState(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const game = new Game(1200, 800, canvas, ctx);

    setGame(game);
    setCtx(ctx);
  }, []);

  useEffect(() => {
    if (!game || !ctx) return;

    game.addEventListeners(ctx);

    // if there is an existing pixelBoard draw it else draw an empty board
    if (pixelBoard) {
      game.playMode = true;
      game.loadFromJson(pixelBoard.data);

      setColors(game.colors);
    } else {
      game.tiles = [];
      game.init(tileSize, tileGap, ctx);
      const initialColor = {
        key: 1,
        hex: "#dcfccc",
      };
      setPickedColor(initialColor);
    }

    const animate = () => {
      game.update(ctx);
      requestAnimationFrame(animate);
    };
    animate();
  }, [pixelBoard, game, ctx, tileSize, tileGap]);

  useEffect(() => {
    if (!game) {
      return;
    }
    if (pixelBoard) {
      setPickedColor(game.colors[0]);
    }
  }, [game, pixelBoard]);

  useEffect(() => {
    if (!game) {
      return;
    }

    game.currentColor = pickedColor;
  }, [game, pickedColor]);

  const saveBoard = async () => {
    const paintedTiles = game?.getOnlyPaintedTiles();

    const { error } = await supabaseClient
      .from("pixelboard")
      .update({ data: JSON.stringify(paintedTiles) })
      .eq("name", "My Awesome Drawing");
  };

  const renderColorPicker = () => {
    return colors.map((color) => {
      return (
        <button
          key={color.key}
          className="button"
          onClick={() => setPickedColor(color)}
          style={{
            backgroundColor: color.hex,
            transform:
              pickedColor?.key === color.key ? "scale(1.3)" : "scale(1)",
          }}
        >
          <p className="button-text">{color.key}</p>
        </button>
      );
    });
  };

  const handleColorChange = (color) => {
    // first get the current colors and see if it's a new one

    const currentColors = game.colors;
    if (color.key === 0) {
      setPickedColor(color);
      return;
    }

    if (currentColors.length === 0) {
      return;
    }

    if (
      currentColors.find((currentColor) => currentColor.hex === color.hex) ===
      undefined
    ) {
      // create a new color with an incremented key

      const lastColor = currentColors[currentColors.length - 1];

      const newColor = {
        key: lastColor.key + 1,
        hex: color.hex,
      };
      setPickedColor(newColor);
    } else {
      // just set picked color and don't create a new color

      setPickedColor(color);
    }
  };

  const renderColorWheel = () => {
    return (
      <>
        <SketchPicker
          color={pickedColor}
          onChangeComplete={handleColorChange}
        />
        <button onClick={() => handleColorChange({ key: 0, hex: "#ffffff" })}>
          Rubber
        </button>
      </>
    );
  };

  return (
    <div>
      <canvas id="canvas" ref={canvasRef} />
      <div className="color-picker">
        {pixelBoard ? renderColorPicker() : renderColorWheel()}
        <button onClick={saveBoard}>Save Board</button>
      </div>
    </div>
  );
};

export default GameCanvas;
