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
  selector: 'app-view-expenses',
  templateUrl: './view-expenses.component.html',
  styleUrls: ['./view-expenses.component.css']
})
export class ViewExpensesComponent implements OnInit {
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
  excelBuffer: any;
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook
  exportedSalesArray: any;
  dateFrom: any;
  dateTo: any;

  constructor(public pouchService: PouchService, private router: Router, private dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.loadExpenses();
    this.loadTotalExpenses();
  }

  loadExpenses() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {

      this.pouchService.getExpenses().then(data => {
        this.expenses = data.filter(data => data.branch == staff.branch);
        this.expenses = this.expenses.filter(data => data.iscomplete == true || data.isowing == true);
        this.expenses = this.expenses.filter(data => data.isoncredit == false);

        $(document).ready(function () {
          $('#dtBasicExample').DataTable();
          $('.dataTables_length').addClass('bs-select');
        });
      });
    });
  }

  loadTotalExpenses() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getExpenses().then(data => {
        this.totalExpenses = data.filter(data => data.branch == staff.branch);
        this.totalExpenses = this.totalExpenses.filter(data => data.iscomplete == true || data.isowing == true);
        this.totalExpenses = this.totalExpenses.filter(data => data.isoncredit == false);
        this.getTotalExpenses(this.totalExpenses);
      });
    });
  }


  flagReconciliation(expense, event) {
    if (event.checked) {
      expense.color = "red";
      expense.isreconciled = false;
      this.pouchService.getExpense(expense.id).then(result => {
        result.color = "red";
        result.isreconciled = false;
        this.pouchService.updateExpense(result)
        this.loadTotalExpenses();
      });
    }
    else {
      expense.color = "";
      expense.isreconciled = true;
      this.pouchService.getExpense(expense.id).then(result => {
        result.color = "";
        result.isreconciled = true;
        this.pouchService.updateExpense(result);
        this.loadTotalExpenses();
      });
    }
  }

  import() {
    this.show = true;
  }

  handleFiles(event) {
    this.files = event.target.files;
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
      this.loadExpenses();
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
    this.router.navigate(['borrows']);
  }

  filterDate() {
    this.expenses = [];
    this.dateFrom = new Date(this.dateFrom).getTime();
    this.dateTo = new Date(this.dateTo).getTime();

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getExpenses().then(expenses => {
        expenses = expenses.filter(data => data.branch == staff.branch);
        expenses = expenses.filter(data => data.iscomplete == true || data.isowing == true);
        expenses = expenses.filter(data => data.isoncredit == false);

        expenses.map(expense => {
          expense['timestamp'] = new Date(expense.date).toLocaleString("en-US", { timeZone: "GMT" });
          expense['timestamp'] = new Date(expense['timestamp']).setSeconds(0);
          expense['timestamp'] = new Date(expense['timestamp']).setMinutes(0);
          expense['timestamp'] = new Date(expense['timestamp']).setHours(0);

        });
        expenses = expenses.filter(data => this.dateFrom <= data['timestamp']);
        expenses = expenses.filter(data => this.dateTo >= data['timestamp']);
        this.expenses = expenses;
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
            console.log(product);
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
                  this.loadExpenses();
                });
              });
            }
          }).catch((error: Error) => {
             if(error) {
              this.pouchService.deleteExpense(expense).then(response => {
                this.loadExpenses();
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

}
