import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Defaults } from "src/defaults";
import { Attack, Color, Move, Piece } from "src/interfaces";
import { Utils } from "./utils";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class StateService {
  private readonly pieces: BehaviorSubject<Piece[]> = new BehaviorSubject(Defaults.startingPieces);
  private readonly turn: BehaviorSubject<Color> = new BehaviorSubject(Color.white);
  private currentPieces: Piece[];
  private currentTurn: Color;

  constructor() {
    this.pieces.subscribe((pieces) => (this.currentPieces = pieces));
    this.turn.subscribe((turn) => (this.currentTurn = turn));
  }

  pieces$ = (): Observable<Piece[]> => this.pieces.pipe(map(Utils.filterTakenPieces));
  turn$ = (): Observable<Color> => this.turn.asObservable();

  moves$ = () => this.pieces$().pipe(map(Utils.filteredMoves));
  attacks$ = () => this.pieces$().pipe(map(Utils.filteredAttacks));

  private nextTurn = () => this.turn.next(this.currentTurn === Color.white ? Color.black : Color.white);
  movePiece = (move: Move) => {
    const piecesAfterMove = Utils.movePiece(this.currentPieces, move);
    this.pieces.next(piecesAfterMove);
    this.nextTurn();
  };
  attackPiece = (attack: Attack) => {
    const piecesAfterAttack = Utils.attackPiece(this.currentPieces, attack);
    this.pieces.next(piecesAfterAttack);
    this.nextTurn();
  };
}
