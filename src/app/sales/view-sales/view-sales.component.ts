import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import {AddSalesComponent} from '../../sales/add-sales/add-sales.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-view-sales',
  templateUrl: './view-sales.component.html',
  styleUrls: ['./view-sales.component.css']
})
export class ViewSalesComponent implements OnInit {
  sales: any[];
  public tableWidget: any;
  tableCheck = false;
  newSales: any;
  show = false;
  files: FileList;
  currentMonthNumber;
  currentMonth;
  months;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
   this.loadSales();
  }

  loadSales() {
    this.months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    this.currentMonthNumber = new Date().getMonth();
    this.currentMonth = this.months[this.currentMonthNumber];

    this.sales = [{ saletype: 'festus kenny', description: 'accountant', date: 'Account', amount: 10000 },
    { saletype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'kate', description: 'receptionist', date: 'Revenue',  amount: 5000},
    { saletype: 'John Bull', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'kate', description: 'receptionist', date: 'Revenue',  amount: 5000},
    { saletype: 'John Bull', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000},
    { saletype: 'festus kenny', description: 'accountant', date: 'Account',  amount: 10000}
    ]

    $(document).ready(function () {
      $('#dtBasicExample').DataTable();
      $('.dataTables_length').addClass('bs-select');
    });
  }


  editSale(sale) {
    let dialogRef = this.dialog.open(AddSalesComponent, {
      data: {
        sale: sale,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(!result) {
        return;
      }
      this.loadSales();
    })
  }

  deleteSale() {

  }

  viewSale() {

  }

  selectedSale(sale, event) {
   if (event.checked) {
      sale['selected'] = true;
    }
    else {
      sale['selected'] = false;
    }
    this.newSales = this.sales.filter(data => data.selected == true);
    if (this.newSales.length > 0) {
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

  addSale() {
    let dialogRef = this.dialog.open(AddSalesComponent, {
      data: {
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        return;
      }
      console.log(result);
      this.loadSales();
    })
  }
}
