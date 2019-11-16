import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { RoutesPath } from "../../app.module";
import { LoginAuthService } from "../../services/auth.services";
import { BaseComponent } from "../base.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html"
})
export class LoginView extends BaseComponent implements OnInit {
  constructor(
    router: Router,
    formBuilder: FormBuilder,
    public authService: LoginAuthService
  ) {
    super(router, formBuilder);
  }

  public onSignIn() {
    this.formSubmitted = true;
    if (this.form.valid) {
      this.addMask("login");
      this.authService
        .userLogin({
          ...this.form.value
        })
        .then(response => {
          this.removeMask("login");
          response && this.navigate(RoutesPath.HOME);
        });
    }
  }

  public onRegister() {
    this.navigate(RoutesPath.REGISTER);
  }

  public ngOnInit() {
    this.fieldProps = {
      email: {
        minlength: "6",
        maxlength: "50",
        required: true,
        messages: {
          label: "",
          placeholder: "Email",
          minlength: "You email is invalid",
          maxlength: "Please validate the email size",
          required: "You need write a email"
        }
      },
      password: {
        minlength: "2",
        maxlength: "20",
        required: true,
        messages: {
          label: "",
          placeholder: "Password",
          minlength: "You password is invalid",
          required: "You need write a password",
          maxlength: "Please validate the password size"
        }
      }
    };

    super.ngOnInit();
  }
}
