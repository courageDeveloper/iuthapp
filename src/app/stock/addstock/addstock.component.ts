import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../../providers/pouch-service';
import { Stock } from '../../../model/stock';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addstock',
  templateUrl: './addstock.component.html',
  styleUrls: ['./addstock.component.scss']
})
export class AddstockComponent implements OnInit {
  title;
  public stock: Stock;
  localStorageItem: any;
  stocks: any[];
  openingstocks: any[];
  months: any[];
  years: any[];
  isOpeningStock = false;
  stockForm = new FormGroup({
    id: new FormControl(),
    rev: new FormControl(),
    branch: new FormControl(),
    department: new FormControl(),
    date: new FormControl(),
    month: new FormControl(),
    year: new FormControl(),
    openingstock: new FormControl(),
    openingstockamount: new FormControl(),
    closingstock: new FormControl(),
    closingstockamount: new FormControl(),
    description: new FormControl()
  });

  constructor(public dialogRef: MatDialogRef<AddstockComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public toastr: ToastrService, public pouchService: PouchService, private formBuilder: FormBuilder, ) {
    this.stock = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      branch: '',
      department: '',
      date: new Date().toString(),
      month: '',
      year: new Date().getFullYear(),
      openingstock: 'Opening Stock',
      openingstockamount: 0,
      closingstock: '',
      closingstockamount: 0,
      description: ''
    }
  }

  ngOnInit() {
    this.isOpeningStock = true;
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    if (this.data.action == 'add') {
      this.title = 'Add';
    }
    else {
      this.title = 'Edit';
      this.stock = this.data.stock;
    }

    this.stockForm = this.formBuilder.group({
      id: [this.stock.id],
      rev: [this.stock.rev],
      branch: [this.stock.branch],
      department: [this.stock.department],
      date: [this.stock.date],
      month: [this.stock.month],
      year: [this.stock.year],
      openingstock: [this.stock.openingstock],
      openingstockamount: [this.stock.openingstockamount],
      closingstock: [this.stock.closingstock],
      closingstockamount: [this.stock.closingstockamount],
      description: [this.stock.description]
    })

    this.localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(this.localStorageItem).then(item => {
      this.stock.branch = item.branch;
      this.stock.department = item.department;
    });

    this.stocks = ['Opening Stock', 'Closing Stock'];
    this.openingstocks = ['Opening Stock'];
    this.getYears();
  }

  getYears() {
    this.years = [];
    var currentYear = new Date().getFullYear();

    for (var i = 1980; i <= currentYear; i++) {

      this.years.push(i);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    this.pouchService.saveStock(this.stock).then(res => {
      this.toastr.success('Stock has been added');
      this.dialogRef.close(true);
    });
  }

  edit() {
    this.pouchService.updateStock(this.stock).then(res => {
      this.toastr.success('Stock has been updated');
      this.dialogRef.close(true);
    })
  }

  changeStockType(stock) {
    if (stock == 'Opening Stock') {
      this.isOpeningStock = true;
    }
    else {
     this.isOpeningStock = false;
    }
  }
}

