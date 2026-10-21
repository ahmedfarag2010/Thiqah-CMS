import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent implements OnInit {

  @Input() rows:any
  @Input() totalRecords:any;
  @Output() switch = new EventEmitter();


  ngOnInit(): void {
  }

  onPageChange(event:any){
    this.switch.emit(event.page + 1)
  }

}
