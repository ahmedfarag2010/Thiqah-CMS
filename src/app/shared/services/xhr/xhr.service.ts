import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, share, shareReplay, tap } from 'rxjs/operators';
import { SharedService } from '../shared/shared.service';
import { LoaderService } from '../loader/loader.service';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class XhrService {

  constructor(
    private http: HttpClient,
    private SharedService: SharedService,
    private LoaderService: LoaderService
  ) {
    this.environment = environment.baseURL
  }

  api: any
  requestsCount = 0
  private environment: string


  get(endpoint: any, parameters?: any, hideLoader: boolean = false): Observable<any> {
    if (parameters && (parameters.includes('?') || endpoint.includes('?'))) endpoint += parameters;
    let url = this.environment + endpoint
    // hideLoader ? this.LoaderService.hide() : this.LoaderService.show()
    this.LoaderService.show()
    return this.http.get(url)
      .pipe(share()).pipe(
        tap((res: any) => {
          this.api = res;
          this.LoaderService.hide()
          // console.log(this.api)
          if (this.api.status == 200 || this.api.status == 201 || this.api.status == 202) {
            if (this.api.message) {
              this.SharedService.showToaster('success', 'تم بنجاح', this.api.message, 2000)
            }
          } else {
            if (this.api.message) {
              this.SharedService.showToaster('error', 'خطأ', this.api.message, 2000)
            }
          }
        }, error => {
          this.LoaderService.hide()
        })
      )
  }

  post(endpoint: any, body: any, parameters?: any, hideLoader: boolean = false): Observable<any> {
    if (parameters && (parameters.includes('?') || endpoint.includes('?'))) endpoint += parameters;
    let url = this.environment + endpoint
    // hideLoader ? this.LoaderService.hide() : this.LoaderService.show()
    this.LoaderService.show()
    return this.http.post(url, body)
      .pipe(share()).pipe(
        tap((res: any) => {
          this.api = res;
          this.LoaderService.hide()
          // console.log(this.api)
          if (this.api.status == 200 || this.api.status == 201 || this.api.status == 202) {
            if (this.api.message) {
              this.SharedService.showToaster('success', 'تم بنجاح', this.api.message, 2000)
            }
          } else {
            if (this.api.message) {
              this.SharedService.showToaster('error', 'خطأ', this.api.message, 2000)
            }
          }
        }, error => {
          this.LoaderService.hide()
        })
      )
  }

  put(endpoint: any, body: any, parameters?: any, hideLoader: boolean = false): Observable<any> {
    if (parameters && (parameters.includes('?') || endpoint.includes('?'))) endpoint += parameters;
    let url = this.environment + endpoint
    // hideLoader ? this.LoaderService.hide() : this.LoaderService.show()
    // console.log(endpoint)
    this.LoaderService.show()
    return this.http.put(url, body)
      .pipe(share()).pipe(
        tap((res: any) => {
          this.api = res;
          this.LoaderService.hide()
          // console.log(this.api)
          if (this.api.status == 200 || this.api.status == 201 || this.api.status == 202) {
            if (this.api.message) {
              this.SharedService.showToaster('success', 'تم بنجاح', this.api.message, 2000)
            }
          } else {
            if (this.api.message) {
              this.SharedService.showToaster('error', 'خطأ', this.api.message, 2000)
            }
          }
        }, error => {
          this.LoaderService.hide()
        })
      )
  }

  delete(endpoint: any, parameters?: any, hideLoader: boolean = false): Observable<any> {
    if (parameters && (parameters.includes('?') || endpoint.includes('?'))) endpoint += parameters;
    let url = this.environment + endpoint
    // hideLoader ? this.LoaderService.hide() : this.LoaderService.show()
    this.LoaderService.show()
    return this.http.delete(url)
      .pipe(share()).pipe(
        tap((res: any) => {
          this.api = res;
          this.LoaderService.hide()
          // console.log(this.api)
          if (this.api.status == 200 || this.api.status == 201 || this.api.status == 202) {
            if (this.api.message) {
              this.SharedService.showToaster('success', 'تم بنجاح', this.api.message, 2000)
            }
          } else {
            if (this.api.message) {
              this.SharedService.showToaster('error', 'خطأ', this.api.message, 2000)
            }
          }
        }, error => {
          this.LoaderService.hide()
        })
      )
  }


}


