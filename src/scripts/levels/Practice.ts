import { Game } from "../engines/Game";
import { Base } from "../layers/Base";
import { FloorMatt } from "../layers/FloorMatt";
import { Ground } from "../layers/Ground";
import { Layer } from "../layers/Layer";
import { Level } from "./Level";

export class Practice extends Level {
  layers: Layer[];

  constructor(context: CanvasRenderingContext2D) {
    super();
    this.layers = [
      new Base(context, Game.canvas.width, Game.canvas.height),
      new Ground(context, 0, 0, Game.canvas.width * 0.6, 400),
      new Ground(
        context,
        Game.canvas.width * 0.8,
        0,
        Game.canvas.width * 0.6,
        400
      ),
      new FloorMatt(
        context,
        Game.canvas.width * 0.8,
        400,
        Game.canvas.width * 0.6,
        16
      ),
      new Ground(
        context,
        Game.canvas.width * 0.5,
        Game.canvas.height - 400,
        Game.canvas.width * 0.2,
        50
      ),
      new Ground(
        context,
        Game.canvas.width * 0.4,
        Game.canvas.height - 300,
        Game.canvas.width * 0.2,
        50
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
        Game.canvas.width * 0.7,
        Game.canvas.height - 150,
        Game.canvas.width * 0.3,
        150
      ),
      new Ground(context, 0, Game.canvas.height - 50, Game.canvas.width, 50),
    ];
  }
}
