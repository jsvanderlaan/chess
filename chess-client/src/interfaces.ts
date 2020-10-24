export interface User {
  id: string;
  name: string;
}

export interface Game {
  whiteUser: User;
  blackUser: User;
  positions: Piece[][];
  whitesTurn: boolean;
}

export interface GameOverview {
  position: Piece[];
  whiteUser: User;
  blackUser: User;
  id: string;
}

export interface Piece {
  type: Type;
  row: number;
  col: number;
  taken: boolean;
  color: Color;
  moved: boolean;
}

export enum Color {
  white = "white",
  black = "black",
}

export enum GameState {
  whitesTurn = "white's turn",
  BlacksTurn = "black's turn",
  whiteWin = "white wins",
  blackWin = "black wins",
  remise = "remise",
}

export interface Position {
  col: number;
  row: number;
}

export interface Move {
  piece: Piece;
  target: Position;
}

export interface Attack {
  move: Move;
  target: Piece;
}

export interface Direction {
  vertical: number;
  horizontal: number;
}

export class Directions {
  public static readonly right: Direction = { horizontal: 1, vertical: 0 };
  public static readonly downRight: Direction = { horizontal: 1, vertical: -1 };
  public static readonly down: Direction = { horizontal: 0, vertical: -1 };
  public static readonly downLeft: Direction = { horizontal: -1, vertical: -1 };
  public static readonly left: Direction = { horizontal: -1, vertical: 0 };
  public static readonly upLeft: Direction = { horizontal: -1, vertical: 1 };
  public static readonly up: Direction = { horizontal: 0, vertical: 1 };
  public static readonly upRight: Direction = { horizontal: 1, vertical: 1 };
  public static readonly rook: Direction[] = [Directions.right, Directions.left, Directions.up, Directions.down];
  public static readonly bishop: Direction[] = [Directions.downRight, Directions.downLeft, Directions.upRight, Directions.upLeft];
  public static readonly king: Direction[] = [...Directions.rook, ...Directions.bishop];
  public static readonly queen: Direction[] = Directions.king;
  public static readonly knight: Direction[] = [
    { vertical: -2, horizontal: -1 },
    { vertical: -2, horizontal: 1 },
    { vertical: -1, horizontal: -2 },
    { vertical: -1, horizontal: 2 },
    { vertical: 1, horizontal: -2 },
    { vertical: 1, horizontal: 2 },
    { vertical: 2, horizontal: -1 },
    { vertical: 2, horizontal: 1 },
  ];
  public static readonly pawnMove = (color: Color) => (color === Color.white ? [Directions.up] : [Directions.down]);
  public static readonly pawnAttack = (color: Color) =>
    color === Color.white ? [Directions.upRight, Directions.upLeft] : [Directions.downRight, Directions.downLeft];
}

export enum Type {
  king = "king",
  queen = "queen",
  rook = "rook",
  bishop = "bishop",
  knight = "knight",
  pawn = "pawn",
}
