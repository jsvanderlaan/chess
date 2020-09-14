import { Component, ɵpublishDefaultGlobalUtils } from "@angular/core";
import { Utils } from "src/core/utils";
import { StateService } from "src/core/state.service";
import { Piece, Tile, Position, Color } from "src/interfaces";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styles: [],
})
export class AppComponent {
  board: Tile[][] = [];
  pieces: Piece[] = [];
  selected: Tile | null = null;
  possibleMoves: Position[] = [];
  turn: Color;

  constructor(state: StateService) {
    this.board = state.getBoard();
    this.pieces = state.getPieces();
    this.turn = state.getTurn();
  }

  tileToText = (position: Position): string => Utils.positionToText(position);
  getPiece = (position: Position): Piece | null => Utils.getPiece(position, this.pieces);
  onTileClick = (tile: Tile) => {
    this.selected = tile;
    const piece = this.getPiece(tile);
    if (!piece) return;
    this.possibleMoves = Utils.moves(this.pieces, piece);
  };
  isSelected = (position: Position) => this.selected && Utils.atPosition(this.selected)(position);
  canMoveHere = (position: Position) => this.possibleMoves.filter(Utils.atPosition(position))?.length > 0;
  canInteract = (position: Position) => Utils.isPieceOfColor({ color: this.turn }, this.getPiece(position));
}
