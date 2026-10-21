import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleTopicRoutingModule } from './single-topic-routing.module';
import { SingleTopicComponent } from './components/single-topic/single-topic.component';
import { SharedModule } from '../../shared/shared.module';
import { CreateTopicComponent } from './components/create-topic/create-topic.component';
import { FileUploadModule } from 'primeng/fileupload';
import { QrCodeModule } from 'ng-qrcode';



@NgModule({
  declarations: [
    SingleTopicComponent,
    CreateTopicComponent,
    
  ],
  imports: [
    CommonModule,
    SingleTopicRoutingModule,
    SharedModule,
    FileUploadModule,
    QrCodeModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SingleTopicModule { }
