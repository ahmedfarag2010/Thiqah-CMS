import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { XhrService } from '../../../../shared/services/xhr/xhr.service';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedService } from '../../../../shared/services/shared/shared.service';
import { PermissionsService } from '../../../../shared/services/permissions.service';
import { Location } from '@angular/common';




@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss'
})
export class InboxComponent implements OnInit {

  totalRecords = 0

  pageMode: any
  pageTitle = ''

  constructor(
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private XhrService: XhrService,
    public SharedModule: SharedModule,
    private SharedService: SharedService,
    private PermissionsService: PermissionsService,
    private Location: Location
  ) {
    this.data_table = {
      cols: [
        {
          label: 'رقم القيد',
          key: 'registrationIncomingOutcomingNumber'
        },
        {
          label: 'التاريخ',
          key: 'date'
        },
        {
          label: 'جهة الإحالة',
          key: 'groupLevelName'
        },
        {
          label: 'الموضوع',
          key: 'topic'
        },
        {
          label: 'الجهة',
          key: 'organizationName'
        },
        {
          label: 'صفة المعاملة',
          key: 'transactionAdjectiveName'
        },
        {
          label: 'رقم الخطاب',
          key: 'incomingLetterNumber'
        },
        {
          label: 'تاريخ الخطاب',
          key: 'incomingLetterDate'
        }
      ],
      data: []
    }
    // merge table columns's labels
    for (let i = 0; i < this.data_table.cols.length; i++) {
      this.table_lables.push(this.data_table.cols[i].key)
    }
  }

  data_table: any = {}
  table_lables: any = []

  search_keyword: any = ''

  getQueryParams() {
    this.currentSection = {}
    this.pageMode = this.ActivatedRoute.snapshot.queryParamMap.get('type')
    this.search_keyword = this.ActivatedRoute.snapshot.queryParamMap.get('keyword')
    this.currentSection = this.sections.find((sec: any) => sec.pageMode == this.pageMode)
    // console.log(this.currentSection)
    

  }

  isRequesting = false


  current_section = ''


  ngOnInit() {
    this.ActivatedRoute.queryParams.subscribe((queries: any) => {
      if (queries.type != this.current_section || this.currentSection.pageMode == 'search')  {
        this.getQueryParams()
        this.transactionsPayload.pageNumber = 1
        if (this.PermissionsService.isHasPermissions(this.currentSection.permission)) {
          // this.getQueryParams()
          this.getTransactions()
          if(this.pageMode == 'all-saved'){
            this.data_table.cols.find((label:any) => label.label == 'جهة الإحالة').label = 'جهة الحفظ'
          } else {
            this.data_table.cols.find((label:any) => label.label == 'جهة الحفظ') ? this.data_table.cols.find((label:any) => label.label == 'جهة الحفظ').label = 'جهة الإحالة' : null
          }
        } else {
          // this.Location.back()
          this.Router.navigate(['cms/home'])
          this.SharedService.showToaster('error', 'خطأ', 'ليس لديك صلاحية للوصول لهذه الصفحة', 5000)
        }
      }
      this.current_section = queries.type
    })
  }



  // click on row
  selectedRow(row: any) {
    this.SharedService.sectionType.next(this.pageMode)
    let object: any = this.transactionsList.find((obj: any) => obj.topic == row.row.topic)
    this.Router.navigate(['cms/topic/' + object.registrationNumber])
  }


  // click on childs elements
  clickChildButton(child: any) {
    // console.log(child)
  }



  // getting data

  transactionsPayload = {
    "pageNumber": 1,
    "pageSize": 10,
    "filter": {
      search: null
    },
    "orderByValue": [{
      sort: 'desc'
    }]
  }

  transactionsList:any[] = []
  getTransactions() {
    if (!this.isRequesting) {
      this.isRequesting = true
      if (this.pageMode == 'search') {
          this.currentSection.pageTitle = `نتائج البحث عن ${this.search_keyword}`
          this.transactionsPayload.filter.search = this.search_keyword
        }
      this.XhrService.post(`v1/transaction/${this.currentSection?.requestURL}`, this.transactionsPayload).subscribe(res => {
        if (res.data.data) {
          this.transactionsList = res.data.data
          this.totalRecords = res.data.totalCount
        }
        this.collectTableProperties()
        this.isRequesting = false
      })
    }

  }

  collectTableProperties() {
    this.data_table.data = []
    for (let i = 0; i < this.transactionsList.length; i++) {
      let object: any = {}
      for (let x = 0; x < this.table_lables.length; x++) {
        // transform date in table
        if (this.table_lables[x].toLowerCase().includes('date')) {
          object[this.table_lables[x]] = this.SharedService.transformDateFormat(this.transactionsList[i][this.table_lables[x]])
        } else {
          object[this.table_lables[x]] = this.transactionsList[i][this.table_lables[x]]
        }
        if(this.table_lables[x] == 'transactionAdjectiveName'){
          object[this.table_lables[x]] = `<span style="background:${this.transactionsList[i].transactionAdjectiveBackGroundColor ? this.transactionsList[i].transactionAdjectiveBackGroundColor : 'transparent'};" class="topic-status"><p class="font-line">${this.transactionsList[i].transactionAdjectiveName}</p></span>`
        }
      }
      
      this.data_table.data.push(object)

    }
    console.log(this.data_table.data)
    // add custom statuses
    for (let i = 0; i < this.data_table.data.length; i++) {
      // let classStatus = this.SharedService.importanceLevelStatuses.find(obj => obj.key == this.data_table.data[i].importanceLevelName)?.class
      // this.data_table.data[i]['importanceLevelName'] = `<span class="topic-status ${classStatus}"><p class="font-line">${this.data_table.data[i].importanceLevelName}</p></span>`
      this.data_table.data[i]['isShow'] = true
    }
    console.log(this.data_table.data)

  }

  onPageChange(event: any) {
    // console.log(event)
    this.transactionsPayload.pageNumber = event
    this.getTransactions()
    // this.first = event.first;
    // this.pageCount = event.pageCount;
  }


  sections: any = [
    {
      pageMode: 'inbox',
      pageTitle: 'المعاملات الواردة',
      requestURL: 'incoming-paged',
      permission: 'read_incoming_transactions'
    },
    {
      pageMode: 'outgoing',
      pageTitle: 'المعاملات الصادرة',
      requestURL: 'outgoing-paged',
      permission: 'read_outgoing_transactions'
    },
    {
      pageMode: 'transferred',
      pageTitle: 'المعاملات المحالة',
      requestURL: 'created-transactions-paged',
      permission: 'read_created_transactions'
    },
    {
      pageMode: 'saved',
      pageTitle: 'المعاملات المحفوظة',
      requestURL: 'archived-transactions-paged',
      permission: 'read_archived_transactions'
    },
    {
      pageMode: 'copied',
      pageTitle: 'نسخ المعاملات',
      requestURL: 'copied-transactions-paged',
      permission: 'read_copied_transactions'
    },
    {
      pageMode: 'all-saved',
      pageTitle: 'كل المعاملات المحفوظة',
      requestURL: 'all-archived-transactions-paged',
      permission: 'read_all_archived_transactions'
    },
    {
      pageMode: 'refused',
      pageTitle: 'المعاملات المرفوضة',
      requestURL: 'refused-transactions-paged',
      permission: 'read_refused_transactions'
    },
    {
      pageMode: 'search',
      pageTitle: 'نتائج البحث عن',
      requestURL: 'public-search',
      permission: ''
    }
  ]

  currentSection:any = {
    pageMode: '',
    pageTitle: '',
    requestURL: '',
    permission: ''
  }

}
