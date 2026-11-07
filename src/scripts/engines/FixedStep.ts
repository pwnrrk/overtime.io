/**
 * Fixed-timestep accumulator.
 *
 * Call `advance()` once per display frame (from requestAnimationFrame). It runs
 * the given step callback zero or more times so that the simulation advances at
 * a constant rate, no matter how fast the display refreshes.
 */
export class FixedStep {
  // Frames arrive with a little jitter, so a frame that is up to this much
  // short of a full step still runs it. The accumulator can dip slightly below
  // zero and corrects itself on later frames.
  private static readonly TOLERANCE_MS = 1;

  readonly stepMs: number;
  private readonly maxStepsPerFrame: number;
  private accumulator = 0;
  private previous: number | null = null;

  constructor(stepMs: number, maxStepsPerFrame = 5) {
    this.stepMs = stepMs;
    this.maxStepsPerFrame = maxStepsPerFrame;
  }

  /**
   * @param timestamp The requestAnimationFrame timestamp, in milliseconds.
   * @param step Runs one simulation step.
   * @returns How many steps ran this frame.
   */
  advance(timestamp: number, step: () => void): number {
    if (this.previous === null) {
      this.previous = timestamp;
      return 0;
    }

    const elapsed = timestamp - this.previous;
    this.previous = timestamp;

    // After a long pause (for example a background tab) do not try to catch up
    // on all the missed time; cap it so the game resumes instead of fast-forwarding.
    this.accumulator += Math.min(elapsed, this.stepMs * this.maxStepsPerFrame);

    let steps = 0;
    while (
      steps < this.maxStepsPerFrame &&
      this.accumulator + FixedStep.TOLERANCE_MS >= this.stepMs
    ) {
      step();
      this.accumulator -= this.stepMs;
      steps++;
    }
    return steps;
  }
}
