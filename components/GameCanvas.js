import { useEffect, useRef, useState } from "react";
import Game from "../Game/Game";
import { createClient } from "@supabase/supabase-js";
import supabaseClient from "../config/supabase";

const GameCanvas = ({ pixelBoard }) => {
  const canvasRef = useRef(null);

  const [colors, setColors] = useState([]);
  const [pickedColor, setPickedColor] = useState(colors[0]);
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (!pixelBoard) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const game = new Game(1200, 800, canvas, ctx);
    setGame(game);
    game.addEventListeners(ctx);

    // game.init(22, 2);
    game.loadFromJson(pixelBoard.data);

    // setColors(game.colors.sort((a, b) => a.key - b.key));
    setColors(game.colors);

    game.save();

    const animate = () => {
      game.update(ctx);
      requestAnimationFrame(animate);
    };
    animate();
  }, [pixelBoard]);

  useEffect(() => {
    if (!game) {
      return;
    }
    setPickedColor(game.colors[0]);
  }, [game]);

  useEffect(() => {
    if (!game) {
      return;
    }

    game.currentColor = pickedColor;
  }, [game, pickedColor]);

  const saveBoard = async () => {
    console.log(game.tiles);
    const { error } = await supabaseClient
      .from("pixelboard")
      .update({ data: JSON.stringify(game.tiles) })
      .eq("name", "My Awesome Drawing");

    console.log(error);
  };

  return (
    <div>
      <canvas id="canvas" ref={canvasRef} />
      <div className="color-picker">
        {colors.map((color) => {
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
        })}
        <button style={{ color: "darkred" }} onClick={saveBoard}>
          Save Board
        </button>
      </div>
    </div>
  );
};

export default GameCanvas;
