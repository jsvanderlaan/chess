import { Piece, Type, Position, Direction, Directions, Color } from "src/interfaces";

export class Utils {
  static positionToText = (position: Position) => `${position.row + 1}${Utils.columnToText.get(position.col)}`;

  static columnToText = new Map([
    [0, "a"],
    [1, "b"],
    [2, "c"],
    [3, "d"],
    [4, "e"],
    [5, "f"],
    [6, "g"],
    [7, "h"],
  ]);

  static flatten = <T>(arr: T[][]): T[] => [].concat(...arr);

  static freePositionsInDirections = (directions: Direction[], maxIterations: number = Number.MAX_VALUE) => (
    pieces: Piece[],
    piece: Piece
  ): Position[] =>
    Utils.flatten(directions.map((direction: Direction) => [...Utils.freePositionsInDirection(pieces, piece, direction, maxIterations)]));

  static basicMoveFilter = (pieces: Piece[], piece: Piece) => (position: Position) =>
    !Utils.isPieceOfColor(piece, Utils.getPiece(position, pieces)) && Utils.isOnBoard(position);
  static isOnBoard = ({ row, col }: Position) => row < 8 && row >= 0 && col < 8 && col >= 0;
  static isPieceOfColor = (piece: { color: Color } | null, otherPiece: { color: Color } | null) =>
    piece && piece?.color === otherPiece?.color;
  static kingMoves = Utils.freePositionsInDirections(Directions.king, 1);
  static queenMoves = Utils.freePositionsInDirections(Directions.queen);
  static bishopMoves = Utils.freePositionsInDirections(Directions.bishop);
  static rookMoves = Utils.freePositionsInDirections(Directions.rook);
  static knightMoves = Utils.freePositionsInDirections(Directions.knight, 1);
  static pawnMoves = (pieces: Piece[], piece: Piece) => Utils.freePositionsInDirections(Directions.pawnMove(piece.color), 1)(pieces, piece);

  static moves = (pieces: Piece[], piece: Piece): Position[] => Utils.moveMap.get(piece.type)(pieces, piece); //filter moves that result in check
  static getPiece = (position: Position, pieces: Piece[]): Piece | null => pieces.find(Utils.atPosition(position));
  static atPosition = ({ row, col }: Position) => ({ row: row2, col: col2 }: Position) => row === row2 && col === col2;

  static moveMap = new Map([
    [Type.king, Utils.kingMoves],
    [Type.queen, Utils.queenMoves],
    [Type.bishop, Utils.bishopMoves],
    [Type.rook, Utils.rookMoves],
    [Type.knight, Utils.knightMoves],
    [Type.pawn, Utils.pawnMoves],
  ]);

  static *freePositionsInDirection(pieces: Piece[], piece: Piece, direction: Direction, maxIterations: number) {
    let currPos = Utils.travelInDirection(piece)(direction);
    let iteration = 0;
    while (Utils.isOnBoard(currPos) && iteration < maxIterations) {
      const currPiece = Utils.getPiece(currPos, pieces);
      if (currPiece) {
        break;
      }
      yield currPos;
      currPos = Utils.travelInDirection(currPos)(direction);
      iteration++;
    }
  }

  static travelInDirection = ({ col, row }: Position) => ({ horizontal, vertical }: Direction) => ({
    col: col + horizontal,
    row: row + vertical,
  });
}
