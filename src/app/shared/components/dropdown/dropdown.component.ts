import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';



@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements OnInit {

  @Input() field: any
  @Input() formGroup: FormGroup;
  @Output() dropdownValue = new EventEmitter();
  @Output('searchKeyword') searchKeyword = new EventEmitter<any>();

  

  ngOnInit(): void {
  }

  ngOnChanges(){
  }
  

  changeDropdown(event:any,field:any){
    this.dropdownValue.emit({event:event,field:field})
  }

  getSearchKeyword(event:any) {
    this.searchKeyword.emit(event.target.value);
  }
}
