import { GameObject } from "./GameObject";
import Box1Idle from "../../assets/3 Objects/Boxes/1_Idle.png";
import Box2Idle from "../../assets/3 Objects/Boxes/2_Idle.png";
import Box3Idle from "../../assets/3 Objects/Boxes/3_Idle.png";
import { getId } from "../misc/Id";
import { Game } from "../engines/Game";

interface BoxState {
  state: "idle" | "hit" | "break";
}

export class Box extends GameObject {
  private static readonly DEFAULT_WIDTH = 32;
  private static readonly DEFAULT_HEIGHT = 32;
  private static readonly BOX_TYPES = [Box1Idle, Box2Idle, Box3Idle];

  readonly id: string;
  readonly name = "Box";
  readonly width: number = Box.DEFAULT_WIDTH;
  readonly height: number = Box.DEFAULT_HEIGHT;

  turnOnCollision: boolean = true;
  x: number = 0;
  y: number = 0;
  model: HTMLImageElement;
  boxType: 1 | 2 | 3;
  boxState: BoxState = { state: "idle" };
  health: number = 2; // 0: break, 1: hit, 2: idle

  constructor(x: number, y: number, boxType: 1 | 2 | 3 = 1) {
    super();
    this.id = getId("Box");
    this.x = x;
    this.y = y;
    this.boxType = boxType;
    this.model = new Image();
    this.model.src = Box.BOX_TYPES[this.boxType];
    Game.collision.register(this);
  }

  onCollision(target: GameObject): void {
    // Handle collision - typically when player hits from below
    if (target.name === "Player") {
      this.hit();
    }
  }

  hit(): void {
    if (this.health > 0) {
      this.health--;
      this.updateState();
    }
  }

  private updateState(): void {
    switch (this.health) {
      case 2:
        this.boxState.state = "idle";
        break;
      case 1:
        this.boxState.state = "hit";
        break;
      case 0:
        this.boxState.state = "break";
        break;
    }
  }

  reset(): void {
    this.health = 2;
    this.updateState();
  }

  update(context: CanvasRenderingContext2D): void {
    // Update box state each frame
    // Can be extended for animation frames, physics, etc.
    this.draw(context);
  }

  draw(context: CanvasRenderingContext2D): void {
    // Draw the box at its current position
    if (this.model) {
      console.log("Drawbox");
      context.drawImage(this.model, this.x, this.y, this.width, this.height);
    }
  }
}
