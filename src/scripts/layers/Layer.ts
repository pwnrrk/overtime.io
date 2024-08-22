import { GameObject } from "../objects/GameObject";

export enum LayerTypes {
  GROUND = "Ground",
}

export abstract class Layer extends GameObject {
  abstract image: HTMLImageElement;
  abstract pattern: CanvasPattern | null;
}
