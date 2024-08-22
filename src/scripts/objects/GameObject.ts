import { Engine } from "../engines/Engine";

export abstract class GameObject extends Engine {
  abstract id: string;
  abstract name: string;
  abstract x: number;
  abstract y: number;
  abstract width: number;
  abstract height: number;
  abstract turnOnCollision: boolean;
  abstract onCollision(target: GameObject): void;
}
