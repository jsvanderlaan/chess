import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StateService {
  private readonly board = Array.from({ length: 8 }, (_, col) => Array.from({ length: 8 }, (_, row) => new Tile(7 - row, col)));

  constructor() {
    console.log(this.board);
  }

  get = () => this.board;
}

class Tile {
  public selected: boolean = false;
  public pieceid: string = null;
  constructor(private row: number, private col: number) {}

  text = () => `${this.row + 1}${this.columnToTekst.get(this.col)}`;

  private columnToTekst = new Map([
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
