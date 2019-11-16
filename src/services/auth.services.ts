import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LoginAuthService {
  constructor(private http: HttpClient) {}

  public usersKey = "temporalUsers";
  public currentUserKey = "loginUser";

  public userLogin(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storage = localStorage.getItem(this.usersKey);
        const users = storage && storage.length > 0 ? JSON.parse(storage) : {};
        const currentUser = users[data.email.toLowerCase()];
        const seccess = currentUser && currentUser.password === data.password;
        seccess && localStorage.setItem(this.currentUserKey, currentUser);
        resolve(seccess);
      }, 5000);
    });
  }

  public checkToken() {
    return !!localStorage.getItem(this.currentUserKey);
  }

  public clearToken() {
    localStorage.setItem(this.currentUserKey, "");
  }

  public userRegister(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storage = localStorage.getItem(this.usersKey);
        const users = storage && storage.length > 0 ? JSON.parse(storage) : {};
        users[data.email.toLowerCase()] = data;
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        resolve(true);
      }, 5000);
    });
  }
}
