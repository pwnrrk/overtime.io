import { Game } from "../engines/Game";
import { Base } from "../layers/Base";
import { Ground } from "../layers/Ground";
import { Layer } from "../layers/Layer";
import { Box } from "../objects/Box";
import { GameObject } from "../objects/GameObject";
import { Gem } from "../objects/Gem";
import { Level } from "./Level";

export class Practice extends Level {
  layers: Layer[];
  collectables: GameObject[] = [];
  obstacles: GameObject[] = [];
  name: string = "Practice";

  constructor(context: CanvasRenderingContext2D) {
    super();
    this.layers = [new Base(context, Game.canvas.width, Game.canvas.height)];
    this.buildLevel(context);
  }

  buildLevel(context: CanvasRenderingContext2D) {
    const ground1 = new Ground(context, 0, 844, 1216, 236);
    const ground2 = new Ground(context, 1511, 833, 409, 236);
    const pillar1 = new Ground(context, 522, 727, 119, 117);
    const ground3 = new Ground(context, 167, 508, 565, 108);
    const ground4 = new Ground(context, 927, 471, 916, 108);
    const ground5 = new Ground(context, 927, 228, 461, 108);
    const ground6 = new Ground(context, 1459, 135, 331, 105);

    this.addLayers([
      pillar1,
      ground1,
      ground2,
      ground3,
      ground4,
      ground5,
      ground6,
    ]);

    for (let i = 0; i < 6; i++) {
      this.addCollectable([new Gem(826, 575 - 16 * i)]);
    }

    for (let i = 0; i < 4; i++) {
      this.addObstacle([new Box(810, 820 - 20 * i)]);
    }

    for (let i = 0; i < 4; i++) {
      this.addObstacle([new Box(830, 820 - 20 * i)]);
    }
  }
}
