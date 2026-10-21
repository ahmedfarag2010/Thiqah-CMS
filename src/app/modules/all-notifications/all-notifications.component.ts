import { Component, OnInit } from '@angular/core';
import { XhrService } from '../../shared/services/xhr/xhr.service';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared/shared.service';




@Component({
  selector: 'app-all-notifications',
  templateUrl: './all-notifications.component.html',
  styleUrl: './all-notifications.component.scss'
})
export class AllNotificationsComponent implements OnInit {
  constructor(
    private XhrService:XhrService,
    private Router:Router,
    private SharedService:SharedService
  ){

  }

  ngOnInit(): void {
    this.getNotifications()
  }

  notificationsList:any= []
  totalCount = 0

  payload = {
    "pageNumber": 1,
    "pageSize": 5,
    "orderByValue": [{sort: 'desc'}]
  }
  getNotifications(){
    this.XhrService.post('v1/usernotification/get-paged',this.payload).subscribe(res =>{
      if(res.data.data){
        // this.notificationsList = [...res.data.data,...this.notificationsList]
        this.notificationsList = this.notificationsList.concat(res.data.data)
        this.totalCount = res.data.totalCount
      }
    })
  }

  goToTransaction(item:any){
    // read notification
    this.SharedService.sectionType.next(this.SharedService.notificationStatus.find(obj => obj.id == item.type)?.mode)
    this.readNotfication(item.id)
    this.Router.navigate([`cms/topic/${item.registrationNumber}`])
  }

  // read notification after click
  readNotfication(notificationId:any){
    this.XhrService.put('v1/usernotification/read-notification','','?id=' + notificationId).subscribe(res => {
      // this.getNotifications()
      this.getUnreadedCount()
    })
  }


  loadMore(){
    this.payload.pageNumber++
    this.getNotifications()
  }

  count:any
  getUnreadedCount(){
    this.XhrService.get('v1/usernotification/get-notification-count').subscribe(res => {
      if(res){
        this.count = res.data
        this.SharedService.notificationCount.next(this.count)
      }
    })
  }
}
