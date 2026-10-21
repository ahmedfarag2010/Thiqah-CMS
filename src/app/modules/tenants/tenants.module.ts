import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenantsRoutingModule } from './tenants-routing.module';
import { TenantsComponent } from './components/tenants/tenants.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    TenantsComponent
  ],
  imports: [
    CommonModule,
    TenantsRoutingModule,
    SharedModule
  ]
})
export class TenantsModule { }
