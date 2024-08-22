import { Level } from "../levels/Level";
import { Practice } from "../levels/Practice";
import { Collision } from "../misc/Collision";
import { Player } from "../objects/Player";
import { Engine } from "./Engine";

export class Game extends Engine {
  static lastTime: number = 0;
  static deltaTime: number = 0;
  static FPS: number = 24;
  static frameInterval = 1000 / Game.FPS;
  static frameTimer: number = 0;
  static collision: Collision;
  static canvas: HTMLCanvasElement;
  static player: Player;
  static engines: Engine[] = [];
  static level: Level;
  context: CanvasRenderingContext2D;
  id: string;

  constructor(canvas: HTMLCanvasElement) {
    super();
    Game.canvas = canvas;
    Game.canvas.width = 1920;
    Game.canvas.height = 1080;
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.id = Math.round(Date.now() * Math.random()).toString(16);
    Game.player = new Player({
      position: {
        x: 0,
        y: Game.canvas.height * 0.5,
      },
      boundaries: {
        top: 0,
        left: 0,
        right: Game.canvas.width,
        bottom: Game.canvas.height,
      },
    });
    Game.collision = new Collision([Game.player]);
    Game.level = new Practice(this.context);
    Game.engines.push(Game.level, Game.player, Game.collision);
  }

  update(): void {
    if (Game.frameTimer > Game.frameInterval) {
      Game.frameTimer = 0;
    } else {
      Game.frameTimer += Game.deltaTime;
    }
    this.draw();
    for (const engine of Game.engines) {
      engine.update(this.context);
    }
  }

  draw(): void {
    this.context.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    this.context.beginPath();
  }

  static respawn() {
    Game.player.x = 0;
    Game.player.y = Game.canvas.height * 0.5;
    Game.player.boundaries = {
      top: 0,
      left: 0,
      right: Game.canvas.width,
      bottom: Game.canvas.height,
    };
  }
}
