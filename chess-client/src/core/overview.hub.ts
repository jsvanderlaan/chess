import { Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class OverviewHub {
  connection: HubConnection;

  constructor() {
    this.connection = new HubConnectionBuilder().withUrl(`${environment.api}/overview`).withAutomaticReconnect().build();
    this.connection.onreconnected(() => this.connection.send("subscribe"));
  }

  subscribe = () =>
    this.connection
      .start()
      .then(() => this.connection.send("subscribe"))
      .catch((err) => console.log(err));
}
