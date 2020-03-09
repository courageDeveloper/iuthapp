import { Component, OnInit, Pipe } from '@angular/core';
import { PouchService } from '../../providers/pouch-service';
//declare var $: any;
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-drugnotifications',
  templateUrl: './drugnotifications.component.html',
  styleUrls: ['./drugnotifications.component.css']
})
export class DrugNotificationsComponent implements OnInit {
  notifications: any[];
  itemSize: any;
  iscounterproducts = false;
  isproducts = false;
  isStaffSwitchedTable = false;
  isDepartmentSwitchedTable = false;
  isSupervisor = false;
  isPayLoan = false;
  paginatedCounterproducts;
  paginatedProducts;
  paginatedNotifications;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService) { }

  ngOnInit() {
    /* var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => { */
    /*  item.notification.reverse();
     this.notifications = item.notification;
     //item.notification = item.notification.filter(data => data.viewed == false);
     item.notification.forEach(notifydata => {
       if (notifydata.viewed == false) {
         notifydata.viewed = true;
         this.pouchService.updateStaff(item).then(result => {
         });
       }
     }); */
    /*  if (item.department == 'Main Pharmacy' || item.department == 'GOPD Pharmacy' || item.department == 'Laboratory' || item.department == 'Radiology') {
       this.loadCounterProducts(item);
     }
     else {
       this.loadProducts(item);
     } */
    //});
    this.checkViewStatus();
  }

  checkViewStatus() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.isStaffSwitchedTable = staff.isswitchedtable;
      this.pouchService.getDepartments().then(departments => {
        departments = departments.filter(data => data.branch == staff.branch);
        this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
        if (staff.department == 'Pharmacy Store' || staff.department == 'Central Store') {
          this.loadProducts(staff);
        }
        else {
          this.loadCounterProducts(staff);
        }
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
            if (staff.department == 'Pharmacy Store' || staff.department == 'Central Store') {
              this.loadProducts(staff);
            }
            else {
              this.loadCounterProducts(staff);
            }
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
            if (staff.department == 'Pharmacy Store' || staff.department == 'Central Store') {
              this.loadProducts(staff);
            }
            else {
              this.loadCounterProducts(staff);
            }
          });
        });
      });
    }
  }


  loadCounterProducts(item) {
    this.iscounterproducts = true;
    this.isproducts = false;
    this.pouchService.getCounterProducts().then(counterproducts => {
      counterproducts = counterproducts.filter(data => data.department == item.department && data.branch == item.branch);
      counterproducts = counterproducts.filter(data => {
        var expiryDateTimestamp = new Date(data.expirydate).getTime();
        var currentDateTimestamp = new Date();
        currentDateTimestamp.setSeconds(0);
        currentDateTimestamp.setMinutes(0);
        currentDateTimestamp.setHours(0);
        currentDateTimestamp.setMilliseconds(0);
        var convertedCurrentDateTimestamp = currentDateTimestamp.getTime();
        return (expiryDateTimestamp - convertedCurrentDateTimestamp) <= 2592000000;
      });
      this.notifications = counterproducts;

      this.itemSize = counterproducts.length;
      if (counterproducts.length != 0) {
        counterproducts.forEach(counterproduct => {
          counterproduct.isnoticed = true;
          this.pouchService.updateCounterProduct(counterproduct);
        });
      }

      this.pouchService.paginationId = counterproducts[0].id; //Reverse of what is meant to be;

      this.pouchService.paginateByDepartment2('counterproduct', this.pouchService.paginationId, item.department, true).then(paginatedata => {
        this.paginatedCounterproducts = paginatedata;
        this.paginatedNotifications = this.paginatedCounterproducts;


        $(document).ready(function () {
          $('#dtBasicExample').DataTable({
            "paging": false,
            "searching": false
          });
          $('.dataTables_length').addClass('bs-select');
        });
        this.isNextActive = true;
      });
    });

  }

  loadProducts(item) {
    this.isproducts = true;
    this.iscounterproducts = false;

    this.pouchService.getProducts().then(products => {
      products = products.filter(data => data.store == item.department && data.branch == item.branch);
      products = products.filter(data => {
        var expiryDateTimestamp = new Date(data.expiryDate).getTime();
        var currentDateTimestamp = new Date();
        currentDateTimestamp.setSeconds(0);
        currentDateTimestamp.setMinutes(0);
        currentDateTimestamp.setHours(0);
        currentDateTimestamp.setMilliseconds(0);
        var convertedCurrentDateTimestamp = currentDateTimestamp.getTime();
        return (expiryDateTimestamp - convertedCurrentDateTimestamp) <= 2592000000;
      });
      this.notifications = products;
      this.itemSize = products.length;
      if (products.length != 0) {
        products.forEach(product => {
          product.isnoticed = true;
          this.pouchService.updateProduct(product);
        });
      }

      this.pouchService.paginationId = products[0].id; //Reverse of what is meant to be;

      this.pouchService.paginateByStore('product', this.pouchService.paginationId, item.department, true).then(paginatedata => {
        this.paginatedProducts = paginatedata;
        this.paginatedNotifications = this.paginatedProducts;


        $(document).ready(function () {
          $('#dtBasicExample').DataTable({
            "paging": false,
            "searching": false
          });
          $('.dataTables_length').addClass('bs-select');
        });
        this.isNextActive = true;
      });
    });
  }

  next() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      if (staff.department == 'Pharmacy Store' || staff.department == 'Central Store') {
        this.pouchService.paginationId = this.paginatedNotifications[this.paginatedNotifications.length - 1].id; //Reverse of what is meant to be;

        this.pouchService.paginateByStore('product', this.pouchService.paginationId, staff.department, true).then(paginatedata => {
          this.paginatedNotifications = paginatedata;

          this.isPreviousActive = true;
        });
      }
      else {
        this.pouchService.paginationId = this.paginatedNotifications[this.paginatedNotifications.length - 1].id;  //Reverse of what is meant to be;

        this.pouchService.paginateByDepartment2('counterproduct', this.pouchService.paginationId, staff.department, true).then(paginatedata => {
          this.paginatedNotifications = paginatedata;

          this.isPreviousActive = true;
        });
      }

    });
  }

  previous() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      if (staff.department == 'Pharmacy Store' || staff.department == 'Central Store') {
        this.pouchService.paginationId = this.paginatedNotifications[this.paginatedNotifications.length - 1].id; //Reverse of what is meant to be;

        this.pouchService.paginateByStorePrev('product', this.pouchService.paginationId, staff.department, true).then(paginatedata => {
          this.paginatedNotifications = paginatedata;

          if (this.paginatedNotifications.length < this.pouchService.limitRange) {
            this.isPreviousActive = true;
          }
        });
      }
      else {
        this.pouchService.paginationId = this.paginatedNotifications[this.paginatedNotifications.length - 1].id;  //Reverse of what is meant to be;

        this.pouchService.paginateByDepartmentPrev2('counterproduct', this.pouchService.paginationId, staff.department, true).then(paginatedata => {
          this.paginatedNotifications = paginatedata;

          if (this.paginatedNotifications.length < this.pouchService.limitRange) {
            this.isPreviousActive = false;
          }
        });
      }
    });
  }

  goToStart() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      if (staff.department == 'Pharmacy Store' || staff.department == 'Central Store') {
        this.isPreviousActive = false;

        this.pouchService.paginationId = this.paginatedNotifications[this.paginatedNotifications.length - 1].id;  //Reverse of what is meant to be;

        this.pouchService.paginateByStoreStart('product', this.pouchService.paginationId, staff.department, true).then(paginatedata => {
          this.paginatedNotifications = paginatedata;

        });
      }
      else {
        this.isPreviousActive = false;

        this.pouchService.paginationId = this.paginatedNotifications[this.paginatedNotifications.length - 1].id;  //Reverse of what is meant to be;

        this.pouchService.paginateByDepartmentStart('counterproduct', this.pouchService.paginationId, staff.department, true).then(paginatedata => {
          this.paginatedNotifications = paginatedata;

        });
      }
    });
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedNotifications = [];

    for (let notification of this.notifications) {
      if ((notification.productname).toLowerCase().indexOf(value) !== -1) {
        this.paginatedNotifications.push(notification);
        this.paginatedNotifications = this.paginatedNotifications.slice(0, this.pouchService.limitRange);
      }
    }
  }

}
