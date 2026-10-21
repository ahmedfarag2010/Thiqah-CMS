import { Component, EventEmitter, Input, OnInit, Output  } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss'
})
export class InputTextComponent implements OnInit {

  @Input() field: any
  @Input() formGroup: FormGroup;
  @Output() textboxValue = new EventEmitter();
  @Output('onPressEnter') onPressEnter = new EventEmitter<any>();

  constructor() { }
  ngOnInit() {
    // console.log(this.formGroup)
    // console.log(this.field)
    // console.log(this.formGroup.get(this.field.name),this.field.name)
    if (this.formGroup) {
      let field = this.formGroup.get(this.field.name)
      if(field){
        field.valueChanges.subscribe(res => {
          // console.log(res)
          this.textboxValue.emit(res);
        });
      }
      
    }
    
    // console.log(this.field)
  }

  enteredValue(value:any) {
    // console.log(value)
    this.onPressEnter.emit(value);
  }

  typedValue(event:any){
    // console.log(event.target.value)
    this.textboxValue.emit(event.target.value);
  }


}
