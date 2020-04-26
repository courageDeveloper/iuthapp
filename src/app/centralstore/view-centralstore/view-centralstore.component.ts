import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddCentralStoreComponent } from '../../centralstore/add-centralstore/add-centralstore.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DispatchFormCentralStoreComponent } from '../../centralstore/dispatch-form-centralstore/dispatch-form-centralstore.component';
import { MakepaymentFormCentralStoreComponent } from '../../centralstore/makepayment-form-centralstore/makepayment-form-centralstore.component';
import { PouchService } from '../../../providers/pouch-service';
import { Products } from '../../../model/product';
import { Router } from '@angular/router';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { DataService } from '../../services/data.service';
import { ExpensedialogmessageComponent } from '../../expensedialogmessage/expensedialogmessage.component';
import { AddVendorDialogComponent } from '../../add-vendor-dialog/add-vendor-dialog.component';
import { AddDamagedproductsComponent } from '../../damagedproducts/add-damagedproducts/add-damagedproducts.component';

@Component({
  selector: 'app-view-centralstore',
  templateUrl: './view-centralstore.component.html',
  styleUrls: ['./view-centralstore.component.css']
})
export class ViewCentralStoreComponent implements OnInit {
  centralstores: Array<Products> = [];
  public tableWidget: any;
  tableCheck = false;
  newCentralStores: any;
  show = false;
  files: FileList;
  currentMonthNumber;
  isUserPermitted = false;
  isUserMakePaymentPermitted = false;
  currentMonth;
  months;
  convertFiles;
  newArray;
  excelBuffer: any;
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook;
  isStaffSwitchedTable = false;
  isDepartmentSwitchedTable = false;
  isSupervisor = false;
  isPayLoan = false;
  itemSize: number;
  paginatedCentralStores;
  isPreviousActive = false;
  isNextActive = false;
  isAdmin = false

  constructor(private dialog: MatDialog, private data: DataService, private router: Router, public pouchService: PouchService, public _DomSanitizer: DomSanitizer, public toastr: ToastrService) { }

  ngOnInit() {
    this.checkDepartment();

    this.pouchService.userPermission().then(result => {
      if (result.department == 'Central Store') {
        this.isUserPermitted = true;
      }
      if (result.department == 'Account' || result.department == 'Revenue' || result.department == 'Audit') {
        this.isUserMakePaymentPermitted = true;
      }
    });

    setInterval(() => {
      this.checkedExpired();
    }, 300000);

    this.checkViewStatus();
    this.checkRoles();
  }

checkDepartment() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'))
    this.pouchService.getStaff(localStorageItem).then(staff => {
      if (staff.department == 'Admin') {
        this.isAdmin = true
      }
    })
  }

  reloadCentralStores() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getProducts().then(items => {
        items = items.filter(data => data.branch == 'IUTH(Okada)' && data.store == "Central Store" && data.totalsubitem > 0);
        this.centralstores = items;
        this.itemSize = this.centralstores.length;

        this.pouchService.paginationId = this.centralstores[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByCentralStoreRemoveItem('product', this.pouchService.paginationId, 0).then(paginatedata => {
          this.paginatedCentralStores = paginatedata;

          this.isNextActive = true;
        });
      });
    });

  }

  loadCentralStores() {
    this.pouchService.getProducts().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.store == "Central Store" && data.totalsubitem > 0);
      this.centralstores = items;
      this.itemSize = this.centralstores.length;

      this.pouchService.paginationId = this.centralstores[0].id; //Reverse of what is meant to be;

      this.pouchService.paginateByCentralStore('product', this.pouchService.paginationId, 0).then(paginatedata => {
        this.paginatedCentralStores = paginatedata;

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
    this.pouchService.paginationId = this.paginatedCentralStores[this.paginatedCentralStores.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByCentralStore('product', this.pouchService.paginationId, 0).then(paginatedata => {
      this.paginatedCentralStores = paginatedata;

      this.isPreviousActive = true;
    });
  }

  previous() {
    this.pouchService.paginationId = this.paginatedCentralStores[this.paginatedCentralStores.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByCentralStorePrev('product', this.pouchService.paginationId, 0).then(paginatedata => {
      this.paginatedCentralStores = paginatedata;

      if (this.paginatedCentralStores.length < this.pouchService.limitRange) {
        this.isPreviousActive = false;
      }
    });
  }

  goToStart() {
    this.isPreviousActive = false;

    this.pouchService.paginationId = this.paginatedCentralStores[this.paginatedCentralStores.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByCentralStoreStart('product', this.pouchService.paginationId, 0).then(paginatedata => {
      this.paginatedCentralStores = paginatedata;

    });
  }

  checkRoles() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      staff.roles.map(role => {
        if (role.role == "Supervisor" && role.isChecked == true) {
          this.isSupervisor = true;
        }
        if (role.role == "Pay Loan" && role.isChecked == true) {
          this.isPayLoan = true;
        }
      })
    });
  }


  checkedExpired() {
    this.pouchService.getProducts().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.store == "Central Store");
      this.centralstores = items;
      this.centralstores.forEach(item => {
        if (new Date(item.expiryDate).getTime() <= new Date().getTime()) {
          item.color = 'red';
          item.errormessage = "Drug has expired";
          item.isexpired = true;
          this.pouchService.updateProduct(item);
        }
      });
    });
  }

  editCentralStore(centralstore) {
    if (centralstore.attachments != "") {
      this.pouchService.getImage(centralstore.id).then(blob => {
        centralstore.attachments = blob;
        var url = URL.createObjectURL(blob);
        centralstore.productimage = url;
      });
    }

    let dialogRef = this.dialog.open(AddCentralStoreComponent, {
      height: '500px',
      width: '500px',
      data: {
        centralstore: centralstore,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      //this.reloadCentralStores()
    })
  }

  makepaymentCentralStore(centralstore) {
    console.log(centralstore);
    let dialogRef = this.dialog.open(MakepaymentFormCentralStoreComponent, {
      height: '500px',
      width: '500px',
      data: {
        centralstore: centralstore,
        action: 'makepayment'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.reloadCentralStores();
    })
  }

  checkViewStatus() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.isStaffSwitchedTable = staff.isswitchedtable;
      this.pouchService.getDepartments().then(departments => {
        departments = departments.filter(data => data.name == "Central Store" && data.branch == staff.branch);
        this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
        this.loadCentralStores();
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
          departments = departments.filter(data => data.name == "Central Store" && data.branch == staff.branch);
          departments[0].isswitchedtable = true;
          this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
          this.pouchService.updateDepartment(departments[0]).then(result => {  //For changes to be made based on department
            this.loadCentralStores();
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
          departments = departments.filter(data => data.name == "Central Store" && data.branch == staff.branch);
          departments[0].isswitchedtable = false;
          this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
          this.pouchService.updateDepartment(departments[0]).then(result => {
            this.loadCentralStores();
          });
        });
      });
    }
  }


  completepaymentCentralStore(centralstore) {
    this.pouchService.getExpense(centralstore.expenseid).then(expense => {
      let dialogRef = this.dialog.open(MakepaymentFormCentralStoreComponent, {
        height: '500px',
        width: '500px',
        data: {
          expense: expense,
          centralstore: centralstore,
          action: 'completepayment'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (!result) {
          return;
        }
        this.reloadCentralStores();
      })
    });
  }

  oncreditCentralStore(centralstore) {
    this.pouchService.getExpense(centralstore.expenseid).then(expense => {
      let dialogRef = this.dialog.open(MakepaymentFormCentralStoreComponent, {
        height: '500px',
        width: '500px',
        data: {
          expense: expense,
          centralstore: centralstore,
          action: 'oncredit'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (!result) {
          return;
        }
        this.reloadCentralStores();
      })
    });
  }

  deleteCentralStore(centralstore) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: centralstore
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteProduct(centralstore).then(res => {
          this.toastr.success('Product has been deleted successfully');
          this.reloadCentralStores();
        });
      }
    });
  }

  refundCentralStore(centralstore) {
    centralstore.refund = true;
    this.pouchService.updateProduct(centralstore).then(result => {
      this.sendRefundNotification(centralstore);
      this.reloadCentralStores();
      this.toastr.success(`A refund request has been made for product ${centralstore.productname}`);
    });
  }

  approveRefund(centralstore) {
    if (centralstore.isdispatched) {
      let dialogRef = this.dialog.open(ExpensedialogmessageComponent, {
        width: '450px',
        data: {
          content: centralstore
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('This dialog has closed');
        if (result) {
        }
      });
    }
    else if (!centralstore.isdispatched) {
      this.pouchService.getExpense(centralstore.expenseid).then(result => {
        if (result != undefined) {
          this.pouchService.deleteExpense(result).then(response => {
            this.pouchService.deleteProduct(centralstore).then(res => {
              this.updateVendorSubtract(result.vendorid, result.balance)
              this.toastr.success(`${centralstore.productname} has been refunded successfully`);
              this.reloadCentralStores();
            });
          });
        }
        else {
          this.pouchService.deleteProduct(centralstore).then(res => {
            this.toastr.success(`${centralstore.productname} has been refunded successfully`);
            this.reloadCentralStores();
          });
        }
      });
    }
  }

  disapproveRefund(centralstore) {
    centralstore.refund = false;
    this.pouchService.updateProduct(centralstore).then(result => {
      this.sendDisapprovedRefundNotification(centralstore);
      this.reloadCentralStores();
    });
  }

  updateVendorSubtract(id, balance) {
    this.pouchService.getVendor(id).then(vendor => {
      vendor.balance -= balance;
      this.pouchService.updateVendor(vendor);
    });
  }


  sendRefundNotification(centralstore) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: `${centralstore.productname} Refund Notification`,
      department: 'Central Store',
      branch: centralstore.branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${centralstore.unitstock} ${centralstore.productname} has been requested to be refunded back to vendor by Central Store. Price of the product is ${centralstore.stockvalue}. Kindly approve or disapprove the request.`,
      sourceid: centralstore.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == 'GOPD Pharmacy' || data.department == 'Laboratory' || data.department == 'Radiology' || data.department == 'Theatre' || data.department == 'Account' || data.department == 'Audit');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {

        })
      })
    });

  }

  sendDisapprovedRefundNotification(centralstore) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: `${centralstore.productname} Refund Notification`,
      department: 'Central Store',
      branch: centralstore.branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${centralstore.unitstock} ${centralstore.productname} has been disapproved to be refunded back to vendor by Accounts.`,
      sourceid: centralstore.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == 'GOPD Pharmacy' || data.department == 'Laboratory' || data.department == 'Radiology' || data.department == 'Theatre' || data.department == 'Account' || data.department == 'Audit' || data.department == 'Central Store');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {

        })
      })
    });
  }


  selectedCentralStore(centralstore, event) {
    if (event.checked) {
      centralstore['selected'] = true;
    }
    else {
      centralstore['selected'] = false;
    }
    this.newCentralStores = this.paginatedCentralStores.filter(data => data['selected'] == true);
    if (this.newCentralStores.length > 0) {
      this.tableCheck = true;
    }
    else {
      this.tableCheck = false;
    }
  }

  deleteSelectedCentralStore() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newCentralStores.forEach(product => {
          this.pouchService.deleteProduct(product).then(res => {
            this.reloadCentralStores();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Products have been deleted successfully');
      }
    });
  }

  viewImage(centralstore, i) {
    this.data.changeDepartment(centralstore.store);
    this.data.changeBranch(centralstore.branch);
    this.router.navigate(['image-viewer/', i]);
  }

  viewDispatchedProducts() {
    this.router.navigate(['central-store-dispatched-products']);
  }


  addCentralStore() {
    let dialogRef = this.dialog.open(AddCentralStoreComponent, {
      height: '500px',
      width: '500px',
      data: {
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      console.log(result);
      this.reloadCentralStores();
    })
  }

  addDamagedProduct(centralstore) {
    let dialogRef = this.dialog.open(AddDamagedproductsComponent, {
      height: '500px',
      width: '500px',
      data: {
        content: centralstore,
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      //this.reloadCentralStores();
    })
  }


  navdamagedproducts() {
    this.router.navigate(['/view-damagedproducts']);
  }

  navdepartmentexpenses() {
    this.router.navigate(['/department-expenses']);
  }

  addVendor() {
    let dialogRef = this.dialog.open(AddVendorDialogComponent, {
      height: '500px',
      width: '500px',
      data: {
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      console.log(result);
      //this.reloadCentralStores();
    })
  }


  dispatchItem(centralstore) {
    if (centralstore.attachments != "") {
      this.pouchService.getImage(centralstore.id).then(blob => {
        centralstore.attachments = blob;
        var url = URL.createObjectURL(blob);
        centralstore.productimage = url;
      });
    }
    let dialogRef = this.dialog.open(DispatchFormCentralStoreComponent, {
      height: '500px',
      width: '500px',
      data: {
        centralstore: centralstore,
        action: 'dispatch'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      //this.reloadCentralStores();
    })
  }

  public export(): void {
    var exportedProductsArray = [];
    this.pouchService.getProducts().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.store == "Central Store");
      for (var i = 0; i < items.length; i++) {
        var exportedProduct = {
          'S/NO': i + 1,
          'PRODUCT NAME': items[i].productname,
          'UNIT STOCK': items[i].unitstock,
          'STOCK VALUE': items[i].stockvalue,
          'SUB GROUP': items[i].subgroup,
          BRANCH: items[i].branch,
          DEPARTMENT: items[i].store,
          'DATE SUPPLIED': items[i].datesupplied,
          'TOTAL SUB ITEMS': items[i].totalsubitem,
          'EXPIRY DATE': items[i].expiryDate,
          'HAS DRUG EXPIRED': items[i].isexpired,
          'DRUG BOUGHT ON CREDIT': items[i].isoncredit,
          'AMOUNT OWED ON DRUG': items[i].isowing,
          'DRUG FULLY PAID FOR': items[i].iscompletepayment
        }
        exportedProductsArray.push(exportedProduct);
        this.worksheet = XLSX.utils.json_to_sheet(exportedProductsArray);
      }
      const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
      this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(this.excelBuffer, 'IUTH Product(Central Store)');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedCentralStores = [];

    for (let centralstore of this.centralstores) {
      if ((centralstore.productname).toLowerCase().indexOf(value) !== -1) {
        this.paginatedCentralStores.push(centralstore);
        this.paginatedCentralStores = this.paginatedCentralStores.slice(0, this.pouchService.limitRange);
      }
    }
  }
}
