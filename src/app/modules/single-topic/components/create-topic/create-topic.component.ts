import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { DomSanitizer } from '@angular/platform-browser';
import { FBControl } from '../../../../shared/interfaces/fbcontrol'
import { XhrService } from '../../../../shared/services/xhr/xhr.service';
import { SharedService } from '../../../../shared/services/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { PermissionsService } from '../../../../shared/services/permissions.service';



@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrl: './create-topic.component.scss',
  providers: [ConfirmationService, MessageService]
})




export class CreateTopicComponent implements OnInit {

  permissionsKey = 'add_transaction'

  isNoChangesDetected = true
  environment: string

  transactionId: any

  userData:any

  createTopicForm: FormGroup
  constructor(
    private FormBuilder: FormBuilder,
    private SharedModule: SharedModule,
    private sanitizer: DomSanitizer,
    private XhrService: XhrService,
    private SharedService: SharedService,
    private Router: Router,
    private Location: Location,
    private ElementRef: ElementRef,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ActivatedRoute: ActivatedRoute,
    private HttpClient: HttpClient,
    public PermissionsService: PermissionsService
  ) {
    this.search.icon = this.sanitizer.bypassSecurityTrustHtml(this.search.icon)
    this.environment = environment.baseURL
  }

  isExportMode = false

  allControls: FBControl[] = []

  topicDetailsControls: FBControl[] = [
    {
      label: 'نوع المعاملة',
      name: 'type',
      formControlName: 'type',
      type: 'dropdown',
      readonly: false,
      placeholder: 'نوع المعاملة',
      icon: '',
      class: '',
      cols: 4,
      value: [],
      isRequired: true,
      options: []
    },
    {
      label: 'رقم القيد',
      name: 'registrationNumber',
      formControlName: 'registrationNumber',
      type: 'textbox',
      readonly: true,
      placeholder: 'رقم القيد...',
      icon: '',
      class: '',
      cols: 4,
      value: [],
      isRequired: true
    },
    {
      label: 'صفة المعاملة',
      name: 'transactionAdjectiveId',
      formControlName: 'transactionAdjectiveId',
      type: 'dropdown',
      readonly: false,
      placeholder: 'صفة المعاملة',
      icon: '',
      class: '',
      cols: 4,
      value: [],
      isRequired: true,
      options: []
    },
    {
      label: 'مستوى الأهمية',
      name: 'importanceLevelId',
      formControlName: 'importanceLevelId',
      type: 'dropdown',
      readonly: false,
      placeholder: 'مستوى الأهمية',
      icon: '',
      class: '',
      cols: 4,
      value: [],
      isRequired: true,
      options: []
    },
    {
      label: 'تاريخ المعاملة',
      name: 'date',
      formControlName: 'date',
      type: 'datepicker',
      readonly: false,
      placeholder: 'تاريخ المعاملة',
      icon: '',
      class: '',
      cols: 4,
      value: [],
      isRequired: true
    },
    {
      label: 'محدد بوقت',
      name: 'expirationDate',
      formControlName: 'expirationDate',
      type: 'datepicker',
      readonly: false,
      placeholder: 'محدد بوقت',
      icon: '',
      class: '',
      cols: 4,
      value: [],
      isRequired: false
    },
    
  ]

  titleControl: FBControl[] = [
    {
      label: '',
      name: 'topic',
      formControlName: 'topic',
      type: 'textbox',
      readonly: false,
      placeholder: 'أكتب عنوان الموضوع...',
      icon: '',
      class: 'input--create-topic',
      cols: 12,
      value: [],
      isRequired: true
    }
  ]

  sendToControls: FBControl[] = [
    {
      label: 'الجهة الرئيسية',
      name: 'organization',
      formControlName: 'organization',
      type: 'dropdown',
      readonly: false,
      placeholder: 'أختر الجهة الرئيسية',
      icon: '',
      class: '',
      cols: 4,
      value: [],
      isRequired: true,
      options: []
    },
    {
      label: 'الجهة الفرعية',
      name: 'organizationId',
      formControlName: 'organizationId',
      type: 'dropdown',
      readonly: false,
      placeholder: 'أختر الجهة الفرعية',
      icon: '',
      class: '',
      cols: 4,
      value: [],
      isRequired: true,
      options: []
    },
    {
      label: 'المرسل إليه',
      name: 'groupLevelId',
      formControlName: 'groupLevelId',
      type: 'dropdown',
      readonly: false,
      placeholder: 'أختر المرسل إليه',
      icon: '',
      class: '',
      cols: 4,
      value: [],
      isRequired: true,
      options: []
    }
  ]

  

  otherDetailsControls:FBControl[] = [
    {
      label: 'عدد المشفوعات',
      name: 'attachmentsCount',
      formControlName: 'attachmentsCount',
      type: 'textbox',
      readonly: false,
      placeholder: 'عدد المشفوعات',
      icon: '',
      class: '',
      cols: 4,
      value: [],
      isRequired: false
    },
    {
      label: 'رقم الخطاب',
      name: 'incomingLetterNumber',
      formControlName: 'incomingLetterNumber',
      type: 'textbox',
      readonly: false,
      placeholder: 'رقم الخطاب',
      icon: '',
      class: '',
      cols: 4,
      value: [],
      isRequired: false
    },
    {
      label: 'تاريخ الخطاب',
      name: 'incomingLetterDate',
      formControlName: 'incomingLetterDate',
      type: 'datepicker',
      readonly: false,
      placeholder: 'تاريخ الخطاب',
      icon: '',
      class: '',
      cols: 4,
      value: [],
      isRequired: false
    },
    {
      label: 'رقم الخزينة',
      name: 'safeId',
      formControlName: 'safeId',
      type: 'textbox',
      readonly: false,
      placeholder: 'رقم الخزينة',
      icon: '',
      class: '',
      cols: 4,
      value: [],
      isRequired: false
    },
    {
      label: 'ملاحظات',
      name: 'notes',
      formControlName: 'notes',
      type: 'textbox',
      readonly: false,
      placeholder: 'ملاحظات',
      icon: '',
      class: '',
      cols: 8,
      value: [],
      isRequired: false
    }
  ]

  attachmentsControls: FBControl[] = [
    {
      label: '',
      name: 'files',
      formControlName: 'files',
      type: 'fileupload',
      readonly: false,
      placeholder: '',
      icon: '',
      class: '',
      cols: 12,
      value: []
    }
  ]



  back() {
    this.Location.back()
  }

  ngOnInit(): void {
    if (this.PermissionsService.isHasPermissions(this.permissionsKey)) {
      this.userData = this.SharedService.decodeToken()
      console.log(this.userData)
      this.initForm()
      this.getOrganization()
      this.getGroups()
      this.getTransactionsTypes()
      this.getTransacionAdjective()
      this.getImportanceLevel()
      this.transactionId = this.ActivatedRoute.snapshot.queryParamMap.get('id')
    } else {
      this.Router.navigate(['cms/home'])
      this.SharedService.showToaster('error', 'خطأ', 'ليس لديك صلاحية للوصول لهذه الصفحة', 5000)
    }

  }


  initForm() {
    // this.allControls = this.titleControl.concat(this.topicDetailsControls, this.sendToControls, this.attachmentsControls)
    this.allControls = this.topicDetailsControls.concat(this.titleControl,this.sendToControls,this.otherDetailsControls,this.attachmentsControls)
    const fieldsCtrls: any = {};
    this.allControls.forEach((field: any) => {
      fieldsCtrls[field.formControlName] = this.FormBuilder.control(null, field.isRequired ? Validators.required : null);
      // fieldsCtrls[field.formControlName] = this.FormBuilder.control(null, field.isRequired ? null : null);
    });
    this.createTopicForm = this.FormBuilder.group(fieldsCtrls);
    this.createTopicForm.get('topic')?.setValidators([Validators.required,Validators.maxLength(250)])
    this.createTopicForm.get('notes')?.setValidators(Validators.maxLength(500))
    this.createTopicForm.get('incomingLetterNumber')?.setValidators(Validators.maxLength(15))
    this.createTopicForm.get('attachmentsCount')?.setValidators(Validators.maxLength(15))
    this.createTopicForm.get('safeId')?.setValidators(Validators.maxLength(15))

    this.handleControlsDisability()
    this.createTopicForm.valueChanges.subscribe(res => {
      this.isNoChangesDetected = false
    })
  }



  handleControlsDisability() {
    for (let i = 0; i < this.allControls.length; i++) {
      this.allControls[i].readonly ? this.createTopicForm.get(this.allControls[i].name)?.disable() : this.createTopicForm.get(this.allControls[i].name)?.enable()
    }
  }



  transactionType:any
  getDropdownValue(event: any) {
    console.log(event)
    if (event.event.value) {
      if (event.field.name == 'organization') {
        this.getSubOrganization(event.event.value.id)
      }
      if (event.field.name == 'type') {
        this.getNewId(event.event.value.id)
        this.transactionType = event.event.value.id
      }
    }
  }


  confirmationSubmit() {
    this.confirmationService.confirm({
      message: 'هل أنت متأكد من إرسال المعاملة ؟',
      accept: () => {
        this.submit()
      },
      reject: () => {
      }
    })
  }


  submit() {
    this.createTopicForm.updateValueAndValidity()
    let fromValue = this.createTopicForm.getRawValue()
    fromValue = this.SharedService.manageDropdownValues(fromValue)
    // fromValue['groupLevelCopyId'] = '1245312c-da36-4dee-d316-08dce2398fc4' // temporary
    fromValue['groups'] = this.copiesValues.length > 0 ? this.copiesValues : []
    if (this.selectedTransactionId) {
      fromValue['parentId'] = this.selectedTransactionId
    }
    if (this.isExportMode && this.transactionData.files.length > 0) {
      fromValue['files'] = [...this.transactionData.files, ...fromValue['files']]
    }
    // console.log(fromValue)
    this.XhrService.post('v1/transaction/add', fromValue).subscribe(res => {
      if (res.data) {
        this.isNoChangesDetected = true
        this.Router.navigate(['cms/topics-list'], { queryParams: { type: this.isExportMode ? 'outgoing' : 'transferred' } })
      }
    })
  }


  attachmentsValue(value: any, controlName: any) {
    this.createTopicForm.get(controlName)?.setValue(value)
  }


  topicCopies: FBControl = {
    label: 'أختر مجموعة / مجموعات',
    name: 'search',
    placeholder: 'أختر مجموعة / مجموعات',
    formControlName: 'search',
    type: 'multiSelect',
    readonly: false,
    class: '',
    cols: 12,
    value: [],
    isRequired: false,
    isSearchable: true,
    icon: '',
    isMulti: true,
    options: []
  }


  copiesValues: any = []
  changeDropdown(event: any) {
    this.copiesValues = []
    if (event.event.value.length > 0) {
      for (let i = 0; i < event.event.value.length; i++) {
        this.copiesValues.push(event.event.value[i].id)
      }
    }
  }



  search: FBControl = {
    name: 'search',
    label: 'أكتب ثلاثة حروف قم أضغط إدخال',
    placeholder: 'إبحث برقم أو موضوع المعاملة',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.3849 15.446C11.7346 17.5687 7.8552 17.4016 5.39842 14.9448C2.76238 12.3088 2.76238 8.03494 5.39842 5.3989C8.03445 2.76287 12.3083 2.76287 14.9444 5.3989C17.4011 7.85569 17.5682 11.7351 15.4456 14.3854L20.6012 19.541C20.8941 19.8339 20.8941 20.3088 20.6012 20.6017C20.3083 20.8946 19.8334 20.8946 19.5405 20.6017L14.3849 15.446ZM6.45908 13.8842C4.40882 11.8339 4.40882 8.50982 6.45908 6.45956C8.50933 4.40931 11.8334 4.40931 13.8837 6.45956C15.9324 8.50831 15.9339 11.8291 13.8882 13.8797C13.8867 13.8812 13.8852 13.8827 13.8837 13.8842C13.8822 13.8857 13.8807 13.8872 13.8792 13.8887C11.8286 15.9344 8.50783 15.9329 6.45908 13.8842Z" fill="black" /></svg>',
  }

  transactionsList: any = []
  searchTransacrionsPayload = {
    "pageNumber": 1,
    "pageSize": 100,
    "filter": {
      "searchText": ""
    },
    "orderByValue": [{}]
  }
  selectedTransactionId = ''
  searchText(value: any) {
    if (value.length >= 3) {
      this.searchTransacrionsPayload.filter.searchText = value
      this.XhrService.post('v1/transaction/get-paged', this.searchTransacrionsPayload).subscribe(res => {
        let response = res.data.data
        if (response) {
          this.transactionsList = []
          for (let i = 0; i < res.data.data.length; i++) {
            this.transactionsList.push({
              topic: response[i].topic,
              id: response[i].id,
              registrationNumber: response[i].registrationNumber,
              isSelected: false
            })
          }
        }
      })
    }
  }

  selectTransaction(item: any) {
    if (item.id == this.selectedTransactionId) {
      let current = this.transactionsList.find((topic: any) => topic.id == item.id)
      current.isSelected = !current.isSelected
      this.selectedTransactionId = current.isSelected ? item.id : null
    } else {
      let old = this.transactionsList.find((topic: any) => topic.isSelected == true)
      old ? old.isSelected = false : null
      let _new = this.transactionsList.find((topic: any) => topic.id == item.id)
      _new ? _new.isSelected = true : false
      this.selectedTransactionId = item.id
    }
    // console.log(this.selectedTransactionId)
  }

  // openLinked Transaction
  openLinkedTransaction(id: any) {
    let url = `${window.location.host}/cms/topic/${id}`
    window.open(url, '_blank');
  }


  // Lookups

  organizationList = []
  getOrganization() {
    this.XhrService.get('v1/organization/get-all').subscribe(res => {
      if (res.data) {
        this.organizationList = res.data
        let options: any[] = []
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].parentId == null) {
            options.push({ name: res.data[i].name, id: res.data[i].id })
          }
        }
        let control = this.allControls.find(control => control.name == 'organization')
        control ? control.options = options : null
      }
    })
  }

  subOrganizationPayload = {
    "pageNumber": 1,
    "pageSize": 100,
    "filter": {
      "isParent": false,
      "parentId": ""
    },
    "orderByValue": []
  }

  subOrganizationList = []
  getSubOrganization(id: any) {
    this.subOrganizationPayload.filter.parentId = id
    this.XhrService.post('v1/organization/get-paged', this.subOrganizationPayload).subscribe(res => {
      if (res.data.data) {
        this.subOrganizationList = res.data.data
        let options: any[] = []
        for (let i = 0; i < res.data.data.length; i++) {
          options.push({ name: res.data.data[i].name, id: res.data.data[i].id })
        }
        let control = this.allControls.find(control => control.name == 'organizationId')
        control ? control.options = options : null
      }
    })
  }

  groupsList = []
  getGroups() {
    this.XhrService.get('v1/grouplevels/get-avilable-groups').subscribe(res => {
      // this.XhrService.get('v1/grouplevels/getall').subscribe(res => {
      if (res.data) {
        this.groupsList = res.data
        let options: any[] = []
        for (let i = 0; i < res.data.length; i++) {
          options.push({ name: res.data[i].name, id: res.data[i].id })
        }
        let control = this.allControls.find(control => control.name == 'groupLevelId')
        let groupsControl = this.topicCopies
        control ? control.options = options : null
        groupsControl ? groupsControl.options = options : null


        if (this.transactionId) {
          // init export transaction
          // setTimeout(() => {
          this.exportTransaction()
          this.isExportMode = true
          // }, 2000);

        }

      }
    })
  }


  getTransactionsTypes() {
    let options = this.SharedService.transactionTypesList
    let control = this.allControls.find(control => control.name == 'type')
    control ? control.options = options : null
  }

  regId = null
  getNewId(id: any) {
    this.XhrService.get(`v1/transaction/get-new-id?type=${id}`).subscribe(res => {
      if (res.data) {
        let registrationNumber = this.allControls.find(control => control.name == 'registrationNumber')
        registrationNumber ? registrationNumber.value = res.data : null
        registrationNumber ? this.createTopicForm.get('registrationNumber')?.setValue(res.data) : null
        this.isShowQR = true
        this.regId = res.data
        this.generateQR(res.data)
      }
    })
  }

  transactionAdjectiveList = []
  getTransacionAdjective() {
    this.XhrService.get('v1/transactionadjective/get-all').subscribe(res => {
      if (res.data) {
        this.transactionAdjectiveList = res.data
        let options: any[] = []
        for (let i = 0; i < res.data.length; i++) {
          options.push({ name: res.data[i].name, id: res.data[i].id })
        }
        let control = this.allControls.find(control => control.name == 'transactionAdjectiveId')
        control ? control.options = options : null
      }
    })
  }

  importanceLevelList = []
  getImportanceLevel() {
    this.XhrService.get('v1/importancelevel/get-all').subscribe(res => {
      if (res.data) {
        this.importanceLevelList = res.data
        let options: any[] = []
        for (let i = 0; i < res.data.length; i++) {
          options.push({ name: res.data[i].name, id: res.data[i].id })
        }
        let control = this.allControls.find(control => control.name == 'importanceLevelId')
        control ? control.options = options : null
      }
    })
  }

  isShowQR = false
  qr_link = ''
  generateQR(id: any) {
    this.qr_link = `${window.location.host}/cms/topic/${id}`
  }


  printQR() {
    let form = this.createTopicForm.getRawValue()
    let canvas = this.ElementRef.nativeElement.querySelector('canvas')
    var image = `<img style="with:70px;height:70px; margin:10px;" src="${canvas.toDataURL()}"/>`;
    let thiqah = `<img style="with:70px;height:70px; margin:10px;" src="https://t-cms.thiqah.sa/images/ThiqahLogo.png"/>`;
    let printWindow: any = window.open('', '300', '300');
    printWindow.document.write(`
      <div style="direction:rtl;text-align:right;">
        <div style="display:flex;">${thiqah}${image}</div>
        <div>
          <div style="display:flex;"><p style="margin:0;width:100px;">${this.transactionType == 1 ? 'رقم القيد' : 'رقم الصادر'}</p><span>${form.registrationNumber}</span></div>
          <div style="display:flex;"><p style="margin:0;width:100px;">التاريخ مــ</p><span>${new Date().toISOString().split('T')[0]}</span></div>
          <div style="display:flex;"><p style="margin:0;width:100px;">التاريخ هــ</p><span>${this.SharedService.transformDateToHijri(new Date(), 'ar')}</span></div>
          <div style="display:flex;"><p style="margin:0;width:100px;">عدد المشفوعات</p><span>${form.attachmentsCount ? form.attachmentsCount : '-'}</span></div>
        </div>
      </div> 
      `)
    setTimeout(() => {
      printWindow.print();
    }, 100);
  }


  printRecievingModel() {
    let printWindow: any = window.open('', '', '');
    printWindow.document.write(`
      <html>
      <head>
        <style>
         @media print {
          body {
              -webkit-print-color-adjust: exact;
          }
        }
        .model-page{
          direction:rtl;
          text-align:right;
          padding:20px;
        }
        .logo img{
          width:80px;
        }
          .heading{
          text-align:center;
        }
        .heading h1{
          
        }
        .sub-heading{
          margin-bottom:15px;
          font-size:25px;
          margin-top:35px;
        }
        .report-table {
          border: 2px solid #cfcfcf;
          border-top:0;
        }
        .report-table__row {
          display: flex;
          align-items: center;
          background: #eaeaea;
          height: 40px;
          print-color-adjust: exact;
        }
        .report-table__row span {
          display: flex;
          align-items: center;
          justify-content: center;
          border-left: 2px solid #cfcfcf;
          height: 100%;
        }
        .report-table__row span:last-of-type {
          border-left: 0;
        }
        .report-table__row span.sm {
          min-width: 50px;
          max-width: 50px;
        }
        .report-table__row span.mid {
          min-width: 150px;
          max-width: 150px;
        }
        .report-table__row span.lg {
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
          border-top: 2px solid #cfcfcf;
        }
        .foot{
          margin-top:25px;
        }
        .foot div{
          font-size:20px;
          margin-top:15px;
        }
      </style>
      </head>
      <body>
        <div class="model-page">
        <div class="logo">
          <img src="https://t-cms.thiqah.sa/images/ThiqahLogo.png"/>
        </div>
        <div class="heading">
          <h1>نموذج تسليم معاملة</h1>
        </div>
        <div class="sub-heading">من</div>
        <div class="report-table">
          <div class="report-table__body">
            <div class="report-table__row">
              <span class="lg">الإسم</span>
              <span class="lg">${this.userData.LastName} ${this.userData.FirstName}</span>
            </div>
            <div class="report-table__row">
              <span class="lg">الجهة</span>
              <span class="lg">${this.userData.GroupName}</span>
            </div>
            <div class="report-table__row">
              <span class="lg">التاريخ</span>
              <span class="lg">${new Date().toISOString().split('T')[0]}</span>
            </div>
            <div class="report-table__row">
              <span class="lg">رقم الوارد</span>
              <span class="lg">${this.createTopicForm.getRawValue().registrationNumber ? this.createTopicForm.getRawValue().registrationNumber : '-'}</span>
            </div>
          </div>
        </div>
        <div class="sub-heading">إلي</div>
        <div class="report-table">
          <div class="report-table__body">
            <div class="report-table__row">
              <span class="lg">الإسم</span>
              <span class="lg"></span>
            </div>
            <div class="report-table__row">
              <span class="lg">الجهة</span>
              <span class="lg">${this.createTopicForm.getRawValue().organizationId ? this.createTopicForm.getRawValue().organizationId.name : '-'}</span>
            </div>
          </div>
        </div>
        <div class="foot">
          <div>إسم المستلم / </div>
          <div>التوقيع / </div>
          <div>التاريخ / </div>
        </div>
      </div>
      </body>
      </html>
      `)
    setTimeout(() => {
      printWindow.print();
    }, 100);
  }

  downloadAttachment(id: any) {
    this.HttpClient.get(`${this.environment}v1/files/downloadwithappcode/${id}`, { responseType: 'blob' }).subscribe((resultBlob: Blob) => {
      var downloadURL = URL.createObjectURL(resultBlob);
      window.open(downloadURL);
    });
  }



  transactionData: any
  exportTransaction() {
    this.XhrService.get('v1/transaction/get-id/' + this.transactionId).subscribe(res => {
      if (res.data) {
        this.transactionData = res.data
        this.selectedTransactionId = this.transactionData.id
        if (this.transactionData.groups.length > 0) {
          for (let i = 0; i < this.transactionData.groups.length; i++) {
            this.copiesValues.push(this.transactionData.groups[i].id)
          }
        }
        this.setPreviousData()
      }
    })
  }

  setPreviousData() {
    let formKeys: any[] = Object.keys(this.transactionData)
    formKeys.push('organization')
    let control
    for (let i = 0; i < formKeys.length; i++) {
      control = this.allControls.find(control => control.name == formKeys[i])
      this.createTopicForm.get(formKeys[i])?.setValue(this.transactionData[formKeys[i]])
      if (control) {
        control.value = this.transactionData[formKeys[i]]
        if (control.type == 'dropdown') {
          if (control.name == 'organization') {
            let object = { name: this.transactionData.parentOrganizationName, id: this.transactionData.parentOrganizationId }
            control.value = object
            control.readonly = true
            this.createTopicForm.get('organization')?.setValue(object)
          }
          else if (control.name == 'organizationId') {
            let object = { name: this.transactionData.organizationName, id: this.transactionData.organizationId }
            control.options = [object]
            control.value = object
            control.readonly = true
            this.createTopicForm.get('organizationId')?.setValue(object)
          }
          else if (control.name == 'groupLevelId') {
            let object = { name: this.transactionData.firstGroupName, id: this.transactionData.firstGroupId }
            control.options.push(object)
            control.readonly = true
            control.value = object
            this.createTopicForm.get('groupLevelId')?.setValue(object)
          }
          else if (control.name == 'transactionAdjectiveId') {
            let object = { name: this.transactionData.transactionAdjectiveName, id: this.transactionData.transactionAdjectiveId }
            control.options.push(object)
            control.readonly = true
            control.value = object
            this.createTopicForm.get('transactionAdjectiveId')?.setValue(object)
          }
          else if (control.name == 'importanceLevelId') {
            let object = { name: this.transactionData.importanceLevelName, id: this.transactionData.importanceLevelId }
            control.options.push(object)
            control.readonly = true
            control.value = object
            this.createTopicForm.get('importanceLevelId')?.setValue(object)
          }
          else if (control.name == 'type') {
            let object = { name: 'الصادر ', id: 2 }
            control.readonly = true
            control.value = object
            this.createTopicForm.get('type')?.setValue(object)
            this.getNewId(2)
          }
        }
        else if (control.type == 'datepicker') {
          if (control.name == 'expirationDate') {
            control.readonly = true
            this.createTopicForm.get('expirationDate')?.reset()
            this.createTopicForm.get('expirationDate')?.disable()
          }
          this.createTopicForm.get('date')?.reset()
          this.createTopicForm.get('incomingLetterDate')?.reset()
        }
      }
    }
  }








}



