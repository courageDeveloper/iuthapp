import { Component, OnInit } from '@angular/core';
import { PouchService } from './../../providers/pouch-service';
declare var $: any;
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[];

  constructor(public pouchService: PouchService) { }

  ngOnInit() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      item.notification.reverse();
      this.notifications = item.notification;
      //item.notification = item.notification.filter(data => data.viewed == false);
      item.notification.forEach(notifydata => {
        if (notifydata.viewed == false) {
          notifydata.viewed = true;
          this.pouchService.updateStaff(item).then(result => {
          });
        }
      });
    });
  }

  deleteNotification(notification, i) {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      item.notification.splice(i, 1);
      this.pouchService.updateStaff(item).then(result => {
      });
    });
  }

}
