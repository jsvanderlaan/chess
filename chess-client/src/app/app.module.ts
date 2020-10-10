import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { PieceComponent } from "./piece.component";
import { WhiteKingComponent } from "./pieces/white-king.component";
import { WhiteQueenComponent } from "./pieces/white-queen.component";
import { WhiteBishopComponent } from "./pieces/white-bishop.component";
import { WhiteKnightComponent } from "./pieces/white-knight.component";
import { WhiteRookComponent } from "./pieces/white-rook.component";
import { WhitePawnComponent } from "./pieces/white-pawn.component";
import { BlackKingComponent } from "./pieces/black-king.component";
import { BlackQueenComponent } from "./pieces/black-queen.component";
import { BlackBishopComponent } from "./pieces/black-bishop.component";
import { BlackKnightComponent } from "./pieces/black-knight.component";
import { BlackRookComponent } from "./pieces/black-rook.component";
import { BlackPawnComponent } from "./pieces/black-pawn.component";
import { WhiteGiraffeComponent } from "./pieces/white-giraffe.component";
import { BlackGiraffeComponent } from "./pieces/black-giraffe.component";

@NgModule({
  declarations: [
    AppComponent,
    PieceComponent,

    WhiteKingComponent,
    WhiteQueenComponent,
    WhiteBishopComponent,
    WhiteKnightComponent,
    WhiteGiraffeComponent,
    WhiteRookComponent,
    WhitePawnComponent,

    BlackKingComponent,
    BlackQueenComponent,
    BlackBishopComponent,
    BlackKnightComponent,
    BlackGiraffeComponent,
    BlackRookComponent,
    BlackPawnComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
