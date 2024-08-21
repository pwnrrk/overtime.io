import { Engine } from "../engines/Engine";
import { Player } from "../engines/Player";
import { Layer } from "../layers/Layer";
import { Boundaries } from "../misc/Boundaries";

export abstract class Level implements Engine {
  abstract layers: Layer[];
  abstract boundaries: Record<number, Boundaries>;

  update(context: CanvasRenderingContext2D, player: Player): void {
    for (const layer of this.layers) {
      layer.update(context);
    }
    const sortedKey = Object.keys(this.boundaries).sort(
      (a: string, b: string) => parseInt(b) - parseInt(a)
    );
    const thisKey = sortedKey.find((key) => player.x >= parseInt(key));
    const newBoundaries = this.boundaries[Number(thisKey)];
    if (newBoundaries) {
      player.boundaries = newBoundaries;
    }
  }

  draw(): void {}
}
