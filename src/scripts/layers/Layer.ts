import { Engine } from "../engines/Engine";

export abstract class Layer extends Engine {
  abstract image: HTMLImageElement;
  abstract width: number;
  abstract height: number;
  abstract x: number;
  abstract y: number;
  abstract pattern: CanvasPattern | null;
}
