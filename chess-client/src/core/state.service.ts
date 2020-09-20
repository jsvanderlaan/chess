import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, combineLatest } from "rxjs";
import { Defaults } from "src/defaults";
import { Attack, Color, GameState, Move, Piece } from "src/interfaces";
import { Utils } from "./utils";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class StateService {
  private readonly states: BehaviorSubject<Piece[][]> = new BehaviorSubject([Defaults.startingPieces]);
  private readonly turn: BehaviorSubject<Color> = new BehaviorSubject(Color.white);
  private readonly selected: BehaviorSubject<Piece> = new BehaviorSubject(null);
  private currentStates: Piece[][];
  private currentTurn: Color;

  pieceCanMove: (piece: Piece) => boolean;

  constructor() {
    this.states.subscribe((states) => (this.currentStates = states));
    this.turn.subscribe((turn) => (this.currentTurn = turn));
    this.pieceCanMove$().subscribe((pieceCanMove) => (this.pieceCanMove = pieceCanMove));
  }

  pieces$ = (): Observable<Piece[]> => this.states.pipe(map(Utils.last), map(Utils.filterTakenPieces));
  turn$ = (): Observable<Color> => this.turn.asObservable();
  selected$ = (): Observable<Piece | null> => this.selected.asObservable();

  moves$ = () => this.pieces$().pipe(map(Utils.filteredMoves));
  attacks$ = () => this.pieces$().pipe(map(Utils.filteredAttacks));

  gameState$ = (): Observable<GameState> =>
    combineLatest([this.pieces$(), this.turn$()]).pipe(
      map(([pieces, turn]) => {
        const endOfGame = !pieces.filter(Utils.isPieceOfColor(turn)).some(this.pieceCanMove);
        if (!endOfGame) {
          return turn === Color.white ? GameState.whitesTurn : GameState.BlacksTurn;
        }
        const check = Utils.checkForColor(pieces, turn);
        if (!check) {
          return GameState.remise;
        }
        return turn === Color.white ? GameState.blackWin : GameState.whiteWin;
      })
    );

  pieceCanMove$ = () =>
    combineLatest([this.moves$(), this.attacks$()]).pipe(
      map(([moves, attacks]) => (piece: Piece) =>
        moves.filter(Utils.moveIsOfPiece(piece)).length > 0 || attacks.filter(Utils.attackIsOfPiece(piece)).length > 0
      )
    );

  private nextTurn = () => this.turn.next(this.currentTurn === Color.white ? Color.black : Color.white);
  movePiece = (move: Move) => {
    const state = Utils.last(this.currentStates);
    const stateAfterMove = Utils.movePiece(state, move);
    // if rocade king move then get corresponsing rook move and perform move
    // if pawn to otherside then cast to piece of choice, maybe first Queen??
    this.states.next([...this.currentStates, stateAfterMove]);
    this.nextTurn();
    this.deselectPiece();
  };
  attackPiece = (attack: Attack) => {
    const state = Utils.last(this.currentStates);
    const stateAfterAttack = Utils.attackPiece(state, attack);
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
