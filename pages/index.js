import { useEffect, useRef, useState } from "react";
import GameCanvas from "../components/GameCanvas";

export default function Home() {
  const handleClick = () => {
    console.log("click");
  };
  return (
    <div>
      <h1>Coloring Pixels</h1>

      <GameCanvas />
    </div>
  );
}
