import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Defaults } from "src/defaults";
import { Attack, Color, GameState, Move, Piece } from "src/interfaces";
import { Utils } from "./utils";

@Injectable({
  providedIn: "root",
})
export class StateService {
  private readonly states: BehaviorSubject<Piece[][]> = new BehaviorSubject([Defaults.startingPieces]);
  private readonly turn: BehaviorSubject<Color> = new BehaviorSubject(Color.white);
  private readonly selected: BehaviorSubject<Piece> = new BehaviorSubject(null);
  private currentStates: Piece[][];
  private currentTurn: Color;

  pieces: Piece[] = [];
  moves: Move[] = [];
  attacks: Attack[] = [];

  pieceCanMove = (piece: Piece) =>
    this.moves.filter(Utils.moveIsOfPiece(piece)).length > 0 || this.attacks.filter(Utils.attackIsOfPiece(piece)).length > 0;

  constructor() {
    this.states.subscribe((states) => {
      this.currentStates = states;
      this.pieces = Utils.filterTakenPieces(Utils.last(states));
      this.moves = Utils.filteredMoves(this.pieces);
      this.attacks = Utils.filteredAttacks(this.pieces);
    });
    this.turn.subscribe((turn) => (this.currentTurn = turn));
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

  private nextTurn = () => this.turn.next(this.currentTurn === Color.white ? Color.black : Color.white);
  movePiece = (move: Move) => {
    const stateAfterMove = Utils.movePiece(this.pieces, move);
    // if rocade king move then get corresponsing rook move and perform move
    // if pawn to otherside then cast to piece of choice, maybe first Queen??
    this.states.next([...this.currentStates, stateAfterMove]);
    this.nextTurn();
    this.deselectPiece();
  };
  attackPiece = (attack: Attack) => {
    const stateAfterAttack = Utils.attackPiece(this.pieces, attack);
    this.states.next([...this.currentStates, stateAfterAttack]);
    this.nextTurn();
    this.deselectPiece();
  };

  restart = () => {
    this.states.next([Defaults.startingPieces]);
    this.turn.next(Color.white);
  };

  selectPiece = (piece: Piece): void => this.selected.next(piece);
  deselectPiece = () => this.selected.next(null);
}
