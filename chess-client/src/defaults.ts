import { Color, Piece, Position, Type } from "./interfaces";

export class Defaults {
  public static readonly startingBoard: Position[][] = Array.from({ length: 8 }, (_, col) =>
    Array.from({ length: 8 }, (_, row) => ({
      row: 7 - row,
      col,
    }))
  );

  private static readonly whitePieces = [
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
  ].map((piece) => ({ ...piece, color: Color.white }));

  private static blackPieces = [
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
  ].map((piece) => ({ ...piece, color: Color.black }));

  public static readonly startingPieces: Piece[] = [...Defaults.whitePieces, ...Defaults.blackPieces].map((piece) => ({
    ...piece,
    taken: false,
    moved: false,
  }));
}
