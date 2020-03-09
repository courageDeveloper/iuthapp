import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../providers/pouch-service';
import { Sales } from '../../model/sales';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
var converter = require('number-to-words');

@Component({
  selector: 'app-pin-message',
  templateUrl: './pin-message.component.html',
  styleUrls: ['./pin-message.component.css']
})
export class PinMessageComponent implements OnInit {
  title;
  public sales: Array<Sales> = [];
  sale;
  seviceError;
  productError;
  receiptSource: any;
  localStorageItem: any;
  serverName: any;
  staffCode;
  currentDate: any;
  amountInWords: any;
  message: string;
  amount: number;
  errorMessage: string;

  constructor(private router: Router, private dataService: DataService, public dialogRef: MatDialogRef<PinMessageComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public toastr: ToastrService, public _DomSanitizer: DomSanitizer, public pouchService: PouchService, private formBuilder: FormBuilder) {

    this.amount = 0;

    if (this.data.action == 'pin') {
      this.title = 'Activate Pin';
      var indexOfBy = this.data.loan.salename.indexOf('by');
      var indexOfFrom = this.data.loan.salename.indexOf('from');
      var patientName = this.data.loan.salename.substring(indexOfBy + 2, indexOfFrom);
      this.data.loan['patientName'] = patientName;
      this.sale = this.data.loan;
      this.data.loan.isoncredit = false;
      console.log(this.sale);
    }
  }

  ngOnInit() {
    this.amount = this.data.loan.totalamount;
    this.message = "Activate Pin for ";
    this.currentDate = new Date();

    this.localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(this.localStorageItem).then(staff => {
      this.serverName = staff.firstname + ' ' + staff.lastname;
      this.staffCode = staff.staffcode;
    });
  }

  activatePin() {
    if (this.amount < this.data.loan.amountloaned) {
      this.data.loan.balance = this.data.loan.amountloaned - this.amount;
      this.data.loan.amount = this.amount;
      this.data.loan.isowing = true;
      this.data.loan.amountloaned = 0;
      this.pouchService.updateSale(this.data.loan).then(res => {
        this.dialogRef.close(true);
      })
    }
    else if (this.amount == this.data.loan.amountloaned) {
      this.data.loan.amount = this.amount;
      this.data.loan.amountloaned = 0;
      this.pouchService.updateSale(this.data.loan).then(res => {
        this.dialogRef.close(true);
      })
    }
    else if (this.amount > this.data.loan.amountloaned) {
      this.errorMessage = "Amount is higher than what is meant to be paid.";
      return false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
