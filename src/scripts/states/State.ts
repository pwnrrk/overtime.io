export enum states {
  IDLING = 0,
  RUNNING = 1,
  JUMPING = 2,
  FALLING = 3,
}

export abstract class State {
  state: string;
  constructor(state: string) {
    this.state = state;
  }
  abstract enter(): void;
  abstract handleInput(keys: string[]): void;
}
