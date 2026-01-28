import { Layer } from "./Layer";
import Tile from "../../assets/2 Locations/Tiles/Tile_63.png";
import { Game } from "../engines/Game";
import { getId } from "../misc/Id";

export class Ground extends Layer {
  id: string;
  name = "Ground";
  turnOnCollision: boolean = true;
  pattern: CanvasPattern | null = null;
  image: HTMLImageElement;

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
    this.id = getId("Ground");
    this.initializePattern(context);
    Game.collision.register(this);
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
