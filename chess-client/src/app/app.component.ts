import { Component } from "@angular/core";
import { Utils } from "src/core/utils";
import { StateService } from "src/core/state.service";
import { Piece, Position, Color } from "src/interfaces";
import { Defaults } from "src/defaults";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styles: [],
})
export class AppComponent {
  board: Position[][] = [];
  pieces: Piece[] = [];
  selected: Piece | null = null;
  possibleMoves: Position[] = [];
  turn: Color;

  constructor(private readonly state: StateService) {
    this.board = Defaults.startingBoard;
    state.pieces$.subscribe((pieces) => (this.pieces = pieces));
    state.turn$.subscribe((turn) => (this.turn = turn));
  }

  tileToText = (position: Position): string => Utils.positionToText(position);
  getPiece = (position: Position): Piece | null => Utils.getPiece(position, this.pieces);
  onTileClick = (tile: Position) => {
    const piece = this.getPiece(tile);
    if (!this.selected) {
      if (piece) this.selectPiece(piece);
      return;
    }
    if (piece) {
      // if(canAttack && selectedIsMyPiece) return takePiece
      const pieceAlreadySelected = Utils.atPosition(this.selected)(tile);
      if (pieceAlreadySelected) return this.deselectPiece();
      return this.selectPiece(piece);
    }
    const isCurrentPieceMyPiece = this.isMyPiece(this.selected);
    if (this.canMoveHere(tile) && isCurrentPieceMyPiece) {
      this.state.movePiece(this.selected, tile);
      this.deselectPiece();
    }
  };
  private deselectPiece = () => {
    this.selected = null;
    this.possibleMoves = [];
  };
  private selectPiece = (piece: Piece) => {
    this.selected = piece;
    this.possibleMoves = Utils.moves(this.pieces, piece);
  };
  isSelected = (position: Position) => this.selected && Utils.atPosition(this.selected)(position);
  canMoveHere = (position: Position) => this.possibleMoves.some(Utils.atPosition(position));
  canInteract = (position: Position) => this.isMyPiece(this.getPiece(position));
  private isMyPiece = (piece: Piece) => Utils.isPieceOfColor({ color: this.turn }, piece);
}
