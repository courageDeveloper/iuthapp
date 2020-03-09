import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddstockComponent } from '../addstock/addstock.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PouchService } from '../../../providers/pouch-service';
import { Stock } from '../../../model/stock';
import { Router } from '@angular/router';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-viewstock',
  templateUrl: './viewstock.component.html',
  styleUrls: ['./viewstock.component.scss']
})
export class ViewstockComponent implements OnInit {
  stocks: Array<Stock> = [];
  openingStock: number;
  closingStock: number;
  public tableWidget: any;
  newStock: any;
  files: FileList;
  currentMonthNumber;
  currentMonth;
  months;
  isUserPermitted = false;
  convertFiles;
  tableCheck = false;
  newArray;
  excelBuffer: any;
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook;
  isSupervisor = false;
  itemSize: number;
  paginatedStocks;
  isPreviousActive = false;
  isNextActive = false;
  localStorageItem;
  years: any[];
  selectedMonth;
  selectedYear = new Date().getFullYear();
  isFilterYear = false;
  isFilterDepartment = false;
  selectedDepartment;
  isFinanceDept;
  departments: any[];

  constructor(public pouchService: PouchService, private dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.checkRoles();

    this.getYears();
    this.loadStocks();

    this.departments = ['Main Pharmacy', 'GOPD Pharmacy', 'Laboratory',
      'Radiology', 'Account', 'Revenue', 'Audit'];
  }

  checkRoles() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      staff.roles.map(role => {
        if (role.role == "Supervisor" && role.isChecked == true) {
          this.isSupervisor = true;
        }
      })

      if (staff.department == 'Account' || staff.department == 'Revenue' || staff.department == 'Audit') {
        this.isFinanceDept = true;
      }
      else {
        this.isFinanceDept = false;
      }
    });
  }

  reloadStocks() {
    this.localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(this.localStorageItem).then(staff => {
      if (staff.department == 'Account' || staff.department == 'Audit') {
        this.pouchService.getStocks().then(items => {

          items = items.filter(data => data.branch == staff.branch);
          this.stocks = items;

          this.pouchService.paginationId = this.stocks[0].id; //Reverse of what is meant to be;
          this.pouchService.paginateByBranchRemoveItem('stock', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedStocks = paginatedata;

          });

          this.getOpeningStock(this.stocks);
          this.getClosingStock(this.stocks);
        });
      }
      else {
        this.pouchService.getStocks().then(items => {
          items = items.filter(data => data.branch == staff.branch && data.department == staff.department);
          this.stocks = items;

          this.pouchService.paginationId = this.stocks[0].id; //Reverse of what is meant to be;
          this.pouchService.paginateByDepartmentRemoveItem('stock', this.pouchService.paginationId, staff.department).then(paginatedata => {
            this.paginatedStocks = paginatedata;

          });

          this.getOpeningStock(this.stocks);
          this.getClosingStock(this.stocks);
        });
      }

    });
  }

  loadStocks() {
    this.localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(this.localStorageItem).then(staff => {
      if (staff.department == 'Account' || staff.department == 'Audit') {
        this.pouchService.getStocks().then(items => {

          items = items.filter(data => data.branch == staff.branch);
          this.stocks = items;

          this.pouchService.paginationId = this.stocks[this.stocks.length - 1].id; //Reverse of what is meant to be;
          this.pouchService.paginateByBranch2('stock', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedStocks = paginatedata;


            $(document).ready(function () {
              $('#dtBasicExample').DataTable({
                "paging": false,
                "searching": false
              });
              $('.dataTables_length').addClass('bs-select');
            });
            this.isNextActive = true;
          });

          this.getOpeningStock(this.stocks);
          this.getClosingStock(this.stocks);
        });
      }
      else {
        this.pouchService.getStocks().then(items => {
          items = items.filter(data => data.branch == staff.branch && data.department == staff.department);
          this.stocks = items;

          this.pouchService.paginationId = this.stocks[0].id; //Reverse of what is meant to be;
          this.pouchService.paginateByDepartment2('stock', this.pouchService.paginationId, staff.department).then(paginatedata => {
            this.paginatedStocks = paginatedata;

            $(document).ready(function () {
              $('#dtBasicExample').DataTable({
                "paging": false,
                "searching": false
              });
              $('.dataTables_length').addClass('bs-select');
            });
            this.isNextActive = true;
          });

          this.getOpeningStock(this.stocks);
          this.getClosingStock(this.stocks);
        });
      }

    });
  }

  next() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      //this.department = staff.department;
      this.pouchService.paginationId = this.paginatedStocks[this.paginatedStocks.length - 1].id;  //Reverse of what is meant to be;

      if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.

        this.pouchService.paginateByDepartment2('stock', this.pouchService.paginationId, staff.department).then(paginatedata => {
          this.paginatedStocks = paginatedata;

          this.isPreviousActive = true;
        });
      }
      else {
        if (this.isFilterDepartment) {

          this.pouchService.paginateByDepartment2('stock', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
            this.paginatedStocks = paginatedata;
          });
        }
        else {
          this.pouchService.paginateByBranch2('stock', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedStocks = paginatedata;
          });
        }
        this.isPreviousActive = true;
      }
    });
  }

  previous() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      //this.department = staff.department;
      this.pouchService.paginationId = this.paginatedStocks[this.paginatedStocks.length - 1].id;  //Reverse of what is meant to be;

      if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.

        this.pouchService.paginateByDepartmentPrev2('stock', this.pouchService.paginationId, staff.department).then(paginatedata => {
          this.paginatedStocks = paginatedata;

        });
        if (this.paginatedStocks.length < this.pouchService.limitRange) {
          this.isPreviousActive = false;
        }
      }
      else {
        if (this.isFilterDepartment) {

          this.pouchService.paginateByDepartmentPrev2('stock', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
            this.paginatedStocks = paginatedata;
          });
        }
        else {
          this.pouchService.paginateByBranchPrev2('stock', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedStocks = paginatedata;
          });
        }
        if (this.paginatedStocks.length < this.pouchService.limitRange) {
          this.isPreviousActive = false;
        }
      }
    });
  }

  goToStart() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      //this.department = staff.department;

      this.isPreviousActive = false;

      this.pouchService.paginationId = this.paginatedStocks[this.paginatedStocks.length - 1].id;  //Reverse of what is meant to be;

      if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.

        this.pouchService.paginateByDepartmentStart('stock', this.pouchService.paginationId, staff.department).then(paginatedata => {
          this.paginatedStocks = paginatedata;

        });
      }
      else {
        if (this.isFilterDepartment) {

          this.pouchService.paginateByDepartmentStart('stock', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
            this.paginatedStocks = paginatedata;
          });
        }
        else {
          this.pouchService.paginateByBranchStart('stock', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedStocks = paginatedata;
          });
        }
        this.isPreviousActive = true;
      }
    });
  }


  getYears() {
    this.years = [];
    var currentYear = new Date().getFullYear();

    for (var i = 1980; i <= currentYear; i++) {

      this.years.push(i);
    }
  }

  filterByYear() {
    this.isFilterYear = true;
    this.pouchService.getStaff(this.localStorageItem).then(staff => {
      this.pouchService.getStocks().then(data => {
        if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.
          this.stocks = data.filter(data => data.branch == staff.branch && data.department == staff.department);

          this.pouchService.paginationId = this.stocks[0].id; //Reverse of what is meant to be;
          this.pouchService.paginateByDepartment2('stock', this.pouchService.paginationId, staff.department, undefined, undefined, this.selectedYear).then(paginatedata => {
            this.paginatedStocks = paginatedata;
          });
        }
        else {
          if (!this.isFilterDepartment) {
            this.stocks = data.filter(data => data.branch == staff.branch);

            this.pouchService.paginationId = this.stocks[0].id; //Reverse of what is meant to be;
             this.pouchService.paginateByBranch2('stock', this.pouchService.paginationId, this.selectedYear).then(paginatedata => {
               this.paginatedStocks = paginatedata;
             }); 
          }
          else {
            this.stocks = data.filter(data => data.branch == staff.branch && data.department == this.selectedDepartment);

            this.pouchService.paginationId = this.stocks[0].id; //Reverse of what is meant to be;
            this.pouchService.paginateByDepartment2('stock', this.pouchService.paginationId, this.selectedDepartment, undefined, undefined, this.selectedYear).then(paginatedata => {
              this.paginatedStocks = paginatedata;
            });
          }
        }
        this.stocks = this.stocks.filter(data => {
          var dbYear = data.year;

          return this.selectedYear == dbYear;

        });
        this.getOpeningStock(this.stocks);
        this.getClosingStock(this.stocks);
      });
    });
  }

  filterByDepartment() {
    this.isFilterDepartment = true;
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getStocks().then(data => {
        if (this.selectedDepartment != "Account" && this.selectedDepartment != "Revenue" && this.selectedDepartment != "Audit") { //If not those departments then filter by specific department logged.
          if (!this.isFilterYear) {
            this.pouchService.paginationId = data[0].id; //Reverse of what is meant to be;
            this.stocks = data.filter(data => data.branch == staff.branch && data.department == this.selectedDepartment);

             this.pouchService.paginateByDepartment2('stock', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
               this.paginatedStocks = paginatedata;
             }); 
          }
          else {
            this.pouchService.paginationId = data[0].id; //Reverse of what is meant to be;
            this.stocks = data.filter(data => data.branch == staff.branch && data.department == this.selectedDepartment && data.year == this.selectedYear);

             this.pouchService.paginateByDepartment2('stock', this.pouchService.paginationId, this.selectedDepartment, undefined, undefined, this.selectedYear).then(paginatedata => {
              this.paginatedStocks = paginatedata;
            }); 
          }
        }
        else {
          if (!this.isFilterYear) {
            this.pouchService.paginationId = data[0].id; //Reverse of what is meant to be;
            this.stocks = data.filter(data => data.branch == staff.branch && data.department == this.selectedDepartment);

             this.pouchService.paginateByBranch2('stock', this.pouchService.paginationId).then(paginatedata => {
               this.paginatedStocks = paginatedata;
             }); 
          }
          else {
            this.pouchService.paginationId = data[0].id; //Reverse of what is meant to be;
            this.stocks = data.filter(data => data.branch == staff.branch && data.year == this.selectedYear);

             this.pouchService.paginateByBranch2('stock', this.pouchService.paginationId, this.selectedYear).then(paginatedata => {
               this.paginatedStocks = paginatedata;
             }); 
          }
        }
        this.getOpeningStock(this.stocks);
        this.getClosingStock(this.stocks);
      });
    });
  }

  editStock(stock) {
    let dialogRef = this.dialog.open(AddstockComponent, {
      height: '500px',
      width: '500px',
      data: {
        stock: stock,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
    })
  }

  deleteStock(stock) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: stock
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteStock(stock).then(res => {
          this.toastr.success('Category has been deleted successfully');
          this.reloadStocks();
        });
      }
    });
  }

  selectedStock(stock, event) {
    if (event.checked) {
      stock['selected'] = true;
    }
    else {
      stock['selected'] = false;
    }
    this.newStock = this.paginatedStocks.filter(data => data['selected'] == true);
    if (this.newStock.length > 0) {
      this.tableCheck = true;
    }
    else {
      this.tableCheck = false;
    }
  }

  addStock() {
    let dialogRef = this.dialog.open(AddstockComponent, {
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
      this.reloadStocks();
    })
  }

  deleteSelectedStock() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newStock.forEach(stock => {
          this.pouchService.deleteStock(stock).then(res => {
            this.reloadStocks();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Stocks have been deleted successfully');
      }
    });
  }

  getOpeningStock(stocks) {
    this.openingStock = 0;
    var subArray = [0];  //to ensure reduce() works even when one item exists in array
    stocks.map(stock => {
      subArray.push(stock.openingstockamount);

      subArray.reduce((a, b) => {
        return this.openingStock = a + b;
      });
    });
  }

  getClosingStock(stocks) {
    this.closingStock = 0;
    var subArray = [0];  //to ensure reduce() works even when one item exists in array
    stocks.map(stock => {
      subArray.push(stock.closingstockamount);
      subArray.reduce((a, b) => {
        return this.closingStock = a + b;
      });
    });
  }

  public export(): void {
    this.localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(this.localStorageItem).then(staff => {
      if (staff.department == 'Account' || staff.department == 'Audit') {
        var exportedStockArray = [];
        this.pouchService.getStocks().then(items => {
          items = items.filter(data => data.branch == staff.branch);
          for (var i = 0; i < items.length; i++) {
            var exportedStocks = {
              'S/NO': i + 1,
              DATE: new Date(),
              MONTH: items[i].month,
              YEAR: items[i].year,
              'OPENING STOCK NAME': items[i].openingstock,
              'OPENING STOCK AMOUNT': items[i].openingstockamount,
              'CLOSING STOCK NAME': items[i].closingstock,
              'CLOSING STOCK AMOUNT': items[i].closingstockamount,
              DESCRIPTION: items[i].description,
              BRANCH: items[i].branch,
              DEPARTMENT: items[i].department
            }
            exportedStockArray.push(exportedStocks);
            this.worksheet = XLSX.utils.json_to_sheet(exportedStockArray);
          }
          const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
          this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(this.excelBuffer, 'IUTH Stock');
        });
      }
      else {
        var exportedStockArray = [];
        this.pouchService.getStocks().then(items => {
          items = items.filter(data => data.branch == staff.branch && data.department == staff.department);
          for (var i = 0; i < items.length; i++) {
            var exportedStocks = {
              'S/NO': i + 1,
              DATE: new Date(),
              MONTH: items[i].month,
              YEAR: items[i].year,
              'OPENING STOCK NAME': items[i].openingstock,
              'OPENING STOCK AMOUNT': items[i].openingstockamount,
              'CLOSING STOCK NAME': items[i].closingstock,
              'CLOSING STOCK AMOUNT': items[i].closingstockamount,
              DESCRIPTION: items[i].description,
              BRANCH: items[i].branch,
              DEPARTMENT: items[i].department
            }
            exportedStockArray.push(exportedStocks);
            this.worksheet = XLSX.utils.json_to_sheet(exportedStockArray);
          }
          const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
          this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(this.excelBuffer, 'IUTH Stock');
        });
      }
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedStocks = [];

    for (let stock of this.stocks) {
      if ((stock.month).toLowerCase().indexOf(value) !== -1) {
        this.paginatedStocks.push(stock);

        this.paginatedStocks = this.paginatedStocks.slice(0, this.pouchService.limitRange);
      }
    }
  }

}
