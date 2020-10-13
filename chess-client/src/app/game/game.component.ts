import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GameStateService } from "src/core/game-state.service";
import { Utils } from "src/core/utils";
import { Defaults } from "src/defaults";
import { Piece, Color, Position } from "src/interfaces";

@Component({
  selector: "game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit, OnDestroy {
  private gameId: string;
  board: Position[][] = Defaults.startingBoard;
  private selected: Piece | null = null;
  private turn: Color;

  constructor(readonly state: GameStateService, private route: ActivatedRoute) {
    state.turn$().subscribe((turn) => (this.turn = turn));
    state.selected$().subscribe((selected) => (this.selected = selected));
  }

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get("id");
    this.state.subscribe(this.gameId);
  }

  ngOnDestroy() {
    this.state.disconnect();
  }

  check = () => Utils.checkForColor(this.state.pieces, this.turn);

  tileToText = (position: Position): string => Utils.positionToText(position);
  getPiece = (position: Position): Piece | null => Utils.getPiece(position, this.state.pieces);
  getSvg = (position: Position) => {
    const piece = this.getPiece(position);
    return `assets/${piece?.color}-${piece?.type}.svg`;
  };
  onTileClick = (tile: Position) => {
    const piece = this.getPiece(tile);
    if (!this.selected) {
      if (piece) {
        return this.state.selectPiece(piece);
      }
      return;
    }
    const isCurrentPieceMyPiece = this.isMyPiece(this.selected);
    if (piece) {
      if (isCurrentPieceMyPiece && this.canAttackHere(tile)) {
        return this.state.attackPiece({ move: { piece: this.selected, target: tile }, target: piece });
      }
      if (this.isSelected(tile)) {
        return this.state.deselectPiece();
      }
      return this.state.selectPiece(piece);
    }
    if (this.canMoveHere(tile) && isCurrentPieceMyPiece) {
      return this.state.movePiece({ piece: this.selected, target: tile });
    }
    this.state.deselectPiece();
  };
  isSelected = (position: Position) => this.selected && Utils.isSamePosition(this.selected)(position);
  canMoveHere = (position: Position) => this.state.moves.filter(Utils.moveIsOfPiece(this.selected)).some(Utils.moveHasTarget(position));
  canAttackHere = (position: Position) =>
    this.state.attacks.filter(Utils.attackIsOfPiece(this.selected)).some(Utils.attackHasTarget(this.getPiece(position)));
  canInteract = (position: Position) => {
    const piece = this.getPiece(position);
    return this.isMyPiece(piece) && this.state.pieceCanMove(piece);
  };
  private isMyPiece = (piece: Piece) => Utils.isPieceOfColor(this.turn)(piece);
  switchSides = () => (this.board = this.board.reverse().map((column) => column.reverse()));
}
