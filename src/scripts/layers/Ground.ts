import { Layer } from "./Layer";
import Tile from "../../assets/2 Locations/Tiles/Tile_63.png";

export class Ground extends Layer {
  pattern: CanvasPattern | null = null;
  image: HTMLImageElement;
  width: number = 16;
  height: number = 16;
  x: number = 0;
  y: number;

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super();
    this.image = new Image();
    this.image.src = Tile;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image.onload = () => {
      this.pattern = context.createPattern(
        this.image,
        "repeat"
      ) as CanvasPattern;
    };
  }

  update(context: CanvasRenderingContext2D): void {
    this.draw(context);
  }

  draw(context: CanvasRenderingContext2D): void {
    if (this.pattern) {
      context.fillStyle = this.pattern;
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
