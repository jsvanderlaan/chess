import { Component } from "@angular/core";
import { OverviewHub } from "src/core/overview.hub";

@Component({
  selector: "new-game",
  templateUrl: "./new-game.component.html",
  styleUrls: ["./new-game.component.css"],
})
export class NewGameComponent {
  constructor(private readonly _overviewHub: OverviewHub) {}

  newGame = () => this._overviewHub.newGame();
}
