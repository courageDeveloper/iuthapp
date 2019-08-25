import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import {AddPayrollComponent} from '../../payroll/add-payroll/add-payroll.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-view-payroll',
  templateUrl: './view-payroll.component.html',
  styleUrls: ['./view-payroll.component.css']
})
export class ViewPayrollComponent implements OnInit {
  payrolls: any[];
  public tableWidget: any;
  tableCheck = false;
  newUsers: any;
  show = false;
  files: FileList;
  currentMonthNumber;
  currentMonth;
  months;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
   this.loadPayroll();
  }

  loadPayroll() {
    this.months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    this.currentMonthNumber = new Date().getMonth();
    this.currentMonth = this.months[this.currentMonthNumber];

    this.payrolls = [{ name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'kate', position: 'receptionist', department: 'Revenue', branch: 'Benin Centre', salary: 5000},
    { name: 'John Bull', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'kate', position: 'receptionist', department: 'Revenue', branch: 'Benin Centre', salary: 5000},
    { name: 'John Bull', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000},
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000}
    ]

    $(document).ready(function () {
      $('#dtBasicExample').DataTable();
      $('.dataTables_length').addClass('bs-select');
    });
  }


  editPayroll(payroll) {
    let dialogRef = this.dialog.open(AddPayrollComponent, {
      data: {
        payroll: payroll,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(!result) {
        return;
      }
      this.loadPayroll();
    })
  }

  deletePayroll() {

  }

  viewHistory() {

  }

  selectedPayroll(user, event) {
   if (event.checked) {
      user['selected'] = true;
    }
    else {
      user['selected'] = false;
    }
    this.newUsers = this.payrolls.filter(data => data.selected == true);
    if (this.newUsers.length > 0) {
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

  addPayroll() {
    let dialogRef = this.dialog.open(AddPayrollComponent, {
      data: {
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        return;
      }
      console.log(result);
      this.loadPayroll();
    })
  }
}
