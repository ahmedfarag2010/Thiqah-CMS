import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import * as CryptoJS from 'crypto-js';



@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private messageService: MessageService) { }

  sectionType = new BehaviorSubject<any>(null);
  notificationCount = new BehaviorSubject<any>(0);

  showToaster(severity: any, summary: any, detail: any, life: number) {
    this.messageService.clear()
    this.messageService.add({ severity: severity, summary: summary, detail: detail, life: life });
  }


  transactionTypesList = [
    {
      name: 'الوارد',
      id: 1
    },
    {
      name: 'الصادر ',
      id: 2
    },
    {
      name: 'معاملة الاحالة الداخلية',
      id: 3
    }
  ]

  manageDropdownValues(valueObject: any) {
    let keys = Object.keys(valueObject)
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] != 'files') {
        // Single select
        if (valueObject[keys[i]] && (valueObject[keys[i]].name && valueObject[keys[i]].id)) {
          valueObject[keys[i]] = valueObject[keys[i]].id
        }
        // Multi select
        if (Array.isArray(valueObject[keys[i]])) {
          for (let x = 0; x < valueObject[keys[i]].length; x++) {
            valueObject[keys[i]][x] = valueObject[keys[i]][x].id
          }
        }
      }
    }
    return valueObject
  }

  transformDateFormat(_date: string) {
    if (_date) {
      const date = new Date(_date)
      let val = ''
      let year = date.getFullYear()
      let month = Number(date.getMonth() + 1) < 10 ? '0' + Number(date.getMonth() + 1) : Number(date.getMonth() + 1)
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      val = `${day}/${month}/${year}`
      return val
    } else {
      return '-'
    }

  }

  importanceLevelStatuses = [
    {
      key: 'عادى',
      class: 'regular'
    },
    {
      key: 'هام',
      class: 'important'
    },
    {
      key: 'هام جدا',
      class: 'important'
    },
    {
      key: 'عاجل للتصدير',
      class: 'urgent'
    }
  ]


  decodeToken() {
    let token: any = localStorage.getItem('token')
    // return token
    return token ? jwtDecode(token) : false
  }

  //   Info = 0,
  //   Incoming = 1,
  //   Outgoing = 2,
  //   Create = 3,
  //   Copy = 4,
  //   Archive = 5,
  //   Refused = 6,

  notificationStatus = [
    { id: 0, mode: '' },
    { id: 1, mode: 'inbox' },
    { id: 2, mode: 'outgoing' },
    { id: 3, mode: 'transferred' },
    { id: 4, mode: 'saved' },
    { id: 5, mode: 'copied' },
    { id: 6, mode: 'refused' },
  ]


  transformDateToHijri(date: any, lang: any) {
    var date = date || new Date();
    lang = lang || 'en';
    var options = {
      year: 'numeric', month: 'numeric', day: 'numeric'
    };
    return date.toLocaleString(lang + '-u-ca-islamic', options);
  }




  key = CryptoJS.enc.Utf8.parse("CmsKey1234567890ABCDEF1234560000");
  encrypt(text: string): string {
    let iv = CryptoJS.lib.WordArray.random(16); // random IV
    const encrypted = CryptoJS.AES.encrypt(text, this.key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const result = iv.concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(result);
  }




}
