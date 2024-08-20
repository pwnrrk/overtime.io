import { useCallback, useEffect, useState } from "react";
import { Game } from "./scripts/Game";
import { Input } from "./scripts/Input";

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
        game.init();
        setGameInstance(game);
        setRunning(true);
        function animate() {
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
