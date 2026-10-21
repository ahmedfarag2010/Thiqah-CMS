import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserModule } from './modules/user/user.module';
import { LoggerInterceptor } from './shared/services/interceptors/logger.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './shared/services/auth/auth.service';
import { AllNotificationsComponent } from './modules/all-notifications/all-notifications.component';
import { AddAttachmentsComponent } from './modules/add-attachments/add-attachments.component';
// import { MSAL_INSTANCE, MsalModule, MsalService } from '@azure/msal-angular'
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';


export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '0d3a0f1b-1fb1-4824-9e4e-98b0adbf0fb2',
      redirectUri: 'http://localhost:4200'
    }
  })
}


@NgModule({
  declarations: [
    AppComponent,
    AllNotificationsComponent,
    AddAttachmentsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    ToastModule,
    UserModule,
    HttpClientModule,
    // MsalModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoggerInterceptor, multi: true }, // standard
    MessageService, AuthService
    //, MsalService,
    
    //  { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory }, // sso
    
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
