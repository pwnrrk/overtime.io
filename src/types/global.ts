export abstract class Engine {
  abstract init(...params: unknown[]): void;
  abstract update(...params: unknown[]): void;
}

export interface Boundaries {
  top: number;
  left: number;
  right: number;
  bottom: number;
}
