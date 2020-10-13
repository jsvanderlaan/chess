import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { OverviewHub } from "src/core/overview.hub";
import { UserService } from "src/core/user.service";
import { GameOverview } from "src/interfaces";

@Component({
  selector: "overview",
  templateUrl: "./overview.component.html",
})
export class OverviewComponent implements OnDestroy {
  gameList: GameOverview[] = [];

  constructor(private readonly _overviewHub: OverviewHub, private readonly _userService: UserService, private readonly _router: Router) {
    _overviewHub.connection.on("NewGame", (game) => (this.gameList = this.gameList.concat(game)));
    _overviewHub.connection.on("GameList", (gameList) => (this.gameList = gameList));
    _overviewHub.connection.on(
      "NewPosition",
      (position, id) => (this.gameList = this.gameList.map((game) => (game.id === id ? { ...game, position } : game)))
    );
    _overviewHub.connection.on("DeleteGame", (gameId) => (this.gameList = this.gameList.filter((game) => game.id !== gameId)));
    _overviewHub.subscribe();
  }

  ngOnDestroy() {
    this._overviewHub.connection.stop();
  }

  newGame = () => this._overviewHub.connection.send("NewGame");
  deleteGame = (gameId) => this._overviewHub.connection.send("DeleteGame", gameId);
  joinWhite = (gameId) => {
    this._userService.joinGame(gameId, true);
    this.goToGame(gameId);
  };
  joinBlack = (gameId) => {
    this._userService.joinGame(gameId, false);
    this.goToGame(gameId);
  };
  spactate = (gameId) => this.goToGame(gameId);

  private goToGame = (gameId) => this._router.navigate([`/${gameId}`]);
}
