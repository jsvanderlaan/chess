import { Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { environment } from "src/environments/environment";
import { GameOverview, User } from "src/interfaces";

@Injectable({
  providedIn: "root",
})
export class OverviewHub {
  private readonly connection: HubConnection;
  gameList: GameOverview[] = [];

  constructor() {
    this.connection = new HubConnectionBuilder().withUrl(`${environment.api}/overview`).withAutomaticReconnect().build();
    this.connection.onreconnected(() => this.connection.send("subscribe"));

    this.connection.on("NewGame", (game) => this.gameList.unshift(game));
    this.connection.on("GameList", (gameList) => (this.gameList = gameList));
    this.connection.on(
      "NewPosition",
      (position, id) => (this.gameList = this.gameList.map((game) => (game.id === id ? { ...game, position } : game)))
    );
    this.connection.on("DeleteGame", (gameId) => (this.gameList = this.gameList.filter((game) => game.id !== gameId)));
    this.connection.on("UserUpdate", (gameId, whiteUser: User, blackUser: User) => {
      this.gameList = this.gameList.map((game) => (game.id === gameId ? { ...game, whiteUser, blackUser } : game));
    });
  }

  deleteGame = (gameId) => this.connection.send("DeleteGame", gameId);
  newGame = () => this.connection.send("NewGame");

  start = () =>
    this.connection
      .start()
      .then(() => this.connection.send("subscribe"))
      .catch((err) => console.log(err));

  stop = () => this.connection.stop();
}
