import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './components/groups/groups.component';
import { SharedModule } from '../../shared/shared.module';
import { SingleGroupComponent } from './components/single-group/single-group.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { UsersComponent } from './components/users/users.component';


@NgModule({
  declarations: [
    GroupsComponent,
    SingleGroupComponent,
    PermissionsComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    SharedModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class GroupsModule { }
