import { Component } from "@angular/core";
import { Utils } from "src/core/utils";
import { StateService } from "src/core/state.service";
import { Piece, Position, Color, Move } from "src/interfaces";
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
  possibleMoves: Move[] = [];
  turn: Color;

  constructor(private readonly _state: StateService) {
    this.board = Defaults.startingBoard;
    _state.pieces$().subscribe((pieces) => (this.pieces = pieces));
    _state.turn$().subscribe((turn) => (this.turn = turn));
    _state
      .moves$()
      .subscribe(
        (moves) =>
          (this.canMoveHere = (position: Position) => moves.filter(Utils.moveIsOfPiece(this.selected)).some(Utils.moveHasTarget(position)))
      );
    _state
      .attacks$()
      .subscribe(
        (attacks) =>
          (this.canAttackHere = (position: Position) =>
            attacks.filter(Utils.attackIsOfPiece(this.selected)).some(Utils.attackHasTarget(this.getPiece(position))))
      );
  }

  check = () => Utils.checkForColor(this.pieces, this.turn);

  tileToText = (position: Position): string => Utils.positionToText(position);
  getPiece = (position: Position): Piece | null => Utils.getPiece(position, this.pieces);
  onTileClick = (tile: Position) => {
    const piece = this.getPiece(tile);
    if (!this.selected) {
      if (piece) this.selectPiece(piece);
      return;
    }
    const isCurrentPieceMyPiece = this.isMyPiece(this.selected);
    if (piece) {
      if (isCurrentPieceMyPiece && this.canAttackHere(tile)) {
        this._state.attackPiece({ move: { piece: this.selected, target: tile }, target: piece });
        this.deselectPiece();
        return;
      }
      const pieceAlreadySelected = Utils.isSamePosition(this.selected)(tile);
      if (pieceAlreadySelected) return this.deselectPiece();
      return this.selectPiece(piece);
    }
    if (this.canMoveHere(tile) && isCurrentPieceMyPiece) {
      this._state.movePiece({ piece: this.selected, target: tile });
      this.deselectPiece();
      return;
    }
    this.deselectPiece();
  };
  private deselectPiece = () => {
    this.selected = null;
    this.possibleMoves = [];
  };
  private selectPiece = (piece: Piece) => {
    this.selected = piece;
    this.possibleMoves = Utils.movesForPiece(this.pieces)(piece);
  };
  isSelected = (position: Position) => this.selected && Utils.isSamePosition(this.selected)(position);
  canMoveHere = (positon: Position) => false;
  canAttackHere = (position: Position) => false;
  canInteract = (position: Position) => this.isMyPiece(this.getPiece(position)); // plus has possible moves
  private isMyPiece = (piece: Piece) => Utils.isPieceOfColor({ color: this.turn }, piece);
}
