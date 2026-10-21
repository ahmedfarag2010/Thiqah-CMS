import { Component, ElementRef, OnInit } from '@angular/core';
import { XhrService } from '../../../../shared/services/xhr/xhr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedService } from '../../../../shared/services/shared/shared.service';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { FBControl } from '../../../../shared/interfaces/fbcontrol'
import { BehaviorSubject, filter, Subject } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PermissionsService } from '../../../../shared/services/permissions.service';




@Component({
  selector: 'app-single-topic',
  templateUrl: './single-topic.component.html',
  styleUrl: './single-topic.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class SingleTopicComponent implements OnInit {
  environment: string

  read_transaction_details_permission = 'read_transaction_details'
  export_transaction_permission = 'add_outgoing_transaction'



  isNoChangesDetected = true



  constructor(
    private XhrService: XhrService,
    private ActivatedRoute: ActivatedRoute,
    private SharedModule: SharedModule,
    public SharedService: SharedService,
    private Location: Location,
    private ElementRef: ElementRef,
    private HttpClient: HttpClient,
    private FormBuilder: FormBuilder,
    private Router: Router,
    private confirmationService: ConfirmationService,
    public PermissionsService: PermissionsService
  ) {
    this.environment = environment.baseURL
  }

  transactionId: any


  transactionTypesList: any = []
  transactionType = ''
  qr_link = ''

  userPermissions: any

  pageMode = ''
  ngOnInit(): void {
    if (this.PermissionsService.isHasPermissions(this.read_transaction_details_permission)) {
      this.SharedService.sectionType.subscribe(res => {
        this.pageMode = res
        // console.log(res)
        // this.pageMode = 'inbox'
      })
      this.transactionId = this.ActivatedRoute.snapshot.paramMap.get('id');
      this.userPermissions = this.PermissionsService.getUserPermissions()
      this.transactionTypesList = this.SharedService.transactionTypesList
      this.qr_link = `${window.location.host}/cms/topic/${this.transactionId}`
      this.getTransactionData()
      this.initTransferForm()
      this.initCopyAndTransferForm()

    } else {
      this.Router.navigate(['cms/home'])
      this.SharedService.showToaster('error', 'خطأ', 'ليس لديك صلاحية للوصول لهذه الصفحة', 5000)
    }

  }

  clearAttchments = new BehaviorSubject<boolean>(false);

  back() {
    this.Location.back()
  }

  transactionData: any
  getTransactionData() {
    this.XhrService.get('v1/transaction/get-id/' + this.transactionId).subscribe(res => {
      if (res.data) {
        this.transactionData = res.data
        // console.log(this.transactionData.comments)
        this.transactionType = this.transactionTypesList.find((type: any) => type.id == this.transactionData.type).name
        this.getGroups()

      }
    })
  }


  printQR() {
    let form = this.transactionData
    let canvas = this.ElementRef.nativeElement.querySelector('canvas')
    var image = `<img style="width:70px;height:70px; margin:10px;" src="${canvas.toDataURL()}"/>`;
    let thiqah = `<img style="width:70px;height:70px; margin:10px;" src="${window.location.origin}/assets/images/app-logo.png"/>`;
    let printWindow: any = window.open('', '300', '300');
    printWindow.document.write(`
      <div style="direction:rtl;text-align:right;">
        <div style="display:flex;">${thiqah}${image}</div>
        <div>
          <div style="display:flex;"><p style="margin:0;width:100px;">${this.transactionData.type == 1 ? 'رقم القيد' : 'رقم الصادر'}</p><span>${form.registrationNumber}</span></div>
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


  isShowAttachment = false
  currentFile:any
  downloadAttachment(id: any) {
    this.HttpClient.get(`${this.environment}v1/files/downloadwithappcode/${id}`, { responseType: 'blob' }).subscribe((resultBlob: Blob) => {
      var downloadURL = URL.createObjectURL(resultBlob);
      window.open(downloadURL);
      this.isShowAttachment = true
      this.currentFile = downloadURL
    });
  }

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


  uploadedFiles = []
  attachmentsValue(value: any, controlName: any) {
    this.uploadedFiles = value
    this.isNoChangesDetected = this.uploadedFiles.length > 0 ? false : true
  }
  submitFiles() {
    let payload = {
      id: this.transactionData.id,
      files: this.uploadedFiles
    }
    this.XhrService.put('v1/transaction/add-transaction-files', payload).subscribe(res => {
      if (res.data) {
        this.getTransactionData()
        this.clear()
        this.uploadedFiles = []
        this.isNoChangesDetected = true
      }
    })
  }

  clear() {
    this.clearAttchments.next(true);
  }

  // openLinked Transaction
  openLinkedTransaction(id: any) {
    // let url = `${window.location.host}/cms/topic/${id}`
    // window.open(url, '_blank');
    const url = this.Router.serializeUrl(
      this.Router.createUrlTree([`/cms/topic/${id}`])
    );

    window.open(url, '_blank');
  }



  /// transfer Transaction

  actionOnTransactionForm: FormGroup


  transferTransactionControls: FBControl[] = [
    {
      label: 'تصدير إلى',
      name: 'groupLevelId',
      formControlName: 'groupLevelId',
      type: 'dropdown',
      readonly: false,
      placeholder: 'أختر المصدر إليه',
      icon: '',
      class: '',
      cols: 12,
      value: [],
      isRequired: true,
      options: []
    }
  ]


  transferTransactionGroupsList = []

  initTransferForm() {
    const fieldsCtrls: any = {};
    this.transferTransactionControls.forEach((field: any) => {
      fieldsCtrls[field.formControlName] = this.FormBuilder.control(null, field.isRequired ? Validators.required : null);
    });
    this.actionOnTransactionForm = this.FormBuilder.group(fieldsCtrls);
  }

  // transfer and copy

  copyAndTransferForm: FormGroup

  copyAndTransferControls: any[] = [
    {
      label: 'أختر مجموعة / مجموعات',
      name: 'groups',
      placeholder: 'أختر مجموعة / مجموعات',
      formControlName: 'groups',
      type: 'multiSelect',
      readonly: false,
      class: '',
      cols: 12,
      value: [],
      isRequired: true,
      isSearchable: true,
      icon: '',
      isMulti: true,
      options: []
    },
    {
      label: 'تصدير إلى',
      name: 'groupLevelId',
      formControlName: 'groupLevelId',
      type: 'dropdown',
      readonly: false,
      placeholder: 'أختر المصدر إليه',
      icon: '',
      class: '',
      cols: 12,
      value: [],
      isRequired: true,
      options: []
    }
  ]





  initCopyAndTransferForm() {
    const fieldsCtrls: any = {};
    this.copyAndTransferControls.forEach((field: any) => {
      fieldsCtrls[field.formControlName] = this.FormBuilder.control(null, field.isRequired ? Validators.required : null);
    });
    this.copyAndTransferForm = this.FormBuilder.group(fieldsCtrls);
  }

  copyAndTransfer() {
    let value = this.copyAndTransferForm.value
    value = this.SharedService.manageDropdownValues(value)
    value['id'] = this.transactionData.id
    value['comment'] = this.enteredComment
    this.XhrService.put('v1/transaction/transfer-transaction', value).subscribe(res => {
      if (res.data) {
        this.Router.navigate(['cms/topics-list'], { queryParams: { type: 'refused' } })
      }
    })
  }


  confirmationAction(action: any) {
    this.confirmationService.confirm({
      accept: () => {
        if (action == 'export') {
          this.exportTransaction()
        } else {
          this.actionOnTransaction(action)
        }
      },
      reject: () => {
      }
    })
  }



  actionOnTransaction(actionType: any) {
    let payload = {
      id: this.transactionData.id,
      groupLevelId: actionType == 'transfer' ? this.actionOnTransactionForm.value.groupLevelId.id : null,
      comment: this.enteredComment
    }
    let url = ''
    if (actionType == 'transfer') {
      url = 'transfer-transaction'
    } else if (actionType == 'save') {
      url = 'archive-transaction'
      delete payload['groupLevelId']
    } else if (actionType == 'refuse') {
      delete payload['groupLevelId']
      url = 'refuse-transaction'
    }
    if (actionType == 'refuse' && !payload.comment) {
      this.SharedService.showToaster('error', 'خطأ', 'قم بكتابة الملاحظات أولاً', 5000)
    } else {
      this.XhrService.put(`v1/transaction/${url}`, payload).subscribe(res => {
        if (res.data) {
          this.Router.navigate(['cms/topics-list'], { queryParams: { type: 'inbox' } })
        }
      })
    }
  }


  enteredComment = null
  getComment(comment: any) {
    this.enteredComment = comment
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

  sendCopies() {
    let payload = {
      id: this.transactionData.id,
      groups: this.copiesValues
    }
    this.XhrService.put('v1/transaction/add-transaction-copy', payload).subscribe(res => {
      if (res.data) {
        this.Router.navigate(['cms/topics-list'], { queryParams: { type: 'inbox' } })
      }
    })
  }

  filterSentGroupsCopies() {
    let sentGroups: any = this.transactionData.groups
    let filtered = this.topicCopies.options.filter((val: any) => {
      return !sentGroups.find((val2: any) => {
        return val.id === val2.id
      })
    });
    console.log(filtered)
    this.topicCopies.options = filtered
    console.log(this.topicCopies)
  }

  expirationDateStatus(expirationDate: any) {
    expirationDate = new Date(expirationDate).getTime()
    let today = new Date().getTime()
    return expirationDate > today
  }


  exportTransaction() {
    this.Router.navigate(['cms/topic/create-topic'], { queryParams: { id: this.transactionId } })
  }


  //// get date

  getGroups() {
    this.XhrService.get('v1/grouplevels/get-avilable-groups').subscribe(res => {
      // this.XhrService.get('v1/grouplevels/getall').subscribe(res => {
      if (res.data) {
        this.transferTransactionGroupsList = res.data
        let options: any[] = []
        for (let i = 0; i < res.data.length; i++) {
          options.push({ name: res.data[i].name, id: res.data[i].id })
        }
        let control = this.transferTransactionControls.find(control => control.name == 'groupLevelId')
        control ? control.options = options : null
        let groupsControl = this.topicCopies
        groupsControl ? groupsControl.options = options : null

        let copyControl = this.copyAndTransferControls.find(control => control.name == 'groupLevelId')
        copyControl ? copyControl.options = options : null
        let transferControls = this.copyAndTransferControls.find(control => control.name == 'groups')
        transferControls ? transferControls.options = options : null

        this.transactionData.groups.length > 0 ? this.filterSentGroupsCopies() : null

      }
    })
  }





}
