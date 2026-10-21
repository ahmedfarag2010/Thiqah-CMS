import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss'
})
export class MultiSelectComponent implements OnInit {

  @Input() field: any
  @Input() formGroup: FormGroup;
  @Output() dropdownValue = new EventEmitter();
  @Output('searchKeyword') searchKeyword = new EventEmitter<any>();

  options = [
    
  ];

  ngOnInit(): void {
    // console.log(this.field)
  }

  changeDropdown(event:any,field:any){
    this.dropdownValue.emit({event:event,field:field})
    // console.log({event:event,field:field})
  }

  getSearchKeyword(event:any) {
    this.searchKeyword.emit(event.target.value);
  }

}
