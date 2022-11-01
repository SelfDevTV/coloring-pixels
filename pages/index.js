import { useEffect, useRef, useState } from "react";
import GameCanvas from "../components/GameCanvas";

export default function Home() {
  const handleClick = () => {
    console.log("click");
  };
  return (
    <div>
      <button onClick={handleClick}>Test</button>
      <GameCanvas />
    </div>
  );
}
