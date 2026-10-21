import { MsalService } from '@azure/msal-angular';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth/auth.service';
import { AuthenticationResult } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root'
})
export class MicrosoftLoginGuard implements CanActivate {

  constructor(private MsalService: MsalService,private AuthService:AuthService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.login()
    

    return true;
  }


  async login(){
    await this.MsalService.instance.initialize();
    if (this.MsalService.instance.getActiveAccount() == null) {
      console.log('not logged in!')
      this.MsalService.loginPopup()
      .subscribe((response: AuthenticationResult) => {
        console.log(response)
        this.MsalService.instance.setActiveAccount(response.account);
        localStorage.setItem('token',response.accessToken)
        window.location.reload()
      });
      return false;
    }
  }

}