import "./App.css";
import { useEffect, useRef } from "react";
import { useEngine } from "./engine";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { start, isRunning } = useEngine();

  useEffect(() => {
    if (!isRunning) start(canvasRef.current);
  }, [isRunning, start]);

  return (
    <>
      <canvas ref={canvasRef} id="game" className="main" />
      <div id="ui-overlay">
        <button type="button">Start</button>
      </div>
    </>
  );
}
