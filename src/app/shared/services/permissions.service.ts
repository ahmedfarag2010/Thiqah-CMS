import { Injectable } from '@angular/core';
import { SharedService } from './shared/shared.service';


@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private SharedService:SharedService) { }

  getUserPermissions(){
    let token:any = this.SharedService.decodeToken()
    return token.permissions ? token.permissions : []
  }

  isHasPermissions(permission:any){
    if(this.getUserPermissions().length > 0){
      // console.log(this.getUserPermissions().find((item:any) => item.includes(permission)),permission)
      return this.getUserPermissions().find((item:any) => item.includes(permission)) ? true : false
    }
    
  }


}
