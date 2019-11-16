import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";
import { RoutesPath } from "./app.module";
import { LoginAuthService } from "./services/auth.services";
import { BaseComponent } from "./views/base.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent extends BaseComponent implements OnInit {
  public isOpen: boolean;
  public isLogin: boolean;
  public loading: boolean;
  public options = [
    {
      description: "Back",
      icon: "fas fa-chevron-left",
      onClick: () => {
        if (!this.currentRouter.url.includes(`/${RoutesPath.DETAILS}`)) {
          this.authService.clearToken();
          this.navigate(RoutesPath.LOGIN);
        } else this.navigate(RoutesPath.HOME);
      }
    }
  ];

  constructor(
    router: Router,
    private currentRouter: Router,
    formBuilder: FormBuilder,
    public authService: LoginAuthService
  ) {
    super(router, formBuilder);
  }

  public ngOnInit() {
    this.currentRouter.routeReuseStrategy.shouldReuseRoute = () => false;
    this.currentRouter.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        this.currentRouter.navigated = true;
        window.scrollTo(0, 0);
        this.isLogin =
          this.currentRouter.url === "/" ||
          this.currentRouter.url.includes(`/${RoutesPath.REGISTER}`);

        if (!this.authService.checkToken() && !this.isLogin) {
          this.navigate(RoutesPath.LOGIN);
        } else if (this.authService.checkToken() && this.isLogin) {
          this.navigate(RoutesPath.HOME);
        }
      }
    });
  }
}
