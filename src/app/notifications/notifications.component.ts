import { Component, OnInit } from '@angular/core';
import { PouchService } from './../../providers/pouch-service';
//declare var $: any;
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[];
  isStaffSwitchedTable = false;
  isDepartmentSwitchedTable = false;
  isSupervisor = false;
  isPayLoan = false;
  itemSize: number;
  paginatedCounterproducts;
  paginatedProducts;
  paginatedNotifications;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService) { }

  ngOnInit() {

    this.checkViewStatus();
  }

  loadNotifications() {
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

      $(document).ready(function () {
        $('#dtBasicExample').DataTable();
        $('.dataTables_length').addClass('bs-select');
      });
    });
  }

  deleteNotification(notification, i) {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      item.notification.splice(i, 1);
      this.pouchService.updateStaff(item).then(result => {
        this.loadNotifications();
      });
    });
  }

  checkViewStatus() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.isStaffSwitchedTable = staff.isswitchedtable;
      this.pouchService.getDepartments().then(departments => {
        departments = departments.filter(data => data.branch == staff.branch);
        this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
        this.loadNotifications();
      });
    });
  }

  switchView(event) {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    if (event.checked) {
      this.pouchService.getStaff(localStorageItem).then(staff => {
        staff.isswitchedtable = true;
        this.isStaffSwitchedTable = staff.isswitchedtable;
        this.pouchService.updateStaff(staff);
        this.pouchService.getDepartments().then(departments => {
          departments = departments.filter(data => data.branch == staff.branch);
          departments[0].isswitchedtable = true;
          this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
          this.pouchService.updateDepartment(departments[0]).then(result => {  //For changes to be made based on department
            this.loadNotifications();
          });
        });
      });
    }
    else {
      this.pouchService.getStaff(localStorageItem).then(staff => {
        staff.isswitchedtable = false;
        this.isStaffSwitchedTable = staff.isswitchedtable;
        this.pouchService.updateStaff(staff);
        this.pouchService.getDepartments().then(departments => {
          departments = departments.filter(data => data.branch == staff.branch);
          departments[0].isswitchedtable = false;
          this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
          this.pouchService.updateDepartment(departments[0]).then(result => {
            this.loadNotifications();
          });
        });
      });
    }
  }

}
