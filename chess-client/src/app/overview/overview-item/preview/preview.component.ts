import { Component, Input, OnInit } from "@angular/core";
import { Utils } from "src/core/utils";
import { Defaults } from "src/defaults";
import { Piece, Position } from "src/interfaces";

@Component({
  selector: "preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.css"],
})
export class PreviewComponent {
  board: Position[][] = Defaults.startingBoard;
  @Input() pieces: Piece[];
  getPiece = (position: Position) => (this.pieces ? Utils.getPiece(position, this.pieces) : null);
}
