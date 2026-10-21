import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FBControl } from '../../interfaces/fbcontrol'
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent implements OnInit {


  @Input() data_table: any
  @Output() clickedRow: any = new EventEmitter<any>();
  @Output() clickedChildButton: any = new EventEmitter<any>();
  @Input() isSearch:boolean


  constructor(private sanitizer: DomSanitizer) {
    this.search.icon = this.sanitizer.bypassSecurityTrustHtml(this.search.icon)
  }

  ngOnInit(): void {
    console.log(this.data_table)
    // this.data_table.o

  }

  ngAfterViewChecked() {
    this.eventsHandler()
  }

  clickRow(e: any, row: any, index: any) {
    // console.log(e,row,index)
    // e.stopPropagation()
    let object = { row: row, index: index }
    this.clickedRow.emit(object)
  }


  eventsHandler() {
    let table: any = document.querySelector('app-data-table')
    let buttons = table.querySelectorAll('[has-event]')
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener(buttons[i].getAttribute('data-event'), (e: any) => {
        e.stopPropagation()
        let object = {
          action: buttons[i].getAttribute('data-action'),
          rowIndex: Number(buttons[i].getAttribute('data-index'))
        }
        this.clickedChildButton.emit(object)
      })
    }
  }


  onSort(event: any, data: any) {
    // console.log(event)
    // console.log(data)
  }

  search: FBControl = {
    name: 'search',
    placeholder: 'بحث عن عنصر',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.3849 15.446C11.7346 17.5687 7.8552 17.4016 5.39842 14.9448C2.76238 12.3088 2.76238 8.03494 5.39842 5.3989C8.03445 2.76287 12.3083 2.76287 14.9444 5.3989C17.4011 7.85569 17.5682 11.7351 15.4456 14.3854L20.6012 19.541C20.8941 19.8339 20.8941 20.3088 20.6012 20.6017C20.3083 20.8946 19.8334 20.8946 19.5405 20.6017L14.3849 15.446ZM6.45908 13.8842C4.40882 11.8339 4.40882 8.50982 6.45908 6.45956C8.50933 4.40931 11.8334 4.40931 13.8837 6.45956C15.9324 8.50831 15.9339 11.8291 13.8882 13.8797C13.8867 13.8812 13.8852 13.8827 13.8837 13.8842C13.8822 13.8857 13.8807 13.8872 13.8792 13.8887C11.8286 15.9344 8.50783 15.9329 6.45908 13.8842Z" fill="black" /></svg>',
  }



  insertedText = ''
  searchText(event: any) {
    this.insertedText = event
    this.executeSearch()
  }

  // search_keys = []
  executeSearch(){
    if (this.insertedText) {
      for (let i = 0; i < this.data_table.data.length; i++) {
        if (this.data_table.data[i].topic?.toLowerCase().includes(this.insertedText.toLowerCase()) || 
        this.data_table.data[i].registrationIncomingOutcomingNumber?.toLowerCase().includes(this.insertedText.toLowerCase()) || 
        this.data_table.data[i].importanceLevelName?.toLowerCase().includes(this.insertedText.toLowerCase()) ||
        this.data_table.data[i].groupName?.toLowerCase().includes(this.insertedText.toLowerCase()) ||
        this.data_table.data[i].date?.toLowerCase().includes(this.insertedText.toLowerCase()) ||
        this.data_table.data[i].organizationName?.toLowerCase().includes(this.insertedText.toLowerCase()) || 
        this.data_table.data[i].importanceLevelName?.toLowerCase().includes(this.insertedText.toLowerCase()) || 
        this.data_table.data[i].incomingLetterNumber?.toLowerCase().includes(this.insertedText.toLowerCase()) ||
        this.data_table.data[i].incomingLetterDate?.toLowerCase().includes(this.insertedText.toLowerCase())) {
          this.data_table.data[i].isShow = true
        } else {
          this.data_table.data[i].isShow = false
        }
      }
    } else {
      for (let i = 0; i < this.data_table.data.length; i++) {
        this.data_table.data[i].isShow = true
      }
    }
  }

}
