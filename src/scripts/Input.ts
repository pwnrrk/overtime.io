export class Input {
  static keys: string[] = [];

  private static keydownListener(ev: KeyboardEvent) {
    if (!Input.keys.includes(ev.key)) Input.keys.push(ev.key);
  }

  private static keyupListener(ev: KeyboardEvent) {
    Input.keys = Input.keys.filter((key) => key !== ev.key);
  }

  constructor() {
    window.removeEventListener("keydown", Input.keydownListener);
    window.removeEventListener("keyup", Input.keyupListener);

    window.addEventListener("keydown", Input.keydownListener);
    window.addEventListener("keyup", Input.keyupListener);
  }
}
