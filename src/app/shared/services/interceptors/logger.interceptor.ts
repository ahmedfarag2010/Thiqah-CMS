import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpEventType } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { AuthService } from '../auth/auth.service'
import { Injectable } from '@angular/core'
import { LoaderService } from '../loader/loader.service'


@Injectable({
  providedIn: 'root'
})


//standard
export class LoggerInterceptor implements HttpInterceptor {
  constructor(private AuthService: AuthService, private LoaderService:LoaderService) { }
  login = 'login'
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes(this.login) && this.AuthService.isUserLogged()) {
      req = req.clone({
        headers: req.headers.append('Authorization', `Bearer ${this.AuthService.getToken()}`)
      })
    }
    return next.handle(req).pipe(tap((event) => {
    }, error => {
      if (error.status == 401 || error.statusText == 'Unauthorized') {
        this.AuthService.logout()
      }
    }
    ))
  }
}


// sso
// export class LoggerInterceptor implements HttpInterceptor {
//   constructor(private AuthService: AuthService, private LoaderService:LoaderService) { }
//   login = 'login'
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     if (this.AuthService.getToken()) {
//       req = req.clone({
//         headers: req.headers.append('Authorization', `Bearer ${this.AuthService.getToken()}`)
//       })
//     }
//     return next.handle(req).pipe(tap((event) => {
//     }, error => {
//       if (error.status == 401 || error.statusText == 'Unauthorized') {
//         this.AuthService.logout()
//       }
//     }
//     ))
//   }
// }