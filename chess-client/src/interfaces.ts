export interface Tile {
  row: number;
  col: number;
}

export interface Piece {
  type: Type;
  row: number;
  col: number;
  taken: boolean;
  color: Color;
}

export enum Color {
  white = "white",
  black = "black",
}

export interface Position {
  col: number;
  row: number;
}

export enum Type {
  king = "king",
  queen = "queen",
  rook = "rook",
  bishop = "bishop",
  knight = "knight",
  pawn = "pawn",
}
