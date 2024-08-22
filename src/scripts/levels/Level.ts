import { Engine } from "../engines/Engine";
import { Layer } from "../layers/Layer";

export abstract class Level implements Engine {
  abstract layers: Layer[];

  update(context: CanvasRenderingContext2D): void {
    for (const layer of this.layers) {
      layer.update(context);
    }
  }

  draw(): void {}
}
