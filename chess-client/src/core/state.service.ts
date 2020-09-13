import { Injectable } from "@angular/core";
import { startingBoard, startingPieces } from "src/defaults";
import { Piece, Tile } from "src/interfaces";
import { UtilService } from "./util.service";

@Injectable({
  providedIn: "root",
})
export class StateService {
  private readonly board: Tile[][] = startingBoard;
  private readonly pieces: Piece[] = startingPieces;

  constructor(private readonly utilService: UtilService) {}

  getBoard = (): Tile[][] => this.board;
  getPieces = (): Piece[] => this.pieces;

  //tiles = () => this.utilService.toTiles(this.board);
}
