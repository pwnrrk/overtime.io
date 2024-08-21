import { Level } from "../levels/Level";
import { Practice } from "../levels/Practice";
import { Engine } from "./Engine";
import { Player } from "./Player";

export class Game extends Engine {
  static lastTime: number = 0;
  static deltaTime: number = 0;
  static FPS: number = 24;
  static frameInterval = 1000 / Game.FPS;
  static frameTimer: number = 0;
  static canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  id: string;
  player: Player;

  level: Level;

  constructor(canvas: HTMLCanvasElement) {
    super();
    Game.canvas = canvas;
    Game.canvas.width = window.innerWidth;
    Game.canvas.height = window.innerHeight;
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.id = Math.round(Date.now() * Math.random()).toString(16);
    this.player = new Player({
      position: {
        x: 0,
        y: Game.canvas.height,
      },
      boundaries: {
        top: 0,
        left: 0,
        right: Game.canvas.width,
        bottom: Game.canvas.height,
      },
    });
    this.level = new Practice(this.context);
  }

  update(): void {
    if (Game.frameTimer > Game.frameInterval) {
      Game.frameTimer = 0;
    } else {
      Game.frameTimer += Game.deltaTime;
    }
    this.draw();
    this.level.update(this.context, this.player);
    this.player.update(this.context);
  }

  draw(): void {
    this.context.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    this.context.beginPath();
  }
}
