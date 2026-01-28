import { Engine } from "../engines/Engine";
import { Layer } from "../layers/Layer";
import { GameObject } from "../objects/GameObject";

export abstract class Level implements Engine {
  abstract name: string;
  abstract layers: Layer[];
  abstract collectables: GameObject[];
  abstract obstacles: GameObject[];

  update(context: CanvasRenderingContext2D): void {
    for (const layer of this.layers) {
      layer.update(context);
    }
  }

  draw(): void {}

  initialize(): void {
    // Hook for level-specific initialization
  }

  reset(): void {
    // Hook for resetting level state
  }

  getLayers(): Layer[] {
    return this.layers;
  }

  addLayers(layers: Layer[]) {
    this.layers.push(...layers);
  }

  addCollectable(objects: GameObject[]) {
    this.collectables.push(...objects);
  }

  addObstacle(objects: GameObject[]) {
    this.obstacles.push(...objects);
  }
}
