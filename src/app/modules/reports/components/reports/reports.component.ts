import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { XhrService } from '../../../../shared/services/xhr/xhr.service';
import { FBControl } from '../../../../shared/interfaces/fbcontrol'
import { SharedModule } from '../../../../shared/shared.module';
import { SharedService } from '../../../../shared/services/shared/shared.service';
import { PermissionsService } from '../../../../shared/services/permissions.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  incoming_report_permission = 'read_incoming_report'
  outgoing_report_permission = 'read_outgoing_report'
  select_group_permission = 'read_groups'

  


  constructor(
    private XhrService: XhrService,
    private FormBuilder: FormBuilder,
    private SharedModule: SharedModule,
    private SharedService: SharedService,
    private ElementRef: ElementRef,
    public PermissionsService: PermissionsService,
    private Router: Router
  ) {
    // this.data_table = {
    //   cols: [
    //     {
    //       label: 'رقم القيد',
    //       key: 'registrationNumber'
    //     },
    //     {
    //       label: 'التاريخ',
    //       key: 'date'
    //     },
    //     {
    //       label: 'جهة الإحالة',
    //       key: 'groupLevelName'
    //     },
    //     {
    //       label: 'الموضوع',
    //       key: 'topic'
    //     },
    //     {
    //       label: 'الجهة',
    //       key: 'organizationName'
    //     },
    //     {
    //       label: 'بوقت محدد',
    //       key: 'expirationDate'
    //     }
    //   ],
    //   data: []
    // }
    // // merge table columns's labels
    // for (let i = 0; i < this.data_table.cols.length; i++) {
    //   this.table_lables.push(this.data_table.cols[i].key)
    // }
  }

  reportType = ''

  reportTitle = ''
  durationTitle = ''

  generateReportForm: FormGroup
  report_endpoint = ''

  // data_table: any = {}
  // table_lables: any = []

  incoming_table:any;
    
    
  outgoing_table:any;
    
  

  current_table:any = {
    columns:[],
    data:[]
  }



  generateReportControls: FBControl[] = [
    {
      label: 'نوع التقرير',
      name: 'type',
      formControlName: 'type',
      type: 'dropdown',
      readonly: false,
      placeholder: 'نوع التقرير',
      icon: '',
      class: '',
      cols: 3,
      value: [],
      isRequired: true,
      options: []
    },
    {
      label: 'المستأجر',
      name: 'tenantId',
      formControlName: 'tenantId',
      type: 'dropdown',
      readonly: false,
      placeholder: 'أختر المستأجر',
      icon: '',
      class: '',
      cols: 3,
      value: [],
      isRequired: false,
      options: []
    },
    {
      label: 'المجموعة',
      name: 'groupId',
      formControlName: 'groupId',
      type: 'dropdown',
      readonly: false,
      placeholder: 'المجموعة',
      icon: '',
      class: '',
      cols: 3,
      value: [],
      isRequired: true,
      options: []
    },
    {
      label: 'من',
      name: 'startDate',
      formControlName: 'startDate',
      type: 'datepicker',
      readonly: false,
      placeholder: 'من',
      icon: '',
      class: '',
      cols: 3,
      value: [],
      isRequired: true
    },
    {
      label: 'إلى',
      name: 'endDate',
      formControlName: 'endDate',
      type: 'datepicker',
      readonly: false,
      placeholder: 'إلى',
      icon: '',
      class: '',
      cols: 3,
      value: [],
      isRequired: true
    },
  ]


  ngOnInit(): void {
    if (this.PermissionsService.isHasPermissions('report')) {
      // console.log(this.PermissionsService.getUserPermissions())
      this.initForm()
      this.getTenants()
      this.getGroups()
      this.incoming_table = {
        columns:[
          {
            label:'#',
            size:'sm'
          },
          {
            label:'رقم القيد والتاريخ',
            size:'mid'
          },
          {
            label:'الجهة',
            size:'mid'
          },
          {
            label:'الموضوع',
            size:'lg'
          },
          {
            label:'الحالة',
            size:'sm'
          },
          {
            label:'تحقيق مستهدف الإجابة',
            size:'mid'
          }
        ],
        data:[]
      }

      this.outgoing_table = {
        columns:[
          {
            label:'#',
            size:'sm'
          },
          {
            label:'رقم الصادر والتاريخ',
            size:'mid'
          },
          {
            label:'الجهة',
            size:'mid'
          },
          {
            label:'الموضوع',
            size:'lg'
          },
        ],
        data:[]
      }
    } else {
      this.Router.navigate(['cms/home'])
      this.SharedService.showToaster('error', 'خطأ', 'ليس لديك صلاحية للوصول لهذه الصفحة', 5000)
    }
  }


  initForm() {
    if (!this.PermissionsService.isHasPermissions(this.select_group_permission)) {
      this.generateReportControls = this.generateReportControls.filter(function (obj) {
        return obj.name !== 'groupId';
      });
    }
    const fieldsCtrls: any = {};
    this.generateReportControls.forEach((field: any) => {
      fieldsCtrls[field.formControlName] = this.FormBuilder.control(null, field.isRequired ? Validators.required : null);
    });
    this.generateReportForm = this.FormBuilder.group(fieldsCtrls);
    let control = this.generateReportControls.find(control => control.name == 'type')
    if (control) {
      this.PermissionsService.isHasPermissions(this.incoming_report_permission) ? control.options.push({ id: 'incoming-report', name: 'معاملات واردة' }) : null
      this.PermissionsService.isHasPermissions(this.outgoing_report_permission) ? control.options.push({ id: 'outgoing-report', name: 'معاملات صادرة' }) : null
    }
  }


  getDropdownValue(event: any) {
    if (event?.field?.name != 'tenantId') {
      return
    }
    this.generateReportForm.get('groupId')?.reset()
    this.getGroups(event.event?.value?.id)
  }




  generateReportPayload = {
    "pageNumber": 1,
    "pageSize": 10,
    "filter": {
      "groupId": "",
      "tenantId": "",
      "startDate": "",
      "endDate": ""
    },
    "orderByValue": [{}]
  }


  transactionsList: any[] = []
  totalRecords = 0

  reportResult:any = []
  generateReport() {
    this.current_table.columns = []
    this.current_table.data = []
    this.report_endpoint = this.generateReportForm.get('type')?.value.id
    this.generateReportPayload.filter.groupId = this.generateReportForm.get('groupId') ? this.generateReportForm.get('groupId')?.value.id : null
    this.generateReportPayload.filter.tenantId = this.generateReportForm.get('tenantId')?.value?.id || null
    this.generateReportPayload.filter.startDate = this.generateReportForm.get('startDate')?.value
    this.generateReportPayload.filter.endDate = this.generateReportForm.get('endDate')?.value
    this.XhrService.post(`v1/report/${this.report_endpoint}`, this.generateReportPayload).subscribe(res => {
      if (res.data.data) {
        this.transactionsList = res.data.data
        this.totalRecords = res.data.totalCount
        this.durationTitle = `التقرير الشهري من ${this.generateReportPayload.filter.startDate} إلي ${this.generateReportPayload.filter.endDate}`
        
        if(this.report_endpoint == 'incoming-report'){
          this.reportType = 'incoming'
          this.current_table.columns = this.incoming_table.columns
          for(let i=0;i<this.transactionsList.length;i++){
            this.current_table.data.push([
              {
                label:i+1,
                size:'sm'
              },
              {
                label:`${this.transactionsList[i].registrationNumber} - ${this.SharedService.transformDateFormat(this.transactionsList[i].date)}`,
                size:'mid'
              },
              {
                label:this.transactionsList[i].groupLevelName,
                size:'mid'
              },
              {
                label:this.transactionsList[i].topic,
                size:'lg'
              },
              {
                label:`<p class="report-status report-status__${this.transactionsList[i].transactionExpireStatus}"></p>`,
                size:'sm'
              },{
                label:this.SharedService.transformDateFormat(this.transactionsList[i].expirationDate),
                size:'mid'
              },
            ])
          }
          
        } else {
          this.reportType = 'outgoing'
          this.current_table.columns = this.outgoing_table.columns
          for(let i=0;i<this.transactionsList.length;i++){
            this.current_table.data.push([
              {
                label:i+1,
                size:'sm'
              },
              {
                label:`${this.transactionsList[i].registrationNumber} - ${this.SharedService.transformDateFormat(this.transactionsList[i].date)}`,
                size:'mid'
              },
              {
                label:this.transactionsList[i].groupLevelName,
                size:'mid'
              },
              {
                label:this.transactionsList[i].topic,
                size:'lg'
              },
            ])
          }
        }
        console.log(this.incoming_table.columns)
        this.reportTitle = `${this.reportType == 'incoming' ? 'المعاملات الواردة' : 'المعاملات الصادرة'}`
        if(this.generateReportForm.get('groupId')){
          this.reportTitle += ` - ${this.generateReportForm.get('groupId')?.value.name}`
        }
        // this.collectTableProperties()
      }
      if (res.data.data.length == 0) {
        this.SharedService.showToaster('error', 'خطأ', 'لا يوجد بيانات', 5000)
      }
    })
  }


  // collectTableProperties() {
  //   this.data_table.data = []
  //   for (let i = 0; i < this.transactionsList.length; i++) {
  //     let object: any = {}
  //     for (let x = 0; x < this.table_lables.length; x++) {
  //       // transform date in table
  //       if (this.table_lables[x].toLowerCase().includes('date')) {
  //         object[this.table_lables[x]] = this.SharedService.transformDateFormat(this.transactionsList[i][this.table_lables[x]])
  //       } else {
  //         object[this.table_lables[x]] = this.transactionsList[i][this.table_lables[x]]
  //       }
  //       object.isShow = true
  //     }
  //     this.data_table.data.push(object)

  //   }
  // }

  onPageChange(event: any) {
    this.generateReportPayload.pageNumber = event
    this.generateReport()
  }


  print() {
    var printContents = this.ElementRef.nativeElement.querySelector('.report-result').innerHTML;
    let printWindow: any = window.open('', '1000', '1000');
    printWindow.document.write(`
      <html>
        <head>
          <link href="https://db.onlinewebfonts.com/c/d602bf6498a65d9595ca30c04eadda32?family=Tanseek+Modern+Pro+Arabic+Book" rel="stylesheet">
          <style>
          @font-face {
              font-family: "Tanseek Modern Pro Arabic Book";
              src: url("https://db.onlinewebfonts.com/t/d602bf6498a65d9595ca30c04eadda32.eot");
              src: url("https://db.onlinewebfonts.com/t/d602bf6498a65d9595ca30c04eadda32.eot?#iefix")format("embedded-opentype"),
              url("https://db.onlinewebfonts.com/t/d602bf6498a65d9595ca30c04eadda32.woff2")format("woff2"),
              url("https://db.onlinewebfonts.com/t/d602bf6498a65d9595ca30c04eadda32.woff")format("woff"),
              url("https://db.onlinewebfonts.com/t/d602bf6498a65d9595ca30c04eadda32.ttf")format("truetype"),
              url("https://db.onlinewebfonts.com/t/d602bf6498a65d9595ca30c04eadda32.svg#Tanseek Modern Pro Arabic Book")format("svg");
          }
          *{
          font-family:'Tanseek Modern Pro Arabic Book' !important;
          }
        p{
          margin-top:0;
          margin-bottom:0;
        }
       @media print {
        body {
            -webkit-print-color-adjust: exact;
        }
        }
        .report-result__heading{
            border-right: 5px solid #36b4e5;
            padding-bottom: 10px;
        }
        .report-result__heading div{
            margin-right: 20px;
            font-size: 25px;
            color: #36b4e5;
        }
        .report-result__group{
            text-align: center;
            font-size: 32px;
            margin: 25px auto;
        }
        .report-table {
            border: 1px solid #cfcfcf;
        }
        .report-table__head, .report-table__row {
            display: flex;
            align-items: center;
            background: #eaeaea;
            height: 40px;
            print-color-adjust: exact;
        }
        .report-table__head span, .report-table__row span {
            display: flex;
            align-items: center;
            justify-content: center;
            border-left: 1px solid #cfcfcf;
            padding-bottom: 5px;
            height: 100%;
        }
        .report-table__head span:last-of-type, .report-table__row span:last-of-type {
            border-left: 0;
        }
        .report-table__head span.sm, .report-table__row span.sm {
            min-width: 50px;
            max-width: 50px;
        }
        .report-table__head span.mid, .report-table__row span.mid {
            min-width: 150px;
            max-width: 150px;
        }
        .report-table__head span.lg, .report-table__row span.lg {
            flex-basis: 0;
            flex-grow: 1;
            min-width:250px;
        }
        .report-table__body {
            border-left: 0;
            border-right: 0;
        }
        .report-table__row {
            background: #fff;
            border-top: 1px solid #cfcfcf;
        }
        .report-status {
            display: flex;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            position: relative;
            top: 3px;
            print-color-adjust: exact;
        }
        .report-status__0 {
            background: #d9d9da;
        }
        .report-status__1 {
            background: #ffc000;
        }
        .report-status__2 {
            background: #36b4e5;
        }
        .report-status__3 {
            background: #70c140;
        }
        .report-status__4 {
            background: #ff0000;
        }
        .report-result-status{
          display: flex;
          max-width: 900px;
          flex-wrap: wrap;
          margin: 35px 0;
        }
        .report-result-status > div{
          display: flex;
          align-items: center;
          width: 270px;
          margin-left: 20px;
          margin-bottom: 10px;
        }
        .report-result-status > div .report-status{
          max-width: 25px;
          position: relative;
        }
        .report-result-status > div p{
          margin-right: 5px;
        }
        @page {
            margin: 2cm 0cm;
        }
      </style>
      </head>
      <body>
      <div style="direction:rtl;text-align:right !important;">
        ${printContents}
        <div class="report-result-status">
            <div><div class="report-status report-status__0"></div><p>قد لا يتطلب الموضوع إعداد إجابة</p></div>
            <div><div class="report-status report-status__1"></div><p>قارب الوقت المحدد للإجابة</p></div>
            <div><div class="report-status report-status__2"></div><p>تم تحقيق الإجابة</p></div>
            <div><div class="report-status report-status__3"></div><p>ضمن نطاق الوقت المحدد للإجابة</p></div>
            <div><div class="report-status report-status__4"></div><p>تجاوز الوقت المحدد للإجابة</p></div>
        </div>
      </div> 
      </body>
      </html>
      `)
    setTimeout(() => {
      printWindow.print();
    }, 100);
  }

  
  // get groups

  groupsList: any[] = []
  getGroups(tenantId?: any) {
    let url = 'v1/grouplevels/getall'
    if (tenantId) {
      url += `?tenantId=${tenantId}`
    }
    this.XhrService.get(url).subscribe(res => {
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || [])
      this.groupsList = list
      let options: any[] = []
      for (let i = 0; i < list.length; i++) {
        options.push({ name: list[i].groupNameWithTenant || list[i].name, id: list[i].id })
      }
      let control = this.generateReportControls.find(control => control.name == 'groupId')
      control ? control.options = options : null
    })
  }

  getTenants() {
    this.XhrService.get('v1/tenant/getall').subscribe(res => {
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || [])
      let options: any[] = []
      for (let i = 0; i < list.length; i++) {
        options.push({ name: list[i].name, id: list[i].id })
      }
      let control = this.generateReportControls.find(control => control.name == 'tenantId')
      control ? control.options = options : null
    })
  }

}
