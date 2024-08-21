import { Player } from "../../engines/Player";
import { State, states } from "../State";
import playerIdle from "../../../assets/1 Main Characters/1/Idle.png";
import playerIdleBackward from "../../../assets/1 Main Characters/1/Idle_Backward.png";

export class Idling extends State {
  player: Player;
  constructor(player: Player) {
    super("IDLING");
    this.player = player;
  }
  enter(): void {
    this.player.frameX = 0;
    this.player.maxFrame = 9;
  }
  handleInput(keys: string[]): void {
    this.player.model.src =
      this.player.faceDirection === "right" ? playerIdle : playerIdleBackward;
    if (keys.includes("d") || keys.includes("a")) {
      this.player.setState(states.RUNNING);
    } else if (keys.includes("w")) {
      this.player.setState(states.JUMPING);
    }
  }
}
