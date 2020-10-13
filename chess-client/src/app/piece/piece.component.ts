import { Component, Input, OnInit } from "@angular/core";
import { Color, Piece } from "src/interfaces";

@Component({
  selector: "piece",
  templateUrl: "./piece.component.svg",
  styleUrls: ["./piece.component.css"],
})
export class PieceComponent {
  @Input() piece: Piece;
  @Input() isSelected: boolean;
  @Input() canAttackHere: boolean;
  @Input() canInteract: boolean;
  isPiece = (piece) => piece === `${this.piece?.color}-${this.piece?.type}`;
}
