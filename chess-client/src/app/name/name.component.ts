import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { UserService } from "src/core/user.service";

@Component({
  selector: "name-form",
  templateUrl: "./name.component.html",
})
export class NameComponent {
  nameForm;
  editing = false;

  constructor(formBuilder: FormBuilder, private readonly _userService: UserService) {
    this.nameForm = formBuilder.group({
      name: this._userService.get().name,
    });
  }

  get name() {
    return this.nameForm.controls["name"].value;
  }

  onSubmit = (data) => {
    this._userService.setName(data.name);
    this.editing = false;
  };

  edit = () => {
    this.editing = true;
  };
}
