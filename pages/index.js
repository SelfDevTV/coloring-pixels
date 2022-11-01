import { useEffect, useRef, useState } from "react";
import Game from "../Game/Game";
import Tile from "../Game/Tile";

export default function Home() {
  const canvasRef = useRef(null);
  const [game, setGame] = useState(null);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    setContext(ctx);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const game = new Game(800, 800, canvas);
    ctx.scale(3, 3);

    game.init(10, 2);
    game.draw(ctx);
    console.log(game.tiles);

    setGame(game);

    const animate = () => {
      game.updateTiles(ctx);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const handleClick = () => {
    game.updateTiles(context);
  };

  return (
    <div>
      <button onClick={handleClick}>Test</button>
      <canvas
        style={{
          background: "red",
        }}
        ref={canvasRef}
      />
    </div>
  );
}
