import { Color, Piece, Tile, Type } from "./interfaces";

export const startingBoard: Tile[][] = Array.from({ length: 8 }, (_, col) =>
  Array.from({ length: 8 }, (_, row) => ({
    row: 7 - row,
    col,
  }))
);

export const startingPieces: Piece[] = [
  //White
  {
    type: Type.king,
    row: 0,
    col: 4,
    taken: false,
    color: Color.white,
  },
  {
    type: Type.queen,
    row: 0,
    col: 3,
    taken: false,
    color: Color.white,
  },
  {
    type: Type.rook,
    row: 0,
    col: 0,
    taken: false,
    color: Color.white,
  },
  {
    type: Type.rook,
    row: 0,
    col: 7,
    taken: false,
    color: Color.white,
  },
  {
    type: Type.knight,
    row: 0,
    col: 1,
    taken: false,
    color: Color.white,
  },
  {
    type: Type.knight,
    row: 0,
    col: 6,
    taken: false,
    color: Color.white,
  },
  {
    type: Type.bishop,
    row: 0,
    col: 2,
    taken: false,
    color: Color.white,
  },
  {
    type: Type.bishop,
    row: 0,
    col: 5,
    taken: false,
    color: Color.white,
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    type: Type.pawn,
    row: 1,
    col: i,
    taken: false,
    color: Color.white,
  })),

  // Black
  {
    type: Type.king,
    row: 7,
    col: 4,
    taken: false,
    color: Color.black,
  },
  {
    type: Type.queen,
    row: 7,
    col: 3,
    taken: false,
    color: Color.black,
  },
  {
    type: Type.rook,
    row: 7,
    col: 0,
    taken: false,
    color: Color.black,
  },
  {
    type: Type.rook,
    row: 7,
    col: 7,
    taken: false,
    color: Color.black,
  },
  {
    type: Type.knight,
    row: 7,
    col: 1,
    taken: false,
    color: Color.black,
  },
  {
    type: Type.knight,
    row: 7,
    col: 6,
    taken: false,
    color: Color.black,
  },
  {
    type: Type.bishop,
    row: 7,
    col: 2,
    taken: false,
    color: Color.black,
  },
  {
    type: Type.bishop,
    row: 7,
    col: 5,
    taken: false,
    color: Color.black,
  },
  ...Array.from({ length: 8 }, (_, i) => ({
    type: Type.pawn,
    row: 6,
    col: i,
    taken: false,
    color: Color.black,
  })),
];
