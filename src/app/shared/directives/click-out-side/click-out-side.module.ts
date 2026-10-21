import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutSideDirective } from './click-out-side.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ClickOutSideDirective
  ],
  exports: [
    ClickOutSideDirective
  ]
})
export class ClickOutSideModule { }
