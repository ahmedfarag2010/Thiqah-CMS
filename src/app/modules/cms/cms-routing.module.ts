import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmsComponent } from './components/cms/cms.component';
import { AllNotificationsComponent } from '../all-notifications/all-notifications.component';
import { AddAttachmentsComponent } from '../add-attachments/add-attachments.component';
import { IsSavedDataGuard } from '../single-topic/guards/is-saved-data.guard';


const routes: Routes = [
  {
    path: '',
    component: CmsComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'topics-list',
        loadChildren: () => import('../inbox/inbox.module').then(m => m.InboxModule)
      },
      {
        path: 'topic',
        loadChildren: () => import('../single-topic/single-topic.module').then(m => m.SingleTopicModule)
      },
      {
        path: 'groups',
        loadChildren: () => import('../groups/groups.module').then(m => m.GroupsModule)
      },
      {
        path: 'tenants',
        loadChildren: () => import('../tenants/tenants.module').then(m => m.TenantsModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path:'reports',
        loadChildren:() => import('../reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: '', redirectTo: '/cms/home', pathMatch: 'full'
      },
      {
        path:'notifications',
        component:AllNotificationsComponent
      },
      {
        path:'add-attachments',
        component:AddAttachmentsComponent,
        canDeactivate:[IsSavedDataGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }

