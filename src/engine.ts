import { useCallback, useEffect, useState } from "react";
import { Game } from "./scripts/engines/Game";
import { FixedStep } from "./scripts/engines/FixedStep";
import { Input } from "./scripts/misc/Input";
import { Collision } from "./scripts/misc/Collision";

export function useEngine() {
    const [isRunning, setRunning] = useState(false);
    const [gameInstance, setGameInstance] = useState<Game>();

    useEffect(() => {
        new Input();
    }, []);

    const start = useCallback(
        (canvas: HTMLCanvasElement | null) => {
            if (gameInstance) return;
            if (!canvas) throw new Error("No canvas to render.");

            const game = new Game({ canvas });
            setGameInstance(game);
            setRunning(true);

            // Advance the game at a fixed rate so speed does not depend on the
            // display's refresh rate.
            const loop = new FixedStep(Game.STEP_MS);

            function animate(timestamp: number) {
                loop.advance(timestamp, () => {
                    Game.updateGameState(timestamp, Game.STEP_MS);
                    game.update();
                });
                requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate);
        },
        [gameInstance]
    );

    return {
        start,
        isRunning,
        toggleCollisionBox() {
            Collision.turnOnBox = !Collision.turnOnBox;
        },
        respawn() {
            Game.respawn();
        },
    };
}
