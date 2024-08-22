import { State, states } from "../State";
import playerRun from "../../../assets/1 Main Characters/1/Run.png";
import playerRunBackward from "../../../assets/1 Main Characters/1/Run_Backward.png";
import { Player } from "../../objects/Player";

export class Running extends State {
  player: Player;
  constructor(player: Player) {
    super("RUNNING");
    this.player = player;
  }
  enter(): void {
    this.player.frameX = 0;
    this.player.maxFrame = 10;
  }
  handleInput(keys: string[]): void {
    this.player.model.src =
      this.player.faceDirection === "right" ? playerRun : playerRunBackward;
    if (!keys.includes("a") && !keys.includes("d")) {
      this.player.setState(states.IDLING);
    } else if (keys.includes("w")) {
      this.player.setState(states.JUMPING);
    }
  }
}
