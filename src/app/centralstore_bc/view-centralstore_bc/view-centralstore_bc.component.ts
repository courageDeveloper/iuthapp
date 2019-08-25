import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddCentralStoreBcComponent } from '../../centralstore_bc/add-centralstore_bc/add-centralstore_bc.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DispatchFormCentralStoreBcComponent } from '../../centralstore_bc/dispatch-form-centralstore_bc/dispatch-form-centralstore_bc.component';
import { MakepaymentFormCentralStoreBcComponent } from '../../centralstore_bc/makepayment-form-centralstore_bc/makepayment-form-centralstore_bc.component';
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

@Component({
  selector: 'app-view-centralstore_bc',
  templateUrl: './view-centralstore_bc.component.html',
  styleUrls: ['./view-centralstore_bc.component.css']
})
export class ViewCentralStoreBcComponent implements OnInit {
  centralstoresbc: Array<Products> = [];
  public tableWidget: any;
  tableCheck = false;
  newCentralStoresBc: any;
  show = false;
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


  constructor(private dialog: MatDialog, private data: DataService, private router: Router, public pouchService: PouchService, public _DomSanitizer: DomSanitizer, public toastr: ToastrService) { }

  ngOnInit() {
    this.arrayImages = ['assets/img/image_placeholder.png', 'assets/img/cover.jpeg'];
    this.loadCentralStoresBc();

    setInterval(() => {
      this.checkedExpired();
    }, 300000);
  }

  loadCentralStoresBc() {
    this.pouchService.getProducts().then(items => {
      items = items.filter(data => data.branch == 'Benin Centre' && data.store == "Central Store");
      this.centralstoresbc = items;
    });
  }


  checkedExpired() {
    this.pouchService.getProducts().then(items => {
      items = items.filter(data => data.branch == 'Benin Centre' && data.store == "Central Store");
      this.centralstoresbc = items;
      this.centralstoresbc.forEach(item => {
        if (new Date(item.expiryDate).getTime() <= new Date().getTime()) {
          item.color = 'red';
          item.errormessage = "Drug has expired";
          item.isexpired = true;
          this.pouchService.updateProduct(item);
        }
      });
    });
  }

  editCentralStoreBc(centralstorebc) {
    if (centralstorebc.attachments != "") {
      this.pouchService.getImage(centralstorebc.id).then(blob => {
        centralstorebc.attachments = blob;
        var url = URL.createObjectURL(blob);
        centralstorebc.productimage = url;
      });
    }

    let dialogRef = this.dialog.open(AddCentralStoreBcComponent, {
      height: '500px',
      width: '500px',
      data: {
        centralstorebc: centralstorebc,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.loadCentralStoresBc();
    })
  }

  makepaymentCentralStoreBc(centralstorebc) {
    let dialogRef = this.dialog.open(MakepaymentFormCentralStoreBcComponent, {
      height: '500px',
      width: '500px',
      data: {
        centralstorebc: centralstorebc,
        action: 'makepayment'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.loadCentralStoresBc();
    })
  }

  completepaymentCentralStoreBc(centralstorebc) {
    this.pouchService.getExpense(centralstorebc.expenseid).then(expense => {
      let dialogRef = this.dialog.open(MakepaymentFormCentralStoreBcComponent, {
        height: '500px',
        width: '500px',
        data: {
          expense: expense,
          centralstorebc: centralstorebc,
          action: 'completepayment'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (!result) {
          return;
        }
        this.loadCentralStoresBc();
      })
    });
  }

  oncreditCentralStoreBc(centralstorebc) {
    this.pouchService.getExpense(centralstorebc.expenseid).then(expense => {
      let dialogRef = this.dialog.open(MakepaymentFormCentralStoreBcComponent, {
        height: '500px',
        width: '500px',
        data: {
          expense: expense,
          centralstorebc: centralstorebc,
          action: 'oncredit'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (!result) {
          return;
        }
        this.loadCentralStoresBc();
      })
    });
  }

  deleteCentralStoreBc(centralstorebc) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: centralstorebc
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteProduct(centralstorebc).then(res => {
          this.toastr.success('Product has been deleted successfully');
          this.loadCentralStoresBc();
        });
      }
    });
  }

  refundCentralStoreBc(centralstorebc) {
    centralstorebc.refund = true;
    this.pouchService.updateProduct(centralstorebc).then(result => {
      this.sendRefundNotification(centralstorebc);
      this.loadCentralStoresBc();
      this.toastr.success(`A refund request has been made for product ${centralstorebc.productname}`);
    });
  }

  approveRefund(centralstorebc) {
    this.pouchService.getExpense(centralstorebc.expenseid).then(result => {
      this.pouchService.deleteExpense(result).then(response => {
        this.pouchService.deleteProduct(centralstorebc).then(res => {
          this.toastr.success(`${centralstorebc.productname} has been refunded successfully`);
          this.loadCentralStoresBc();
        });
      });
    });
  }

  disapproveRefund(centralstorebc) {
    centralstorebc.refund = false;
    this.pouchService.updateProduct(centralstorebc).then(result => {
      this.sendDisapprovedRefundNotification(centralstorebc);
      this.loadCentralStoresBc();
    });
  }

  sendRefundNotification(centralstorebc) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: `${centralstorebc.productname} Refund Notification`,
      department: 'Central Store',
      branch: centralstorebc.branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${centralstorebc.unitstock} ${centralstorebc.productname} has been requested to be refunded back to vendor by Central Store. Price of the product is ${centralstorebc.stockvalue}. Kindly approve or disapprove the request.`,
      sourceid: centralstorebc.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == 'Account' || data.department == 'Admin');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {

        })
      })
    });

  }

  sendDisapprovedRefundNotification(centralstorebc) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: `${centralstorebc.productname} Refund Notification`,
      department: 'Central Store',
      branch: centralstorebc.branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${centralstorebc.unitstock} ${centralstorebc.productname} has been disapproved to be refunded back to vendor by Accounts.`,
      sourceid: centralstorebc.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == 'Account' || data.department == 'Admin');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {

        })
      })
    });
  }


  selectedCentralStoreBc(centralstorebc, event) {
    if (event.checked) {
      centralstorebc['selected'] = true;
    }
    else {
      centralstorebc['selected'] = false;
    }
    this.newCentralStoresBc = this.centralstoresbc.filter(data => data['selected'] == true);
    if (this.newCentralStoresBc.length > 0) {
      this.tableCheck = true;
    }
    else {
      this.tableCheck = false;
    }
  }

  deleteSelectedCentralStoreBc() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newCentralStoresBc.forEach(product => {
          this.pouchService.deleteProduct(product).then(res => {
            this.loadCentralStoresBc();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Products have been deleted successfully');
      }
    });
  }

  viewImage(centralstorebc, i) {
    this.data.changeDepartment(centralstorebc.store);
    this.data.changeBranch(centralstorebc.branch);
    this.router.navigate(['image-viewer/', i]);
  }

  viewDispatchedProducts() {
    this.router.navigate(['central-store-bc-dispatched-products']);
  }


  addCentralStoreBc() {
    let dialogRef = this.dialog.open(AddCentralStoreBcComponent, {
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
      this.loadCentralStoresBc();
    })
  }

  dispatchItem(centralstorebc) {
    let dialogRef = this.dialog.open(DispatchFormCentralStoreBcComponent, {
      height: '500px',
      width: '500px',
      data: {
        centralstorebc: centralstorebc,
        action: 'dispatch'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.loadCentralStoresBc();
    })
  }

  public export(): void {
    var exportedProductsArray = [];
    this.pouchService.getProducts().then(items => {
      items = items.filter(data => data.branch == 'Benin Centre' && data.store == "Central Store");
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
      this.saveAsExcelFile(this.excelBuffer, 'IUTH Product(Central Store(BC))');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
