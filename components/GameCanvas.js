import { useEffect, useRef, useState } from "react";
import Game from "../Game/Game";
import { SketchPicker } from "react-color";

import supabaseClient from "../config/supabase";

const GameCanvas = ({ pixelBoard }) => {
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
    console.log("Game: ", game);
    console.log("CTX: ", ctx);
    if (!game || !ctx) return;

    game.addEventListeners(ctx);

    // if there is an existing pixelBoard draw it else draw an empty board
    if (pixelBoard) {
      console.log("we are playing");
      game.playMode = true;
      game.loadFromJson(pixelBoard.data);

      setColors(game.colors);
    } else {
      console.log("we are not playing");
      game.init(22, 2);
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
  }, [pixelBoard, game, ctx]);

  useEffect(() => {
    if (!game) {
      return;
    }
    if (pixelBoard) {
      console.log("pixel board found, game.colors: ", game.colors);
      setPickedColor(game.colors[0]);
    }
  }, [game, pixelBoard]);

  useEffect(() => {
    if (!game) {
      return;
    }

    game.currentColor = pickedColor;
    console.log("picked color hi", pickedColor);
  }, [game, pickedColor]);

  const saveBoard = async () => {
    const paintedTiles = game?.getOnlyPaintedTiles();

    const { error } = await supabaseClient
      .from("pixelboard")
      .update({ data: JSON.stringify(paintedTiles) })
      .eq("name", "My Awesome Drawing");

    console.log(error);
  };

  // TODO: Find out a way to store unique colors into game colors array
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
    console.log("game colors after click: ", game.colors);

    if (currentColors.length === 0) {
      return;
    }

    if (
      currentColors.find((currentColor) => currentColor.hex === color.hex) ===
      undefined
    ) {
      // create a new color with an incremented key

      console.log("Color not found yet, adding it");
      const lastColor = currentColors[currentColors.length - 1];
      console.log("last color: ", lastColor);
      const newColor = {
        key: lastColor.key + 1,
        hex: color.hex,
      };
      setPickedColor(newColor);
      console.log("new color: ", newColor);
    } else {
      // just set picked color and don't create a new color
      console.log("color found, adding this color to current color");
      setPickedColor(color);
    }
  };

  const renderColorWheel = () => {
    return (
      <SketchPicker color={pickedColor} onChangeComplete={handleColorChange} />
    );
  };

  return (
    <div>
      <canvas id="canvas" ref={canvasRef} />
      <div className="color-picker">
        {pixelBoard ? renderColorPicker() : renderColorWheel()}
        <button style={{ color: "darkred" }} onClick={saveBoard}>
          Save Board
        </button>
      </div>
    </div>
  );
};

export default GameCanvas;
