import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../../providers/pouch-service';
import { Expenses } from '../../../model/expense';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
var converter = require('number-to-words');

@Component({
  selector: 'app-view-receipt-payroll',
  templateUrl: './view-receipt-payroll.component.html',
  styleUrls: ['./view-receipt-payroll.component.css']
})
export class ViewReceiptPayrollComponent implements OnInit {
  title;
  public expense: Array<Expenses> = [];
  receiptSource: any;
  staffCode;
  staffDepartment;
  amountInWords: any;

  constructor(private router: Router, private dataService: DataService, public dialogRef: MatDialogRef<ViewReceiptPayrollComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public toastr: ToastrService, public _DomSanitizer: DomSanitizer, public pouchService: PouchService, private formBuilder: FormBuilder) {

    if (this.data.action == 'view') {
      this.title = "View";
      this.expense = this.data.content;
      this.amountInWords = converter.toWords(this.data.content.amount);
      this.pouchService.getStaff(this.data.content.staffid).then(staff => {
        this.staffCode = staff.staffcode;
        this.staffDepartment = staff.department;
      });
    }
  }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  print() {
    var win: any;

    win = window;
    var printContent = document.getElementById('printArea').innerHTML;
    var printWindow = win.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    printWindow.document.open();
    printWindow.document.write(`<html><head><title>Staff Payroll `, `</title><style>
       
    .hide-btn {
      visibility: hidden;
    }

           </style></head><body></body></html>`);

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }

}
