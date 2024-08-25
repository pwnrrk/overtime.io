import { State, states } from "../State";
import playerJump from "../../../assets/1 Main Characters/1/Jump.png";
import playerJumpBackward from "../../../assets/1 Main Characters/1/Jump_Backward.png";
import { Player } from "../../objects/Player";
import { Game } from "../../engines/Game";

export class Jumping extends State {
  player: Player;
  jumpPower: number = 20;
  constructor(player: Player) {
    super("JUMPING");
    this.player = player;
  }
  enter(): void {
    this.player.frameX = 0;
    this.player.maxFrame = -1;
    if (this.player.onGround()) {
      this.player.boundaries.top = 0;
      this.player.boundaries.right = Game.canvas.width - this.player.width;
      this.player.boundaries.bottom = Game.canvas.height - this.player.height;
      this.player.boundaries.left = 0;
      this.player.vy -= this.jumpPower;
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
