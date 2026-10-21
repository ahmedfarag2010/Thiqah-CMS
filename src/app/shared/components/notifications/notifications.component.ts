import { Component, OnInit } from '@angular/core';
import { XhrService } from '../../services/xhr/xhr.service';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared/shared.service';
import { NotificationStatuses } from '../../enums/notification-statuses';



@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {

  constructor(
    private XhrService:XhrService,
    public Router:Router,
    private SharedService:SharedService
  ){
    
  }

  ngOnInit(): void {
    this.getNotifications()
  }

  notificationsList:any = []

  payload = {
    "pageNumber": 1,
    "pageSize": 10,
    "orderByValue": [{sort: 'desc'}]
  }
  getNotifications(){
    this.XhrService.post('v1/usernotification/get-paged',this.payload).subscribe(res =>{
      if(res.data.data){
        this.notificationsList = res.data.data
        this.getUnreadedCount()
      }
    })
  }

  count:any
  getUnreadedCount(){
    this.XhrService.get('v1/usernotification/get-notification-count').subscribe(res => {
      // console.log(res)
      if(res){
        this.count = res.data
        this.SharedService.notificationCount.next(this.count)
      }
    })
  }


  // click event
  goToTransaction(item:any){
    // read notification
    this.SharedService.sectionType.next(this.SharedService.notificationStatus.find(obj => obj.id == item.type)?.mode)
    this.readNotfication(item.id)
    this.Router.navigate([`cms/topic/${item.registrationNumber}`])
  }

  // read notification after click
  readNotfication(notificationId:any){
    // console.log(notificationId)
    this.XhrService.put('v1/usernotification/read-notification','','?id=' + notificationId).subscribe(res => {
      // console.log(res)
      this.getNotifications()
    })
  }

  readAll(){
    this.XhrService.put('v1/usernotification/read-all-notification','').subscribe(res => {
      this.getNotifications()
    })
  }

  

}
