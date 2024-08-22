import { Layer } from "./Layer";
import background from "../../assets/2 Locations/Backgrounds/1.png";
import { getId } from "../misc/Id";

export class Base extends Layer {
  id: string;
  name = "Background";
  turnOnCollision: boolean = false;
  pattern: CanvasPattern | null = null;
  image: HTMLImageElement = new Image();
  width: number = 0;
  height: number = 0;
  x: number = 0;
  y: number = 0;

  constructor(
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    super();
    this.image.src = background;
    this.image.onload = () => {
      this.pattern = context.createPattern(
        this.image,
        "repeat"
      ) as CanvasPattern;
    };
    this.width = width;
    this.height = height;
    this.id = getId("Background");
  }

  update(context: CanvasRenderingContext2D): void {
    this.draw(context);
  }

  draw(context: CanvasRenderingContext2D): void {
    if (this.pattern) {
      context.fillStyle = this.pattern;
      context.fillRect(0, 0, this.width, this.height);
    }
  }

  onCollision(): void {}
}
