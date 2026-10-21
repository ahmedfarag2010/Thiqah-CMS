import { Component, OnInit } from '@angular/core';
import { FBControl } from '../../../../shared/interfaces/fbcontrol';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { XhrService } from '../../../../shared/services/xhr/xhr.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Location } from '@angular/common';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss', '../../groups.scss'],
  providers: [ConfirmationService, MessageService],
})
export class UsersComponent implements OnInit {

  searchUser: FormGroup

  constructor(
    private FormBuilder: FormBuilder,
    private XhrService: XhrService,
    private ActivatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private Location:Location
  ) {

  }

  groupId: any

  ngOnInit(): void {
    this.groupId = this.ActivatedRoute.snapshot.paramMap.get('id');
    this.getGroupDetails()
  }

  back(){
    this.Location.back()
  }

  search: FBControl = {
    name: 'search',
    label: 'أكتب ثلاثة حروف قم أضغط إدخال',
    placeholder: 'البحث عن مستخدم',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.3849 15.446C11.7346 17.5687 7.8552 17.4016 5.39842 14.9448C2.76238 12.3088 2.76238 8.03494 5.39842 5.3989C8.03445 2.76287 12.3083 2.76287 14.9444 5.3989C17.4011 7.85569 17.5682 11.7351 15.4456 14.3854L20.6012 19.541C20.8941 19.8339 20.8941 20.3088 20.6012 20.6017C20.3083 20.8946 19.8334 20.8946 19.5405 20.6017L14.3849 15.446ZM6.45908 13.8842C4.40882 11.8339 4.40882 8.50982 6.45908 6.45956C8.50933 4.40931 11.8334 4.40931 13.8837 6.45956C15.9324 8.50831 15.9339 11.8291 13.8882 13.8797C13.8867 13.8812 13.8852 13.8827 13.8837 13.8842C13.8822 13.8857 13.8807 13.8872 13.8792 13.8887C11.8286 15.9344 8.50783 15.9329 6.45908 13.8842Z" fill="black" /></svg>',
  }



  searchResult: any[] = []
  searchText(value: any) {
    if (value.length > 0) {
      this.XhrService.get('v1/accounts/ad-users/' + value).subscribe(res => {
        this.searchResult = []
        if (res.data) {
          this.searchResult = res.data
          for (let i = 0; i < this.searchResult.length; i++) {
            this.searchResult[i]['isAdded'] = false
          }
          this.filterExistsUsers()
        }
      })
    }
  }

  filterExistsUsers() {
    if (this.groupDetails.users.length > 0) {
      let user
      for (let i = 0; i < this.groupDetails.users.length; i++) {
        user = this.searchResult.find(user => user.principal == this.groupDetails.users[i].email)
        user ? user.isAdded = true : false
      }
    }
  }

  actionUser(user: any, action: any) {
    if (action == 'add') {
      let payload = {
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        groupLevelId: this.groupId
      }
      payload.firstName = user.firstName
      payload.lastName = user.lastName
      payload.userName = user.logonName
      payload.email = user.principal
      this.XhrService.post('v1/users/add', payload).subscribe(res => {
        if (res.status != 302) {
          this.getGroupDetails()
        }
      })
    } else if (action == 'remove') {
      this.confirmationService.confirm({
        accept: () => {
          this.XhrService.delete(`v1/users/deletesoft/${user.id}`).subscribe(res => {
            if (res.data) {
              this.getGroupDetails()
            }
          })
        }
      })
    }
  }




  // get data
  groupDetails: any
  getGroupDetails() {
    this.XhrService.get(`v1/grouplevels/get-id/${this.groupId}`).subscribe(res => {
      if (res.data) {
        this.groupDetails = res.data
        this.filterExistsUsers()
      }
    })
  }



}
