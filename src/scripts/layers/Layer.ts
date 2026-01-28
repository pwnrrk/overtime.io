import { GameObject } from "../objects/GameObject";

export enum LayerTypes {
  GROUND = "Ground",
}

export interface LayerConfig {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export abstract class Layer extends GameObject {
  abstract image: HTMLImageElement;
  abstract pattern: CanvasPattern | null;

  x: number = 0;
  y: number = 0;
  width: number = 16;
  height: number = 16;
  turnOnCollision: boolean = false;

  abstract update(context: CanvasRenderingContext2D): void;
  abstract draw(context: CanvasRenderingContext2D): void;
  abstract onCollision(): void;

  protected createPattern(
    context: CanvasRenderingContext2D,
    image: HTMLImageElement
  ): CanvasPattern | null {
    if (!image.complete) {
      return null;
    }
    return context.createPattern(image, "repeat") as CanvasPattern;
  }

  protected drawPattern(
    context: CanvasRenderingContext2D,
    pattern: CanvasPattern | null
  ): void {
    if (pattern) {
      context.fillStyle = pattern;
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
