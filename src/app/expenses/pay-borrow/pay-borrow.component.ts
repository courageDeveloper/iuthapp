import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Expenses } from '../../../model/expense';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Patient } from '../../../model/patient';
import { PouchService } from '../../../providers/pouch-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pay-borrow',
  templateUrl: './pay-borrow.component.html',
  styleUrls: ['./pay-borrow.component.css']
})
export class AddPayborrowComponent implements OnInit {
  title;
  expenses: Expenses;
  amount: any;
  amountToPay: any;
  isError = false;
  errorMessage = '';

  constructor(public dialogRef: MatDialogRef<AddPayborrowComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public toastr: ToastrService, public pouchService: PouchService) {
    this.title = 'Pay';
    data.borrow;
  }

  ngOnInit() {
    if (this.data.borrow.isoncredit || this.data.borrow.isowing) {
      this.amountToPay = this.data.borrow.balance;
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  amountChanged(event) {
    if (this.data.borrow.isoncredit || this.data.borrow.isowing) {
      if (this.data.borrow.balance < this.amount) {
        this.errorMessage = "You have exceded the amount meant to be paid";
        this.isError = true;
      }
      else {
        this.errorMessage = "";
        this.isError = false;
      }
    }
  }


  submit() {
    if (this.data.borrow.isoncredit || this.data.borrow.isowing) {
      this.data.borrow.amount += this.amount;
      this.data.borrow.balance = this.data.borrow.balance - this.amount;
      if (this.data.borrow.balance <= 0) {
        this.data.borrow.iscomplete = true;
        this.data.borrow.isowing = false;
        this.data.borrow.isoncredit = false;
      }
      else if (this.data.borrow.balance == 0) {
        this.data.borrow.iscomplete = false;
        this.data.borrow.isowing = false;
        this.data.borrow.isoncredit = true;
      }
      else {
        this.data.borrow.iscomplete = false;
        this.data.borrow.isowing = true;
        this.data.borrow.isoncredit = false;
      }
    }
    this.pouchService.updateExpense(this.data.borrow).then(result => {
      this.updateVendor(result.vendorid);
      this.pouchService.getProduct(result.expenseproductid).then(product => {
        if (result.iscomplete == true) {
          product.iscompletepayment = true;
          product.isowing = false;
          product.isoncredit = false;
        }
        else if (result.isowing == true) {
          product.isowing = true;
          product.iscompletepayment = false;
          product.isoncredit = false;
        }
        else {
          product.isoncredit = true;
          product.isowing = false;
          product.iscompletepayment = false;
        }
        this.pouchService.updateProduct(product);
      });
      this.dialogRef.close(true);
    });

  }

  updateVendor(id) {
    this.pouchService.getVendor(id).then(vendor => {
      vendor.balance -= this.amount;
      this.pouchService.updateVendor(vendor);
    });
  }


  sendNotification(branch, expensename) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: expensename,
      department: this.expenses.departmentname,
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${expensename} on ${this.expenses.date} from ${this.expenses.departmentname}`,
      sourceid: this.expenses.id
    }
    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == 'GOPD Pharmacy' || data.department == 'Laboratory' || data.department == 'Radiology' || data.department == 'Revenue' || data.department == 'Account' || data.department == 'Audit');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {
        })
      })
    });
  }

  sendNotificationBenin(branch, expensename) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: expensename,
      department: 'Account',
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${expensename} on ${this.expenses.date} from ${this.expenses.departmentname}`,
      sourceid: this.expenses.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Admin' || data.department == 'Account');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {

        })
      })
    });
  }

}
