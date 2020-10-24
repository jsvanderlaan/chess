import { Component, OnDestroy } from "@angular/core";
import { OverviewHub } from "src/core/overview.hub";

@Component({
  selector: "overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.css"],
})
export class OverviewComponent implements OnDestroy {
  constructor(readonly overviewHub: OverviewHub) {
    overviewHub.start();
  }

  ngOnDestroy() {
    this.overviewHub.stop();
  }
}
