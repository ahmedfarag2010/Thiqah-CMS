import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  
})
export class CheckboxComponent implements OnInit  {


  isChecked = false
  @Input() field: any
  @Input() formGroup: FormGroup;
  @Output() checkValue = new EventEmitter();

  ngOnInit(): void {
    console.log(this.field)
  }

  check(event:any){
    // let value
    // value = event.checked.length > 0 ? true : false
    this.isChecked = event.checked
    // this.formGroup.get(this.field.name)?.setValue(this.isChecked)
    // this.isChecked = event.checked.length > 0 ? true : false
    this.checkValue.emit({event:event.checked,field:this.field})
  }

  


}
