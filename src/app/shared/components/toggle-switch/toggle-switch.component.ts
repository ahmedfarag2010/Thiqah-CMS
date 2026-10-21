import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrl: './toggle-switch.component.scss'
})
export class ToggleSwitchComponent implements  OnInit{

  isChecked = false
  @Input() field: any
  @Input() formGroup: FormGroup;
  @Output() checkValue = new EventEmitter();


  ngOnInit(){
    console.log(this.field)
  }

  switch(event: any) {
    this.isChecked = event.checked
    this.checkValue.emit({ event: event.checked, field: this.field })
  }

}
