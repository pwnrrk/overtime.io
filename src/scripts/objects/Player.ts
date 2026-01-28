import { Input } from "../misc/Input";
import { Game } from "../engines/Game";
import { State, states } from "../states/State";
import { Running } from "../states/player/Running";
import { Falling } from "../states/player/Falling";
import { Idling } from "../states/player/Idling";
import { Jumping } from "../states/player/Jumping";
import { Boundaries } from "../misc/Boundaries";
import { GameObject } from "./GameObject";
import { LayerTypes } from "../layers/Layer";

interface PlayerConfig {
  position: { x: number; y: number };
  boundaries: Boundaries;
}

interface PlayerPhysics {
  vy: number;
  weight: number;
}

export class Player extends GameObject {
  private static readonly DEFAULT_WIDTH = 32;
  private static readonly DEFAULT_HEIGHT = 32;
  private static readonly DEFAULT_BASE_SPEED = 5;
  private static readonly DEFAULT_MAX_FRAME = 10;
  private static readonly DEFAULT_WEIGHT = 1;

  readonly id: string = "Player1";
  readonly name = "Player";
  readonly width: number = Player.DEFAULT_WIDTH;
  readonly height: number = Player.DEFAULT_HEIGHT;

  turnOnCollision: boolean = true;
  x: number = 0;
  y: number = 0;
  speed: number = 0;
  baseSpeed: number = Player.DEFAULT_BASE_SPEED;
  boundaries: Boundaries = { top: 0, left: 0, right: 0, bottom: 0 };
  model: HTMLImageElement;
  frameX: number = 0;
  maxFrame: number = Player.DEFAULT_MAX_FRAME;
  faceDirection: "left" | "right" = "right";
  currentState: State;
  groundEdgeL: number = 0;
  groundEdgeR: number = 0;

  private physics: PlayerPhysics = {
    vy: 0,
    weight: Player.DEFAULT_WEIGHT,
  };

  private states: State[];

  constructor(options: PlayerConfig) {
    super();
    this.model = new Image();
    this.initializeBoundaries(options.boundaries);
    this.initializePosition(options.position);
    this.states = this.createStates();
    this.currentState = this.states[0];
    this.currentState.enter();
  }

  private initializeBoundaries(boundaries: Boundaries): void {
    this.boundaries = { ...boundaries };
    this.boundaries.right -= this.width;
    this.boundaries.bottom -= this.height;
    this.groundEdgeL = this.boundaries.left;
    this.groundEdgeR = this.boundaries.right;
  }

  private initializePosition(position: { x: number; y: number }): void {
    this.x = position.x;
    this.y = position.y - this.height;
  }

  private createStates(): State[] {
    return [
      new Idling(this),
      new Running(this),
      new Jumping(this),
      new Falling(this),
    ];
  }

  get vy(): number {
    return this.physics.vy;
  }

  set vy(value: number) {
    this.physics.vy = value;
  }

  get weight(): number {
    return this.physics.weight;
  }

  update(context: CanvasRenderingContext2D): void {
    this.handleMovement();
    this.updatePhysics();
    this.updateAnimation();
    this.validateBoundaries();
    this.draw(context);
  }

  private handleMovement(): void {
    this.currentState.handleInput(Input.keys);

    if (Input.keys.includes("d") || Input.keys.includes("ArrowRight")) {
      this.faceDirection = "right";
      this.speed = this.baseSpeed;
    } else if (Input.keys.includes("a") || Input.keys.includes("ArrowLeft")) {
      this.faceDirection = "left";
      this.speed = -this.baseSpeed;
    } else {
      this.speed = 0;
    }

    this.x += this.speed;
    this.constrainHorizontalPosition();
  }

  private constrainHorizontalPosition(): void {
    if (
      this.x < this.boundaries.left &&
      this.y > this.boundaries.top - this.height * 3
    ) {
      this.x = this.boundaries.left;
    }
    if (
      this.x > this.boundaries.right &&
      this.y > this.boundaries.top - this.height * 3
    ) {
      this.x = this.boundaries.right;
    }
  }

  private updatePhysics(): void {
    if (this.y <= this.boundaries.top) {
      this.y = this.boundaries.top;
    }

    this.y += this.physics.vy;

    if (!this.onGround()) {
      this.physics.vy += this.physics.weight;
    } else {
      this.physics.vy = 0;
    }
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

  private validateBoundaries(): void {
    if (this.y > this.boundaries.bottom) {
      this.y = this.boundaries.bottom;
    }

    if (this.x < this.groundEdgeL || this.x > this.groundEdgeR) {
      this.boundaries.bottom = Game.canvas.height;
    }
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
      this.height,
    );
  }

  onGround(): boolean {
    return this.y >= this.boundaries.bottom;
  }

  animateEnd(): boolean {
    return this.frameX > this.maxFrame;
  }

  setState(state: number): void {
    this.currentState = this.states[state];
    this.currentState.enter();
  }

  onCollision(target: GameObject): void {
    if (target.name === LayerTypes.GROUND || target.name === "Box") {
      if (this.currentState.state === "JUMPING") {
        this.setState(states.FALLING);
      }

      if (target.y <= this.y) {
        this.handleTopCollision(target);
      } else if (this.y <= target.y + target.height) {
        this.handleBottomCollision(target);
      }
    }
  }

  private handleTopCollision(target: GameObject): void {
    if (target.x <= this.x && target.x + target.width >= this.x + this.width) {
      this.boundaries.top = target.y + target.height;
    } else if (target.x >= this.x) {
      this.boundaries.right = this.x;
    } else if (target.x + target.width <= this.x + this.width) {
      this.boundaries.left = target.x + target.width;
    }
  }

  private handleBottomCollision(target: GameObject): void {
    this.boundaries.left = 0;
    this.boundaries.right = Game.canvas.width;
    this.boundaries.bottom = target.y - this.height;
    this.groundEdgeL = target.x;
    this.groundEdgeR = target.x + target.width;
  }
}
