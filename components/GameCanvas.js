import { useEffect, useRef } from "react";
import Game from "../Game/Game";

const GameCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const game = new Game(800, 800, canvas, ctx);
    game.addEventListeners(ctx);

    game.init(50, 4);

    const animate = () => {
      game.update(ctx);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return <canvas id="canvas" ref={canvasRef} />;
};

export default GameCanvas;
