import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth/auth.service';
import { SharedService } from '../shared/services/shared/shared.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {

  constructor(private authService: AuthService, private router: Router, private SharedService:SharedService) {}
  canActivate(): boolean {
    return this.checkAuth();
  }

  private checkAuth(): boolean {
    if (this.authService.isUserLogged()) {
      return true;
    } else {
      this.SharedService.showToaster('error','خطأ','ليس لديك صلاحية للوصول لمحتوى هذه الصفحة',3000)
      this.router.navigate(['/login']);
      return false;
    }
  }
}


