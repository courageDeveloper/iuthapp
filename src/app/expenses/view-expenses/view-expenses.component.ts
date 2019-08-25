import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import {AddExpensesComponent} from '../../expenses/add-expenses/add-expenses.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-view-expenses',
  templateUrl: './view-expenses.component.html',
  styleUrls: ['./view-expenses.component.css']
})
export class ViewExpensesComponent implements OnInit {
  expenses: any[];
  public tableWidget: any;
  tableCheck = false;
  newExpenses: any;
  show = false;
  files: FileList;
  currentMonthNumber;
  currentMonth;
  months;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
   this.loadExpenses();
  }

  loadExpenses() {
    this.months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    this.currentMonthNumber = new Date().getMonth();
    this.currentMonth = this.months[this.currentMonthNumber];

    this.expenses = [{ expensetype: 'festus kenny', description: 'accountant', date: 'Account', amount: 10000 },
    { expensetype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'kate', description: 'receptionist', date: 'Revenue',  amount: 5000},
    { expensetype: 'John Bull', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'kate', description: 'receptionist', date: 'Revenue',  amount: 5000},
    { expensetype: 'John Bull', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { expensetype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000}
    ]

    $(document).ready(function () {
      $('#dtBasicExample').DataTable();
      $('.dataTables_length').addClass('bs-select');
    });
  }


  editExpense(expense) {
    let dialogRef = this.dialog.open(AddExpensesComponent, {
      data: {
        expense: expense,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(!result) {
        return;
      }
      this.loadExpenses();
    })
  }

  deleteExpense() {

  }

  viewExpense() {

  }

  selectedExpense(expense, event) {
   if (event.checked) {
    expense['selected'] = true;
    }
    else {
      expense['selected'] = false;
    }
    this.newExpenses = this.expenses.filter(data => data.selected == true);
    if (this.newExpenses.length > 0) {
      this.tableCheck = true;
    }
    else {
      this.tableCheck = false;
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
      data: {
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        return;
      }
      console.log(result);
      this.loadExpenses();
    })
  }
}
