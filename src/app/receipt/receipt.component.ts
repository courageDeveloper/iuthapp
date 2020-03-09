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
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {
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


  constructor(private router: Router, private dataService: DataService, public dialogRef: MatDialogRef<ReceiptComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public toastr: ToastrService, public _DomSanitizer: DomSanitizer, public pouchService: PouchService, private formBuilder: FormBuilder) {

    if (this.data.action == 'print') {
      this.title = 'Print';
      var indexOfBy = this.data.sale.salename.indexOf('by');
      var indexOfFrom = this.data.sale.salename.indexOf('from');
      var patientName = this.data.sale.salename.substring(indexOfBy + 2, indexOfFrom);
      this.data.sale['patientName'] = patientName;
      this.sale = this.data.sale;
      if(!this.data.sale.isoncredit) {
      this.amountInWords = converter.toWords(this.sale.amount);
      }
      else if(this.data.sale.isoncredit) {
        this.amountInWords = converter.toWords(this.sale.amountloaned);
      }

      if (this.sale.productorder.length == 0) {
        this.productError = 'No Product has been added to cart';
      }
      else if (this.sale.serviceorder.length == 0) {
        this.seviceError = 'No Service has been added to cart';
      }
    }
  }

  ngOnInit() {
    this.currentDate = new Date();

    this.localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(this.localStorageItem).then(staff => {
      this.serverName = staff.firstname + ' ' + staff.lastname;
      this.staffCode = staff.staffcode;
    });
    this.dataService.receiptSource.subscribe(receiptsource => this.receiptSource = receiptsource);
    setTimeout(() => {
      this.printReceipt();
    }, 1000);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  printReceipt() {
    var win: any;

    win = window;
    var printContent = document.getElementById('printArea').innerHTML;
    var printWindow = win.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    printWindow.document.open();

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }

}
