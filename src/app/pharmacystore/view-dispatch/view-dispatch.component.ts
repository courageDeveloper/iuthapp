import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { PouchService } from '../../../providers/pouch-service';
import { DispatchedProducts } from '../../../model/dispatchedproduct';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material'
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-view-dispatch',
  templateUrl: './view-dispatch.component.html',
  styleUrls: ['./view-dispatch.component.css']
})
export class ViewDispatchComponent implements OnInit {
  public tableWidget: any;
  tableCheck = false;
  newDispatchedProducts: any;
  show = false;
  files: FileList;
  convertFiles;
  isUserPermitted = false;
  newArray;
  excelBuffer: any;
  public dispatchedProducts: Array<DispatchedProducts> = [];
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook
  exportedDispatchedProductsArray: any;
  months: any[];
  years: any[];
  selectedMonth;
  selectedYear = new Date().getFullYear();
  purchases: number;
  isFilterDate = false;
  isFilterDepartment = false;
  departments: any[];
  selectedDepartment;
  paginatedDispatchedProducts;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService, private router: Router, public dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.purchases = 0;

    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.pouchService.userPermission().then(result => {
      if (result.department == 'Pharmacy Store') {
        this.isUserPermitted = true;
      }
    });

    this.loadDispatchedProducts();
    this.getYears();
    this.getMonths();

    this.departments = ['Main Pharmacy', 'GOPD Pharmacy', 'Laboratory', 'Radiology', 'Central Store', 'Theatre'];
  }

  getYears() {
    this.years = [];
    var currentYear = new Date().getFullYear();

    for (var i = 1980; i <= currentYear; i++) {

      this.years.push(i);
    }
  }

  getMonths() {
    var indexMonth = new Date().getMonth();
    this.selectedMonth = this.months[indexMonth];
  }

  reloadDispatchedProducts() {
    this.pouchService.getDispatchedProducts().then(data => {
      this.dispatchedProducts = data;
      this.dispatchedProducts = this.dispatchedProducts.filter(data => data.sourcedepartment == 'Pharmacy Store' && data.branch == 'IUTH(Okada)');

      this.pouchService.paginationId = this.dispatchedProducts[0].id; //Reverse of what is meant to be;

      this.pouchService.paginateByGeneralDispatchedProductRemoveItem('dispatchedproduct', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
        this.paginatedDispatchedProducts = paginatedata;

        this.getPurchases(this.dispatchedProducts);
      });
    });
  }

  loadDispatchedProducts() {
    this.pouchService.getDispatchedProducts().then(data => {
      this.dispatchedProducts = data;
      this.dispatchedProducts = this.dispatchedProducts.filter(data => data.sourcedepartment == 'Pharmacy Store' && data.branch == 'IUTH(Okada)');
      
      this.pouchService.paginationId = this.dispatchedProducts[0].id; //Reverse of what is meant to be;

      this.pouchService.paginateByGeneralDispatchedProduct('dispatchedproduct', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
        this.paginatedDispatchedProducts = paginatedata;

        this.getPurchases(this.dispatchedProducts);
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
    this.pouchService.paginationId = this.paginatedDispatchedProducts[this.paginatedDispatchedProducts.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByGeneralDispatchedProduct('dispatchedproduct', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
      this.paginatedDispatchedProducts = paginatedata;

      this.isPreviousActive = true;
    });
  }

  previous() {
    this.pouchService.paginationId = this.paginatedDispatchedProducts[this.paginatedDispatchedProducts.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByGeneralDispatchedProductPrev('dispatchedproduct', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
      this.paginatedDispatchedProducts = paginatedata;

      if (this.paginatedDispatchedProducts.length < this.pouchService.limitRange) {
        this.isPreviousActive = false;
      }
    });
  }

  goToStart() {
    this.isPreviousActive = false;

    this.pouchService.paginationId = this.paginatedDispatchedProducts[this.paginatedDispatchedProducts.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByGeneralDispatchedProductStart('dispatchedproduct', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
      this.paginatedDispatchedProducts = paginatedata;

    });
  }

  filterByDate() {
    this.isFilterDate = true;
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getDispatchedProducts().then(data => {
        this.dispatchedProducts = data;
        this.dispatchedProducts = this.dispatchedProducts.filter(data => data.sourcedepartment == 'Pharmacy Store' && data.branch == 'IUTH(Okada)');

        if (!this.isFilterDepartment) {
          this.dispatchedProducts = this.dispatchedProducts.filter(data => {
            var dbMonth = this.months[new Date(data.datedispatched).getMonth()];
            var dbYear = new Date(data.datedispatched).getFullYear();

            return this.selectedMonth == dbMonth && this.selectedYear == dbYear;
          });

          if (data.length != 0) {
            this.pouchService.paginationId = this.dispatchedProducts[0].id; //Reverse of what is meant to be;
          }
          this.pouchService.paginateByGeneralDispatchedProduct('dispatchedproduct', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
            this.paginatedDispatchedProducts = paginatedata;
            this.paginatedDispatchedProducts = this.paginatedDispatchedProducts.filter(data => {
              var dbMonth = this.months[new Date(data.datedispatched).getMonth()];
              var dbYear = new Date(data.datedispatched).getFullYear();

              return this.selectedMonth == dbMonth && this.selectedYear == dbYear;
            });
          });
        }
        else {
          this.dispatchedProducts = this.dispatchedProducts.filter(data => {
            var dbMonth = this.months[new Date(data.datedispatched).getMonth()];
            var dbYear = new Date(data.datedispatched).getFullYear();

            return this.selectedMonth == dbMonth && this.selectedYear == dbYear && data.branch == staff.branch && data.dispatchdepartment == this.selectedDepartment;
          });

          if (data.length != 0) {
            this.pouchService.paginationId = this.dispatchedProducts[0].id; //Reverse of what is meant to be;
          }
          this.pouchService.paginateByGeneralDispatchedProduct('dispatchedproduct', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
            this.paginatedDispatchedProducts = paginatedata;

            this.paginatedDispatchedProducts = this.paginatedDispatchedProducts.filter(data => {
              var dbMonth = this.months[new Date(data.datedispatched).getMonth()];
              var dbYear = new Date(data.datedispatched).getFullYear();

              return this.selectedMonth == dbMonth && this.selectedYear == dbYear && data.branch == staff.branch && data.dispatchdepartment == this.selectedDepartment;
            });
          });
        }
        this.getPurchases(this.dispatchedProducts);
      });
    })
  }

  filterByDepartment() {
    this.isFilterDepartment = true;
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getDispatchedProducts().then(data => {
        this.dispatchedProducts = data;
        this.dispatchedProducts = this.dispatchedProducts.filter(data => data.sourcedepartment == 'Pharmacy Store' && data.branch == 'IUTH(Okada)');

        if (!this.isFilterDate) {
          this.dispatchedProducts = this.dispatchedProducts.filter(data => data.branch == staff.branch && data.dispatchdepartment == this.selectedDepartment);

          if (data.length != 0) {
            this.pouchService.paginationId = this.dispatchedProducts[0].id; //Reverse of what is meant to be;
          }
          this.pouchService.paginateByGeneralDispatchedProduct('dispatchedproduct', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
            this.paginatedDispatchedProducts = paginatedata;
            this.paginatedDispatchedProducts = this.paginatedDispatchedProducts.filter(data => data.branch == staff.branch && data.dispatchdepartment == this.selectedDepartment);
          });
        }
        else {
          this.dispatchedProducts = this.dispatchedProducts.filter(data => {
            var dbMonth = this.months[new Date(data.datedispatched).getMonth()];
            var dbYear = new Date(data.datedispatched).getFullYear();

            return this.selectedMonth == dbMonth && this.selectedYear == dbYear && data.branch == staff.branch && data.dispatchdepartment == this.selectedDepartment;

          });

          if (data.length != 0) {
            this.pouchService.paginationId = this.dispatchedProducts[0].id; //Reverse of what is meant to be;
          }
          this.pouchService.paginateByGeneralDispatchedProduct('dispatchedproduct', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
            this.paginatedDispatchedProducts = paginatedata;
            this.paginatedDispatchedProducts = this.paginatedDispatchedProducts.filter(data => {
              var dbMonth = this.months[new Date(data.paginatedDispatchedProducts).getMonth()];
              var dbYear = new Date(data.datedispatched).getFullYear();

              return this.selectedMonth == dbMonth && this.selectedYear == dbYear && data.branch == staff.branch && data.dispatchdepartment == this.selectedDepartment;
            });
          });
        }
        this.getPurchases(this.dispatchedProducts);
      });
    });
  }

  getPurchases(dispatchedProducts) {
    this.purchases = 0;
    var subCostArray = [0];  //to ensure reduce() works even when one item exists in array
    dispatchedProducts.map(dispatchedproduct => {
      subCostArray.push(dispatchedproduct.costprice * dispatchedproduct.unitquantity);
      subCostArray.reduce((a, b) => {
        return this.purchases = a + b;
      });
    });
  }

  deleteDispatchedProduct(dispatchedProduct) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: dispatchedProduct
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteDispatchedProduct(dispatchedProduct).then(res => {
          this.toastr.success('Dispatched Product has been deleted successfully');
          this.reloadDispatchedProducts();
        });
      }
    });

  }

  public export(): void {
    var exportedDispatchedProductsArray = [];
    this.pouchService.getDispatchedProducts().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.sourcedepartment == "Pharmacy Store");
      for (var i = 0; i < items.length; i++) {
        var exportedDispatchedProduct = {
          'S/NO': i + 1,
          'PRODUCT NAME': items[i].productname,
          'QUANTITY DISPATCHED': items[i].unitquantity,
          'RECEIVING DEPARTMENT': items[i].dispatchdepartment,
          BRANCH: items[i].branch,
          'SOURCE DEPARTMENT': items[i].sourcedepartment,
          'DATE DISPATCHED': items[i].datedispatched
        }
        exportedDispatchedProductsArray.push(exportedDispatchedProduct);
        this.worksheet = XLSX.utils.json_to_sheet(exportedDispatchedProductsArray);
      }
      const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
      this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(this.excelBuffer, 'IUTH Dispatched Product(Pharmacy Store)');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedDispatchedProducts = [];

    for (let dispatchedProduct of this.dispatchedProducts) {
      if ((dispatchedProduct.productname).toLowerCase().indexOf(value) !== -1) {
        this.paginatedDispatchedProducts.push(dispatchedProduct);
        this.paginatedDispatchedProducts = this.paginatedDispatchedProducts.slice(0, this.pouchService.limitRange);
      }
    }
  }
}
