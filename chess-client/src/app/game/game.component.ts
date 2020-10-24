import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GameStateService } from "src/core/game-state.service";
import { UserService } from "src/core/user.service";
import { Utils } from "src/core/utils";
import { Defaults } from "src/defaults";
import { Piece, Color, Position, Attack, Move } from "src/interfaces";

@Component({
  selector: "game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit, OnDestroy {
  gameId: string;
  private _board: Position[][] = Defaults.startingBoard;
  private selected: Piece | null = null;
  private turn: Color;
  private get defaultSideWhite() {
    const user = this._userService?.get();
    if (!user) return true;
    if (this.state.userWhite?.id === user.id) return true;
    if (this.state.userBlack?.id === user.id) return false;
    return true;
  }
  private setSideWhite: boolean;
  get whiteAtBottom() {
    return this.setSideWhite === undefined ? this.defaultSideWhite : this.setSideWhite;
  }

  logs: string[] = [];

  get board() {
    return this.whiteAtBottom ? this._board : this._board.reverse().map((column) => column.reverse());
  }

  constructor(readonly state: GameStateService, private route: ActivatedRoute, private readonly _userService: UserService) {
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
        return this.tryAttack({ move: { piece: this.selected, target: tile }, target: piece });
      }
      if (this.isSelected(tile)) {
        return this.state.deselectPiece();
      }
      return this.state.selectPiece(piece);
    }
    if (this.canMoveHere(tile) && isCurrentPieceMyPiece) {
      return this.tryMove({ piece: this.selected, target: tile });
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
  switchSides = () => (this.setSideWhite = this.setSideWhite === undefined ? !this.defaultSideWhite : !this.setSideWhite);
  addLog = (message: string) => this.logs.unshift(message);
  private isYourTurn = () => {
    const currentUserId = this.turn === Color.white ? this.state.userWhite?.id : this.state.userBlack?.id;
    return this._userService.get().id === currentUserId;
  };
  private tryAttack = (attack: Attack) => {
    if (!this.isYourTurn()) return this.addLog("not your turn");
    this.state.attackPiece(attack);
  };
  private tryMove = (move: Move) => {
    if (!this.isYourTurn()) return this.addLog("not your turn");
    this.state.movePiece(move);
  };
}
