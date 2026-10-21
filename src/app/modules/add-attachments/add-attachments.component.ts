import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FBControl } from '../../shared/interfaces/fbcontrol'
import { XhrService } from '../../shared/services/xhr/xhr.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { PermissionsService } from '../../shared/services/permissions.service';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared/shared.service';



@Component({
  selector: 'app-add-attachments',
  templateUrl: './add-attachments.component.html',
  styleUrl: './add-attachments.component.scss'
})
export class AddAttachmentsComponent implements OnInit {
  environment: string
  clearAttchments = new BehaviorSubject<boolean>(false);
  isNoChangesDetected = true
  
  constructor(
    private DomSanitizer:DomSanitizer,
    private XhrService:XhrService,
    private HttpClient:HttpClient,
    private PermissionsService:PermissionsService,
    private Router:Router,
    private SharedService:SharedService
  ){
    this.search.icon = this.DomSanitizer.bypassSecurityTrustHtml(this.search.icon)
    this.environment = environment.baseURL
  }

  add_attachments_permission = 'add_files_to_transaction'

  transactionsList:any = []
  searchTransacrionsPayload = {
    "pageNumber": 1,
    "pageSize": 100,
    "filter": {
      "searchText": ""
    },
    "orderByValue": [{}]
  }
  selectedTransactionNumber:any


  transactionData:any

  ngOnInit(): void {
    if (!this.PermissionsService.isHasPermissions(this.add_attachments_permission)) {
      this.Router.navigate(['cms/home'])
      this.SharedService.showToaster('error', 'خطأ', 'ليس لديك صلاحية للوصول لهذه الصفحة', 5000)
    }
  }

  search: FBControl = {
    name: 'search',
    label: 'أكتب ثلاثة حروف قم أضغط إدخال',
    placeholder: 'إبحث برقم أو موضوع المعاملة',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.3849 15.446C11.7346 17.5687 7.8552 17.4016 5.39842 14.9448C2.76238 12.3088 2.76238 8.03494 5.39842 5.3989C8.03445 2.76287 12.3083 2.76287 14.9444 5.3989C17.4011 7.85569 17.5682 11.7351 15.4456 14.3854L20.6012 19.541C20.8941 19.8339 20.8941 20.3088 20.6012 20.6017C20.3083 20.8946 19.8334 20.8946 19.5405 20.6017L14.3849 15.446ZM6.45908 13.8842C4.40882 11.8339 4.40882 8.50982 6.45908 6.45956C8.50933 4.40931 11.8334 4.40931 13.8837 6.45956C15.9324 8.50831 15.9339 11.8291 13.8882 13.8797C13.8867 13.8812 13.8852 13.8827 13.8837 13.8842C13.8822 13.8857 13.8807 13.8872 13.8792 13.8887C11.8286 15.9344 8.50783 15.9329 6.45908 13.8842Z" fill="black" /></svg>',
  }

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
    if (item.registrationNumber == this.selectedTransactionNumber) {
      let current = this.transactionsList.find((topic: any) => topic.registrationNumber == item.registrationNumber)
      current.isSelected = !current.isSelected
      this.selectedTransactionNumber = current.isSelected ? item.registrationNumber : null
    } else {
      let old = this.transactionsList.find((topic: any) => topic.isSelected == true)
      old ? old.isSelected = false : null
      let _new = this.transactionsList.find((topic: any) => topic.registrationNumber == item.registrationNumber)
      _new ? _new.isSelected = true : false
      this.selectedTransactionNumber = item.registrationNumber
    }
    this.selectedTransactionNumber ? this.getTransactionData(this.selectedTransactionNumber) : this.clear()
    // console.log(this.selectedTransactionNumber)
  }


  getTransactionData(id:any) {
    this.XhrService.get('v1/transaction/get-id/' + id).subscribe(res => {
      if (res.data) {
        this.transactionData = res.data
      }
    })
  }



  downloadAttachment(id: any) {
    this.HttpClient.get(`${this.environment}v1/files/downloadwithappcode/${id}`, { responseType: 'blob' }).subscribe((resultBlob: Blob) => {
      var downloadURL = URL.createObjectURL(resultBlob);
      window.open(downloadURL);
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
    this.isNoChangesDetected = this.uploadedFiles.length > 0 ?  false : true
  }
  submitFiles() {
    let payload = {
      id: this.transactionData.id,
      files: this.uploadedFiles
    }
    // console.log(payload)
    this.XhrService.put('v1/transaction/add-transaction-files', payload).subscribe(res => {
      if (res.data) {
        this.getTransactionData(this.selectedTransactionNumber)
        this.clear()
      }
    })
  }










  clear(){
    this.transactionData = []
    this.uploadedFiles = []
    this.clearAttchments.next(true);
    this.isNoChangesDetected = true
  }

}
