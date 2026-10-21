import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { SharedModule } from '../../shared.module';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FBControl } from '../../interfaces/fbcontrol'
import { SharedService } from '../../services/shared/shared.service';
import { PermissionsService } from '../../services/permissions.service';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  isShowUserBox = false
  isShowNotificationsBox = false

  userData:any

  notificationCount:any

  constructor(
    private sanitizer: DomSanitizer,
    public Router:Router,
    private AuthService:AuthService,
    private SharedModule:SharedModule,
    private SharedService:SharedService,
    public PermissionsService:PermissionsService
  ) {
    this.search.icon = this.sanitizer.bypassSecurityTrustHtml(this.search.icon)
  }

  ngOnInit(): void {
    this.userData = this.SharedService.decodeToken()
    console.log(this.userData)
    this.SharedService.notificationCount.subscribe(res => {
      this.notificationCount = res
    })
     
  }

  search:FBControl = {
    name:'search',
    placeholder:'إبحث برقم أو موضوع المعاملة',
    icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.3849 15.446C11.7346 17.5687 7.8552 17.4016 5.39842 14.9448C2.76238 12.3088 2.76238 8.03494 5.39842 5.3989C8.03445 2.76287 12.3083 2.76287 14.9444 5.3989C17.4011 7.85569 17.5682 11.7351 15.4456 14.3854L20.6012 19.541C20.8941 19.8339 20.8941 20.3088 20.6012 20.6017C20.3083 20.8946 19.8334 20.8946 19.5405 20.6017L14.3849 15.446ZM6.45908 13.8842C4.40882 11.8339 4.40882 8.50982 6.45908 6.45956C8.50933 4.40931 11.8334 4.40931 13.8837 6.45956C15.9324 8.50831 15.9339 11.8291 13.8882 13.8797C13.8867 13.8812 13.8852 13.8827 13.8837 13.8842C13.8822 13.8857 13.8807 13.8872 13.8792 13.8887C11.8286 15.9344 8.50783 15.9329 6.45908 13.8842Z" fill="black" /></svg>',
  }


  logout(){
    localStorage.clear()
    this.Router.navigate(['login'])
    // sso logout
    // this.AuthService.logout()
  }

  searchText(value:any){
    console.log(value)
    if(value.length > 0){
      this.Router.navigate(['cms/topics-list'], { queryParams: { type: 'search', keyword: value} })
    } else {
      this.SharedService.showToaster('error', 'خطأ', 'أكتب رقم أو عنوان المعاملة', 3000)
    }
  }

}
