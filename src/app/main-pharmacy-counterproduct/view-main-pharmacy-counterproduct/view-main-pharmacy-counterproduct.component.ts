import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddMainPharmacyCounterProductComponent } from '../../main-pharmacy-counterproduct/add-main-pharmacy-counterproduct/add-main-pharmacy-counterproduct.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PouchService } from '../../../providers/pouch-service';
import { CounterProducts } from '../../../model/counterproduct';
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
  selector: 'app-view-main-pharmacy-counterproduct',
  templateUrl: './view-main-pharmacy-counterproduct.component.html',
  styleUrls: ['./view-main-pharmacy-counterproduct.component.css']
})
export class ViewMainPharmacyCounterProductComponent implements OnInit {
  counterProducts: Array<CounterProducts> = [];
  public tableWidget: any;
  tableCheck = false;
  newCounterProducts: any;
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
    this.loadCounterProducts();

    setInterval(() => {
      this.checkedExpired();
    }, 300000);
  }

  loadCounterProducts() {
    this.pouchService.getCounterProducts().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.department == "Main Pharmacy");
      this.counterProducts = items;
    });
  }


  checkedExpired() {
    this.pouchService.getCounterProducts().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.department == "Main Pharmacy");
      this.counterProducts = items;
      this.counterProducts.forEach(item => {
        if (new Date(item.expirydate).getTime() <= new Date().getTime()) {
          item.color = 'red';
          item.errormessage = "Drug has expired";
          item.isexpired = true;
          this.pouchService.updateCounterProduct(item);
        }
      });
    });
  }

  editCounterProduct(counterproduct) {
    let dialogRef = this.dialog.open(AddMainPharmacyCounterProductComponent, {
      height: '500px',
      width: '500px',
      data: {
        counterproduct: counterproduct,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.loadCounterProducts();
    })
  }

  deleteCounterProduct(counterproduct) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: counterproduct
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteCounterProduct(counterproduct).then(res => {
          this.toastr.success('Product has been deleted successfully');
          this.loadCounterProducts();
        });
      }
    });
  }

  refundCounterProduct(counterproduct) {
    counterproduct.refund = true;
    this.pouchService.updateCounterProduct(counterproduct).then(result => {
      this.sendRefundNotification(counterproduct);
      this.loadCounterProducts();
      this.toastr.success(`A refund request has been made for product ${counterproduct.productname}`);
    });
  }

  approveRefund(counterproduct) {
    this.pouchService.getProduct(counterproduct.productid).then(product => {
      product.unitstock = counterproduct.suppliedunit + product.unitstock;
      product.totalsubitem += counterproduct.totalsubitem; 
      product.isdispatched = false;
      this.pouchService.updateProduct(product).then(response => {
        this.pouchService.getDispatchedProduct(counterproduct.dispatchid).then(dispatch => {
          this.pouchService.deleteDispatchedProduct(dispatch).then(res => {
            this.pouchService.deleteCounterProduct(counterproduct).then(result => {
              this.toastr.success(`${counterproduct.productname} has been refunded successfully`);
              this.loadCounterProducts();
            });
          });
        });
      });
    });
  }

  disapproveRefund(counterproduct) {
    counterproduct.refund = false;
    this.pouchService.updateCounterProduct(counterproduct).then(result => {
      this.sendDisapprovedRefundNotification(counterproduct);
      this.loadCounterProducts();
    });
  }

  sendRefundNotification(counterproduct) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: `${counterproduct.productname} Refund Notification`,
      department: 'Main Pharmacy',
      branch: counterproduct.branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${counterproduct.unitstock} ${counterproduct.productname} has been requested to be refunded back to ${counterproduct.sourcedepartment} by ${counterproduct.department}. Price of the product is ${counterproduct.stockvalue}. Kindly approve or disapprove the request.`,
      sourceid: counterproduct.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == counterproduct.sourcedepartment  || data.department == 'Account' || data.department == 'Audit');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {

        })
      })
    });

  }

  sendDisapprovedRefundNotification(counterproduct) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: `${counterproduct.productname} Refund Notification`,
      department: 'Main Pharmacy',
      branch: counterproduct.branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${counterproduct.unitstock} ${counterproduct.productname} has been disapproved to be refunded back to ${counterproduct.sourcedepartment} by Accounts.`,
      sourceid: counterproduct.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == counterproduct.sourcedepartment  || data.department == 'Account' || data.department == 'Audit');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {

        })
      })
    });
  }


  selectedCounterProduct(counterproduct, event) {
    if (event.checked) {
      counterproduct['selected'] = true;
    }
    else {
      counterproduct['selected'] = false;
    }
    this.newCounterProducts = this.counterProducts.filter(data => data['selected'] == true);
    if (this.newCounterProducts.length > 0) {
      this.tableCheck = true;
    }
    else {
      this.tableCheck = false;
    }
  }

  deleteSelectedCounterProduct() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newCounterProducts.forEach(counterproduct => {
          this.pouchService.deleteProduct(counterproduct).then(res => {
            this.loadCounterProducts();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Products have been deleted successfully');
      }
    });
  }

  viewImage(counterproduct, i) {
    this.data.changeDepartment(counterproduct.department);
    this.data.changeBranch(counterproduct.branch);
    this.router.navigate(['image-viewer-counterproduct/', i]);
  }

  public export(): void {
    var exportedProductsArray = [];
    this.pouchService.getCounterProducts().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.department == "Main Pharmacy");
      for (var i = 0; i < items.length; i++) {
        var exportedProduct = {
          'S/NO': i + 1,
          'PRODUCT NAME': items[i].productname,
          'SUPPLIED UNIT': items[i].suppliedunit,
          'UNIT SELLING PRICE': items[i].unitsellingprice,
          'SUB-ITEM SELLING PRICE': items[i].subitemsellingprice,
          'COST PRICE': items[i].costprice,
          'PRODUCT CATEGORY': items[i].productcategory,
          BRANCH: items[i].branch,
          DEPARTMENT: items[i].department,
          'DATE SUPPLIED': items[i].datesupplied,
          'TOTAL SUB ITEMS': items[i].totalsubitem,
          'EXPIRY DATE': items[i].expirydate,
          'HAS DRUG EXPIRED': items[i].isexpired,
          'SOURCE DEPARTMENT': items[i].sourcedepartment
        }
        exportedProductsArray.push(exportedProduct);
        this.worksheet = XLSX.utils.json_to_sheet(exportedProductsArray);
      }
      const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
      this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(this.excelBuffer, 'IUTH Product(Main Pharmacy Counter Product)');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
