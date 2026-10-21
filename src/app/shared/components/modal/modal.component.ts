import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  providers: [DialogService]
})
export class ModalComponent implements OnInit, OnDestroy {

  ref: DynamicDialogRef | undefined;

  constructor(public dialogService: DialogService) {}

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }

}
