import { Component } from "@angular/core";
import { Utils } from "src/core/utils";
import { StateService } from "src/core/state.service";
import { Piece, Position, Color, Move, Attack, GameState } from "src/interfaces";
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
  gameState: GameState;

  constructor(private readonly _state: StateService) {
    this.board = Defaults.startingBoard;
    _state.pieces$().subscribe((pieces) => (this.pieces = pieces));
    _state.turn$().subscribe((turn) => (this.turn = turn));
    _state
      .moves$()
      .subscribe(
        (moves: Move[]) =>
          (this.canMoveHere = (position: Position) => moves.filter(Utils.moveIsOfPiece(this.selected)).some(Utils.moveHasTarget(position)))
      );
    _state
      .attacks$()
      .subscribe(
        (attacks: Attack[]) =>
          (this.canAttackHere = (position: Position) =>
            attacks.filter(Utils.attackIsOfPiece(this.selected)).some(Utils.attackHasTarget(this.getPiece(position))))
      );
    _state.selected$().subscribe((selected) => (this.selected = selected));
    _state.gameState$().subscribe((gameState) => (this.gameState = gameState));
  }

  check = () => Utils.checkForColor(this.pieces, this.turn);

  tileToText = (position: Position): string => Utils.positionToText(position);
  getPiece = (position: Position): Piece | null => Utils.getPiece(position, this.pieces);
  onTileClick = (tile: Position) => {
    const piece = this.getPiece(tile);
    if (!this.selected) {
      if (piece) {
        return this._state.selectPiece(piece);
      }
      return;
    }
    const isCurrentPieceMyPiece = this.isMyPiece(this.selected);
    if (piece) {
      if (isCurrentPieceMyPiece && this.canAttackHere(tile)) {
        return this._state.attackPiece({ move: { piece: this.selected, target: tile }, target: piece });
      }
      if (this.isSelected(tile)) {
        return this._state.deselectPiece();
      }
      return this._state.selectPiece(piece);
    }
    if (this.canMoveHere(tile) && isCurrentPieceMyPiece) {
      return this._state.movePiece({ piece: this.selected, target: tile });
    }
    this._state.deselectPiece();
  };
  isSelected = (position: Position) => this.selected && Utils.isSamePosition(this.selected)(position);
  canMoveHere;
  canAttackHere;
  canInteract = (position: Position) => {
    const piece = this.getPiece(position);
    return this.isMyPiece(piece) && this._state.pieceCanMove(piece);
  };
  private isMyPiece = (piece: Piece) => Utils.isPieceOfColor(this.turn)(piece);
  restart = this._state.restart;
}
