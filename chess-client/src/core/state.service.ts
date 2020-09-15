import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Defaults } from "src/defaults";
import { Color, Piece, Position } from "src/interfaces";
import { Utils } from "./utils";

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

  get pieces$(): Observable<Piece[]> {
    return this.pieces.asObservable();
  }
  get turn$(): Observable<Color> {
    return this.turn.asObservable();
  }
  private nextTurn = () => this.turn.next(this.currentTurn === Color.white ? Color.black : Color.white);
  movePiece = (piece: Piece, position: Position) => {
    const newPieces = this.currentPieces.map((currentPiece) => {
      if (Utils.atPosition(piece)(currentPiece)) return { ...currentPiece, row: position.row, col: position.col };
      return currentPiece;
    });
    this.pieces.next(newPieces);
    this.nextTurn();
  };
}
