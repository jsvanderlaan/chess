import { Component } from "@angular/core";
import { UserService } from "src/core/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  constructor(userService: UserService) {
    userService.init();
  }
}
