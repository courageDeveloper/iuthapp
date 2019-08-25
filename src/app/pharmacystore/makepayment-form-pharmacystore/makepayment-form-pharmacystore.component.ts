import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { PouchService } from '../../../providers/pouch-service';
import { Expenses } from '../../../model/expense';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-makepayment-form-pharmacystore',
  templateUrl: './makepayment-form-pharmacystore.component.html',
  styleUrls: ['./makepayment-form-pharmacystore.component.css']
})
export class MakepaymentFormPharmacyStoreComponent implements OnInit {
  title;
  isChecked = false;
  isCheckedPacket = false;
  isCheckedItem = false;
  makepayment: Expenses;
  files: FileList;
  isEditTotalItem = false
  departments: any[];
  localStorageItem: any;
  errorMessage: any;
  isError = false;

  makepaymentForm = new FormGroup({
    id: new FormControl(),
    rev: new FormControl(),
    amountloaned: new FormControl(),
    amountpayable: new FormControl(),
    loanstatus: new FormControl(),
    departmentname: new FormControl(),
    staffname: new FormControl(),
    staffposition: new FormControl(),
    departmentloaning: new FormControl(),
    dateofloan: new FormControl(),
    expensename: new FormControl(),
    amount: new FormControl(),
    isoncredit: new FormControl(),
    balance: new FormControl(),
    expensetype: new FormControl(),
    expenseproduct: new FormControl(),
    expenseproductid: new FormControl(),
    description: new FormControl(),
    isonlinepayment: new FormControl(),
    date: new FormControl(),
    pending: new FormControl(),
    staffloan: new FormControl(),
    departmentloan: new FormControl(),
    branch: new FormControl()
  });

  constructor(private router: Router, public pouchService: PouchService, public toastr: ToastrService, public dialogRef: MatDialogRef<MakepaymentFormPharmacyStoreComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder) {
    if (this.data.action == 'makepayment') {
      this.title = 'Make Payment';
      this.data.pharmacystore;
      this.makepayment = {
        id: Math.round((new Date()).getTime()).toString(),
        rev: '',
        amountloaned: 0,
        amountpayable: 0,
        loanstatus: false,
        departmentname: this.data.pharmacystore.store,
        staffname: '',
        staffposition: '',
        departmentloaning: '',
        dateofloan: new Date(),
        expensename: '',
        amount: 0,
        isoncredit: false,
        balance: this.data.pharmacystore.stockvalue,
        expensetype: 'Product Payment',
        expenseproduct: this.data.pharmacystore.productname,
        expenseproductid: this.data.pharmacystore.id,
        description: '',
        isonlinepayment: false,
        date: new Date(),
        pending: false,
        staffloan: false,
        departmentloan: false,
        branch: ''
      }
    }
    else if (this.data.action == 'completepayment') {
      this.data.expense;
      this.makepayment = {
        id: Math.round((new Date()).getTime()).toString(),
        rev: '',
        amountloaned: 0,
        amountpayable: 0,
        loanstatus: false,
        departmentname: this.data.pharmacystore.store,
        staffname: '',
        staffposition: '',
        departmentloaning: '',
        dateofloan: new Date(),
        expensename: '',
        amount: this.data.expense.amount,
        isoncredit: false,
        balance: this.data.expense.balance,
        expensetype: 'Product Payment',
        expenseproduct: this.data.pharmacystore.productname,
        expenseproductid: this.data.pharmacystore.id,
        description: '',
        isonlinepayment: false,
        date: new Date(),
        pending: false,
        staffloan: false,
        departmentloan: false,
        branch: ''
      }
    }
    else if (this.data.action == 'oncredit') {
      this.data.expense;
      this.makepayment = {
        id: Math.round((new Date()).getTime()).toString(),
        rev: '',
        amountloaned: 0,
        amountpayable: 0,
        loanstatus: false,
        departmentname: this.data.pharmacystore.store,
        staffname: '',
        staffposition: '',
        departmentloaning: '',
        dateofloan: new Date(),
        expensename: '',
        amount: 0,
        isoncredit: this.data.pharmacystore.isoncredit,
        balance: this.data.pharmacystore.stockvalue,
        expensetype: 'Product Payment',
        expenseproduct: this.data.pharmacystore.productname,
        expenseproductid: this.data.pharmacystore.id,
        description: '',
        isonlinepayment: false,
        date: new Date(),
        pending: false,
        staffloan: false,
        departmentloan: false,
        branch: ''
      }
    }

  }

  ngOnInit() {
    if (this.data.pharmacystore)
      this.localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.makepaymentForm = this.formBuilder.group({
      id: [this.makepayment.id],
      rev: [this.makepayment.rev],
      amountloaned: [this.makepayment.amountloaned],
      amountpayable: [this.makepayment.amountpayable],
      loanstatus: [this.makepayment.loanstatus],
      departmentname: [this.makepayment.departmentname],
      staffname: [this.makepayment.staffname],
      staffposition: [this.makepayment.staffposition],
      departmentloaning: [this.makepayment.departmentloaning],
      dateofloan: [this.makepayment.dateofloan],
      expensename: [this.makepayment.expensename],
      amount: [this.makepayment.amount],
      isoncredit: [this.makepayment.isoncredit],
      balance: [this.makepayment.balance],
      expensetype: [this.makepayment.expensetype],
      expenseproduct: [this.makepayment.expenseproduct],
      expenseproductid: [this.makepayment.expenseproductid],
      description: [this.makepayment.description],
      isonlinepayment: [this.makepayment.isonlinepayment],
      date: [this.makepayment.date],
      pending: [this.makepayment.pending],
      staffloan: [this.makepayment.staffloan],
      departmentloan: [this.makepayment.departmentloan],
      branch: [this.makepayment.branch]
    });

    this.makepaymentForm.controls.expenseproduct.disable();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCredit(event) {
    if (event.checked) {
      this.makepayment.isoncredit = true;
      this.makepayment.amount = 0;
    }
    else {
      this.makepayment.isoncredit = false;
    }
  }

  calcBalance() {
    this.makepayment.balance = this.data.pharmacystore.stockvalue - this.makepayment.amount;

    if (this.makepayment.balance <= 0) {
      this.errorMessage = "You have reached/exceeded cost for item";
    }
  }

  sendNotification(branch) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: `${this.makepayment.expenseproduct} Payment Notification`,
      department: 'Pharmacy Store',
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${this.data.pharmacystore.unitstock} ${this.makepayment.expenseproduct} has been paid for on ${this.makepayment.date}`,
      sourceid: this.makepayment.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == 'GOPD Pharmacy' || data.department == 'Laboratory' || data.department == 'Radiology' || data.department == 'Theatre' || data.department == 'Account' || data.department == 'Audit');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {

        })
      })
    });
  }

  sendNotificationIsOwing(branch) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: `${this.makepayment.expenseproduct} Payment Notification`,
      department: 'Pharmacy Store',
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${this.data.pharmacystore.unitstock} ${this.makepayment.expenseproduct} has been partly paid for of the amount ${this.makepayment.amount} on ${this.makepayment.date}`,
      sourceid: this.makepayment.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == 'GOPD Pharmacy' || data.department == 'Laboratory' || data.department == 'Radiology' || data.department == 'Theatre' || data.department == 'Account' || data.department == 'Audit');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {

        })
      })
    });
  }

  sendNotificationOnCredit(branch) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: `${this.makepayment.expenseproduct} Payment Notification`,
      department: 'Pharmacy Store',
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${this.data.pharmacystore.unitstock} ${this.makepayment.expenseproduct} has been taken on credit from vendor on ${this.makepayment.date}`,
      sourceid: this.makepayment.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == 'GOPD Pharmacy' || data.department == 'Laboratory' || data.department == 'Radiology' || data.department == 'Theatre' || data.department == 'Account' || data.department == 'Audit');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {

        })
      })
    });
  }

  paymentDone(event) {
    console.log('Online Payment');
    this.makepayment.isonlinepayment = true;
  }

  payOnCredit() {
    this.pouchService.getStaff(this.localStorageItem).then(item => {
      this.makepayment.branch = item.branch;
      this.makepayment.staffname = item.firstname + '' + item.lastname;
      this.makepayment.staffposition = item.position;
      this.makepayment.expensename = 'Payment of ' + this.makepayment.expenseproduct

      this.makepayment.date = new Date(this.makepayment.date).toString();
      this.pouchService.saveExpense(this.makepayment).then(results => {
        this.data.pharmacystore.expenseid = results.id;

        if (this.makepayment.isoncredit == true) {
          this.data.pharmacystore.isoncredit = true;
          this.data.pharmacystore.isowing = false;
          this.data.pharmacystore.iscompletepayment = false;
          this.sendNotificationOnCredit(this.makepayment.branch);
        }
        else if (this.makepayment.amount < this.data.pharmacystore.stockvalue) {
          this.data.pharmacystore.isowing = true;
          this.data.pharmacystore.isoncredit = false;
          this.data.pharmacystore.iscompletepayment = false;
          this.sendNotificationIsOwing(this.makepayment.branch);
        }
        else if (this.makepayment.amount >= this.data.pharmacystore.stockvalue) {
          this.data.pharmacystore.iscompletepayment = true;
          this.data.pharmacystore.isoncredit = false;
          this.data.pharmacystore.isowing = false;
          this.sendNotification(this.makepayment.branch);
        }
        this.pouchService.updateProduct(this.data.pharmacystore).then(data => {

        });

        this.toastr.success('Payment has been made on credit');
        this.dialogRef.close(true);
      });
    });
  }

  payOffline() {
    this.pouchService.getStaff(this.localStorageItem).then(item => {
      this.makepayment.branch = item.branch;
      this.makepayment.branch = item.branch;
      this.makepayment.staffname = item.firstname + '' + item.lastname;
      this.makepayment.staffposition = item.position;
      this.makepayment.expensename = 'Payment of ' + this.makepayment.expenseproduct;

      this.makepayment.date = new Date(this.makepayment.date).toString();;
      this.pouchService.saveExpense(this.makepayment).then(results => {
        this.data.pharmacystore.expenseid = results.id;
        if (this.makepayment.isoncredit == true) {
          this.data.pharmacystore.isoncredit = true;
          this.data.pharmacystore.isowing = false;
          this.data.pharmacystore.iscompletepayment = false;
          this.updateProduct(this.data.pharmacystore);
          this.sendNotificationOnCredit(this.makepayment.branch);
        }
        else if (this.makepayment.amount < this.data.pharmacystore.stockvalue) {
          this.data.pharmacystore.isowing = true;
          this.data.pharmacystore.isoncredit = false;
          this.data.pharmacystore.iscompletepayment = false;
          this.updateProduct(this.data.pharmacystore);
          this.sendNotificationIsOwing(this.makepayment.branch);
        }
        else if (this.makepayment.amount >= this.data.pharmacystore.stockvalue) {
          this.data.pharmacystore.iscompletepayment = true;
          this.data.pharmacystore.isoncredit = false;
          this.data.pharmacystore.isowing = false;
          this.updateProduct(this.data.pharmacystore);
          this.sendNotification(this.makepayment.branch);
        }
        this.toastr.success('Payment has been made');
        this.dialogRef.close(true);
      });
    });

  }

  updateProduct(product) {
    this.pouchService.updateProduct(product).then(data => {

    });
  }

}
