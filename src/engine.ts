import { useCallback, useEffect, useState } from "react";
import { Game } from "./scripts/engines/Game";
import { Input } from "./scripts/misc/Input";

export function useEngine() {
  const [isRunning, setRunning] = useState(false);
  const [gameInstance, setGameInstance] = useState<Game>();

  useEffect(() => {
    new Input();
  }, []);

  const start = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      {
        if (gameInstance) return;
        if (!canvas) throw new Error("No canvas to render.");
        const game = new Game(canvas);
        setGameInstance(game);
        setRunning(true);
        function animate(timestamp: number) {
          Game.deltaTime = timestamp - Game.lastTime;
          Game.lastTime = timestamp;
          game.update();
          requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
      }
    },
    [gameInstance]
  );

  return {
    start,
    isRunning,
  };
}
