import { Input } from "../misc/Input";
import { Game } from "./Game";
import { State } from "../states/State";
import { Running } from "../states/player/Running";
import { Falling } from "../states/player/Falling";
import { Idling } from "../states/player/Idling";
import { Jumping } from "../states/player/Jumping";
import { Boundaries } from "../misc/Boundaries";
import { Engine } from "./Engine";

export class Player extends Engine {
  static width: number = 32;
  static height: number = 32;
  /**
   * Position X
   */
  x: number = 0;
  /**
   * Position Y
   */
  y: number = 0;
  speed: number = 0;
  baseSpeed: number = 5;
  boundaries: Boundaries = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
  model: HTMLImageElement;
  /**
   * Velocity Y
   */
  vy: number = 0;
  weight: number = 1;
  frameX: number = 0;
  maxFrame: number = 10;
  faceDirection: "left" | "right" = "right";
  states: State[] = [
    new Idling(this),
    new Running(this),
    new Jumping(this),
    new Falling(this),
  ];
  currentState: State;

  constructor(options: {
    position: { x: number; y: number };
    boundaries: Boundaries;
  }) {
    super();
    this.model = new Image();
    this.boundaries = options.boundaries;
    this.boundaries.right -= Player.width;
    this.boundaries.bottom -= Player.height;
    this.x = options.position.x;
    this.y = options.position.y - Player.height;
    this.currentState = this.states[0];
    this.currentState.enter();
  }

  update(context: CanvasRenderingContext2D): void {
    this.currentState.handleInput(Input.keys);
    if (Input.keys.includes("d")) {
      this.faceDirection = "right";
      this.speed = this.baseSpeed;
    } else if (Input.keys.includes("a")) {
      this.faceDirection = "left";
      this.speed = -this.baseSpeed;
    } else {
      this.speed = 0;
    }
    this.x += this.speed;
    if (
      this.x < this.boundaries.left &&
      this.y > this.boundaries.top - Player.height * 3
    )
      this.x = this.boundaries.left;
    if (
      this.x > this.boundaries.right &&
      this.y > this.boundaries.top - Player.height * 3
    )
      this.x = this.boundaries.right;
    this.y += this.vy;
    if (!this.onGround()) {
      this.vy += this.weight;
    } else this.vy = 0;
    if (Game.frameTimer > Game.frameInterval) {
      if (!this.animateEnd()) this.frameX++;
      else this.frameX = 0;
    }
    if (this.y > this.boundaries.bottom) this.y = this.boundaries.bottom;
    this.draw(context);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.drawImage(
      this.model,
      this.frameX * Player.width,
      0,
      Player.width,
      Player.height,
      this.x,
      this.y,
      Player.width,
      Player.height
    );
  }

  onGround() {
    return this.y >= this.boundaries.bottom;
  }

  animateEnd() {
    return this.frameX > this.maxFrame;
  }

  setState(state: number) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }
}
