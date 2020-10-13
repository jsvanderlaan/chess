import { Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class GameHub {
  connection: HubConnection;
  gameId: string;

  constructor() {
    this.connection = new HubConnectionBuilder().withUrl(`${environment.api}/game`).withAutomaticReconnect().build();
    this.connection.onreconnected(() => this.connection.send("subscribe", this.gameId));
  }

  subscribe = (gameId: string) => {
    this.gameId = gameId;
    this.connection
      .start()
      .then(() => this.connection.send("subscribe", gameId))
      .catch((err) => console.log(err));
  };
}
