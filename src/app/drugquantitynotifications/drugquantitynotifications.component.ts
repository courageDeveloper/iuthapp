import { Component, OnInit, Pipe } from '@angular/core';
import { PouchService } from '../../providers/pouch-service';
//declare var $: any;
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-drugquantitynotifications',
  templateUrl: './drugquantitynotifications.component.html',
  styleUrls: ['./drugquantitynotifications.component.css']
})
export class DrugquantityNotificationsComponent implements OnInit {
  notifications: any[];
  itemSize: any;
  iscounterproducts = false;
  isproducts = false;
  isStaffSwitchedTable = false;
  isDepartmentSwitchedTable = false;
  isSupervisor = false;
  paginatedCounterproducts;
  paginatedProducts;
  paginatedNotifications;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService) { }

  ngOnInit() {
    /* var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      if (item.department == 'Main Pharmacy' || item.department == 'GOPD Pharmacy' || item.department == 'Laboratory' || item.department == 'Radiology') {
        this.counterProductQuantitynotification(localStorageItem);
      }
      else {
        this.productQuantitynotification(localStorageItem);
      }
    }); */
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
          this.productQuantitynotification(staff.id);
        }
        else {
          this.counterProductQuantitynotification(staff.id);
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
              this.productQuantitynotification(staff.id);
            }
            else {
              this.counterProductQuantitynotification(staff.id);
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
              this.productQuantitynotification(staff.id);
            }
            else {
              this.counterProductQuantitynotification(staff.id);
            }
          });
        });
      });
    }
  }

  counterProductQuantitynotification(id) {
    this.iscounterproducts = true;
    this.isproducts = false;
    this.pouchService.getStaff(id).then(item => {
      this.pouchService.getCounterProducts().then(counterproducts => {
        
        counterproducts = counterproducts.filter(data => data.department == item.department && data.branch == item.branch);
        if (counterproducts.length != 0) {
          counterproducts = counterproducts.filter(data => {
            return data.suppliedunit <= 1 || data.totalsubitem <= 1;
          });
          this.notifications = counterproducts;
          this.itemSize = counterproducts.length;
          if (counterproducts.length != 0) {
            counterproducts.map(counterproduct => {
              counterproduct.isquantitynoticed = true;
              this.pouchService.updateCounterProduct(counterproduct);
            });
          }
          this.pouchService.paginationId = this.notifications[0].id; //Reverse of what is meant to be;
        }

        this.pouchService.paginateByDepartment2('counterproduct', this.pouchService.paginationId, item.department, undefined, true).then(paginatedata => {
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
    });
  }

  productQuantitynotification(id) {
    this.isproducts = true;
    this.iscounterproducts = false;
    this.pouchService.getStaff(id).then(item => {
      this.pouchService.getProducts().then(products => {
        products = products.filter(data => data.store == item.department && data.branch == item.branch);
        if (products.length != 0) {
          products = products.filter(data => {
            return data.unitstock <= 1 || data.totalsubitem <= 1;
          });
          this.notifications = products;
          this.itemSize = products.length;
          if (products.length != 0) {
            products.map(product => {
              product.isquantitynoticed = true;
              this.pouchService.updateProduct(product);
            });
          }

          this.pouchService.paginationId = products[0].id; //Reverse of what is meant to be;
        }

        this.pouchService.paginateByStore('product', this.pouchService.paginationId, item.department, undefined, true).then(paginatedata => {
          this.paginatedProducts = paginatedata;
          this.paginatedNotifications = this.paginatedProducts;


          $(document).ready(function () {
            $('#dtBasicExample').DataTable();
            $('.dataTables_length').addClass('bs-select');
          });
          this.isNextActive = true;
        });
      });
    });
  }

  next() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      if (staff.department == 'Pharmacy Store' || staff.department == 'Central Store') {
        this.pouchService.paginationId = this.paginatedNotifications[this.paginatedNotifications.length - 1].id; //Reverse of what is meant to be;

        this.pouchService.paginateByStore('product', this.pouchService.paginationId, staff.department, undefined, true).then(paginatedata => {
          this.paginatedNotifications = paginatedata;

          this.isPreviousActive = true;
        });
      }
      else {
        this.pouchService.paginationId = this.paginatedNotifications[this.paginatedNotifications.length - 1].id;  //Reverse of what is meant to be;

        this.pouchService.paginateByDepartment2('counterproduct', this.pouchService.paginationId, staff.department, undefined, true).then(paginatedata => {
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

        this.pouchService.paginateByStorePrev('product', this.pouchService.paginationId, staff.department, undefined, true).then(paginatedata => {
          this.paginatedNotifications = paginatedata;

          if (this.paginatedNotifications.length < this.pouchService.limitRange) {
            this.isPreviousActive = true;
          }
        });
      }
      else {
        this.pouchService.paginationId = this.paginatedNotifications[this.paginatedNotifications.length - 1].id;  //Reverse of what is meant to be;

        this.pouchService.paginateByDepartmentPrev2('counterproduct', this.pouchService.paginationId, staff.department, undefined, true).then(paginatedata => {
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

        this.pouchService.paginateByStoreStart('product', this.pouchService.paginationId, staff.department, undefined, true).then(paginatedata => {
          this.paginatedNotifications = paginatedata;

        });
      }
      else {
        this.isPreviousActive = false;

        this.pouchService.paginationId = this.paginatedNotifications[this.paginatedNotifications.length - 1].id;  //Reverse of what is meant to be;

        this.pouchService.paginateByDepartmentStart('counterproduct', this.pouchService.paginationId, staff.department, undefined, true).then(paginatedata => {
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
