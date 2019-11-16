import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { RoutesPath } from "../../app.module";
import { LoginAuthService } from "../../services/auth.services";
import { BaseComponent } from "../base.component";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html"
})
export class RegisterView extends BaseComponent implements OnInit {
  public lengthRegex = /.*\S{8}/;
  public numberRegex = /(?:.*\d.*){1}/;
  public capitalRegex = /(?:.*[A-Z].*){2}/;
  public specialRegex = /(?:.*[!@#\$%\^\&*\)\(+=._-].*){1}/;

  constructor(
    router: Router,
    formBuilder: FormBuilder,
    public authService: LoginAuthService
  ) {
    super(router, formBuilder);
  }

  public onRegister() {
    this.formSubmitted = true;
    if (this.form.valid) {
      if (this.form.value.password !== this.form.value.confirmPassword) {
        (this.form.controls.confirmPassword as any).customError =
          "The passwords don't match";
        return;
      }
      this.addMask("register");
      this.authService
        .userRegister({
          ...this.form.value
        })
        .then(response => {
          this.removeMask("register");
          this.navigate(RoutesPath.LOGIN);
        });
    }
  }

  public ngOnInit() {
    this.fieldProps = {
      fullName: {
        maxlength: "25",
        required: true,
        messages: {
          label: "",
          placeholder: "Full name",
          maxlength: "Please validate the name size",
          required: "You need write a name"
        }
      },
      email: {
        maxlength: "50",
        required: true,
        regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        messages: {
          label: "",
          placeholder: "Email",
          maxlength: "Please validate the email size",
          required: "You need write a email",
          regex: "The email hava a invalid format"
        }
      },
      password: {
        required: true,
        maxlength: "20",
        regex: /^(?=(?:.*\d){1})(?=(?:.*[!@#\$%\^\&*\)\(+=._-]){1})(?=(?:.*[A-Z]){2})\S{8,}$/,
        messages: {
          label: "",
          placeholder: "Password",
          required: "You need write a password",
          maxlength: "Please validate the password size",
          regex: "The password dont have the format required"
        }
      },
      confirmPassword: {
        maxlength: "20",
        required: true,
        messages: {
          label: "",
          placeholder: "Confirm password",
          maxlength: "Please validate the password size",
          required: "You need write the password confirmation"
        }
      }
    };

    super.ngOnInit();
  }

  public onCancel() {
    this.navigate(RoutesPath.LOGIN);
  }
}
