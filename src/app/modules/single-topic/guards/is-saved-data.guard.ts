import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CreateTopicComponent } from '../components/create-topic/create-topic.component';


@Injectable({
  providedIn: 'root'
})
export class IsSavedDataGuard implements CanDeactivate<CreateTopicComponent> {
  canDeactivate(
    component:CreateTopicComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.isNoChangesDetected ? true : window.confirm('هل تريد مغادرة هذه الصفحة ؟');
  }
  
}
