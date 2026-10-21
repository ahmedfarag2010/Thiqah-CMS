import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './components/home/home.component';
import { MonthsChartsComponent } from './components/months-charts/months-charts.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MonthsChartsComponent,
    FullCalendarModule,
    SharedModule
  ]
})
export class HomeModule { }
