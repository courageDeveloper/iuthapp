import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddDamagedproductsComponent } from '../add-damagedproducts/add-damagedproducts.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PouchService } from '../../../providers/pouch-service';
import { Damagedproduct } from '../../../model/damagedproduct';
import { Router } from '@angular/router';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-view-damagedproducts',
  templateUrl: './view-damagedproducts.component.html',
  styleUrls: ['./view-damagedproducts.component.css']
})
export class ViewDamagedproductsComponent implements OnInit {
  public tableWidget: any;
  tableCheck = false;
  newRenderServices: any;
  show = false;
  files: FileList;
  convertFiles;
  itemSize: any;
  newArray;
  isStaffSwitchedTable = false;
  isDepartmentSwitchedTable = false;
  excelBuffer: any;
  isUserPermitted = true;
  public damagedProducts: Array<Damagedproduct> = [];
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook;
  selectedDepartment;
  isFinanceDept;
  departments: any[];
  isRefund = false;
  paginatedDamagedProducts;
  isPreviousActive = false;
  isNextActive = false;

  constructor(private dialog: MatDialog, public toastr: ToastrService, public pouchService: PouchService) { }

  ngOnInit() {
    this.checkViewStatus();
    this.checkRoles();

    this.departments = ['Main Pharmacy', 'GOPD Pharmacy', 'Laboratory',
      'Radiology'];

    this.pouchService.userPermission().then(result => {
      if (result.department == 'Account' || result.department == 'Audit' || result.department == 'Revenue') {
        this.isUserPermitted = true;
      }
    });
  }

  checkRoles() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      staff.roles.map(role => {
        if (role.role == "Refund/Return" && role.isChecked == true) {
          this.isRefund = true;
        }
      })
    });
  }

  reloadDamagedProducts() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getDamagedproducts().then(items => {
        if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.
          items = items.filter(data => data.branch == staff.branch && data.department == staff.department);

          this.pouchService.paginationId = items[0].id; //Reverse of what is meant to be;

          this.pouchService.paginateByDepartmentRemoveItem('damagedproduct', this.pouchService.paginationId, staff.department).then(paginatedata => {
            this.paginatedDamagedProducts = paginatedata;

            this.isNextActive = true;
          });
        }
        else {
          items = items.filter(data => data.branch == staff.branch);

          this.pouchService.paginateByBranch2('damagedproduct', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedDamagedProducts = paginatedata;

            this.isNextActive = true;
          });
        }
        this.damagedProducts = items;
        this.itemSize = items.length;

      });

      if (staff.department == 'Account' || staff.department == 'Revenue' || staff.department == 'Audit') {
        this.isFinanceDept = true;
      }
      else {
        this.isFinanceDept = false;
      }
    });
  }

  loadDamagedProducts() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getDamagedproducts().then(items => {
        if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.
          items = items.filter(data => data.branch == staff.branch && data.department == staff.department);

          this.pouchService.paginationId = items[items.length - 1].id; //Reverse of what is meant to be;

          this.pouchService.paginateByDepartment2('damagedproduct', this.pouchService.paginationId, staff.department).then(paginatedata => {
            this.paginatedDamagedProducts = paginatedata;


            $(document).ready(function () {
              $('#dtBasicExample').DataTable({
                "paging": false,
                "searching": false
              });
              $('.dataTables_length').addClass('bs-select');
            });
            this.isNextActive = true;
          });
        }
        else {
          items = items.filter(data => data.branch == staff.branch);

          this.pouchService.paginateByBranch2('damagedproduct', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedDamagedProducts = paginatedata;


            $(document).ready(function () {
              $('#dtBasicExample').DataTable({
                "paging": false,
                "searching": false
              });
              $('.dataTables_length').addClass('bs-select');
            });
            this.isNextActive = true;
          });
        }
        this.damagedProducts = items;
        this.itemSize = items.length;

      });

      if (staff.department == 'Account' || staff.department == 'Revenue' || staff.department == 'Audit') {
        this.isFinanceDept = true;
      }
      else {
        this.isFinanceDept = false;
      }
    });
  }

  next() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.paginationId = this.paginatedDamagedProducts[this.paginatedDamagedProducts.length - 1].id;  //Reverse of what is meant to be;

      if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.
        this.pouchService.paginateByDepartment2('damagedproduct', this.pouchService.paginationId, staff.department).then(paginatedata => {
          this.paginatedDamagedProducts = paginatedata;

          this.isPreviousActive = true;
        });
      }
      else {
        if (this.selectedDepartment == undefined) {
          this.pouchService.paginateByBranch2('damagedproduct', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedDamagedProducts = paginatedata;

            this.isPreviousActive = true;
          });
        }
        else {
          this.pouchService.paginateByDepartment2('damagedproduct', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
            this.paginatedDamagedProducts = paginatedata;

            this.isPreviousActive = true;
          });
        }
      }

    });
  }

  previous() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.paginationId = this.paginatedDamagedProducts[this.paginatedDamagedProducts.length - 1].id;  //Reverse of what is meant to be;

      if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.
        this.pouchService.paginateByDepartmentPrev2('damagedproduct', this.pouchService.paginationId, staff.department).then(paginatedata => {
          this.paginatedDamagedProducts = paginatedata;

          if (this.paginatedDamagedProducts.length < this.pouchService.limitRange) {
            this.isPreviousActive = false;
          }
        });
      }
      else {
        if (this.selectedDepartment == undefined) {
          this.pouchService.paginateByBranchPrev2('damagedproduct', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedDamagedProducts = paginatedata;

            if (this.paginatedDamagedProducts.length < this.pouchService.limitRange) {
              this.isPreviousActive = false;
            }
          });
        }
        else {
          this.pouchService.paginateByDepartmentPrev2('damagedproduct', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
            this.paginatedDamagedProducts = paginatedata;

            if (this.paginatedDamagedProducts.length < this.pouchService.limitRange) {
              this.isPreviousActive = false;
            }
          });
        }
      }
    });
  }

  goToStart() {
    this.isPreviousActive = false;
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.paginationId = this.paginatedDamagedProducts[this.paginatedDamagedProducts.length - 1].id;  //Reverse of what is meant to be;

      if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.
        this.pouchService.paginateByDepartmentStart('damagedproduct', this.pouchService.paginationId, staff.department).then(paginatedata => {
          this.paginatedDamagedProducts = paginatedata;

        });
      }
      else {
        this.pouchService.paginateByBranchStart('damagedproduct', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedDamagedProducts = paginatedata;

        });
      }
    });
  }

  filterByDepartment() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getDamagedproducts().then(items => {
        if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.
          items = items.filter(data => data.branch == staff.branch && data.department == staff.department);

          this.pouchService.paginationId = items[items.length - 1].id; //Reverse of what is meant to be;

          this.pouchService.paginateByDepartment2('damagedproduct', this.pouchService.paginationId, staff.department).then(paginatedata => {
            this.paginatedDamagedProducts = paginatedata;
          });
        }
        else {
          items = items.filter(data => data.branch == staff.branch && data.department == this.selectedDepartment);

          this.pouchService.paginationId = items[items.length - 1].id; //Reverse of what is meant to be;

          this.pouchService.paginateByDepartment2('damagedproduct', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
            this.paginatedDamagedProducts = paginatedata;

          });
        }
        this.damagedProducts = items;
        this.itemSize = items.length;

        /*   $(document).ready(function () {
            $('#dtBasicExample').DataTable();
            $('.dataTables_length').addClass('bs-select');
          }); */
      });
    });
  }


  editDamagedProduct(damagedProduct) {
    let dialogRef = this.dialog.open(AddDamagedproductsComponent, {
      width: '500px',
      data: {
        content: damagedProduct,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      //this.loadDamagedProducts();
    })
  }

  refundDamagedProduct(damagedProduct) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: damagedProduct
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.getCounterProduct(damagedProduct.productid).then(product => {
          if (product != undefined) {
            if (damagedProduct.isunit) {
              product.suppliedunit += damagedProduct.amount;
            }
            else if (damagedProduct.issubitem) {
              product.totalsubitem += damagedProduct.amount;
            }
            this.pouchService.updateCounterProduct(product).then(res => {
              this.pouchService.deleteDamagedproduct(damagedProduct).then(result => {
                this.toastr.success('Damaged Product has been refunded');
                this.reloadDamagedProducts();
              });
            });
          }
          else {
            this.pouchService.getProduct(damagedProduct.productid).then(product => {
              if (product != undefined) {
                if (damagedProduct.isunit) {
                  product.unitstock += damagedProduct.amount;
                }
                else if (damagedProduct.issubitem) {
                  product.totalsubitem += damagedProduct.amount;
                }
                this.pouchService.updateProduct(product).then(res => {
                  this.pouchService.deleteDamagedproduct(damagedProduct).then(result => {
                    this.toastr.success('Damaged Product has been refunded');
                    this.reloadDamagedProducts();
                  });
                });
              }
              else {
                this.pouchService.deleteDamagedproduct(damagedProduct).then(result => {
                  this.toastr.success('Damaged Product has been refunded');
                  this.reloadDamagedProducts();
                });
              }
            });
          }
        });
      }
    });
  }

  checkViewStatus() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.isStaffSwitchedTable = staff.isswitchedtable;
      this.pouchService.getDepartments().then(departments => {
        departments = departments.filter(data => data.name == staff.department && data.branch == staff.branch);
        this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
        this.loadDamagedProducts();
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
          departments = departments.filter(data => data.name == staff.department && data.branch == staff.branch);
          departments[0].isswitchedtable = true;
          this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
          this.pouchService.updateDepartment(departments[0]).then(result => {  //For changes to be made based on department
            this.loadDamagedProducts();
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
          departments = departments.filter(data => data.name == staff.department && data.branch == staff.branch);
          departments[0].isswitchedtable = false;
          this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
          this.pouchService.updateDepartment(departments[0]).then(result => {
            this.loadDamagedProducts();
          });
        });
      });
    }
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedDamagedProducts = [];

    for (let damagedProduct of this.damagedProducts) {
      if ((damagedProduct.name).toLowerCase().indexOf(value) !== -1) {
        this.paginatedDamagedProducts.push(damagedProduct);
        this.paginatedDamagedProducts = this.paginatedDamagedProducts.slice(0, this.pouchService.limitRange);
      }
    }
  }
}
