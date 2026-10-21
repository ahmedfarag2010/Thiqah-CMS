import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleTopicComponent } from './components/single-topic/single-topic.component';
import { CreateTopicComponent } from './components/create-topic/create-topic.component';
import { IsSavedDataGuard } from './guards/is-saved-data.guard';


const routes: Routes = [
  {
    path: 'create-topic',
    component: CreateTopicComponent,
    canDeactivate:[IsSavedDataGuard]
  },
  {
    path: ':id',
    component: SingleTopicComponent,
    canDeactivate:[IsSavedDataGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleTopicRoutingModule { }
