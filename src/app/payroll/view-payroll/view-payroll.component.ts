import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddPayrollComponent } from '../../payroll/add-payroll/add-payroll.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { PouchService } from '../../../providers/pouch-service';
import { Expenses } from '../../../model/expense';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { ViewReceiptPayrollComponent } from '../view-receipt-payroll/view-receipt-payroll.component';
import { ExpensedialogmessageComponent } from '../../expensedialogmessage/expensedialogmessage.component';

@Component({
  selector: 'app-view-payroll',
  templateUrl: './view-payroll.component.html',
  styleUrls: ['./view-payroll.component.css']
})
export class ViewPayrollComponent implements OnInit {
  expenses: Array<Expenses> = [];
  public totalExpenses: Array<Expenses> = [];
  public tableWidget: any;
  tableCheck = false;
  newExpenses: any;
  show = false;
  files: FileList;
  isUserPermitted = false;
  convertFiles;
  newArray;
  total = 0;
  excelBuffer: any;
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook
  exportedExpensesArray: any;
  dateFrom: any;
  dateTo: any;
  timeFrom: any;
  timeTo: any;
  isEvacuate = false;
  isSupervisor = false;
  isRefund = false;
  isPayLoan = false;
  paginatedExpenses;
  isPreviousActive = false;
  isNextActive = false;


  constructor(public pouchService: PouchService, private router: Router, private dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.timeFrom = '00:00';
    this.timeTo = '00:00';

    this.pouchService.userPermission().then(result => {
      if (result.department == 'Account' || result.department == 'Audit' || result.department == 'Revenue') {
        this.isUserPermitted = true;
      }
    });

    this.loadPayroll();
    this.checkRoles();
  }

  checkRoles() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      staff.roles.map(role => {
        if (role.role == "Supervisor" && role.isChecked == true) {
          this.isSupervisor = true;
        }
      })
    });
  }

  reloadPayroll() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {

      this.pouchService.getExpenses().then(data => {
        this.expenses = data.filter(data => data.branch == staff.branch);
        this.expenses = this.expenses.filter(data => data.iscomplete == true || data.isowing == true);
        this.expenses = this.expenses.filter(data => data.isoncredit == false);
        this.expenses = this.expenses.filter(data => data.expensetype == 'Staff Payroll');

        this.expenses.forEach(expense => {
          this.pouchService.getStaff(expense.staffid).then(staff => {
            expense['staffcode'] = staff.staffcode;
            expense['staffdepartment'] = staff.department;
          });
        });

        this.pouchService.paginationId = this.expenses[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByExpenseRemoveItem('expense', this.pouchService.paginationId, undefined, false, undefined, undefined, 'Staff Payroll').then(paginatedata => {
          this.paginatedExpenses = paginatedata;
        });
      });
    });
  }

  loadPayroll() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {

      this.pouchService.getExpenses().then(data => {
        this.expenses = data.filter(data => data.branch == staff.branch);
        this.expenses = this.expenses.filter(data => data.iscomplete == true || data.isowing == true);
        this.expenses = this.expenses.filter(data => data.isoncredit == false);
        this.expenses = this.expenses.filter(data => data.expensetype == 'Staff Payroll');

        this.expenses.forEach(expense => {
          this.pouchService.getStaff(expense.staffid).then(staff => {
            expense['staffcode'] = staff.staffcode;
            expense['staffdepartment'] = staff.department;
          });
        });
        console.log(this.expenses);
        this.pouchService.paginationId = this.expenses[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByExpense('expense', this.pouchService.paginationId, undefined, false, undefined, undefined, 'Staff Payroll').then(paginatedata => {
          this.paginatedExpenses = paginatedata;

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
      //this.department = staff.department;

      this.pouchService.paginationId = this.paginatedExpenses[this.paginatedExpenses.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByExpense('expense', this.pouchService.paginationId, undefined, false, undefined, undefined, 'Staff Payroll').then(paginatedata => {
        this.paginatedExpenses = paginatedata;

        this.isPreviousActive = true;
      });

    });
  }

  previous() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      //this.department = staff.department;
      this.pouchService.paginationId = this.paginatedExpenses[this.paginatedExpenses.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByExpensePrev('expense', this.pouchService.paginationId, undefined, false, undefined, undefined, 'Staff Payroll').then(paginatedata => {
        this.paginatedExpenses = paginatedata;

      });
      if (this.paginatedExpenses.length < this.pouchService.limitRange) {
        this.isPreviousActive = false;
      }
    });
  }

  goToStart() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      //this.department = staff.department;

      this.isPreviousActive = false;

      this.pouchService.paginationId = this.paginatedExpenses[this.paginatedExpenses.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByExpenseStart('expense', this.pouchService.paginationId, undefined, false, undefined, undefined, 'Staff Payroll').then(paginatedata => {
        this.paginatedExpenses = paginatedata;

        this.isPreviousActive = true;
      });
    });
  }

  deletePayroll(payroll) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: payroll
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteExpense(payroll).then(res => {
          this.toastr.success('Payroll has been deleted successfully');
          this.reloadPayroll();
        });
      }
    });
  }


  selectedPayroll(payroll, event) {
    if (event.checked) {
      payroll['selected'] = true;
    }
    else {
      payroll['selected'] = false;
    }
    this.newExpenses = this.paginatedExpenses.filter(data => data['selected'] == true);
    if (this.newExpenses.length > 0) {
      this.tableCheck = true;
    }
    else {
      this.tableCheck = false;
    }
  }

  addPayroll() {
    let dialogRef = this.dialog.open(AddPayrollComponent, {
      data: {
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      console.log(result);
      this.reloadPayroll();
    })
  }

  deleteSelectedPayroll() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newExpenses.forEach(expense => {
          this.pouchService.deleteExpense(expense).then(res => {
            this.reloadPayroll();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Payrolls has been deleted successfully');
      }
    });
  }

  public export(): void {
    var exportedExpensesArray = [];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getExpenses().then(items => {
        items = items.filter(data => data.branch == staff.branch);
        items = items.filter(data => data.iscomplete == true || data.isowing == true);
        items = items.filter(data => data.isoncredit == false);
        items = items.filter(data => data.expensetype == 'Staff Payroll');
        let p = items.map(async expense => {
          await this.pouchService.getStaff(expense.staffid).then(staff => {
            expense['staffcode'] = staff.staffcode;
            expense['staffdepartment'] = staff.department;
          });
        });
        Promise.all(p).then(result => {
          setTimeout(() => {
            for (var i = 0; i < items.length; i++) {

              var exportedExpenses = {
                'S/NO': i + 1,
                'STAFF NAME': items[i].staffname,
                'STAFF CODE': items[i]['staffcode'],
                'PAYROLL NAME': items[i].expensename,
                'STAFF DEPARTMENT': items[i]['staffdepartment'],
                'DATE OF PAYMENT': items[i].date,
                'PAYROLL TYPE': items[i].expensetype,
                AMOUNT: items[i].amount,
                DESCRIPTION: items[i].description,
                'BRANCH': items[i].branch
              }
              exportedExpensesArray.push(exportedExpenses);
              this.worksheet = XLSX.utils.json_to_sheet(exportedExpensesArray);
            }
            const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
            this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(this.excelBuffer, 'IUTH Payrolls');
          }, 1000);
        });
      });
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  filterDate() {
    this.expenses = [];
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
      this.pouchService.getExpenses().then(expenses => {
        expenses = expenses.filter(data => data.branch == staff.branch);
        expenses = expenses.filter(data => data.iscomplete == true || data.isowing == true);
        expenses = expenses.filter(data => data.isoncredit == false);
        expenses = expenses.filter(data => data.expensetype == 'Staff Payroll');
        expenses.forEach(expense => {
          this.pouchService.getStaff(expense.staffid).then(staff => {
            expense['staffcode'] = staff.staffcode;
            expense['staffdepartment'] = staff.department;
          });
        });

        expenses.map(expense => {
          expense['timestamp'] = new Date(expense.date);
          expense['timestamp'] = new Date(expense['timestamp']).setSeconds(0);
          expense['timestamp'] = expense['timestamp'] + 3600000;
          /*  expense['timestamp'] = new Date(expense['timestamp']).setMinutes(0);
           expense['timestamp'] = new Date(expense['timestamp']).setHours(0); */

        });
        expenses = expenses.filter(data => newDateFrom <= data['timestamp']);
        expenses = expenses.filter(data => newDateTo >= data['timestamp']);
        this.expenses = expenses;

        this.pouchService.paginationId = this.expenses[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByExpense('expense', this.pouchService.paginationId, undefined, false, undefined, undefined, 'Staff Payroll').then(paginatedata => {
          this.paginatedExpenses = paginatedata;

          this.paginatedExpenses.map(paginateExpense => {
            paginateExpense['timestamp'] = new Date(paginateExpense.date);
            paginateExpense['timestamp'] = new Date(paginateExpense['timestamp']).setSeconds(0);
            paginateExpense['timestamp'] = paginateExpense['timestamp'] + 3600000;
            /*  expense['timestamp'] = new Date(expense['timestamp']).setMinutes(0);
             expense['timestamp'] = new Date(expense['timestamp']).setHours(0); */
          });
          this.paginatedExpenses = this.paginatedExpenses.filter(data => newDateFrom <= data['timestamp']);
          this.paginatedExpenses = this.paginatedExpenses.filter(data => newDateTo >= data['timestamp']);
        });
      });
    });
  }

  viewPayroll(payroll) {
    let dialogRef = this.dialog.open(ViewReceiptPayrollComponent, {
      width: '450px',
      data: {
        action: 'view',
        content: payroll
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {

      }
    });
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedExpenses = [];

    for (let expense of this.expenses) {
      if ((expense.staffname).toLowerCase().indexOf(value) !== -1) {
        this.paginatedExpenses.push(expense);

        this.paginatedExpenses = this.paginatedExpenses.slice(0, this.pouchService.limitRange);
      }
    }
  }

}
