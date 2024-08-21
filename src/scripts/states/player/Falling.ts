import { Player } from "../../engines/Player";
import playerFall from "../../../assets/1 Main Characters/1/Fall.png";
import playerFallBackward from "../../../assets/1 Main Characters/1/Fall_Backward.png";
import { State, states } from "../State";

export class Falling extends State {
  player: Player;
  constructor(player: Player) {
    super("FALLING");
    this.player = player;
  }
  enter(): void {
    this.player.frameX = 0;
    this.player.maxFrame = -1;
  }
  handleInput(): void {
    this.player.model.src =
      this.player.faceDirection === "right" ? playerFall : playerFallBackward;
    if (this.player.onGround()) {
      this.player.setState(states.RUNNING);
    }
  }
}
