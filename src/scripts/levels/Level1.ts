import { Game } from "../engines/Game";
import { Base } from "../layers/Base";
import { Ground } from "../layers/Ground";
import { Layer } from "../layers/Layer";
import { Level } from "./Level";

interface PlatformConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Level1 extends Level {
  name: string = "Level 1";
  layers: Layer[] = [];

  constructor(context: CanvasRenderingContext2D) {
    super();
    this.buildLevel(context);
  }

  private buildLevel(context: CanvasRenderingContext2D): void {
    const width = Game.canvas.width;
    const height = Game.canvas.height;

    // Background layer
    this.layers.push(new Base(context, width, height));

    // Platform configurations for Level 1 - Zig-zag pattern with falling point
    const platforms: PlatformConfig[] = [
      // Starting platform (top-left)
      { x: 20, y: 80, width: 120, height: 40 },
      // First zig - move right and down
      { x: 220, y: 160, width: 100, height: 40 },
      // Second zag - move right and up
      { x: 420, y: 100, width: 100, height: 40 },
      // Third zig - move right and down (higher difficulty)
      { x: 620, y: 200, width: 100, height: 40 },
      // Fourth zag - move right and up
      { x: 780, y: 120, width: 100, height: 40 },
      // Falling point - narrow platform with death zone below
      { x: 900, y: 280, width: 60, height: 40 },
      // Recovery platform - back to left and up
      { x: 720, y: 180, width: 100, height: 40 },
      // Return zig - continue left-ward pattern
      { x: 540, y: 260, width: 100, height: 40 },
      // Final descent - towards bottom left
      { x: 340, y: 320, width: 100, height: 40 },
      // End platform (bottom-left)
      { x: 20, y: height - 120, width: 120, height: 40 },
      // Ground floor
      { x: 0, y: height - 50, width: width, height: 50 },
    ];

    // Create Ground layers from platform configs
    platforms.forEach((platform) => {
      this.layers.push(
        new Ground(context, platform.x, platform.y, platform.width, platform.height)
      );
    });
  }

  initialize(): void {
    // Level 1 initialization
  }

  reset(): void {
    // Reset Level 1 to initial state
  }
}
