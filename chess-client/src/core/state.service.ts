import { Injectable } from "@angular/core";
import { Defaults } from "src/defaults";
import { Color, Piece, Tile } from "src/interfaces";

@Injectable({
  providedIn: "root",
})
export class StateService {
  private readonly board: Tile[][] = Defaults.startingBoard;
  private readonly pieces: Piece[] = Defaults.startingPieces;
  private turn: Color = Color.white;

  getBoard = (): Tile[][] => this.board;
  getPieces = (): Piece[] => this.pieces;
  getTurn = () => this.turn;
  setTurn = (color) => (this.turn = color);
}
