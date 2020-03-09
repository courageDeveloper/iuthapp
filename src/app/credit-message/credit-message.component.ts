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
  selector: 'app-credit-message',
  templateUrl: './credit-message.component.html',
  styleUrls: ['./credit-message.component.css']
})
export class CreditMessageComponent implements OnInit {
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


  constructor(private router: Router, private dataService: DataService, public dialogRef: MatDialogRef<CreditMessageComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public toastr: ToastrService, public _DomSanitizer: DomSanitizer, public pouchService: PouchService, private formBuilder: FormBuilder) {

    if (this.data.action == 'display') {
      this.title = 'Credit Message';
      var indexOfBy = this.data.sale.salename.indexOf('by');
      var indexOfFrom = this.data.sale.salename.indexOf('from');
      var patientName = this.data.sale.salename.substring(indexOfBy + 2, indexOfFrom);
      this.data.sale['patientName'] = patientName;
      this.sale = this.data.sale;
    }
  }

  ngOnInit() {
    this.message = "A reference code will be generated when you have made payment for the products";
    this.currentDate = new Date();

    this.localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(this.localStorageItem).then(staff => {
      this.serverName = staff.firstname + ' ' + staff.lastname;
      this.staffCode = staff.staffcode;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
