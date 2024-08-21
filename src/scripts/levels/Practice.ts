import { Game } from "../engines/Game";
import { Player } from "../engines/Player";
import { Base } from "../layers/Base";
import { Ground } from "../layers/Ground";
import { Layer } from "../layers/Layer";
import { Boundaries } from "../misc/Boundaries";
import { Level } from "./Level";

export class Practice extends Level {
  layers: Layer[];
  boundaries: Record<number, Boundaries>;

  constructor(context: CanvasRenderingContext2D) {
    super();
    this.layers = [
      new Base(context, Game.canvas.width, Game.canvas.height),
      new Ground(context, 0, 0, Game.canvas.width * 0.3, 150),
      new Ground(
        context,
        Game.canvas.width * 0.25,
        0,
        Game.canvas.width * 0.45,
        50
      ),
      new Ground(
        context,
        Game.canvas.width * 0.65,
        0,
        Game.canvas.width * 0.35,
        150
      ),
      new Ground(
        context,
        0,
        Game.canvas.height - 150,
        Game.canvas.width * 0.3,
        150
      ),
      new Ground(
        context,
        Game.canvas.width * 0.25,
        Game.canvas.height - 50,
        Game.canvas.width * 0.45,
        50
      ),
      new Ground(
        context,
        Game.canvas.width * 0.65,
        Game.canvas.height - 150,
        Game.canvas.width * 0.35,
        150
      ),
    ];
    this.boundaries = {
      0: {
        top: 0,
        left: 0,
        right: Game.canvas.width - Player.width,
        bottom: Game.canvas.height - 150 - Player.height,
      },
      [Game.canvas.width * 0.3]: {
        top: Game.canvas.height - 50,
        left: Game.canvas.width * 0.3,
        right: Game.canvas.width - Game.canvas.width * 0.35 - Player.width,
        bottom: Game.canvas.height - 50 - Player.height,
      },
      [Game.canvas.width * 0.65]: {
        top: 0,
        left: 0,
        right: Game.canvas.width - Player.width,
        bottom: Game.canvas.height - 150 - Player.height,
      },
    };
  }
}
