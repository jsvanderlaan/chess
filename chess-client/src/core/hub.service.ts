import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class HubService {
  private _serverUrl = environment.production ? "https://api.jurre.dev" : "http://localhost:57187";
  connection = new signalR.HubConnectionBuilder().withUrl(this._serverUrl).withAutomaticReconnect().build();

  constructor() {
    this.connection
      .start()
      .then(() => console.log("connected"))
      .catch((err) => console.log(err));
  }
}
