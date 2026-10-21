import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { MicrosoftLoginGuard } from './guards/microsoft-login.guard';


export const routes: Routes = [
  // remove login component routing after sso implementation
  {
    path: 'login',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'cms',
    loadChildren: () => import('./modules/cms/cms.module').then(m => m.CmsModule),
    // canActivate:[MicrosoftLoginGuard] // sso auth
    canActivate:[AuthGuard]
  },
  {
    path: '', redirectTo: '/cms/home', pathMatch: 'full'
  },
  // {
  //   path: '**', component:not_found
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
