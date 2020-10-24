import { Component, Input, OnInit } from "@angular/core";
import { UserService } from "src/core/user.service";
import { User } from "src/interfaces";

@Component({
  selector: "player-display",
  templateUrl: "./player-display.component.html",
  styleUrls: ["./player-display.component.css"],
})
export class PlayerDisplayComponent {
  @Input() gameId: string;
  @Input() player: User;
  @Input() white: boolean;

  constructor(private readonly _userService: UserService) {}

  join = (event) => {
    event.stopPropagation();
    this._userService.joinGame(this.gameId, this.white);
  };
}
