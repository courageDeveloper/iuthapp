import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../../providers/pouch-service';
import { Netprofit } from '../../../model/netprofit';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-netprofit',
  templateUrl: './add-netprofit.component.html',
  styleUrls: ['./add-netprofit.component.css']
})
export class AddNetProfitComponent implements OnInit {
  title;
  isChecked = false;
  public netProfit: Netprofit;
  isCheckedPacket = false;
  serviceArray = [];
  localStorageItem: any;
  months: any[];
  years: any[];
  selectedMonth;
  departments: any[];
  isFinanceDept;

  netProfitForm = new FormGroup({
    id: new FormControl(),
    rev: new FormControl(),
    grossprofit: new FormControl(),
    expenses: new FormControl(),
    date: new FormControl(),
    month: new FormControl(),
    year: new FormControl(),
    branch: new FormControl(),
    netprofit: new FormControl(),
    department: new FormControl()
  });

  constructor(private router: Router, public dialogRef: MatDialogRef<AddNetProfitComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public toastr: ToastrService, public _DomSanitizer: DomSanitizer, public pouchService: PouchService, private formBuilder: FormBuilder) {

    if (this.data.action == 'add') {
      this.title = 'Add';
      this.netProfit = {
        id: Math.round((new Date()).getTime()).toString(),
        rev: '',
        grossprofit: 0,
        expenses: 0,
        netprofit: 0,
        date: new Date().toString(),
        month: '',
        year: '',
        branch: '',
        department: ''
      }
    }
    else {
      this.title = 'Edit';
      this.netProfit = data.netprofit;
    }
  }

  ngOnInit() {
    this.departments = ['Pharmacy Store', 'Central Store', 'Main Pharmacy', 'GOPD Pharmacy', 'Laboratory',
      'Radiology', 'Revenue', 'Account', 'Audit', 'Theatre', 'Admin'];


    this.localStorageItem = JSON.parse(localStorage.getItem('user'));

    this.netProfitForm = this.formBuilder.group({
      id: [this.netProfit.id],
      rev: [this.netProfit.rev],
      grossprofit: [this.netProfit.grossprofit],
      netprofit: [this.netProfit.netprofit],
      expenses: [this.netProfit.expenses],
      date: [this.netProfit.date],
      month: [this.netProfit.month],
      year: [this.netProfit.year],
      branch: [this.netProfit.branch],
      department: [this.netProfit.department]
    });

    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.getYears();
    this.getMonths();

   /*  this.pouchService.getStaff(this.localStorageItem).then(staff => {
      if (staff.department == 'Account' || staff.department == 'Revenue' || staff.department == 'Audit') {
        this.isFinanceDept = true;
      }
      else {
        this.isFinanceDept = false;
      }
    }); */
  }

  getYears() {
    this.years = [];
    this.netProfit.year = new Date().getFullYear();

    for (var i = 1980; i <= this.netProfit.year; i++) {

      this.years.push(i);
    }
  }

  getMonths() {
    var indexMonth = new Date().getMonth();
    this.netProfit.month = this.months[indexMonth];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    this.pouchService.getStaff(this.localStorageItem).then(item => {
      this.netProfit.branch = item.branch;
     /*  if (!this.isFinanceDept) {
        this.netProfit.department = item.department;
      } */
      this.netProfit.netprofit = this.netProfit.grossprofit - this.netProfit.expenses;
      this.pouchService.saveNetprofit(this.netProfit).then(res => {
        this.toastr.success('Net Profit has been added');
        this.dialogRef.close(true);
      });
    });
  }

  edit() {
    this.pouchService.getStaff(this.localStorageItem).then(item => {
      this.netProfit.branch = item.branch;
      /* if (!this.isFinanceDept) {
        this.grossProfit.department = item.department;
      } */
      this.netProfit.netprofit = this.netProfit.grossprofit - this.netProfit.expenses;
      this.pouchService.updateNetprofit(this.netProfit).then(res => {
        this.toastr.success('Net Profit has been updated');
        this.dialogRef.close(true);
      });
    })
  }

}
