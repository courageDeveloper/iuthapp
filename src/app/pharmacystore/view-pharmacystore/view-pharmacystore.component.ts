import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddPharmacyStoreComponent } from '../../pharmacystore/add-pharmacystore/add-pharmacystore.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DispatchFormPharmacyStoreComponent } from '../../pharmacystore/dispatch-form-pharmacystore/dispatch-form-pharmacystore.component';
import { MakepaymentFormPharmacyStoreComponent } from '../../pharmacystore/makepayment-form-pharmacystore/makepayment-form-pharmacystore.component';
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
  selector: 'app-view-pharmacystore',
  templateUrl: './view-pharmacystore.component.html',
  styleUrls: ['./view-pharmacystore.component.css']
})
export class ViewPharmacyStoreComponent implements OnInit {
  pharmacystores: Array<Products> = [];
  public tableWidget: any;
  tableCheck = false;
  newPharmacyStores: any;
  show = false;
  isUserPermitted = false;
  isUserMakePaymentPermitted = false;
  files: FileList;
  currentMonthNumber;
  currentMonth;
  months;
  convertFiles;
  newArray;
  excelBuffer: any;
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook;
  arrayImages: any[];
  isStaffSwitchedTable = false;
  isDepartmentSwitchedTable = false;
  isSupervisor = false;
  isPayLoan = false;
  itemSize: number;
  paginatedPharmacyStores;
  isPreviousActive = false;
  isNextActive = false;

  constructor(private dialog: MatDialog, private data: DataService, private router: Router, public pouchService: PouchService, public _DomSanitizer: DomSanitizer, public toastr: ToastrService) { }

  ngOnInit() {
    this.pouchService.userPermission().then(result => {
      if (result.department == 'Pharmacy Store') {
        this.isUserPermitted = true;
      }
      if (result.department == 'Account' || result.department == 'Revenue' || result.department == 'Audit') {
        this.isUserMakePaymentPermitted = true;
      }
    });

    this.arrayImages = ['assets/img/image_placeholder.png', 'assets/img/cover.jpeg'];
    
    this.checkViewStatus();
    this.checkRoles();

    setInterval(() => {
      this.checkedExpired();
    }, 300000);
  }

  reloadPharmacyStores() {
    this.pouchService.getProducts().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.store == "Pharmacy Store");
      this.pharmacystores = items;
      this.itemSize = this.pharmacystores.length;

      this.pouchService.paginationId = this.pharmacystores[0].id; //Reverse of what is meant to be;

      this.pouchService.paginateByStoreRemoveItem('product', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
        this.paginatedPharmacyStores = paginatedata;

      });
    });
  }

  loadPharmacyStores() {
    this.pouchService.getProducts().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.store == "Pharmacy Store");
      this.pharmacystores = items;
      
      this.itemSize = this.pharmacystores.length;

      this.pouchService.paginationId = this.pharmacystores[0].id; //Reverse of what is meant to be;

      this.pouchService.paginateByStore('product', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
        this.paginatedPharmacyStores = paginatedata;

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
    this.pouchService.paginationId = this.paginatedPharmacyStores[this.paginatedPharmacyStores.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByStore('product', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
      this.paginatedPharmacyStores = paginatedata;

      this.isPreviousActive = true;
    });
  }

  previous() {
    this.pouchService.paginationId = this.paginatedPharmacyStores[this.paginatedPharmacyStores.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByStorePrev('product', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
      this.paginatedPharmacyStores = paginatedata;

      if (this.paginatedPharmacyStores.length < this.pouchService.limitRange) {
        this.isPreviousActive = false;
      }
    });
  }

  goToStart() {
    this.isPreviousActive = false;

    this.pouchService.paginationId = this.paginatedPharmacyStores[this.paginatedPharmacyStores.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByStoreStart('product', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
      this.paginatedPharmacyStores = paginatedata;

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
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.store == "Pharmacy Store");
      this.pharmacystores = items;
      this.pharmacystores.forEach(item => {
        if (new Date(item.expiryDate).getTime() <= new Date().getTime()) {
          item.color = 'red';
          item.errormessage = "Drug has expired";
          item.isexpired = true;
          this.pouchService.updateProduct(item);
        }
      });
    });
  }

  editPharmacyStore(pharmacystore) {
    if (pharmacystore.attachments != "") {
      this.pouchService.getImage(pharmacystore.id).then(blob => {
        pharmacystore.attachments = blob;
        var url = URL.createObjectURL(blob);
        pharmacystore.productimage = url;
      });
    }

    let dialogRef = this.dialog.open(AddPharmacyStoreComponent, {
      height: '500px',
      width: '500px',
      data: {
        pharmacystore: pharmacystore,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      //this.loadPharmacyStores();
    })
  }

  makepaymentPharmacyStore(pharmacystore) {
    let dialogRef = this.dialog.open(MakepaymentFormPharmacyStoreComponent, {
      height: '500px',
      width: '500px',
      data: {
        pharmacystore: pharmacystore,
        action: 'makepayment'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.reloadPharmacyStores();
    })
  }

  completepaymentPharmacyStore(pharmacystore) {
    this.pouchService.getExpense(pharmacystore.expenseid).then(expense => {
      let dialogRef = this.dialog.open(MakepaymentFormPharmacyStoreComponent, {
        height: '500px',
        width: '500px',
        data: {
          expense: expense,
          pharmacystore: pharmacystore,
          action: 'completepayment'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (!result) {
          return;
        }
        this.reloadPharmacyStores();
      })
    });
  }

  checkViewStatus() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.isStaffSwitchedTable = staff.isswitchedtable;
      this.pouchService.getDepartments().then(departments => {
        departments = departments.filter(data => data.name == "Pharmacy Store" && data.branch == staff.branch);
        this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
        this.loadPharmacyStores();
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
          departments = departments.filter(data => data.name == "Pharmacy Store" && data.branch == staff.branch);
          departments[0].isswitchedtable = true;
          this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
          this.pouchService.updateDepartment(departments[0]).then(result => {  //For changes to be made based on department
            this.loadPharmacyStores();
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
          departments = departments.filter(data => data.name == "Pharmacy Store" && data.branch == staff.branch);
          departments[0].isswitchedtable = false;
          this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
          this.pouchService.updateDepartment(departments[0]).then(result => {
            this.loadPharmacyStores();
          });
        });
      });
    }
  }

  oncreditPharmacyStore(pharmacystore) {
    this.pouchService.getExpense(pharmacystore.expenseid).then(expense => {
      let dialogRef = this.dialog.open(MakepaymentFormPharmacyStoreComponent, {
        height: '500px',
        width: '500px',
        data: {
          expense: expense,
          pharmacystore: pharmacystore,
          action: 'oncredit'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (!result) {
          return;
        }
        this.reloadPharmacyStores();
      })
    });
  }

  deletePharmacyStore(pharmacystore) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: pharmacystore
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteProduct(pharmacystore).then(res => {
          this.toastr.success('Product has been deleted successfully');
          this.reloadPharmacyStores();
        });
      }
    });
  }

  refundPharmacyStore(pharmacystore) {
    pharmacystore.refund = true;
    this.pouchService.updateProduct(pharmacystore).then(result => {
      this.sendRefundNotification(pharmacystore);
      this.reloadPharmacyStores();
      this.toastr.success(`A refund request has been made for product ${pharmacystore.productname}`);
    });
  }

  approveRefund(pharmacystore) {
    if (pharmacystore.isdispatched) {
      let dialogRef = this.dialog.open(ExpensedialogmessageComponent, {
        width: '450px',
        data: {
          content: pharmacystore
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('This dialog has closed');
        if (result) {
        }
      });
    }
    else if (!pharmacystore.isdispatched) {
      this.pouchService.getExpense(pharmacystore.expenseid).then(result => {
        if (result != undefined) {
          this.pouchService.deleteExpense(result).then(response => {
            this.pouchService.deleteProduct(pharmacystore).then(res => {
              this.updateVendorSubtract(result.vendorid, result.balance)
              this.toastr.success(`${pharmacystore.productname} has been refunded successfully`);
              this.reloadPharmacyStores();
            });
          });
        }
        else {
          this.pouchService.deleteProduct(pharmacystore).then(res => {
            this.toastr.success(`${pharmacystore.productname} has been refunded successfully`);
            this.reloadPharmacyStores();
          });
        }
      })
    }
  }

  disapproveRefund(pharmacystore) {
    pharmacystore.refund = false;
    this.pouchService.updateProduct(pharmacystore).then(result => {
      this.sendDisapprovedRefundNotification(pharmacystore);
      this.reloadPharmacyStores();
    });
  }

  updateVendorSubtract(id, balance) {
    this.pouchService.getVendor(id).then(vendor => {
      vendor.balance -= balance;
      this.pouchService.updateVendor(vendor);
    });
  }

  sendRefundNotification(pharmacystore) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: `${pharmacystore.productname} Refund Notification`,
      department: 'Pharmacy Store',
      branch: pharmacystore.branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${pharmacystore.unitstock} ${pharmacystore.productname} has been requested to be refunded back to vendor by Pharmacy Store. Price of the product is ${pharmacystore.stockvalue}. Kindly approve or disapprove the request.`,
      sourceid: pharmacystore.id
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

  sendDisapprovedRefundNotification(pharmacystore) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: `${pharmacystore.productname} Refund Notification`,
      department: 'Pharmacy Store',
      branch: pharmacystore.branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${pharmacystore.unitstock} ${pharmacystore.productname} has been disapproved to be refunded back to vendor by Accounts.`,
      sourceid: pharmacystore.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == 'GOPD Pharmacy' || data.department == 'Laboratory' || data.department == 'Radiology' || data.department == 'Theatre' || data.department == 'Account' || data.department == 'Audit' || data.department == 'Pharmacy Store');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {

        })
      })
    });
  }


  selectedPharmacyStore(pharmacystore, event) {
    if (event.checked) {
      pharmacystore['selected'] = true;
    }
    else {
      pharmacystore['selected'] = false;
    }
    this.newPharmacyStores = this.paginatedPharmacyStores.filter(data => data['selected'] == true);
    if (this.newPharmacyStores.length > 0) {
      this.tableCheck = true;
    }
    else {
      this.tableCheck = false;
    }
  }

  deleteSelectedPharmacyStore() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newPharmacyStores.forEach(product => {
          this.pouchService.deleteProduct(product).then(res => {
            this.reloadPharmacyStores();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Products have been deleted successfully');
      }
    });
  }

  addDamagedProduct(pharmacystore) {
    let dialogRef = this.dialog.open(AddDamagedproductsComponent, {
      height: '500px',
      width: '500px',
      data: {
        content: pharmacystore,
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      //this.reloadPharmacyStores();
    })
  }

  navdamagedproducts() {
    this.router.navigate(['/view-damagedproducts']);
  }

  navdepartmentexpenses() {
    this.router.navigate(['/department-expenses']);
  }

  viewImage(pharmacystore, i) {
    this.data.changeDepartment(pharmacystore.store);
    this.data.changeBranch(pharmacystore.branch);
    this.router.navigate(['image-viewer/', i]);
  }

  viewDispatchedProducts() {
    this.router.navigate(['dispatched-products']);
  }


  addPharmacyStore() {
    let dialogRef = this.dialog.open(AddPharmacyStoreComponent, {
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
      this.reloadPharmacyStores();
    })
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
      //this.loadPharmacyStores();
    })
  }

  dispatchItem(pharmacystore) {
    let dialogRef = this.dialog.open(DispatchFormPharmacyStoreComponent, {
      height: '500px',
      width: '500px',
      data: {
        pharmacystore: pharmacystore,
        action: 'dispatch'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      //this.loadPharmacyStores();
    })
  }

  public export(): void {
    var exportedProductsArray = [];
    this.pouchService.getProducts().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.store == "Pharmacy Store");
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
      this.saveAsExcelFile(this.excelBuffer, 'IUTH Product(Pharmacy Store)');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedPharmacyStores = [];

    for (let pharmacystore of this.pharmacystores) {
      if ((pharmacystore.productname).toLowerCase().indexOf(value) !== -1) {
        this.paginatedPharmacyStores.push(pharmacystore);
        this.paginatedPharmacyStores = this.paginatedPharmacyStores.slice(0, this.pouchService.limitRange);
      }
    }
  }
}
