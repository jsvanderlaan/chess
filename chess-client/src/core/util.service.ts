import { Injectable } from "@angular/core";
import { Color, Piece, Position, Tile, Type } from "src/interfaces";

@Injectable({
  providedIn: "root",
})
export class UtilService {
  positionToText = (position: Position) => `${position.row + 1}${this.columnToText.get(position.col)}`;
  posibleMoves = (piece: Piece, pieces: Piece[]): Position[] => {
    return this.pieceMovesMap
      .get(piece.type)(piece)
      .filter((position) => this.basicMoveCheck(piece.color, position, pieces));
  };
  getPiece = (position: Position, pieces: Piece[]): Piece | null =>
    pieces.find((piece) => position.row === piece.row && position.col === piece.col) ?? null;
  toTiles = (board: Tile[][]): Tile[] => [].concat(...board);

  private basicMoveCheck = (color: Color, position: Position, pieces: Piece[]) =>
    !this.isOccupiedByOwnPiece(color, position, pieces) && this.isOnBoard(position);
  private isOccupiedByOwnPiece = (color: Color, position: Position, pieces: Piece[]) => this.getPiece(position, pieces)?.color === color;
  private isOnBoard = (position: Position) => position.row < 8 && position.row >= 0 && position.col < 8 && position.col >= 0;

  private getKingMoves = (position: Position) => [
    { row: position.row + 1, col: position.col },
    { row: position.row + 1, col: position.col + 1 },
    { row: position.row + 1, col: position.col - 1 },
    { row: position.row - 1, col: position.col + 1 },
    { row: position.row - 1, col: position.col },
    { row: position.row - 1, col: position.col - 1 },
    { row: position.row, col: position.col + 1 },
    { row: position.row, col: position.col - 1 },
  ];
  private getQueenMoves = (position: Position) => this.getBishopMoves(position).concat(this.getRookMoves(position));
  private getBishopMoves = (position: Position) => [
    { row: position.row + 1, col: position.col + 1 },
    { row: position.row + 2, col: position.col + 2 },
    { row: position.row + 3, col: position.col + 3 },
    { row: position.row + 4, col: position.col + 4 },
    { row: position.row + 5, col: position.col + 5 },
    { row: position.row + 6, col: position.col + 6 },
    { row: position.row + 7, col: position.col + 7 },
    { row: position.row + 1, col: position.col - 1 },
    { row: position.row + 2, col: position.col - 2 },
    { row: position.row + 3, col: position.col - 3 },
    { row: position.row + 4, col: position.col - 4 },
    { row: position.row + 5, col: position.col - 5 },
    { row: position.row + 6, col: position.col - 6 },
    { row: position.row + 7, col: position.col - 7 },
    { row: position.row - 1, col: position.col + 1 },
    { row: position.row - 2, col: position.col + 2 },
    { row: position.row - 3, col: position.col + 3 },
    { row: position.row - 4, col: position.col + 4 },
    { row: position.row - 5, col: position.col + 5 },
    { row: position.row - 6, col: position.col + 6 },
    { row: position.row - 7, col: position.col + 7 },
    { row: position.row - 1, col: position.col - 1 },
    { row: position.row - 2, col: position.col - 2 },
    { row: position.row - 3, col: position.col - 3 },
    { row: position.row - 4, col: position.col - 4 },
    { row: position.row - 5, col: position.col - 5 },
    { row: position.row - 6, col: position.col - 6 },
    { row: position.row - 7, col: position.col - 7 },
  ];
  private getRookMoves = (position: Position) => [
    { row: position.row, col: position.col + 1 },
    { row: position.row, col: position.col + 2 },
    { row: position.row, col: position.col + 3 },
    { row: position.row, col: position.col + 4 },
    { row: position.row, col: position.col + 5 },
    { row: position.row, col: position.col + 6 },
    { row: position.row, col: position.col + 7 },
    { row: position.row, col: position.col - 1 },
    { row: position.row, col: position.col - 2 },
    { row: position.row, col: position.col - 3 },
    { row: position.row, col: position.col - 4 },
    { row: position.row, col: position.col - 5 },
    { row: position.row, col: position.col - 6 },
    { row: position.row, col: position.col - 7 },
    { row: position.row + 1, col: position.col },
    { row: position.row + 2, col: position.col },
    { row: position.row + 3, col: position.col },
    { row: position.row + 4, col: position.col },
    { row: position.row + 5, col: position.col },
    { row: position.row + 6, col: position.col },
    { row: position.row + 7, col: position.col },
    { row: position.row - 1, col: position.col },
    { row: position.row - 2, col: position.col },
    { row: position.row - 3, col: position.col },
    { row: position.row - 4, col: position.col },
    { row: position.row - 5, col: position.col },
    { row: position.row - 6, col: position.col },
    { row: position.row - 7, col: position.col },
  ];

  private pieceMovesMap = new Map([
    [Type.king, this.getKingMoves],
    [Type.queen, this.getQueenMoves],
    [Type.bishop, this.getBishopMoves],
    [Type.rook, this.getRookMoves],
  ]);

  private columnToText = new Map([
    [0, "a"],
    [1, "b"],
    [2, "c"],
    [3, "d"],
    [4, "e"],
    [5, "f"],
    [6, "g"],
    [7, "h"],
  ]);
}
