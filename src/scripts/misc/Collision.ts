import { Engine } from "../engines/Engine";
import { GameObject } from "../objects/GameObject";

export class Collision extends Engine {
  private objects: GameObject[];
  private margin: number = 12;
  static turnOnBox: boolean = true;

  constructor(objects: GameObject[]) {
    super();
    this.objects = objects;
  }

  register(target: GameObject): void {
    this.objects.push(target);
  }

  update(context: CanvasRenderingContext2D): void {
    for (const target of this.objects) {
      if (target.turnOnCollision) {
        const other = this.objects.find((cursor) => {
          if (!cursor.turnOnCollision) return false;
          if (cursor.name === target.name) return false;
          if (
            target.x + target.width >= cursor.x - this.margin &&
            target.x <= cursor.x + cursor.width + this.margin &&
            target.y + target.height >= cursor.y - this.margin &&
            target.y <= cursor.y + cursor.height + this.margin
          ) {
            return true;
          }
        });
        if (other) target.onCollision(other);
      }
    }
    if (Collision.turnOnBox) this.draw(context);
  }

  draw(context: CanvasRenderingContext2D): void {
    for (const target of this.objects) {
      context.strokeStyle = "red";
      context.strokeRect(
        target.x - this.margin,
        target.y - this.margin,
        target.width + this.margin * 2,
        target.height + this.margin * 2
      );
    }
  }
}
