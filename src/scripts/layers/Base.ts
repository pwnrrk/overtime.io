import { Layer } from "./Layer";
import background from "../../assets/2 Locations/Backgrounds/1.png";
import { getId } from "../misc/Id";

export class Base extends Layer {
  id: string;
  name = "Background";
  turnOnCollision: boolean = false;
  pattern: CanvasPattern | null = null;
  image: HTMLImageElement;

  constructor(
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    super();
    this.image = new Image();
    this.image.src = background;
    this.width = width;
    this.height = height;
    this.id = getId("Background");
    this.initializePattern(context);
  }

  private initializePattern(context: CanvasRenderingContext2D): void {
    this.image.onload = () => {
      this.pattern = this.createPattern(context, this.image);
    };
  }

  update(context: CanvasRenderingContext2D): void {
    this.draw(context);
  }

  draw(context: CanvasRenderingContext2D): void {
    this.drawPattern(context, this.pattern);
  }

  onCollision(): void {}
}
