import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Attack, Color, GameState, Move, Piece } from "src/interfaces";
import { HubService } from "./hub.service";
import { Utils } from "./utils";

@Injectable({
  providedIn: "root",
})
export class StateService {
  private readonly states: BehaviorSubject<Piece[][]> = new BehaviorSubject([]);
  private readonly turn: BehaviorSubject<Color> = new BehaviorSubject(Color.white);
  private readonly selected: BehaviorSubject<Piece> = new BehaviorSubject(null);
  private currentStates: Piece[][];
  private currentTurn: Color;

  pieces: Piece[] = [];
  moves: Move[] = [];
  attacks: Attack[] = [];

  pieceCanMove = (piece: Piece) =>
    this.moves.filter(Utils.moveIsOfPiece(piece)).length > 0 || this.attacks.filter(Utils.attackIsOfPiece(piece)).length > 0;

  constructor(private _hub: HubService) {
    this.states.subscribe((states) => {
      if (!states || states.length === 0) return;
      this.currentStates = states;
      this.pieces = Utils.filterTakenPieces(Utils.last(states));
      this.moves = Utils.filteredMoves(this.pieces);
      this.attacks = Utils.filteredAttacks(this.pieces);
    });
    this.turn.subscribe((turn) => (this.currentTurn = turn));
    _hub.connection.on("newGame", (whitesTurn, states) => {
      this.states.next(states);
      this.turn.next(whitesTurn ? Color.white : Color.black);
    });
    _hub.connection.on("newState", (whitesTurn, state) => {
      this.states.next([...this.currentStates, state]);
      this.turn.next(whitesTurn ? Color.white : Color.black);
    });
  }

  turn$ = (): Observable<Color> => this.turn.asObservable();
  selected$ = (): Observable<Piece | null> => this.selected.asObservable();

  gameState = (): GameState => {
    const endOfGame = !this.pieces.filter(Utils.isPieceOfColor(this.currentTurn)).some(this.pieceCanMove);
    if (!endOfGame) {
      return this.currentTurn === Color.white ? GameState.whitesTurn : GameState.BlacksTurn;
    }
    const check = Utils.checkForColor(this.pieces, this.currentTurn);
    if (!check) {
      return GameState.remise;
    }
    return this.currentTurn === Color.white ? GameState.blackWin : GameState.whiteWin;
  };

  movePiece = (move: Move) => {
    const stateAfterMove = Utils.movePiece(this.pieces, move);
    // if rocade king move then get corresponsing rook move and perform move
    // if pawn to otherside then cast to piece of choice, maybe first Queen??
    this._hub.connection.send("addState", stateAfterMove);
    this.deselectPiece();
  };
  attackPiece = (attack: Attack) => {
    const stateAfterAttack = Utils.attackPiece(this.pieces, attack);
    this._hub.connection.send("addState", stateAfterAttack);
    this.deselectPiece();
  };

  restart = () => this._hub.connection.send("restart");

  selectPiece = (piece: Piece): void => this.selected.next(piece);
  deselectPiece = () => this.selected.next(null);
}
