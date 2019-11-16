import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { AngularWebStorageModule } from "angular-web-storage";
import { StorageServiceModule } from "angular-webstorage-service";
import { NgxLoadingModule } from "ngx-loading";
import { AppComponent } from "./app.component";
import { InputField } from "./components/inputField/inputField.component";
import { LoginAuthService } from "./services/auth.services";
import { PokemonService } from "./services/pokemon.services";
import { DetailsView } from "./views/details/details.component";
import { HomeView } from "./views/home/home.component";
import { LoginView } from "./views/login/login.component";
import { RegisterView } from "./views/register/register.component";

export enum RoutesPath {
  LOGIN = "",
  HOME = "home",
  DETAILS = "details",
  REGISTER = "register"
}

const appRoutes: Routes = [
  {
    path: RoutesPath.LOGIN,
    component: LoginView
  },
  {
    path: RoutesPath.HOME,
    component: HomeView
  },
  {
    path: RoutesPath.DETAILS,
    component: DetailsView
  },
  {
    path: RoutesPath.REGISTER,
    component: RegisterView
  }
];

@NgModule({
  declarations: [
    InputField,
    AppComponent,
    LoginView,
    HomeView,
    RegisterView,
    DetailsView
  ],
  imports: [
    StorageServiceModule,
    AngularWebStorageModule,
    NgxLoadingModule.forRoot({ fullScreenBackdrop: true }),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    BrowserAnimationsModule
  ],
  providers: [LoginAuthService, PokemonService],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
