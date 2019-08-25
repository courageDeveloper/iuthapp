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
  currentMonth;
  months;
  convertFiles;
  newArray;
  excelBuffer: any;
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook;

  constructor(private dialog: MatDialog, private data: DataService, private router: Router, public pouchService: PouchService, public _DomSanitizer: DomSanitizer, public toastr: ToastrService) { }

  ngOnInit() {
    this.loadCentralStores();

    setInterval(() => {
      this.checkedExpired();
    }, 300000);

    this.pouchService.getExpenses().then(items => {
      console.log(items);
    });
  }

  loadCentralStores() {
    this.pouchService.getProducts().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.store == "Central Store");
      this.centralstores = items;
      console.log(this.centralstores);
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
      this.loadCentralStores();
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
      this.loadCentralStores();
    })
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
        this.loadCentralStores();
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
        this.loadCentralStores();
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
          this.loadCentralStores();
        });
      }
    });
  }

  refundCentralStore(centralstore) {
    centralstore.refund = true;
    this.pouchService.updateProduct(centralstore).then(result => {
      this.sendRefundNotification(centralstore);
      this.loadCentralStores();
      this.toastr.success(`A refund request has been made for product ${centralstore.productname}`);
    });
  }

  approveRefund(centralstore) {
    this.pouchService.getExpense(centralstore.expenseid).then(result => {
      this.pouchService.deleteExpense(result).then(response => {
        this.pouchService.deleteProduct(centralstore).then(res => {
          this.toastr.success(`${centralstore.productname} has been refunded successfully`);
          this.loadCentralStores();
        });
      });
    });
  }

  disapproveRefund(centralstore) {
    centralstore.refund = false;
    this.pouchService.updateProduct(centralstore).then(result => {
      this.sendDisapprovedRefundNotification(centralstore);
      this.loadCentralStores();
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
    this.newCentralStores = this.centralstores.filter(data => data['selected'] == true);
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
            this.loadCentralStores();
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
      this.loadCentralStores();
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
    console.log(centralstore);
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
      this.loadCentralStores();
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
}
