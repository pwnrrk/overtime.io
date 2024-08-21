import { Player } from "../../engines/Player";
import { State, states } from "../State";
import playerJump from "../../../assets/1 Main Characters/1/Jump.png";
import playerJumpBackward from "../../../assets/1 Main Characters/1/Jump_Backward.png";

export class Jumping extends State {
  player: Player;
  constructor(player: Player) {
    super("JUMPING");
    this.player = player;
  }
  enter(): void {
    this.player.frameX = 0;
    this.player.maxFrame = -1;
    if (this.player.onGround()) {
      this.player.vy -= 20;
    }
  }
  handleInput(): void {
    this.player.model.src =
      this.player.faceDirection === "right" ? playerJump : playerJumpBackward;
    if (this.player.vy > this.player.weight) {
      this.player.setState(states.FALLING);
    }
  }
}
