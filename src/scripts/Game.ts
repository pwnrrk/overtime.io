import { Engine } from "../types";
import { Player } from "./Player";
import background from "../assets/2 Locations/Backgrounds/1.png";

export class Game extends Engine {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  id: string;
  player: Player;

  static gameFrame: number = 0;
  static staggerFrames: number = 5;

  levelImage: HTMLImageElement = new Image();
  levelWidth = 64;
  levelHeight = 64;
  levelPattern: CanvasPattern | null = null;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.id = Math.round(Date.now() * Math.random()).toString(16);
    this.player = new Player();
    this.levelImage.src = background;
    this.levelImage.onload = () => {
      this.levelPattern = this.context.createPattern(
        this.levelImage,
        "repeat"
      ) as CanvasPattern;
    };
  }

  init(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.player.init({
      position: {
        x: 0,
        y: this.canvas.height - this.player.height,
      },
      boundaries: {
        top: 0,
        left: 0,
        right: this.canvas.width - this.player.width,
        bottom: this.canvas.height - this.player.height,
      },
    });
  }

  update(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.beginPath();
    if (this.levelPattern) {
      this.context.rect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fillStyle = this.levelPattern;
      this.context.fill();
    }
    this.player.update(this.context);
    Game.gameFrame++;
  }
}
