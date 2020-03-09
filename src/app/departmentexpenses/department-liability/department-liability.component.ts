import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { MatDialog, MatDialogRef } from '@angular/material';
import { PouchService } from '../../../providers/pouch-service';
import { Expenses } from '../../../model/expense';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { ExpensedialogmessageComponent } from '../../expensedialogmessage/expensedialogmessage.component';

@Component({
  selector: 'app-department-liability',
  templateUrl: './department-liability.component.html',
  styleUrls: ['./department-liability.component.css']
})
export class DepartmentLiabilityComponent implements OnInit {
  public borrows: Array<Expenses> = [];
  public totalBorrows: Array<Expenses> = [];
  public tableWidget: any;
  tableCheck = false;
  newBorrows: any;
  isUserPermitted = true;
  show = false;
  files: FileList;
  convertFiles;
  newArray;
  total = 0;
  excelBuffer: any;
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook;
  branch;
  promise1;
  promise2;
  promise3;
  promise4;
  promise5;
  dateFrom: any;
  dateTo: any;
  timeFrom: any;
  timeTo: any;
  isEvacuate = false;
  isSupervisor = false;
  isRefund = false;
  isPayLoan = false;
  department: any;
  months: any[];
  years: any[];
  selectedMonth;
  selectedYear = new Date().getFullYear();
  paginatedBorrows;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService, private router: Router, private dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.timeFrom = '00:00';
    this.timeTo = '00:00';

    this.pouchService.userPermission().then(result => {
      if (result.department == 'Admin') {
        this.isUserPermitted = false;
      }
    });

    this.loadBorrows();
    this.loadTotalBorrows();
    this.checkRoles();
    this.getYears();
    this.getMonths();
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

  filterByMonth() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getExpenses().then(data => {
        this.borrows = data.filter(data => data.branch == staff.branch && data.departmentname == staff.department);
        this.borrows = this.borrows.filter(data => data.isoncredit == true || data.isowing == true);
        this.borrows = this.borrows.filter(data => {
          var dbMonth = this.months[new Date(data.date).getMonth()];
          var dbYear = new Date(data.date).getFullYear();

          return this.selectedMonth == dbMonth && this.selectedYear == dbYear;

        });
        this.pouchService.paginationId = this.borrows[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByExpense('expense', this.pouchService.paginationId, staff.department, undefined, undefined, false).then(paginatedata => {
          this.paginatedBorrows = paginatedata;
          this.paginatedBorrows = this.paginatedBorrows.filter(data => {
            var dbMonth = this.months[new Date(data.date).getMonth()];
            var dbYear = new Date(data.date).getFullYear();

            return this.selectedMonth == dbMonth && this.selectedYear == dbYear;

          });
        });
      });
    });
  }

  checkRoles() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      staff.roles.map(role => {
        if (role.role == "Pay Loan" && role.isChecked == true) {
          this.isPayLoan = true;
        }
        if (role.role == "Refund/Return" && role.isChecked == true) {
          this.isRefund = true;
        }
      })
    });
  }

  reloadBorrows() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.department = staff.department;

      this.pouchService.getExpenses().then(data => {
        this.borrows = data.filter(data => data.branch == staff.branch && data.departmentname == staff.department);
        this.borrows = this.borrows.filter(data => data.isoncredit == false);

        this.pouchService.paginationId = this.borrows[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByExpenseRemoveItem('expense', this.pouchService.paginationId, staff.department, undefined, undefined, false).then(paginatedata => {
          this.paginatedBorrows = paginatedata;

          this.isNextActive = true;
        });
      });
    });
  }

  loadBorrows() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.department = staff.department;

      this.pouchService.getExpenses().then(data => {
        this.borrows = data.filter(data => data.branch == staff.branch && data.departmentname == staff.department);
        this.borrows = this.borrows.filter(data => data.isoncredit == true || data.isowing == true);
        this.pouchService.paginationId = this.borrows[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByExpense('expense', this.pouchService.paginationId, staff.department, undefined, undefined, false).then(paginatedata => {
          this.paginatedBorrows = paginatedata;
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

  next() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.department = staff.department;
      this.pouchService.paginationId = this.paginatedBorrows[this.paginatedBorrows.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByExpense('expense', this.pouchService.paginationId, staff.department, undefined, undefined, false).then(paginatedata => {
        this.paginatedBorrows = paginatedata;

        this.isPreviousActive = true;
      });
    });
  }

  previous() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.department = staff.department;
      this.pouchService.paginationId = this.paginatedBorrows[this.paginatedBorrows.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByExpensePrev('expense', this.pouchService.paginationId, staff.department, undefined, undefined, false).then(paginatedata => {
        this.paginatedBorrows = paginatedata;

        if (this.paginatedBorrows.length < this.pouchService.limitRange) {
          this.isPreviousActive = false;
        }
      });
    });
  }

  goToStart() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.department = staff.department;
      this.isPreviousActive = false;

      this.pouchService.paginationId = this.paginatedBorrows[this.paginatedBorrows.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByExpenseStart('expense', this.pouchService.paginationId, staff.department, undefined, undefined, false).then(paginatedata => {
        this.paginatedBorrows = paginatedata;

      });
    });
  }

  loadTotalBorrows() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getExpenses().then(data => {
        this.totalBorrows = data.filter(data => data.branch == staff.branch && data.departmentname == staff.department);
        this.totalBorrows = this.totalBorrows.filter(data => data.isoncredit == true || data.isowing == true);
        this.getTotalBorrows(this.totalBorrows);
      });
    });
  }


  returnBorrow(borrow) {
    //Send Notification
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: borrow
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.getProduct(borrow.expenseproductid).then(product => {
          if (product.isdispatched) {
            let dialogRef = this.dialog.open(ExpensedialogmessageComponent, {
              width: '450px',
              data: {
                content: borrow
              }
            });

            dialogRef.afterClosed().subscribe(result => {
              console.log('This dialog has closed');
              if (result) {
              }
            });
          }
          else if (!product.isdispatched) {
            product.iscompletepayment = false;
            product.isowing = false;
            product.isoncredit = false;
            this.pouchService.updateProduct(product).then(result => {
              this.pouchService.deleteExpense(borrow).then(response => {
                if (borrow.vendorid != undefined) {
                  this.updateVendorSubtract(borrow.vendorid, borrow.balance);
                }
                this.reloadBorrows();
              });
            });
          }
        }).catch((error: Error) => {
          if (error) {
            this.pouchService.deleteExpense(borrow).then(response => {
              this.reloadBorrows();
            });
          }
        })
      }
    });
  }

  updateVendorSubtract(id, balance) {
    this.pouchService.getVendor(id).then(vendor => {
      vendor.balance -= balance;
      this.pouchService.updateVendor(vendor);
    });
  }

  getTotalBorrows(borrows) {

    var borrowArray = [];
    borrows = borrows.filter(data => data.isreconciled == true);
    borrows.forEach(borrow => {
      borrowArray.push(borrow.balance);
    });
    return this.total = borrowArray.reduce((a, b) => a + b, 0);
  }

  filterDate() {
    this.borrows = [];
    var inputTimeArray = this.timeFrom.split(':');
    var hours = inputTimeArray[0];
    var minutes = inputTimeArray[1];
    var millisecondsHour = hours * 3600000;
    var millisecondsMinute = minutes * 60000;
    this.dateFrom = new Date(this.dateFrom).getTime();
    var totalMillisecondsFrom = millisecondsHour + millisecondsMinute + this.dateFrom;
    var newDateFrom = new Date().setTime(totalMillisecondsFrom);

    var inputTimeArrayTo = this.timeTo.split(':');
    var hoursTo = inputTimeArrayTo[0];
    var minutesTo = inputTimeArrayTo[1];
    var millisecondsHourTo = hoursTo * 3600000;
    var millisecondsMinuteTo = minutesTo * 60000;
    this.dateTo = new Date(this.dateTo).getTime();
    var totalMillisecondsTo = millisecondsHourTo + millisecondsMinuteTo + this.dateTo;
    var newDateTo = new Date().setTime(totalMillisecondsTo);

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getExpenses().then(borrows => {
        borrows = borrows.filter(data => data.branch == staff.branch && data.departmentname == staff.department);
        borrows = borrows.filter(data => data.isoncredit == true || data.isowing == true);

        borrows.map(borrow => {
          borrow['timestamp'] = new Date(borrow.date).toLocaleString("en-US", { timeZone: "GMT" });
          borrow['timestamp'] = new Date(borrow['timestamp']).setSeconds(0);
          /* borrow['timestamp'] = new Date(borrow['timestamp']).setMinutes(0);
          borrow['timestamp'] = new Date(borrow['timestamp']).setHours(0); */
        });
        borrows = borrows.filter(data => newDateFrom <= data['timestamp']);
        borrows = borrows.filter(data => newDateTo >= data['timestamp']);
        this.borrows = borrows;

        this.pouchService.paginationId = this.borrows[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByExpense('expense', this.pouchService.paginationId, staff.department, undefined, undefined, false).then(paginatedata => {
          this.paginatedBorrows = paginatedata;

          this.paginatedBorrows.map(paginatedBorrow => {
            paginatedBorrow['timestamp'] = new Date(paginatedBorrow.date).toLocaleString("en-US", { timeZone: "GMT" });
            paginatedBorrow['timestamp'] = new Date(paginatedBorrow['timestamp']).setSeconds(0);
            /*  expense['timestamp'] = new Date(expense['timestamp']).setMinutes(0);
             expense['timestamp'] = new Date(expense['timestamp']).setHours(0); */
          });
          this.paginatedBorrows = this.paginatedBorrows.filter(data => newDateFrom <= data['timestamp']);
          this.paginatedBorrows = this.paginatedBorrows.filter(data => newDateTo >= data['timestamp']);
        });
      });
    });
  }


  public export(): void {
    var exportedExpensesArray = [];

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getExpenses().then(items => {
        items = items.filter(data => data.branch == staff.branch && data.departmentname == staff.department);
        items = items.filter(data => data.isoncredit == true || data.isowing == true);

        for (var i = 0; i < items.length; i++) {
          var exportedExpenses = {
            'S/NO': i + 1,
            DEPARTMENT: items[i].departmentname,
            'DEPARTMENT LOANING': items[i].departmentloaning,
            DATE: items[i].date,
            'EXPENSE NAME': items[i].expensename,
            'EXPENSE TYPE': items[i].expensetype,
            AMOUNT: items[i].amount,
            DESCRIPTION: items[i].description,
            BALANCE: items[i].balance,
            'BRANCH': items[i].branch
          }
          exportedExpensesArray.push(exportedExpenses);
          this.worksheet = XLSX.utils.json_to_sheet(exportedExpensesArray);
        }
        const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
        this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(this.excelBuffer, 'IUTH Items On Credit');
      });
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedBorrows = [];

    for (let borrow of this.borrows) {
      if ((borrow.expensename).toLowerCase().indexOf(value) !== -1) {
        this.paginatedBorrows.push(borrow);

        this.paginatedBorrows = this.paginatedBorrows.slice(0, this.pouchService.limitRange);
      }
    }
  }
}
