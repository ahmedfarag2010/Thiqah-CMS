import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './components/comment/comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { HeaderComponent } from './components/header/header.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { TableModule } from 'primeng/table';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectComponent } from './components/multi-select/multi-select.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { CalendarModule } from 'primeng/calendar';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
import { ToasterComponent } from './components/toaster/toaster.component';
import { ClickOutSideModule } from './directives/click-out-side/click-out-side.module';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
// import { ModalComponent } from './components/modal/modal.component';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { NoDataComponent } from './components/no-data/no-data.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ToggleSwitchComponent } from './components/toggle-switch/toggle-switch.component';






@NgModule({
  declarations: [
    SideMenuComponent,
    HeaderComponent,
    InputTextComponent,
    DataTableComponent,
    CommentComponent,
    DropdownComponent,
    DatepickerComponent,
    UploadFilesComponent,
    SafeHtmlPipe,
    CheckboxComponent,
    MultiSelectComponent,
    NoDataComponent,
    PaginatorComponent,
    NotificationsComponent,
    ToggleSwitchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    CalendarModule,
    ToasterComponent,
    ClickOutSideModule,
    DialogModule,
    CheckboxModule,
    ConfirmDialogModule,
    PaginatorModule,
    ColorPickerModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    SideMenuComponent,
    HeaderComponent,
    InputTextComponent,
    DataTableComponent,
    CommentComponent,
    DropdownComponent,
    MultiSelectComponent,
    DatepickerComponent,
    UploadFilesComponent,
    ClickOutSideModule,
    ToasterComponent,
    SafeHtmlPipe,
    DialogModule,
    CheckboxComponent,
    NoDataComponent,
    ConfirmDialogModule,
    PaginatorModule,
    PaginatorComponent,
    NotificationsComponent,
    ColorPickerModule,
    ToggleSwitchComponent
  ],
  schemas:[NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
