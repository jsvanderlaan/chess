import { Color, Piece, Position, Type } from "./interfaces";

const toPieces = (piece) => ({
  ...piece,
  taken: false,
  moved: false,
});
const withColor = (color) => (piece) => ({ ...piece, color });

const whitePieces = [
  {
    type: Type.king,
    row: 0,
    col: 4,
  },
  {
    type: Type.queen,
    row: 0,
    col: 3,
  },
  {
    type: Type.rook,
    row: 0,
    col: 0,
  },
  {
    type: Type.rook,
    row: 0,
    col: 7,
  },
  {
    type: Type.knight,
    row: 0,
    col: 1,
  },
  {
    type: Type.knight,
    row: 0,
    col: 6,
  },
  {
    type: Type.bishop,
    row: 0,
    col: 2,
  },
  {
    type: Type.bishop,
    row: 0,
    col: 5,
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    type: Type.pawn,
    row: 1,
    col: i,
  })),
].map(withColor(Color.white));

const blackPieces = [
  {
    type: Type.king,
    row: 7,
    col: 4,
  },
  {
    type: Type.queen,
    row: 7,
    col: 3,
  },
  {
    type: Type.rook,
    row: 7,
    col: 0,
  },
  {
    type: Type.rook,
    row: 7,
    col: 7,
  },
  {
    type: Type.knight,
    row: 7,
    col: 1,
  },
  {
    type: Type.knight,
    row: 7,
    col: 6,
  },
  {
    type: Type.bishop,
    row: 7,
    col: 2,
  },
  {
    type: Type.bishop,
    row: 7,
    col: 5,
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    type: Type.pawn,
    row: 6,
    col: i,
  })),
].map(withColor(Color.black));

const defaultPieces: Piece[] = [...whitePieces, ...blackPieces].map(toPieces);

const almostCheckMatePieces: Piece[] = [
  {
    type: Type.king,
    row: 0,
    col: 4,
    color: Color.white,
  },
  {
    type: Type.queen,
    row: 5,
    col: 1,
    color: Color.white,
  },
  {
    type: Type.bishop,
    row: 6,
    col: 2,
    color: Color.white,
  },
  {
    type: Type.king,
    row: 7,
    col: 0,
    color: Color.black,
  },
].map(toPieces);

export class Defaults {
  public static readonly startingBoard: Position[][] = Array.from({ length: 8 }, (_, col) =>
    Array.from({ length: 8 }, (_, row) => ({
      row: 7 - row,
      col,
    }))
  );

  public static readonly startingPieces = defaultPieces;
}
