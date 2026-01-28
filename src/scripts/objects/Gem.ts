import { GameObject } from "./GameObject";
import { Game } from "../engines/Game";
import Gem1 from "../../assets/3 Objects/Gems/1.png";
import Gem2 from "../../assets/3 Objects/Gems/2.png";
import Gem3 from "../../assets/3 Objects/Gems/3.png";
import Gem4 from "../../assets/3 Objects/Gems/4.png";
import Gem5 from "../../assets/3 Objects/Gems/5.png";
import Gem6 from "../../assets/3 Objects/Gems/6.png";
import { getId } from "../misc/Id";

export class Gem extends GameObject {
  private static readonly DEFAULT_WIDTH = 16;
  private static readonly DEFAULT_HEIGHT = 16;
  private static readonly GEM_TYPES = [Gem1, Gem2, Gem3, Gem4, Gem5, Gem6];
  private static readonly DEFAULT_MAX_FRAME = 6;

  readonly id: string;
  readonly name = "Gem";
  readonly width: number = Gem.DEFAULT_WIDTH;
  readonly height: number = Gem.DEFAULT_HEIGHT;

  turnOnCollision: boolean = true;
  x: number = 0;
  y: number = 0;
  model: HTMLImageElement;
  gemType: 1 | 2 | 3 | 4 | 5 | 6;
  isCollected: boolean = false;
  value: number = 10; // Points awarded for collecting
  frameX: number = 0;
  maxFrame: number = Gem.DEFAULT_MAX_FRAME;

  constructor(
    x: number,
    y: number,
    gemType: 1 | 2 | 3 | 4 | 5 | 6 = 1,
    value: number = 10,
  ) {
    super();
    this.id = getId("Gem");
    this.x = x;
    this.y = y;
    this.gemType = gemType;
    this.value = value;
    this.model = new Image();
    this.model.src = Gem.GEM_TYPES[this.gemType];
    Game.collision.register(this)
  }

  onCollision(target: GameObject): void {
    // Handle collision - typically when player touches
    if (!this.isCollected && target.name === "Player") {
      this.collect();
    }
  }

  collect(): void {
    this.isCollected = true;
    // Trigger collection effects (sound, particles, etc.)
  }

  reset(): void {
    this.isCollected = false;
  }

  update(context: CanvasRenderingContext2D): void {
    // Update gem animation each frame
    this.updateAnimation();
    this.draw(context);
  }

  private updateAnimation(): void {
    const gameState = Game.getState();
    if (gameState.frameTimer > this.getFrameInterval()) {
      if (!this.animateEnd()) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
    }
  }

  private getFrameInterval(): number {
    return 1000 / 24;
  }

  animateEnd(): boolean {
    return this.frameX >= this.maxFrame;
  }

  draw(context: CanvasRenderingContext2D): void {
    // Only draw if not collected
    if (!this.isCollected && this.model) {
      context.drawImage(
        this.model,
        this.frameX * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height,
      );
    }
  }
}
