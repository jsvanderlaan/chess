import { Piece, Type, Position, Direction, Directions, Color, Move, Attack } from "src/interfaces";

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
  static last = (arr: any[]) => arr[arr.length - 1];
  static movesInDirections = (directions: Direction[], maxIterations: number = Number.MAX_VALUE) => (
    pieces: Piece[],
    piece: Piece
  ): Move[] =>
    Utils.flatten(directions.map((direction: Direction) => [...Utils.movesInDirection(pieces, piece, direction, maxIterations)]));

  static attacksInDirections = (directions: Direction[], maxIterations: number = Number.MAX_VALUE) => (
    pieces: Piece[],
    piece: Piece
  ): Attack[] => Utils.flatten(directions.map((direction: Direction) => Utils.attackInDirection(pieces, piece, direction, maxIterations)));

  static basicMoveFilter = (pieces: Piece[], piece: Piece) => (position: Position) =>
    !Utils.arePiecesSameColor(piece)(Utils.getPiece(position, pieces)) && Utils.isOnBoard(position);
  static isOnBoard = ({ row, col }: Position) => row < 8 && row >= 0 && col < 8 && col >= 0;
  static arePiecesSameColor = (piece: Piece | null) => (otherPiece: Piece | null) => piece && Utils.isPieceOfColor(piece.color)(otherPiece);
  static isPieceOfColor = (color: Color) => (piece: Piece | null) => piece && piece?.color === color;
  static pieceIsNotTaken = (piece: Piece) => !piece.taken;
  static filterTakenPieces = (pieces: Piece[]) => pieces.filter(Utils.pieceIsNotTaken);

  static kingMoves = Utils.movesInDirections(Directions.king, 1); // Add rokade
  static queenMoves = Utils.movesInDirections(Directions.queen);
  static bishopMoves = Utils.movesInDirections(Directions.bishop);
  static rookMoves = Utils.movesInDirections(Directions.rook);
  static knightMoves = Utils.movesInDirections(Directions.knight, 1);
  static pawnMoves = (pieces: Piece[], piece: Piece) =>
    Utils.movesInDirections(Directions.pawnMove(piece.color), piece.moved ? 1 : 2)(pieces, piece);

  static kingAttacks = Utils.attacksInDirections(Directions.king, 1);
  static queenAttacks = Utils.attacksInDirections(Directions.queen);
  static bishopAttacks = Utils.attacksInDirections(Directions.bishop);
  static rookAttacks = Utils.attacksInDirections(Directions.rook);
  static knightAttacks = Utils.attacksInDirections(Directions.knight, 1);
  static pawnAttacks = (pieces: Piece[], piece: Piece) => Utils.attacksInDirections(Directions.pawnAttack(piece.color), 1)(pieces, piece); // Add en passade / wanneer pion vorige beurt 2 stappen, dan kan je onderscheppen

  static movesForPiece = (pieces: Piece[]) => (piece: Piece): Move[] => Utils.moveMaps.get(piece.type)(pieces, piece);
  static moves = (pieces: Piece[]) => Utils.flatten(pieces.map(Utils.movesForPiece(pieces)));
  static filteredMoves = (pieces: Piece[]) => Utils.moves(pieces).filter(Utils.noCheckForMove(pieces));

  static attacksForPiece = (pieces: Piece[]) => (piece: Piece): Attack[] => Utils.attackMaps.get(piece.type)(pieces, piece);
  static attacks = (pieces: Piece[]) => Utils.flatten(pieces.map(Utils.attacksForPiece(pieces)));
  static filteredAttacks = (pieces: Piece[]) => Utils.attacks(pieces).filter((attack) => Utils.noCheckForAttack(pieces)(attack));

  static movePiece = (pieces: Piece[], { piece, target }: Move) =>
    pieces.map((currentPiece) =>
      Utils.isSamePiece(piece)(currentPiece) ? { ...currentPiece, row: target.row, col: target.col, moved: true } : currentPiece
    );

  static attackPiece = (pieces: Piece[], { move, target }: Attack) =>
    Utils.movePiece(pieces, move).map((piece) => (Utils.isSamePiece(target)(piece) ? { ...piece, taken: true } : piece));

  static noCheckForMove = (pieces: Piece[]) => (move: Move) => !Utils.checkForColor(Utils.movePiece(pieces, move), move.piece.color);
  static noCheckForAttack = (pieces: Piece[]) => (attack: Attack) =>
    !Utils.checkForColor(Utils.filterTakenPieces(Utils.attackPiece(pieces, attack)), attack.move.piece.color);
  static checkForColor = (pieces: Piece[], color: Color) => {
    const yourKing = pieces.find((piece) => piece.type === Type.king && piece.color === color);
    const attacks = Utils.attacks(pieces);
    return pieces
      .filter((piece) => piece.color !== color)
      .some((piece) => attacks.filter(Utils.attackIsOfPiece(piece)).some(Utils.attackHasTarget(yourKing)));
  };

  static getPiece = (position: Position, pieces: Piece[]): Piece | null => pieces.find(Utils.isSamePosition(position));
  static isSamePosition = ({ row, col }: Position) => ({ row: row2, col: col2 }: Position) => row === row2 && col === col2;
  static isSamePiece = (piece: Piece) => (piece2: Piece) =>
    piece && piece2 && Utils.isSamePosition(piece)(piece2) && piece.type === piece2.type && piece.color === piece2.color;

  static attackIsOfPiece = (piece: Piece) => (attack: Attack) => Utils.isSamePiece(piece)(attack.move.piece);
  static attackHasTarget = (piece: Piece) => (attack: Attack) => Utils.isSamePiece(piece)(attack.target);
  static moveIsOfPiece = (piece: Piece) => (move: Move) => Utils.isSamePiece(piece)(move.piece);
  static moveHasTarget = (position: Position) => (move: Move) => Utils.isSamePosition(position)(move.target);

  static moveMaps = new Map([
    [Type.king, Utils.kingMoves],
    [Type.queen, Utils.queenMoves],
    [Type.bishop, Utils.bishopMoves],
    [Type.rook, Utils.rookMoves],
    [Type.knight, Utils.knightMoves],
    [Type.pawn, Utils.pawnMoves],
  ]);

  static attackMaps = new Map([
    [Type.king, Utils.kingAttacks],
    [Type.queen, Utils.queenAttacks],
    [Type.bishop, Utils.bishopAttacks],
    [Type.rook, Utils.rookAttacks],
    [Type.knight, Utils.knightAttacks],
    [Type.pawn, Utils.pawnAttacks],
  ]);

  static *movesInDirection(pieces: Piece[], piece: Piece, direction: Direction, maxIterations: number) {
    let currPos = Utils.travelInDirection(piece)(direction);
    let iteration = 0;
    while (Utils.isOnBoard(currPos) && iteration < maxIterations) {
      const currPiece = Utils.getPiece(currPos, pieces);
      if (currPiece) {
        break;
      }
      yield { piece: piece, target: currPos };
      currPos = Utils.travelInDirection(currPos)(direction);
      iteration++;
    }
  }

  static attackInDirection(pieces: Piece[], piece: Piece, direction: Direction, maxIterations: number): Attack[] {
    let currPos = Utils.travelInDirection(piece)(direction);
    let iteration = 0;
    while (Utils.isOnBoard(currPos) && iteration < maxIterations) {
      const currPiece = Utils.getPiece(currPos, pieces);
      if (currPiece) {
        return !this.arePiecesSameColor(currPiece)(piece) ? [{ move: { piece: piece, target: currPos }, target: currPiece }] : [];
      }
      currPos = Utils.travelInDirection(currPos)(direction);
      iteration++;
    }
    return [];
  }

  static travelInDirection = ({ col, row }: Position) => ({ horizontal, vertical }: Direction) => ({
    col: col + horizontal,
    row: row + vertical,
  });
}
