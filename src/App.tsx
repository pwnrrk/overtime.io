import "./App.css";
import { useEffect, useRef } from "react";
import { useEngine } from "./engine";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { start, isRunning, toggleCollisionBox, respawn } = useEngine();

  useEffect(() => {
    if (!isRunning) start(canvasRef.current);
  }, [isRunning, start]);

  return (
    <>
      <canvas ref={canvasRef} id="game" className="main" />
      <div id="ui-overlay">
        <button type="button" onClick={respawn}>
          Respawn
        </button>
        <button type="button" onClick={toggleCollisionBox}>
          Toggle Collision Box
        </button>
      </div>
    </>
  );
}
