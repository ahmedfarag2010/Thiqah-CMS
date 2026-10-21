import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupsComponent } from './components/groups/groups.component';
import { SingleGroupComponent } from './components/single-group/single-group.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { UsersComponent } from './components/users/users.component';


const routes: Routes = [
  {
    path: '',
    component: GroupsComponent
  },
  {
    path: 'group',
    component: GroupsComponent
  },
  {
    path: 'group/:id',
    component: SingleGroupComponent
  },
  {
    path: 'permissions',
    component: GroupsComponent
  },
  {
    path: 'permissions/:id',
    component: PermissionsComponent
  },
  {
    path: 'users',
    component: GroupsComponent
  },
  {
    path: 'users/:id',
    component: UsersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
