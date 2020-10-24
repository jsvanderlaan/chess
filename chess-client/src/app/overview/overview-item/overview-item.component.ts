import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { OverviewHub } from "src/core/overview.hub";
import { UserService } from "src/core/user.service";
import { GameOverview } from "src/interfaces";

@Component({
  selector: "overview-item",
  templateUrl: "./overview-item.component.html",
  styleUrls: ["./overview-item.component.css"],
})
export class OverviewItemComponent {
  @Input() game: GameOverview;

  constructor(private readonly _overviewHub: OverviewHub, private readonly _userService: UserService, private readonly _router: Router) {}

  deleteGame = (gameId, event) => {
    event.stopPropagation();
    this._overviewHub.deleteGame(gameId);
  };
  joinWhite = (gameId, event) => {
    event.stopPropagation();
    this._userService.joinGame(gameId, true);
    this.goToGame(gameId);
  };
  joinBlack = (gameId, event) => {
    event.stopPropagation();
    this._userService.joinGame(gameId, false);
    this.goToGame(gameId);
  };
  spactate = (gameId) => {
    this.goToGame(gameId);
  };

  private goToGame = (gameId) => this._router.navigate([`/${gameId}`]);
}
