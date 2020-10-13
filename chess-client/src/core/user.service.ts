import { Injectable } from "@angular/core";
import { Guid } from "guid-typescript";
import { User } from "src/interfaces";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly _userKey = "user";
  private readonly _defaultNames = ["Anonymous"];

  constructor(private readonly _http: HttpClient) {}

  init = () => {
    let localStorageItem = localStorage.getItem(this._userKey);
    let user: User;

    if (!localStorageItem) {
      const id = Guid.create().toString();
      const name = this._defaultNames[~~(Math.random() * this._defaultNames.length)];
      user = { id, name };
    } else {
      user = JSON.parse(localStorageItem);
    }

    this.update(user);
  };

  setName = (name: string) => {
    const id = this.get().id;
    var user = { id, name };
    this.update(user);
  };

  joinGame = (gameId: string, white: boolean) => {
    var { id } = this.get();
    this._http.post(`${environment.api}/user/joingame?gameId=${gameId}&userId=${id}&white=${white}`, {}).subscribe();
  };

  get = (): User => JSON.parse(localStorage.getItem(this._userKey));

  private set = (user: User) => localStorage.setItem(this._userKey, JSON.stringify(user));
  private update = ({ id, name }: User) => {
    this.set({ id, name });
    this._http.post(`${environment.api}/user/signup?id=${id}&name=${name}`, {}).subscribe();
  };
}
