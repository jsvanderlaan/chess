import { Component } from "@angular/core";
import { StateService } from "src/core/state.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styles: [],
})
export class AppComponent {
  board: any = [];
  constructor(state: StateService) {
    this.board = state.get();
  }
}
