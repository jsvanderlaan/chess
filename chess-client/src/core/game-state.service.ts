import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Attack, Color, Game, GameState, Move, Piece, Type, User } from "src/interfaces";
import { GameHub } from "./game.hub";
import { Utils } from "./utils";

@Injectable({
  providedIn: "root",
})
export class GameStateService {
  private gameId: string;

  private readonly states: BehaviorSubject<Piece[][]> = new BehaviorSubject([]);
  private readonly turn: BehaviorSubject<Color> = new BehaviorSubject(Color.white);
  private readonly selected: BehaviorSubject<Piece> = new BehaviorSubject(null);
  private currentStates: Piece[][];
  private currentTurn: Color;

  pieces: Piece[] = [];
  moves: Move[] = [];
  attacks: Attack[] = [];
  userWhite: User;
  userBlack: User;

  pieceCanMove = (piece: Piece) =>
    this.moves.filter(Utils.moveIsOfPiece(piece)).length > 0 || this.attacks.filter(Utils.attackIsOfPiece(piece)).length > 0;

  constructor(private _gameHub: GameHub) {
    this.states.subscribe((states) => {
      if (!states || states.length === 0) return;
      this.currentStates = states;
      this.pieces = Utils.filterTakenPieces(Utils.last(states));
      this.attacks = Utils.filteredAttacks(this.pieces);
      this.moves = Utils.filteredMoves(this.pieces, this.attacks);
    });
    this.turn.subscribe((turn) => (this.currentTurn = turn));
    _gameHub.connection.on("GameState", (game: Game) => {
      this.userWhite = game.whiteUser;
      this.userBlack = game.blackUser;
      this.states.next(game.positions);
      this.turn.next(game.whitesTurn ? Color.white : Color.black);
    });
    _gameHub.connection.on("AddPosition", (state, whitesTurn) => {
      this.states.next([...this.currentStates, state]);
      this.turn.next(whitesTurn ? Color.white : Color.black);
    });
  }

  subscribe = (gameId) => {
    this.gameId = gameId;
    this._gameHub.subscribe(gameId);
  };

  disconnect = () => this._gameHub.connection.stop();

  turn$ = (): Observable<Color> => this.turn.asObservable();
  selected$ = (): Observable<Piece | null> => this.selected.asObservable();

  gameState = (): GameState => {
    const endOfGame = !this.pieces.filter(Utils.isPieceOfColor(this.currentTurn)).some(this.pieceCanMove);
    if (!endOfGame) {
      return this.currentTurn === Color.white ? GameState.whitesTurn : GameState.BlacksTurn;
    }
    const check = Utils.checkForColor(this.pieces, this.currentTurn);
    if (!check) {
      return GameState.remise;
    }
    return this.currentTurn === Color.white ? GameState.blackWin : GameState.whiteWin;
  };

  movePiece = (move: Move) => {
    let stateAfterMove = Utils.movePiece(this.pieces, move);

    if (Utils.isCastlingMove(move)) {
      const queenSide = move.target.col === 2;
      const rook = Utils.getPiece({ row: move.piece.row, col: queenSide ? 0 : 7 }, this.pieces);
      const rookMove: Move = { target: { row: move.piece.row, col: queenSide ? 3 : 5 }, piece: rook };
      stateAfterMove = Utils.movePiece(stateAfterMove, rookMove);
    }

    // if pawn to otherside then cast to queen for now
    if (Utils.isPromotionMove(move)) {
      stateAfterMove = stateAfterMove.map((piece) => (Utils.isSamePosition(piece)(move.target) ? { ...piece, type: Type.queen } : piece));
    }

    this._gameHub.connection.send("AddPosition", this.gameId, stateAfterMove);
    this.deselectPiece();
  };
  attackPiece = (attack: Attack) => {
    let stateAfterAttack = Utils.attackPiece(this.pieces, attack);

    // if pawn to otherside then cast to queen for now
    if (Utils.isPromotionMove(attack.move)) {
      stateAfterAttack = stateAfterAttack.map((piece) =>
        Utils.isSamePosition(piece)(attack.target) ? { ...piece, type: Type.queen } : piece
      );
    }

    this._gameHub.connection.send("AddPosition", this.gameId, stateAfterAttack);
    this.deselectPiece();
  };

  restart = () => this._gameHub.connection.send("Restart", this.gameId);

  selectPiece = (piece: Piece): void => this.selected.next(piece);
  deselectPiece = () => this.selected.next(null);
}
