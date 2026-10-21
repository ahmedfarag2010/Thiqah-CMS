import { Component, OnInit } from '@angular/core';
import { XhrService } from '../../../../shared/services/xhr/xhr.service';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SharedService } from '../../../../shared/services/shared/shared.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  data_table: any = {}



  constructor(
    private XhrService: XhrService,
    private SharedService: SharedService,
    private Router: Router
  ) {
    this.data_table = {
      cols: [
        {
          label: 'رقم القيد',
          key: 'registrationIncomingOutcomingNumber'
        },
        // {
        //   label: 'جهة الإحالة',
        //   key: 'groupLevelName'
        // },
        {
          label: 'الموضوع',
          key: 'topic'
        },
        // {
        //   label: 'الجهة',
        //   key: 'organizationName'
        // },
        // {
        //   label: 'صفة المعاملة',
        //   key: 'transactionAdjectiveName'
        // },
        // {
        //   label: 'رقم الخطاب',
        //   key: 'incomingLetterNumber'
        // },
        // {
        //   label: 'تاريخ الخطاب',
        //   key: 'incomingLetterDate'
        // }
      ],
      data: []
    }
  }

  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg: any) => this.dateClick(arg),
    events: [],
    datesSet: (event: any) => {
      // console.log(event)
      this.changeMonth(event.start)
    }
  };

  ngOnInit(): void {
    this.getTransactionsCounts()
  }


  selectedDate: any
  dateClick(arg: any) {
    this.selectedDate = arg.dateStr
    this.data_table.data = []
    if (this.transactionsList.length > 0) {
      for (let i = 0; i < this.transactionsList.length; i++) {
        if (this.selectedDate == this.transactionsList[i].expirationDate.split('T')[0]) {
          this.data_table.data.push({
            registrationIncomingOutcomingNumber: this.transactionsList[i].registrationIncomingOutcomingNumber,
            topic: this.transactionsList[i].topic,
            isShow: true
          })
        }
      }
    }
    if(this.data_table.data.length == 0){
      this.SharedService.showToaster('warn', 'لا يوجد بيانات', 'لا يوجد معاملات متعلقة بوقت محدد في هذا اليوم', 3000)
    }
  }

  // click on row
  selectedRow(row: any) {
    this.SharedService.sectionType.next('inbox')
    let object: any = this.transactionsList.find((obj: any) => obj.topic == row.row.topic)
    this.Router.navigate(['cms/topic/' + object.registrationNumber])
  }

  getFirstAndLastDaysOfMonth(date: any) {
    let newDate = new Date(date);
    let firstDay = new Date(newDate.getFullYear(), newDate.getMonth(), 1).getDate();
    let lastDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
    let month = new Date(date).getMonth() + 1
    let year = new Date(date).getFullYear()
    return { firstDay: firstDay, lastDay: lastDay, month: month < 10 ? '0' + month : month, year: year }
  }

  insertTransactionsOnCalendar() {
    let events = []
    let date = ''
    let count = 0
    for (let i = 0; i < this.transactionsList.length; i++) {
      if (date != this.transactionsList[i].expirationDate) {
        count = 1
      } else {
        count++
      }
      if (count == 1) {
        events.push({ title: count, date: this.transactionsList[i].expirationDate.split('T')[0] })
      } else {
        let obj = events.find(obj => obj.date == this.transactionsList[i].expirationDate.split('T')[0])
        obj ? obj.title = obj.title + 1 : null
      }
      date = this.transactionsList[i].expirationDate
    }
    this.calendarOptions.events = events
    setTimeout(() => {
      this.changeColorStatus()
    }, 100);
  }

  changeColorStatus() {
    let days:any = document.querySelectorAll('.fc-day-past')
    if (days.length > 0) {
      for(let i=0;i<days.length;i++){
        if(days[i].querySelector('.fc-daygrid-event-harness')){
          days[i].querySelector('.fc-h-event').style.backgroundColor = '#ff0000';
          days[i].querySelector('.fc-h-event').style.border = '1px solid #ff0000';
        }
      }
    }
  }


  changeMonth(event: any) {
    this.data_table.data = []
    let middleOfMonth = new Date(event.setDate(event.getDate() + 15));
    this.getTransactions(this.getFirstAndLastDaysOfMonth(middleOfMonth))
  }



  routeSection(param:any){
    this.Router.navigate(['cms/topics-list'], { queryParams: { type: param } })
  }



  transactionsPayload = {
    "pageNumber": 1,
    "pageSize": 5000,
    "filter": {
      expireDate: true,
      expireDateFrom: '',
      expireDateTo: ''
    },
    "orderByValue": [
    ]
  }


  transactionsList: any[] = []
  getTransactions(object: any) {
    this.transactionsPayload.filter.expireDateFrom = `${object.year}-${object.month}-0${object.firstDay}`
    this.transactionsPayload.filter.expireDateTo = `${object.year}-${object.month}-${object.lastDay}`
    this.XhrService.post(`v1/transaction/incoming-paged`, this.transactionsPayload).subscribe(res => {
      if (res.data.data) {
        this.transactionsList = res.data.data
        this.insertTransactionsOnCalendar()
        // console.log(this.transactionsList)
        // this.totalRecords = res.data.totalCount
      }
    })
  }


















  tranasactionsCounts: any
  getTransactionsCounts() {
    this.XhrService.get(`v1/transaction/get-incoming-created-refused-count`).subscribe(res => {
      console.log(res)
      this.tranasactionsCounts = res.data ? res.data : null
    })
  }

}
