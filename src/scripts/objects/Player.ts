import { Input } from "../misc/Input";
import { Game } from "../engines/Game";
import { State } from "../states/State";
import { Running } from "../states/player/Running";
import { Falling } from "../states/player/Falling";
import { Idling } from "../states/player/Idling";
import { Jumping } from "../states/player/Jumping";
import { Boundaries } from "../misc/Boundaries";
import { GameObject } from "./GameObject";
import { LayerTypes } from "../layers/Layer";

export class Player extends GameObject {
  id: string = "Player1";
  name = "Player";
  turnOnCollision: boolean = true;
  width: number = 32;
  height: number = 32;
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
  groundEdgeL: number;
  groundEdgeR: number;

  constructor(options: {
    position: { x: number; y: number };
    boundaries: Boundaries;
  }) {
    super();
    this.model = new Image();
    this.boundaries = options.boundaries;
    this.boundaries.right -= this.width;
    this.boundaries.bottom -= this.height;
    this.groundEdgeL = this.boundaries.left;
    this.groundEdgeR = this.boundaries.right;
    this.x = options.position.x;
    this.y = options.position.y - this.height;
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
      this.y > this.boundaries.top - this.height * 3
    )
      this.x = this.boundaries.left;
    if (
      this.x > this.boundaries.right &&
      this.y > this.boundaries.top - this.height * 3
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
    if (this.x < this.groundEdgeL || this.x > this.groundEdgeR)
      this.boundaries.bottom = Game.canvas.height;
    this.draw(context);
  }

  draw(context: CanvasRenderingContext2D): void {
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
  }

  onGround() {
    return this.y >= this.boundaries.bottom ;
  }

  animateEnd() {
    return this.frameX > this.maxFrame;
  }

  setState(state: number) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }

  onCollision(target: GameObject): void {
    if (target.name === LayerTypes.GROUND) {
      if (
        target.y <= this.y &&
        target.y + target.height >= this.y + this.height
      ) {
        if (target.x >= this.x) this.boundaries.right = this.x;
        else if (target.x <= this.x)
          this.boundaries.left = target.x + target.width;
      } else if (this.y <= target.y + target.height) {
        this.boundaries.bottom = target.y - this.height;
        this.groundEdgeL = target.x;
        this.groundEdgeR = target.x + target.width;
      }
    }
  }
}
