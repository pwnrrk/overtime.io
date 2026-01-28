import { getId } from "../misc/Id";
import { GameObject } from "./GameObject";

interface CheckpointState {
  type: "flag" | "pointer" | "end";
  activated: boolean;
}

export class Checkpoint extends GameObject {
  private static readonly DEFAULT_WIDTH = 32;
  private static readonly DEFAULT_HEIGHT = 48;

  readonly id: string;
  readonly name = "Checkpoint";
  readonly width: number = Checkpoint.DEFAULT_WIDTH;
  readonly height: number = Checkpoint.DEFAULT_HEIGHT;

  turnOnCollision: boolean = true;
  x: number = 0;
  y: number = 0;
  model: HTMLImageElement;
  checkpointType: "flag" | "pointer" | "end";
  state: CheckpointState;

  constructor(
    x: number,
    y: number,
    checkpointType: "flag" | "pointer" | "end" = "flag",
  ) {
    super();
    this.id = getId("Checkpoint");
    this.x = x;
    this.y = y;
    this.checkpointType = checkpointType;
    this.state = {
      type: checkpointType,
      activated: false,
    };
    this.model = new Image();
  }

  onCollision(target: GameObject): void {
    // Handle collision - typically when player reaches checkpoint
    if (target.name === "Player") {
      this.activate();
    }
  }

  activate(): void {
    if (!this.state.activated) {
      this.state.activated = true;
      // Trigger checkpoint effects (save point, level end, etc.)
    }
  }

  reset(): void {
    this.state.activated = false;
  }

  isLevelEnd(): boolean {
    return this.checkpointType === "end" && this.state.activated;
  }

  update(context: CanvasRenderingContext2D): void {
    // Update checkpoint state each frame
    // Can be extended for flag waving animation, etc.
    this.draw(context);
  }

  draw(context: CanvasRenderingContext2D): void {
    // Draw the checkpoint at its current position
    if (this.model) {
      context.drawImage(this.model, this.x, this.y, this.width, this.height);
    }
  }
}
