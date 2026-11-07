import { Level } from "../levels/Level";
import { Practice } from "../levels/Practice";
import { Collision } from "../misc/Collision";
import { Player } from "../objects/Player";
import { Engine } from "./Engine";

interface GameConfig {
  canvas: HTMLCanvasElement;
  fps?: number;
  width?: number;
  height?: number;
}

interface GameState {
  lastTime: number;
  deltaTime: number;
  frameTimer: number;
}

export class Game extends Engine {
  // The simulation runs at a fixed rate. Speeds and gravity in Player are
  // tuned per tick at 60 ticks per second.
  static readonly TICK_RATE = 60;
  static readonly STEP_MS = 1000 / Game.TICK_RATE;

  // The world is always this size in canvas pixels, whatever the window size.
  // The canvas is scaled to fit the window with CSS (see App.css).
  static readonly LOGICAL_WIDTH = 1920;
  static readonly LOGICAL_HEIGHT = 1080;

  private static readonly DEFAULT_FPS = 24;
  private static readonly INITIAL_PLAYER_Y_RATIO = 0.5;

  private static state: GameState = {
    lastTime: 0,
    deltaTime: 0,
    frameTimer: 0,
  };

  static collision: Collision;
  static canvas: HTMLCanvasElement;
  static player: Player;
  static engines: Engine[] = [];
  static level: Level;

  private context: CanvasRenderingContext2D;

  constructor(config: GameConfig) {
    super();
    const {
      canvas,
      width = Game.LOGICAL_WIDTH,
      height = Game.LOGICAL_HEIGHT,
    } = config;

    this.initializeCanvas(canvas, width, height);
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;

    this.initializeGameEntities(width, height);
  }

  private initializeCanvas(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
  ): void {
    Game.canvas = canvas;
    Game.canvas.width = width;
    Game.canvas.height = height;
  }

  private initializeGameEntities(width: number, height: number): void {
    const centerY = height * Game.INITIAL_PLAYER_Y_RATIO;
    const boundaries = { top: 0, left: 0, right: width, bottom: height };

    Game.player = new Player({
      position: { x: 0, y: centerY },
      boundaries,
    });

    Game.collision = new Collision([Game.player]);
    Game.level = new Practice(this.context);
    Game.engines.push(
      Game.level,
      ...Game.level.collectables,
      ...Game.level.obstacles,
      Game.collision,
      Game.player,
    );
  }

  update(): void {
    this.updateFrameTimer();
    this.draw();
    this.updateEngines();
  }

  private updateFrameTimer(): void {
    if (Game.state.frameTimer > this.getFrameInterval()) {
      Game.state.frameTimer = 0;
    } else {
      Game.state.frameTimer += Game.state.deltaTime;
    }
  }

  private updateEngines(): void {
    for (const engine of Game.engines) {
      engine.update(this.context);
    }
  }

  private getFrameInterval(): number {
    return 1000 / Game.DEFAULT_FPS;
  }

  draw(): void {
    this.context.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    this.context.beginPath();
  }

  static respawn(): void {
    const centerY = Game.canvas.height * Game.INITIAL_PLAYER_Y_RATIO;
    const boundaries = {
      top: 0,
      left: 0,
      right: Game.canvas.width,
      bottom: Game.canvas.height,
    };

    Game.player.respawn({ x: 0, y: centerY }, boundaries);
  }

  static getState(): Readonly<GameState> {
    return { ...Game.state };
  }

  static updateGameState(lastTime: number, deltaTime: number): void {
    Game.state.lastTime = lastTime;
    Game.state.deltaTime = deltaTime;
  }
}
