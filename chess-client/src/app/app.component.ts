import { Component } from "@angular/core";
import { StateService } from "src/core/state.service";
import { UtilService } from "src/core/util.service";
import { Piece, Tile, Position } from "src/interfaces";

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

  constructor(state: StateService, private readonly utilService: UtilService) {
    this.board = state.getBoard();
    this.pieces = state.getPieces();
  }

  tileToText = (tile: Tile): string => this.utilService.positionToText(tile);
  getPiece = (tile: Tile): Piece | null => this.utilService.getPiece(tile, this.pieces);
  onTileClick = (tile: Tile) => {
    this.selected = tile;
    const piece = this.getPiece(tile);
    if (!piece) return;
    this.possibleMoves = this.utilService.posibleMoves(piece, this.pieces);
  };
  isSelected = (position: Position) => this.selected && this.selected.row === position.row && this.selected.col === position.col;
  canMoveHere = (position: Position) =>
    this.possibleMoves.filter((pos) => pos.col === position.col && pos.row === position.row)?.length > 0;
}
