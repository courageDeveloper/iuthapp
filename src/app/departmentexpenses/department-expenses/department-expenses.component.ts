import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddExpensesComponent } from '../../expenses/add-expenses/add-expenses.component';
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
import { ExpensedialogmessageComponent } from '../../expensedialogmessage/expensedialogmessage.component';

@Component({
  selector: 'app-department-expenses',
  templateUrl: './department-expenses.component.html',
  styleUrls: ['./department-expenses.component.css']
})
export class DepartmentExpensesComponent implements OnInit {
  expenses: Array<Expenses> = [];
  public totalExpenses: Array<Expenses> = [];
  public tableWidget: any;
  tableCheck = false;
  newExpenses: any;
  show = false;
  files: FileList;
  convertFiles;
  newArray;
  total = 0;
  isUserPermitted = true;
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
  department: any;
  months: any[];
  years: any[];
  selectedMonth;
  selectedYear = new Date().getFullYear();
  paginatedExpenses;
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

    this.loadExpenses();
    this.loadTotalExpenses();
    this.getYears();
    this.getMonths();
    this.checkRoles();
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
        this.expenses = data.filter(data => data.branch == staff.branch && data.departmentname == staff.department);
        this.expenses = this.expenses.filter(data => data.isoncredit == false);
        this.expenses = this.expenses.filter(data => {
          var dbMonth = this.months[new Date(data.date).getMonth()];
          var dbYear = new Date(data.date).getFullYear();

          return this.selectedMonth == dbMonth && this.selectedYear == dbYear;

        });
        this.pouchService.paginationId = this.expenses[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByExpense('expense', this.pouchService.paginationId, staff.department, false).then(paginatedata => {
          this.paginatedExpenses = paginatedata;
          this.paginatedExpenses = this.paginatedExpenses.filter(data => {
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
        if (role.role == "Refund/Return" && role.isChecked == true) {
          this.isRefund = true;
        }
      })
    });
  }

  reloadExpenses() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.department = staff.department;

      this.pouchService.getExpenses().then(data => {
        this.expenses = data.filter(data => data.branch == staff.branch && data.departmentname == staff.department);
        this.expenses = this.expenses.filter(data => data.isoncredit == false);

        this.pouchService.paginationId = this.expenses[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByExpenseRemoveItem('expense', this.pouchService.paginationId, staff.department, false).then(paginatedata => {
          this.paginatedExpenses = paginatedata;

          this.isNextActive = true;
        });
      });
    });
  }


  loadExpenses() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.department = staff.department;

      this.pouchService.getExpenses().then(data => {
        this.expenses = data.filter(data => data.branch == staff.branch && data.departmentname == staff.department);
        this.expenses = this.expenses.filter(data => data.isoncredit == false);

        this.pouchService.paginationId = this.expenses[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByExpense('expense', this.pouchService.paginationId, staff.department, false).then(paginatedata => {
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
      this.department = staff.department;

      this.pouchService.paginationId = this.paginatedExpenses[this.paginatedExpenses.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByExpense('expense', this.pouchService.paginationId, staff.department, false).then(paginatedata => {
        this.paginatedExpenses = paginatedata;

        this.isPreviousActive = true;
      });
    });
  }

  previous() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.department = staff.department;

      this.pouchService.paginationId = this.paginatedExpenses[this.paginatedExpenses.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByExpensePrev('expense', this.pouchService.paginationId, staff.department, false).then(paginatedata => {
        this.paginatedExpenses = paginatedata;

        if (this.paginatedExpenses.length < this.pouchService.limitRange) {
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

      this.pouchService.paginationId = this.paginatedExpenses[this.paginatedExpenses.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByExpenseStart('expense', this.pouchService.paginationId, staff.department, false).then(paginatedata => {
        this.paginatedExpenses = paginatedata;

      });
    });
  }

  loadTotalExpenses() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getExpenses().then(data => {
        this.totalExpenses = data.filter(data => data.branch == staff.branch && data.departmentname == staff.department);
        this.totalExpenses = this.totalExpenses.filter(data => data.isoncredit == false);
        this.getTotalExpenses(this.totalExpenses);
      });
    });
  }

  import() {
    this.show = true;
  }

  handleFiles(event) {
    this.files = event.target.files;

    var reader: FileReader = new FileReader();
    reader.readAsDataURL(this.files[0]);

    reader.onload = (e) => {
      this.convertFiles = reader.result;

      return new Promise((resolve, reject) => {
        var url = this.convertFiles;
        var oReq = new XMLHttpRequest();
        var workbook: any;
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";
        oReq.onload = (e) => {
          if (oReq.status >= 200 && oReq.status < 300) {
            var arraybuffer = oReq.response;
            var data = new Uint8Array(arraybuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            workbook = XLSX.read(bstr, { type: "binary" });
            var worksheetname = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[worksheetname];
            var json = XLSX.utils.sheet_to_json(worksheet, { raw: true });

            json.forEach(item => {
              var arrayCheck = ['EXPENSE NAME', 'EXPENSE TYPE', 'AMOUNT', 'DESCRIPTION', 'DATE'];

              for (var i = 0; i < arrayCheck.length; i++) {

                if (item[arrayCheck[i]] == undefined) {
                  item[arrayCheck[i]] = 'N/A';
                }
              }

              setTimeout(() => {
                var expense = {
                  id: '',
                  rev: '',
                  amountloaned: 0,
                  amountpayable: 0,
                  loanstatus: false,
                  departmentname: '',
                  staffname: '',
                  staffposition: '',
                  departmentloaning: '',
                  dateofloan: new Date(),
                  expensename: item['EXPENSE NAME'],
                  amount: item['AMOUNT'],
                  isoncredit: false,
                  balance: 0,
                  expensetype: item['EXPENSE TYPE'],
                  expenseproduct: '',
                  expenseproductid: '',
                  description: item['EXPENSE DESCRIPTION'],
                  isonlinepayment: false,
                  departmentid: '',
                  staffid: '',
                  date: item['DATE'],
                  pending: false,
                  staffloan: false,
                  isreconciled: true,
                  iscomplete: true,
                  isowing: false,
                  color: '',
                  departmentloan: false,
                  branch: ''
                }

                this.newArray = [];
                this.newArray.push(expense);

                this.newArray.forEach(arrayExpense => {
                  arrayExpense.date = new Date((arrayExpense.date - (25567 + 2)) * 86400 * 1000).toString();

                  var localStorageItem = JSON.parse(localStorage.getItem('user'));
                  this.pouchService.getStaff(localStorageItem).then(staff => {
                    if (staff.branch == "IUTH(Okada)") {
                      arrayExpense.department = "Revenue";
                      arrayExpense.departmentloaning = "Revenue";
                      arrayExpense.branch = "IUTH(Okada)";
                    }
                    else if (staff.branch == "Benin Centre") {
                      arrayExpense.department = "Account";
                      arrayExpense.departmentloaning = "Account";
                      arrayExpense.branch = "Benin Centre";
                    }
                    this.pouchService.saveExpense(arrayExpense).then(res => {
                      this.reloadExpenses();
                    });
                  });
                });
              }, 3000);
            });

            resolve('Finished generating JSON');
          } else {
            reject(console.log('XMLHttpRequest failed; error code:' + oReq.statusText));
          }
        }
        oReq.send();
      });
    }
  }

  public export(): void {
    var exportedExpensesArray = [];

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getExpenses().then(items => {
        items = items.filter(data => data.branch == staff.branch && data.departmentname == staff.department);
        items = items.filter(data => data.isoncredit == false);

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
        this.saveAsExcelFile(this.excelBuffer, 'IUTH Expenses');
      });
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  addExpense() {
    let dialogRef = this.dialog.open(AddExpensesComponent, {
      width: '450px',
      data: {
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      console.log(result);
      this.reloadExpenses();
    })
  }

  getTotalExpenses(expenses) {

    var expenseArray = [];
    expenses = expenses.filter(data => data.isreconciled == true);
    expenses.forEach(expense => {
      expenseArray.push(expense.amount);
    });
    return this.total = expenseArray.reduce((a, b) => a + b, 0);
  }

  borrows() {
    this.router.navigate(['/department-liability']);
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
        expenses = expenses.filter(data => data.branch == staff.branch && data.departmentname == staff.department);
        expenses = expenses.filter(data => data.isoncredit == false);

        expenses.map(expense => {
          expense['timestamp'] = new Date(expense.date).toLocaleString("en-US", { timeZone: "GMT" });
          expense['timestamp'] = new Date(expense['timestamp']).setSeconds(0);
          /*  expense['timestamp'] = new Date(expense['timestamp']).setMinutes(0);
           expense['timestamp'] = new Date(expense['timestamp']).setHours(0); */

        });
        expenses = expenses.filter(data => newDateFrom <= data['timestamp']);
        expenses = expenses.filter(data => newDateTo >= data['timestamp']);
        this.expenses = expenses;

        this.pouchService.paginationId = this.expenses[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByExpense('expense', this.pouchService.paginationId, staff.department, false).then(paginatedata => {
          this.paginatedExpenses = paginatedata;

          this.paginatedExpenses.map(paginateExpense => {
            paginateExpense['timestamp'] = new Date(paginateExpense.date).toLocaleString("en-US", { timeZone: "GMT" });
            paginateExpense['timestamp'] = new Date(paginateExpense['timestamp']).setSeconds(0);
            /*  expense['timestamp'] = new Date(expense['timestamp']).setMinutes(0);
             expense['timestamp'] = new Date(expense['timestamp']).setHours(0); */
          });
          this.paginatedExpenses = this.paginatedExpenses.filter(data => newDateFrom <= data['timestamp']);
          this.paginatedExpenses = this.paginatedExpenses.filter(data => newDateTo >= data['timestamp']);
        });
      });
    });
  }

  returnExpense(expense) {
    //Send Notification
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: expense
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        //try {
        this.pouchService.getProduct(expense.expenseproductid).then(product => {
          if (product.isdispatched) {
            let dialogRef = this.dialog.open(ExpensedialogmessageComponent, {
              width: '450px',
              data: {
                content: expense
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
              this.pouchService.deleteExpense(expense).then(response => {
                if (expense.vendorid != undefined) {
                  this.updateVendorSubtract(expense.vendorid, expense.balance);
                }
                this.reloadExpenses();
              });
            });
          }
        }).catch((error: Error) => {
          if (error) {
            this.pouchService.deleteExpense(expense).then(response => {
              this.reloadExpenses();
            });
          }
        })
        /*  }
         catch (e) {
           console.log(e);
           if (e instanceof Error) {
             console.log(e);
           }
         } */
      }
    });
  }

  updateVendorSubtract(id, balance) {
    this.pouchService.getVendor(id).then(vendor => {
      vendor.balance -= balance;
      this.pouchService.updateVendor(vendor);
    });
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedExpenses = [];

    for (let expense of this.expenses) {
      if ((expense.expensename).toLowerCase().indexOf(value) !== -1) {
        this.paginatedExpenses.push(expense);

        this.paginatedExpenses = this.paginatedExpenses.slice(0, this.pouchService.limitRange);
      }
    }
  }

}
