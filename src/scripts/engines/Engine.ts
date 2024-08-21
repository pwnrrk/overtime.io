export abstract class Engine {
  abstract update(
    context: CanvasRenderingContext2D,
    ...params: unknown[]
  ): void;
  abstract draw(context: CanvasRenderingContext2D, ...params: unknown[]): void;
}
