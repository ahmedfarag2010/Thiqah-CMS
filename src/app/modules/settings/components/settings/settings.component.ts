import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FBControl } from '../../../../shared/interfaces/fbcontrol'
import { DomSanitizer } from '@angular/platform-browser';
import { XhrService } from '../../../../shared/services/xhr/xhr.service';
import { SharedService } from '../../../../shared/services/shared/shared.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PermissionsService } from '../../../../shared/services/permissions.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class SettingsComponent implements OnInit {

  permissionKey = 'read_all_settings'

  selectedColor = ''

  list_of_sections: any = []
  isShowLOVModal = false
  constructor(
    private sanitizer: DomSanitizer,
    private XhrService: XhrService,
    private SharedService: SharedService,
    private confirmationService: ConfirmationService,
    public PermissionsService: PermissionsService,
    private Router: Router
  ) {
    this.list_of_sections = [
      {
        icon: this.sanitizer.bypassSecurityTrustHtml('<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M5.2498 3C4.00727 3 3 4.00727 3 5.2498V18.7486C3 19.9911 4.00727 20.9984 5.2498 20.9984H11.1644L11.5202 19.5754C11.5266 19.5497 11.5333 19.5241 11.5402 19.4985H5.2498C4.83563 19.4985 4.49987 19.1628 4.49987 18.7486V5.2498C4.49987 4.83563 4.83563 4.49987 5.2498 4.49987H18.7486C19.1628 4.49987 19.4985 4.83563 19.4985 5.2498V11.2317C19.9774 11.0412 20.492 10.9678 20.9984 11.0115V5.2498C20.9984 4.00727 19.9911 3 18.7486 3H5.2498ZM15.3539 14.9989H11.2493C10.835 14.9989 10.4993 15.3347 10.4993 15.7489C10.4993 16.163 10.835 16.4988 11.2493 16.4988H13.8541L15.3539 14.9989ZM8.74949 8.24954C8.74949 8.80177 8.30181 9.24945 7.74958 9.24945C7.19735 9.24945 6.74967 8.80177 6.74967 8.24954C6.74967 7.69731 7.19735 7.24963 7.74958 7.24963C8.30181 7.24963 8.74949 7.69731 8.74949 8.24954ZM11.2493 7.4996C10.8351 7.4996 10.4993 7.83536 10.4993 8.24954C10.4993 8.66371 10.8351 8.99947 11.2493 8.99947H16.7488C17.163 8.99947 17.4987 8.66371 17.4987 8.24954C17.4987 7.83536 17.163 7.4996 16.7488 7.4996H11.2493ZM11.2493 11.2493C10.835 11.2493 10.4993 11.585 10.4993 11.9992C10.4993 12.4134 10.835 12.7491 11.2493 12.7491H16.7486C17.1629 12.7491 17.4985 12.4134 17.4985 11.9992C17.4985 11.585 17.1629 11.2493 16.7486 11.2493H11.2493ZM7.74958 12.9991C8.30181 12.9991 8.74949 12.5515 8.74949 11.9992C8.74949 11.447 8.30181 10.9993 7.74958 10.9993C7.19735 10.9993 6.74967 11.447 6.74967 11.9992C6.74967 12.5515 7.19735 12.9991 7.74958 12.9991ZM8.74949 15.7489C8.74949 16.3011 8.30181 16.7488 7.74958 16.7488C7.19735 16.7488 6.74967 16.3011 6.74967 15.7489C6.74967 15.1966 7.19735 14.749 7.74958 14.749C8.30181 14.749 8.74949 15.1966 8.74949 15.7489ZM19.0984 12.6686L13.1965 18.5705C12.8524 18.9146 12.6083 19.3458 12.4903 19.8179L12.0327 21.6484C11.8336 22.4445 12.5547 23.1656 13.3508 22.9666L15.1813 22.5089C15.6534 22.3909 16.0846 22.1468 16.4287 21.8027L22.3306 15.9008C23.2231 15.0082 23.2231 13.5611 22.3306 12.6686C21.4381 11.7761 19.991 11.7761 19.0984 12.6686Z" fill="#36b4e5"/></svg>'),
        name: 'الجهات الرئيسية',
        count: 0,
        key: 'organization',
        permission: 'read_main_organizations'
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml('<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M5.2498 3C4.00727 3 3 4.00727 3 5.2498V18.7486C3 19.9911 4.00727 20.9984 5.2498 20.9984H11.1644L11.5202 19.5754C11.5266 19.5497 11.5333 19.5241 11.5402 19.4985H5.2498C4.83563 19.4985 4.49987 19.1628 4.49987 18.7486V5.2498C4.49987 4.83563 4.83563 4.49987 5.2498 4.49987H18.7486C19.1628 4.49987 19.4985 4.83563 19.4985 5.2498V11.2317C19.9774 11.0412 20.492 10.9678 20.9984 11.0115V5.2498C20.9984 4.00727 19.9911 3 18.7486 3H5.2498ZM15.3539 14.9989H11.2493C10.835 14.9989 10.4993 15.3347 10.4993 15.7489C10.4993 16.163 10.835 16.4988 11.2493 16.4988H13.8541L15.3539 14.9989ZM8.74949 8.24954C8.74949 8.80177 8.30181 9.24945 7.74958 9.24945C7.19735 9.24945 6.74967 8.80177 6.74967 8.24954C6.74967 7.69731 7.19735 7.24963 7.74958 7.24963C8.30181 7.24963 8.74949 7.69731 8.74949 8.24954ZM11.2493 7.4996C10.8351 7.4996 10.4993 7.83536 10.4993 8.24954C10.4993 8.66371 10.8351 8.99947 11.2493 8.99947H16.7488C17.163 8.99947 17.4987 8.66371 17.4987 8.24954C17.4987 7.83536 17.163 7.4996 16.7488 7.4996H11.2493ZM11.2493 11.2493C10.835 11.2493 10.4993 11.585 10.4993 11.9992C10.4993 12.4134 10.835 12.7491 11.2493 12.7491H16.7486C17.1629 12.7491 17.4985 12.4134 17.4985 11.9992C17.4985 11.585 17.1629 11.2493 16.7486 11.2493H11.2493ZM7.74958 12.9991C8.30181 12.9991 8.74949 12.5515 8.74949 11.9992C8.74949 11.447 8.30181 10.9993 7.74958 10.9993C7.19735 10.9993 6.74967 11.447 6.74967 11.9992C6.74967 12.5515 7.19735 12.9991 7.74958 12.9991ZM8.74949 15.7489C8.74949 16.3011 8.30181 16.7488 7.74958 16.7488C7.19735 16.7488 6.74967 16.3011 6.74967 15.7489C6.74967 15.1966 7.19735 14.749 7.74958 14.749C8.30181 14.749 8.74949 15.1966 8.74949 15.7489ZM19.0984 12.6686L13.1965 18.5705C12.8524 18.9146 12.6083 19.3458 12.4903 19.8179L12.0327 21.6484C11.8336 22.4445 12.5547 23.1656 13.3508 22.9666L15.1813 22.5089C15.6534 22.3909 16.0846 22.1468 16.4287 21.8027L22.3306 15.9008C23.2231 15.0082 23.2231 13.5611 22.3306 12.6686C21.4381 11.7761 19.991 11.7761 19.0984 12.6686Z" fill="#36b4e5"/></svg>'),
        name: 'الجهات الفرعية',
        count: 0,
        key: 'subOrganization',
        permission: 'read_sub_organizations',
        nested: {
          name: 'organization',
          placeholder: 'أختر الجهة الرئيسية أولا',
          type: 'dropdown',
          options: []
        }
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml('<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M5.2498 3C4.00727 3 3 4.00727 3 5.2498V18.7486C3 19.9911 4.00727 20.9984 5.2498 20.9984H11.1644L11.5202 19.5754C11.5266 19.5497 11.5333 19.5241 11.5402 19.4985H5.2498C4.83563 19.4985 4.49987 19.1628 4.49987 18.7486V5.2498C4.49987 4.83563 4.83563 4.49987 5.2498 4.49987H18.7486C19.1628 4.49987 19.4985 4.83563 19.4985 5.2498V11.2317C19.9774 11.0412 20.492 10.9678 20.9984 11.0115V5.2498C20.9984 4.00727 19.9911 3 18.7486 3H5.2498ZM15.3539 14.9989H11.2493C10.835 14.9989 10.4993 15.3347 10.4993 15.7489C10.4993 16.163 10.835 16.4988 11.2493 16.4988H13.8541L15.3539 14.9989ZM8.74949 8.24954C8.74949 8.80177 8.30181 9.24945 7.74958 9.24945C7.19735 9.24945 6.74967 8.80177 6.74967 8.24954C6.74967 7.69731 7.19735 7.24963 7.74958 7.24963C8.30181 7.24963 8.74949 7.69731 8.74949 8.24954ZM11.2493 7.4996C10.8351 7.4996 10.4993 7.83536 10.4993 8.24954C10.4993 8.66371 10.8351 8.99947 11.2493 8.99947H16.7488C17.163 8.99947 17.4987 8.66371 17.4987 8.24954C17.4987 7.83536 17.163 7.4996 16.7488 7.4996H11.2493ZM11.2493 11.2493C10.835 11.2493 10.4993 11.585 10.4993 11.9992C10.4993 12.4134 10.835 12.7491 11.2493 12.7491H16.7486C17.1629 12.7491 17.4985 12.4134 17.4985 11.9992C17.4985 11.585 17.1629 11.2493 16.7486 11.2493H11.2493ZM7.74958 12.9991C8.30181 12.9991 8.74949 12.5515 8.74949 11.9992C8.74949 11.447 8.30181 10.9993 7.74958 10.9993C7.19735 10.9993 6.74967 11.447 6.74967 11.9992C6.74967 12.5515 7.19735 12.9991 7.74958 12.9991ZM8.74949 15.7489C8.74949 16.3011 8.30181 16.7488 7.74958 16.7488C7.19735 16.7488 6.74967 16.3011 6.74967 15.7489C6.74967 15.1966 7.19735 14.749 7.74958 14.749C8.30181 14.749 8.74949 15.1966 8.74949 15.7489ZM19.0984 12.6686L13.1965 18.5705C12.8524 18.9146 12.6083 19.3458 12.4903 19.8179L12.0327 21.6484C11.8336 22.4445 12.5547 23.1656 13.3508 22.9666L15.1813 22.5089C15.6534 22.3909 16.0846 22.1468 16.4287 21.8027L22.3306 15.9008C23.2231 15.0082 23.2231 13.5611 22.3306 12.6686C21.4381 11.7761 19.991 11.7761 19.0984 12.6686Z" fill="#36b4e5"/></svg>'),
        name: 'صفة المعاملة',
        count: 0,
        key: 'transactionAdjective',
        permission: 'read_transaction_adjective'
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml('<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M5.2498 3C4.00727 3 3 4.00727 3 5.2498V18.7486C3 19.9911 4.00727 20.9984 5.2498 20.9984H11.1644L11.5202 19.5754C11.5266 19.5497 11.5333 19.5241 11.5402 19.4985H5.2498C4.83563 19.4985 4.49987 19.1628 4.49987 18.7486V5.2498C4.49987 4.83563 4.83563 4.49987 5.2498 4.49987H18.7486C19.1628 4.49987 19.4985 4.83563 19.4985 5.2498V11.2317C19.9774 11.0412 20.492 10.9678 20.9984 11.0115V5.2498C20.9984 4.00727 19.9911 3 18.7486 3H5.2498ZM15.3539 14.9989H11.2493C10.835 14.9989 10.4993 15.3347 10.4993 15.7489C10.4993 16.163 10.835 16.4988 11.2493 16.4988H13.8541L15.3539 14.9989ZM8.74949 8.24954C8.74949 8.80177 8.30181 9.24945 7.74958 9.24945C7.19735 9.24945 6.74967 8.80177 6.74967 8.24954C6.74967 7.69731 7.19735 7.24963 7.74958 7.24963C8.30181 7.24963 8.74949 7.69731 8.74949 8.24954ZM11.2493 7.4996C10.8351 7.4996 10.4993 7.83536 10.4993 8.24954C10.4993 8.66371 10.8351 8.99947 11.2493 8.99947H16.7488C17.163 8.99947 17.4987 8.66371 17.4987 8.24954C17.4987 7.83536 17.163 7.4996 16.7488 7.4996H11.2493ZM11.2493 11.2493C10.835 11.2493 10.4993 11.585 10.4993 11.9992C10.4993 12.4134 10.835 12.7491 11.2493 12.7491H16.7486C17.1629 12.7491 17.4985 12.4134 17.4985 11.9992C17.4985 11.585 17.1629 11.2493 16.7486 11.2493H11.2493ZM7.74958 12.9991C8.30181 12.9991 8.74949 12.5515 8.74949 11.9992C8.74949 11.447 8.30181 10.9993 7.74958 10.9993C7.19735 10.9993 6.74967 11.447 6.74967 11.9992C6.74967 12.5515 7.19735 12.9991 7.74958 12.9991ZM8.74949 15.7489C8.74949 16.3011 8.30181 16.7488 7.74958 16.7488C7.19735 16.7488 6.74967 16.3011 6.74967 15.7489C6.74967 15.1966 7.19735 14.749 7.74958 14.749C8.30181 14.749 8.74949 15.1966 8.74949 15.7489ZM19.0984 12.6686L13.1965 18.5705C12.8524 18.9146 12.6083 19.3458 12.4903 19.8179L12.0327 21.6484C11.8336 22.4445 12.5547 23.1656 13.3508 22.9666L15.1813 22.5089C15.6534 22.3909 16.0846 22.1468 16.4287 21.8027L22.3306 15.9008C23.2231 15.0082 23.2231 13.5611 22.3306 12.6686C21.4381 11.7761 19.991 11.7761 19.0984 12.6686Z" fill="#36b4e5"/></svg>'),
        name: 'مستوى الأهمية',
        count: 0,
        key: 'importanceLevel',
        permission: 'read_importance_level'
      },
      // {
      //   icon: this.sanitizer.bypassSecurityTrustHtml('<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M5.2498 3C4.00727 3 3 4.00727 3 5.2498V18.7486C3 19.9911 4.00727 20.9984 5.2498 20.9984H11.1644L11.5202 19.5754C11.5266 19.5497 11.5333 19.5241 11.5402 19.4985H5.2498C4.83563 19.4985 4.49987 19.1628 4.49987 18.7486V5.2498C4.49987 4.83563 4.83563 4.49987 5.2498 4.49987H18.7486C19.1628 4.49987 19.4985 4.83563 19.4985 5.2498V11.2317C19.9774 11.0412 20.492 10.9678 20.9984 11.0115V5.2498C20.9984 4.00727 19.9911 3 18.7486 3H5.2498ZM15.3539 14.9989H11.2493C10.835 14.9989 10.4993 15.3347 10.4993 15.7489C10.4993 16.163 10.835 16.4988 11.2493 16.4988H13.8541L15.3539 14.9989ZM8.74949 8.24954C8.74949 8.80177 8.30181 9.24945 7.74958 9.24945C7.19735 9.24945 6.74967 8.80177 6.74967 8.24954C6.74967 7.69731 7.19735 7.24963 7.74958 7.24963C8.30181 7.24963 8.74949 7.69731 8.74949 8.24954ZM11.2493 7.4996C10.8351 7.4996 10.4993 7.83536 10.4993 8.24954C10.4993 8.66371 10.8351 8.99947 11.2493 8.99947H16.7488C17.163 8.99947 17.4987 8.66371 17.4987 8.24954C17.4987 7.83536 17.163 7.4996 16.7488 7.4996H11.2493ZM11.2493 11.2493C10.835 11.2493 10.4993 11.585 10.4993 11.9992C10.4993 12.4134 10.835 12.7491 11.2493 12.7491H16.7486C17.1629 12.7491 17.4985 12.4134 17.4985 11.9992C17.4985 11.585 17.1629 11.2493 16.7486 11.2493H11.2493ZM7.74958 12.9991C8.30181 12.9991 8.74949 12.5515 8.74949 11.9992C8.74949 11.447 8.30181 10.9993 7.74958 10.9993C7.19735 10.9993 6.74967 11.447 6.74967 11.9992C6.74967 12.5515 7.19735 12.9991 7.74958 12.9991ZM8.74949 15.7489C8.74949 16.3011 8.30181 16.7488 7.74958 16.7488C7.19735 16.7488 6.74967 16.3011 6.74967 15.7489C6.74967 15.1966 7.19735 14.749 7.74958 14.749C8.30181 14.749 8.74949 15.1966 8.74949 15.7489ZM19.0984 12.6686L13.1965 18.5705C12.8524 18.9146 12.6083 19.3458 12.4903 19.8179L12.0327 21.6484C11.8336 22.4445 12.5547 23.1656 13.3508 22.9666L15.1813 22.5089C15.6534 22.3909 16.0846 22.1468 16.4287 21.8027L22.3306 15.9008C23.2231 15.0082 23.2231 13.5611 22.3306 12.6686C21.4381 11.7761 19.991 11.7761 19.0984 12.6686Z" fill="#36b4e5"/></svg>'),
      //   name: 'نوع المعاملة',
      //   count: 0,
      //   key: 'transactionTypes',
      //   permission:''
      // },
      // {
      //   icon: this.sanitizer.bypassSecurityTrustHtml('<svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M5.2498 3C4.00727 3 3 4.00727 3 5.2498V18.7486C3 19.9911 4.00727 20.9984 5.2498 20.9984H11.1644L11.5202 19.5754C11.5266 19.5497 11.5333 19.5241 11.5402 19.4985H5.2498C4.83563 19.4985 4.49987 19.1628 4.49987 18.7486V5.2498C4.49987 4.83563 4.83563 4.49987 5.2498 4.49987H18.7486C19.1628 4.49987 19.4985 4.83563 19.4985 5.2498V11.2317C19.9774 11.0412 20.492 10.9678 20.9984 11.0115V5.2498C20.9984 4.00727 19.9911 3 18.7486 3H5.2498ZM15.3539 14.9989H11.2493C10.835 14.9989 10.4993 15.3347 10.4993 15.7489C10.4993 16.163 10.835 16.4988 11.2493 16.4988H13.8541L15.3539 14.9989ZM8.74949 8.24954C8.74949 8.80177 8.30181 9.24945 7.74958 9.24945C7.19735 9.24945 6.74967 8.80177 6.74967 8.24954C6.74967 7.69731 7.19735 7.24963 7.74958 7.24963C8.30181 7.24963 8.74949 7.69731 8.74949 8.24954ZM11.2493 7.4996C10.8351 7.4996 10.4993 7.83536 10.4993 8.24954C10.4993 8.66371 10.8351 8.99947 11.2493 8.99947H16.7488C17.163 8.99947 17.4987 8.66371 17.4987 8.24954C17.4987 7.83536 17.163 7.4996 16.7488 7.4996H11.2493ZM11.2493 11.2493C10.835 11.2493 10.4993 11.585 10.4993 11.9992C10.4993 12.4134 10.835 12.7491 11.2493 12.7491H16.7486C17.1629 12.7491 17.4985 12.4134 17.4985 11.9992C17.4985 11.585 17.1629 11.2493 16.7486 11.2493H11.2493ZM7.74958 12.9991C8.30181 12.9991 8.74949 12.5515 8.74949 11.9992C8.74949 11.447 8.30181 10.9993 7.74958 10.9993C7.19735 10.9993 6.74967 11.447 6.74967 11.9992C6.74967 12.5515 7.19735 12.9991 7.74958 12.9991ZM8.74949 15.7489C8.74949 16.3011 8.30181 16.7488 7.74958 16.7488C7.19735 16.7488 6.74967 16.3011 6.74967 15.7489C6.74967 15.1966 7.19735 14.749 7.74958 14.749C8.30181 14.749 8.74949 15.1966 8.74949 15.7489ZM19.0984 12.6686L13.1965 18.5705C12.8524 18.9146 12.6083 19.3458 12.4903 19.8179L12.0327 21.6484C11.8336 22.4445 12.5547 23.1656 13.3508 22.9666L15.1813 22.5089C15.6534 22.3909 16.0846 22.1468 16.4287 21.8027L22.3306 15.9008C23.2231 15.0082 23.2231 13.5611 22.3306 12.6686C21.4381 11.7761 19.991 11.7761 19.0984 12.6686Z" fill="#36b4e5"/></svg>'),
      //   name: 'إرسال البريد الإلكتروني',
      //   count: 0,
      //   key: 'sendMail',
      //   permission: ''
      // }
    ]
  }





  // isShowCreateOrEditModal = false
  // isShowDeleteModal = false

  actionType = ''

  transactionAdjectiveList: any[] = []
  transactionTypesList: any[] = []
  importanceLevelList: any[] = []
  organizationList: any[] = []
  subOrganizationList: any[] = []


  addNewControl: FBControl = {
    label: '',
    placeholder: 'أدخل الخيار',
    type: 'textbox',
    name: 'name'
  }

  ngOnInit(): void {
    if (this.PermissionsService.isHasPermissions(this.permissionKey)) {
      this.executePermissions()
      this.transactionTypesList = this.SharedService.transactionTypesList
      this.manageDisability(this.transactionTypesList, true)

      this.list_of_sections.find((obj: any) => obj.key.toLowerCase() === 'transactiontypes') ? this.list_of_sections.find((obj: any) => obj.key.toLowerCase() === 'transactiontypes').count = this.transactionTypesList.length : null;
      (this.list_of_sections.find((obj: any) => obj.key.toLowerCase() === 'organization') || this.list_of_sections.find((obj: any) => obj.key.toLowerCase() === 'suborganization')) ? this.getOrganization() : null;
      this.list_of_sections.find((obj: any) => obj.key.toLowerCase() === 'importancelevel') ? this.getImportanceLevel() : null;
      this.list_of_sections.find((obj: any) => obj.key.toLowerCase() === 'transactionadjective') ? this.getTransacionAadjective() : null;
      this.getEmailSettingValue()
    } else {
      this.Router.navigate(['cms/home'])
      this.SharedService.showToaster('error', 'خطأ', 'ليس لديك صلاحية للوصول لهذه الصفحة', 5000)
    }

  }


  selectedMainOrg: any
  selectedParentId: any
  getDropdownValue(event: any) {
    if (event.event.value) {
      this.selectedMainOrg = event.field
      this.getSubOrganization(event.event.value.id)
      this.selectedParentId = event.event.value.id
    } else {
      this.selectedMainOrg = undefined
      this.selectedParentId = null
      this.list_of_sections.find((obj: any) => obj.key.toLowerCase() === 'suborganization').count = 0
    }
    // console.log(this.selectedParentId)
  }


  currentObject: any = {}
  modalTitle = ''
  initModal(e: any, object: any) {
    // console.log(this.selectedMainOrg)
    if (object.key == 'subOrganization' && this.selectedMainOrg == undefined) {
      this.SharedService.showToaster('error', 'خطأ', 'قم بإختيار الجهة الرئيسية أولاً', 2000)
    } else {
      this.currentObject = object
      this.isShowLOVModal = true
      this.modalTitle = this.currentObject.name
      if (object.key == 'organization') {
        this.currentObjectOptions = this.organizationList
      }
      else if (object.key == 'subOrganization') {
        this.currentObjectOptions = this.subOrganizationList
      }
      else if (object.key == 'transactionTypes') {
        this.currentObjectOptions = this.transactionTypesList
      }
      else if (object.key == 'importanceLevel') {
        this.currentObjectOptions = this.importanceLevelList
      }
      else if (object.key == 'transactionAdjective') {
        this.currentObjectOptions = this.transactionAdjectiveList
        this.addNewForm.addControl('backGroundColor', new FormControl('#ffffff', Validators.required));
      }
    }
  }

  addNewForm: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required)
  })

  currentObjectOptions: any[] = []

  edit(option: any) {
    console.log(option)
    let field = this.currentObjectOptions.find(object => object.name == option.name)
    field ? field.isDisabled = false : true
    // console.log(field)
    // this.currentObjectOptions.find(object => object.name == option.name).isDisabled = false
  }

  submitEdit(option: any) {
    // this option is the updated control
    console.log(option)
    if (this.currentObject.key.toLowerCase() == 'organization') {
      this.XhrService.put('v1/organization/update', { id: option.id, name: option.name, parentId: null }).subscribe(res => {
        if (res.data) {
          this.getOrganization()
        }
      })
    }
    else if (this.currentObject.key.toLowerCase() == 'suborganization') {
      this.XhrService.put('v1/organization/update', { id: option.id, name: option.name, parentId: this.selectedParentId }).subscribe(res => {
        if (res.data) {
          this.getSubOrganization(this.selectedParentId)
        }
      })
    }
    else if (this.currentObject.key.toLowerCase() == 'transactionadjective') {
      this.XhrService.put('v1/transactionadjective/update', { id: option.id, name: option.name, backGroundColor: option.backGroundColor }).subscribe(res => {
        if (res.data) {
          this.getTransacionAadjective()
        }
      })
    }
    else if (this.currentObject.key.toLowerCase() == 'importancelevel') {
      this.XhrService.put('v1/importancelevel/update', { id: option.id, name: option.name }).subscribe(res => {
        if (res.data) {
          this.getImportanceLevel()
        }
      })
    }
  }

  confirmationSubmit(option: any) {
    this.confirmationService.confirm({
      accept: () => {
        this.delete(option)
      },
      reject: () => {
      }
    })
  }

  delete(option: any) {
    // console.log(option)
    if (this.currentObject.key.toLowerCase() == 'organization' || this.currentObject.key.toLowerCase() == 'suborganization') {
      this.XhrService.delete('v1/organization/delete-soft/' + option.id).subscribe(res => {
        if (res.data) {
          if (this.currentObject.key.toLowerCase() == 'organization') {
            this.getOrganization()
          } else if (this.currentObject.key.toLowerCase() == 'suborganization') {
            this.getSubOrganization(this.selectedParentId)
          }
        }
      })
    }
    else if (this.currentObject.key.toLowerCase() == 'transactionadjective') {
      this.XhrService.delete('v1/transactionadjective/delete-soft/' + option.id).subscribe(res => {
        if (res.data) {
          this.getTransacionAadjective()
        }
      })
    }
    else if (this.currentObject.key.toLowerCase() == 'importancelevel') {
      this.XhrService.delete('v1/importancelevel/delete-soft/' + option.id).subscribe(res => {
        if (res.data) {
          this.getImportanceLevel()
        }
      })
    }
  }



  closeModal() {
    this.isShowLOVModal = false
    this.currentObjectOptions = []
    this.manageDisability(this.organizationList, true)
    this.manageDisability(this.subOrganizationList, true)
    this.manageDisability(this.transactionTypesList, true)
    this.manageDisability(this.importanceLevelList, true)
    this.manageDisability(this.transactionAdjectiveList, true)
    this.addNewForm.reset()
  }


  submitNewChoice(form: any) {
    // console.log(this.selectedMainOrg)
    console.log(form.value)
    // console.log(this.currentObject)
    // nested
    if (this.currentObject.key == 'subOrganization' && this.selectedMainOrg.name == 'organization') {
      // console.log(1)
      this.XhrService.post('v1/organization/add', { name: form.value.name, parentId: this.selectedParentId }).subscribe(res => {
        if (res.data) {
          this.currentObjectOptions = []
          this.getSubOrganization(this.selectedParentId)
          this.isShowLOVModal = false
        }
      })
    } else {
      // others
      if (this.currentObject.key == 'organization') {
        this.XhrService.post('v1/organization/add', { name: form.value.name }).subscribe(res => {
          if (res.data) {
            this.currentObjectOptions = []
            this.isShowLOVModal = false
            this.getOrganization()
          }
        })
      }
      else if (this.currentObject.key.toLowerCase() == 'transactionadjective') {
        this.XhrService.post('v1/transactionadjective/add', { name: form.value.name, backGroundColor: form.value.backGroundColor }).subscribe(res => {
          if (res.data) {
            this.currentObjectOptions = []
            this.isShowLOVModal = false
            this.getTransacionAadjective()
          }
        })
      }
      else if (this.currentObject.key.toLowerCase() == 'importancelevel') {
        this.XhrService.post('v1/importancelevel/add', { name: form.value.name }).subscribe(res => {
          if (res.data) {
            this.currentObjectOptions = []
            this.isShowLOVModal = false
            this.getImportanceLevel()
          }
        })
      }
    }
    this.addNewForm.get('backGroundColor')?.setValue('#ffffff')
    this.addNewForm.get('backGroundColor') ? this.addNewForm.removeControl('backGroundColor') : null
    this.addNewForm.reset()
  }

  executePermissions() {
    let userPermissions = this.PermissionsService.getUserPermissions()
    // console.log(userPermissions)
    let filteredPermisions = []
    for (let i = 0; i < this.list_of_sections.length; i++) {
      // console.log(userPermissions.includes(this.list_of_sections[i].permission),this.list_of_sections[i].permission)
      if (userPermissions.includes(this.list_of_sections[i].permission)) {

        filteredPermisions.push(this.list_of_sections[i])
      }
    }
    // console.log(filteredPermisions)
    // push filtered permissions
    this.list_of_sections = filteredPermisions
    // console.log(this.list_of_sections)
  }


  //-- get lookups
  getImportanceLevel() {
    this.XhrService.get('v1/importancelevel/get-all').subscribe(res => {
      if (res.data) {
        this.importanceLevelList = res.data
        this.manageDisability(this.importanceLevelList, true)
        // console.log(this.importanceLevelList)
        this.list_of_sections.find((obj: any) => obj.key.toLowerCase() === 'importancelevel').count = this.importanceLevelList.length
        this.currentObjectOptions = this.importanceLevelList
      }
    })
  }

  getTransacionAadjective() {
    this.XhrService.get('v1/transactionadjective/get-all').subscribe(res => {
      if (res.data) {
        this.transactionAdjectiveList = res.data
        this.manageDisability(this.transactionAdjectiveList, true)
        // console.log(this.transactionAdjectiveList)
        for (let i = 0; i < this.transactionAdjectiveList.length; i++) {
          if (!this.transactionAdjectiveList[i].backGroundColor) {
            this.transactionAdjectiveList[i].backGroundColor = '#ffffff';
          }
        }
        this.list_of_sections.find((obj: any) => obj.key.toLowerCase() === 'transactionadjective').count = this.transactionAdjectiveList.length
        // you right here -- continue later
        this.currentObjectOptions = this.transactionAdjectiveList
      }
    })
  }

  getOrganization() {
    // console.log(this.list_of_sections)
    this.XhrService.get('v1/organization/get-all').subscribe(res => {
      this.organizationList = []
      if (res.data) {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].parentId == null) {
            this.organizationList.push(res.data[i])
          }
        }
        this.manageDisability(this.organizationList, true)
        this.list_of_sections.find((obj: any) => obj.key.toLowerCase() === 'organization') ? this.list_of_sections.find((obj: any) => obj.key.toLowerCase() === 'organization').count = this.organizationList.length : null;
        let organization_ddl = this.list_of_sections.find((obj: any) => obj.key.toLowerCase() === 'suborganization')
        organization_ddl ? organization_ddl.nested.options = [] : null
        for (let i = 0; i < this.organizationList.length; i++) {
          organization_ddl ? organization_ddl.nested.options.push({ name: this.organizationList[i].name, id: this.organizationList[i].id }) : null
        }
        this.currentObjectOptions = this.organizationList
        // when get organizations assign ddl in nested
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
    "orderByValue": [{}]
  }

  getSubOrganization(id: any) {
    // console.log(id)
    this.subOrganizationPayload.filter.parentId = id
    this.XhrService.post('v1/organization/get-paged', this.subOrganizationPayload).subscribe(res => {
      if (res.data.data) {
        this.subOrganizationList = res.data.data
        this.manageDisability(this.subOrganizationList, true)
        this.list_of_sections.find((obj: any) => obj.key.toLowerCase() === 'suborganization').count = this.subOrganizationList.length
        this.currentObjectOptions = this.subOrganizationList
      }
    })
  }

  manageDisability(arr: any[], isDisabled: boolean) {
    for (let i = 0; i < arr.length; i++) {
      arr[i]['isDisabled'] = isDisabled
    }
  }

  // email setting


  getEmailSettingValue() {
    this.XhrService.get('v1/setting/get-id/SendMails').subscribe(res => {
      console.log(res)
      if(res.data){
        console.log(res)
        this.sendMail.value = res.data.value
      }
    })
    // temporary
    // let _res = { "data": { "code": "SendMails", "nameAr": "ارسال ايميل", "nameEn": "Send Mails", "type": "System.Boolean", "value": true }, "status": 200, "message": "Data Retrieved Successfully", "exception": null }
    
  }

  sendMail: FBControl = {
    label: 'إرسال بريد إلكتروني',
    name: 'sendMail',
    formControlName: 'sendMail',
    type: 'checkbox',
    readonly: false,
    value: false,
    isRequired: false,
    isSearchable: true,
  }

  toggleValue(event: any) {
    let payload = {   "key": "SendMails",   "value": event.event.toString() }
    this.XhrService.put('v1/setting/update',payload).subscribe(res => {
      console.log(res)
    })
  }



}
