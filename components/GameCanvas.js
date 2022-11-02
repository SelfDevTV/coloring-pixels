import { useEffect, useRef, useState } from "react";
import Game from "../Game/Game";
import save from "../Game/save.json";

const GameCanvas = () => {
  const canvasRef = useRef(null);

  const [colors, setColors] = useState([]);
  const [pickedColor, setPickedColor] = useState(colors[0]);
  const [game, setGame] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const game = new Game(1200, 800, canvas, ctx);
    setGame(game);
    game.addEventListeners(ctx);

    game.init(22, 2);
    // game.loadFromJson(JSON.stringify(save));

    // setColors(game.colors.sort((a, b) => a.key - b.key));
    setColors(game.colors);

    game.save();

    const animate = () => {
      game.update(ctx);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

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
      </div>
    </div>
  );
};

export default GameCanvas;
