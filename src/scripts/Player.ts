import { Boundaries, Engine } from "../types";
import { Input } from "./Input";
import playerIdle from "../assets/1 Main Characters/1/Idle.png";
import playerRun from "../assets/1 Main Characters/1/Run.png";
import { Game } from "./Game";

export class Player extends Engine {
  /**
   * Position X
   */
  x: number = 0;
  /**
   * Position Y
   */
  y: number = 0;
  speed: number = 5;
  boundaries: Boundaries = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
  width: number = 32;
  height: number = 38;
  model: CanvasImageSource;
  /**
   * Velocity Y
   */
  vy: number = 0;
  weight: number = 1;

  frameX: number = 0;
  maxAnimate: number = 10;

  constructor() {
    super();
    this.model = new Image();
    this.model.src = playerIdle;
  }

  init(options: {
    position: { x: number; y: number };
    boundaries: Boundaries;
  }): void {
    this.boundaries = options.boundaries;
    this.x = options.position.x;
    this.y = options.position.y;
  }

  update(context: CanvasRenderingContext2D): void {
    // Draw the player
    context.beginPath();
    context.drawImage(
      this.model,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );

    // Move Right
    if (Input.keys.includes("d") && this.x < this.boundaries.right) {
      this.x += this.speed;
      (this.model as HTMLImageElement).src = playerRun;
    }
    // Move Lefta
    if (Input.keys.includes("a") && this.x > this.boundaries.left) {
      this.x -= this.speed;
    }
    // Jump
    if (Input.keys.includes("w") && this.onGround()) this.vy -= 20;
    this.y += this.vy;
    // Fall
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;

    // Update animation
    if (Game.gameFrame % Game.staggerFrames === 0) {
      if (!this.animateEnd()) this.frameX++;
      else this.frameX = 0;
    }
  }

  onGround() {
    return this.y >= this.boundaries.bottom;
  }

  animateEnd() {
    return this.frameX === this.maxAnimate;
  }
}
