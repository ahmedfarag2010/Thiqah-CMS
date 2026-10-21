import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { LoaderService } from './shared/services/loader/loader.service';
import { MessageService } from 'primeng/api';
import { SharedService } from './shared/services/shared/shared.service';
import { HttpClient } from '@angular/common/http';
import { XhrService } from './shared/services/xhr/xhr.service';
import { AuthenticationResult } from '@azure/msal-browser';
// import { MsalService } from '@azure/msal-angular';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [],
})
export class AppComponent implements OnInit {
  isLoading: any;
  $isLoading: Observable<boolean>;

  // isUserLogged = false
  constructor(
    public loaderService: LoaderService,
    private SharedService: SharedService,
    private http: HttpClient,
    private XhrService: XhrService,
    // private MsalService: MsalService
  ) {

  }

  async  ngOnInit():  Promise<any> {
    this.$isLoading = this.loaderService.isLoading;
    // sso
    // await this.MsalService.instance.initialize();
    // this.MsalService.instance.handleRedirectPromise().then((res:any) => {
    //   console.log(res)
    //   if (res != null && res.account != null) {
    //   }
    //    else {
    //     if(!localStorage.getItem('token')){
    //       this.login()
    //     }
    //   }
    // })
  }

  // isLoggedIn(): boolean {
  //   return this.MsalService.instance.getActiveAccount() != null
  // }

  // login() {
  //   this.MsalService.loginPopup()
  //     .subscribe((response: AuthenticationResult) => {
  //       console.log(response)
  //       this.MsalService.instance.setActiveAccount(response.account);
  //       localStorage.setItem('token',response.accessToken)
  //       window.location.reload()
  //     });
  // }

  // logout() {
  //   this.MsalService.logout()
  // }



}
