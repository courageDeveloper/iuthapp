import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../../providers/pouch-service';
import { Grossprofit } from '../../../model/grossprofit';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-grossprofit',
  templateUrl: './add-grossprofit.component.html',
  styleUrls: ['./add-grossprofit.component.css']
})
export class AddGrossProfitComponent implements OnInit {
  title;
  isChecked = false;
  public grossProfit: Grossprofit;
  isCheckedPacket = false;
  serviceArray = [];
  localStorageItem: any;
  months: any[];
  years: any[];
  selectedMonth;
  departments: any[];
  isFinanceDept;

  grossProfitForm = new FormGroup({
    id: new FormControl(),
    rev: new FormControl(),
    openingstock: new FormControl(),
    purchases: new FormControl(),
    closingstock: new FormControl(),
    isopeningstock: new FormControl(),
    isclosingstock: new FormControl(),
    date: new FormControl(),
    salespermonth: new FormControl(),
    month: new FormControl(),
    year: new FormControl(),
    branch: new FormControl(),
    department: new FormControl(),
    cogs: new FormControl(),
    expenses: new FormControl(),
    grossprofit: new FormControl()
  });

  constructor(private router: Router, public dialogRef: MatDialogRef<AddGrossProfitComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public toastr: ToastrService, public _DomSanitizer: DomSanitizer, public pouchService: PouchService, private formBuilder: FormBuilder) {

    if (this.data.action == 'add') {
      this.title = 'Add';
      this.grossProfit = {
        id: Math.round((new Date()).getTime()).toString(),
        rev: '',
        openingstock: 0,
        purchases: 0,
        closingstock: 0,
        isopeningstock: false,
        isclosingstock: false,
        date: new Date(),
        salespermonth: 0,
        month: '',
        year: '',
        branch: '',
        department: '',
        cogs: 0,
        expenses: 0,
        grossprofit: 0
      }
    }
    else {
      this.title = 'Edit';
      this.grossProfit = data.grossprofit;
      /* data.counterproduct.datesupplied = new Date(data.counterproduct.datesupplied);
      data.counterproduct.expirydate = new Date(data.counterproduct.expirydate);
      this.counterProduct = data.counterproduct; */
    }
  }

  ngOnInit() {
    this.departments = ['Main Pharmacy', 'GOPD Pharmacy', 'Laboratory',
      'Radiology'];


    this.localStorageItem = JSON.parse(localStorage.getItem('user'));

    this.grossProfitForm = this.formBuilder.group({
      id: [this.grossProfit.id],
      rev: [this.grossProfit.rev],
      openingstock: [this.grossProfit.openingstock],
      purchases: [this.grossProfit.purchases],
      closingstock: [this.grossProfit.closingstock],
      isopeningstock: [this.grossProfit.isopeningstock],
      isclosingstock: [this.grossProfit.isclosingstock],
      date: [this.grossProfit.date],
      salespermonth: [this.grossProfit.salespermonth],
      month: [this.grossProfit.month],
      year: [this.grossProfit.year],
      branch: [this.grossProfit.branch],
      department: [this.grossProfit.department],
      cogs: [this.grossProfit.cogs],
      expenses: [this.grossProfit.expenses],
      grossprofit: [this.grossProfit.grossprofit]
    });

    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.getYears();
    this.getMonths();

    this.pouchService.getStaff(this.localStorageItem).then(staff => {
      if (staff.department == 'Account' || staff.department == 'Revenue' || staff.department == 'Audit') {
        this.isFinanceDept = true;
      }
      else {
        this.isFinanceDept = false;
      }
    });
  }

  getYears() {
    this.years = [];
    this.grossProfit.year = new Date().getFullYear();

    for (var i = 1980; i <= this.grossProfit.year; i++) {

      this.years.push(i);
    }
  }

  getMonths() {
    var indexMonth = new Date().getMonth();
    this.grossProfit.month = this.months[indexMonth];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    this.pouchService.getStaff(this.localStorageItem).then(item => {
      this.grossProfit.branch = item.branch;
      if (!this.isFinanceDept) {
        this.grossProfit.department = item.department;
      }
      this.grossProfit.cogs = this.grossProfit.openingstock + this.grossProfit.purchases - this.grossProfit.closingstock;
      this.grossProfit.grossprofit = this.grossProfit.salespermonth - this.grossProfit.cogs;
      this.pouchService.saveGrossprofit(this.grossProfit).then(res => {
        this.toastr.success('Gross Profit has been added');
        this.dialogRef.close(true);
      });
    });
  }

  edit() {
    this.pouchService.getStaff(this.localStorageItem).then(item => {
      this.grossProfit.branch = item.branch;
      if (!this.isFinanceDept) {
        this.grossProfit.department = item.department;
      }
      this.grossProfit.cogs = this.grossProfit.openingstock + this.grossProfit.purchases - this.grossProfit.closingstock;
      this.grossProfit.grossprofit = this.grossProfit.salespermonth - this.grossProfit.cogs;
      this.pouchService.updateGrossprofit(this.grossProfit).then(res => {
        this.toastr.success('Gross Profit has been updated');
        this.dialogRef.close(true);
      });
    })
  }

}
