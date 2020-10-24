import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { PieceComponent } from "./piece/piece.component";
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
import { GameComponent } from "./game/game.component";
import { OverviewComponent } from "./overview/overview.component";
import { HttpClientModule } from "@angular/common/http";
import { NameComponent } from "./name/name.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { PreviewComponent } from "./overview/overview-item/preview/preview.component";
import { OverviewItemComponent } from "./overview/overview-item/overview-item.component";
import { HeaderComponent } from "./layout/header/header.component";
import { NewGameComponent } from "./overview/new-game/new-game.component";
import { PlayerDisplayComponent } from "./player-display/player-display.component";

const routes: Routes = [
  { path: "", component: OverviewComponent },
  { path: ":id", component: GameComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,

    PieceComponent,
    GameComponent,
    OverviewComponent,
    OverviewItemComponent,
    NewGameComponent,
    NameComponent,
    PreviewComponent,

    PlayerDisplayComponent,

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
  imports: [BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
