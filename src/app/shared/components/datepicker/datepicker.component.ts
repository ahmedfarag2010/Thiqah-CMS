import { Component, EventEmitter, Input, OnInit, Output  } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss'
})
export class DatepickerComponent implements OnInit {

  constructor() { }

  @Input() field: any
  @Input() formGroup: FormGroup;
  @Output() datepickerValue = new EventEmitter();

  ngOnInit(): void {
  }

  datePickerValue(event:any){
  }

}
