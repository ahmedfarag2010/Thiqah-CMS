import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private Router:Router,
    // private MsalService:MsalService
  ) { }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): any {
    // console.log(localStorage.getItem('token'))
    return localStorage.getItem('token');
  }

  isUserLogged(){
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem('token');
    // this.MsalService.logout()
  }

  login(){
    // when login save token in localstorage
  }
}
