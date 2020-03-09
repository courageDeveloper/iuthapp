import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Expenses } from '../../../model/expense';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../../providers/pouch-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.css']
})
export class AddExpensesComponent implements OnInit {
  title;
  expenses: Expenses;
  disableBalance = false;
  totalAmountPaid: number;
  discountedAmount: number;

  expensesForm = new FormGroup({
    id: new FormControl(),
    rev: new FormControl(),
    department: new FormControl(),
    amountloaned: new FormControl(),
    amountpayable: new FormControl(),
    loanstatus: new FormControl(),
    departmentloaned: new FormControl(),
    individualloanid: new FormControl(),
    departmentloaning: new FormControl(),
    dateofloan: new FormControl(),
    salename: new FormControl(),
    amount: new FormControl(),
    description: new FormControl(),
    color: new FormControl(),
    date: new FormControl(),
    iscomplete: new FormControl(),
    isowing: new FormControl(),
    isoncredit: new FormControl(),
    staffloan: new FormControl(),
    departmentloan: new FormControl(),
    balance: new FormControl(),
    departmentid: new FormControl(),
    patientid: new FormControl(),
    isreconciled: new FormControl(),
    isevacuated: new FormControl(),
    evacuatedmessage: new FormControl(),
    branch: new FormControl(),
    posproduct: new FormControl(),
    allowancebonus: new FormControl(),
    tax: new FormControl(),
    discount: new FormControl(),
    totalamount: new FormControl(),
    referencenumber: new FormControl(),
    serviceorder: new FormControl(),
    productorder: new FormControl(),
    products: new FormControl(),
    services: new FormControl(),
    vendorid: new FormControl(),
    vendordebt: new FormControl(),
    paymentstatus: new FormControl()
  });

  constructor(public dialogRef: MatDialogRef<AddExpensesComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public toastr: ToastrService, public pouchService: PouchService, private formBuilder: FormBuilder) {
    if (this.data.action == 'add') {
      this.title = 'Add';
      this.expenses = {
        id: Math.round((new Date()).getTime()).toString(),
        rev: '',
        amountloaned: 0,
        amountpayable: 0,
        loanstatus: false,
        departmentname: '',
        staffname: '',
        staffposition: '',
        departmentloaning: '',
        dateofloan: new Date(),
        expensename: '',
        amount: 0,
        isoncredit: false,
        balance: 0,
        expensetype: 'Product Payment',
        expenseproduct: '',
        expenseproductid: '',
        description: '',
        isonlinepayment: false,
        departmentid: '',
        staffid: '',
        date: new Date(),
        pending: false,
        staffloan: false,
        isreconciled: true,
        iscomplete: false,
        isowing: false,
        allowancebonus: 0,
        tax: 0,
        discount: 0,
        totalamount: 0,
        color: '',
        departmentloan: false,
        branch: '',
        vendorid: '',
        vendordebt: 0,
        paymentstatus: ''
      }
    }
    else {
      this.title = 'Edit';
    }
  }

  ngOnInit() {
    this.totalAmountPaid = 0;

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      if (item.branch == "IUTH(Okada)") {
        this.expenses.departmentname = item.department;
        this.expenses.departmentloaning = item.department;
      }
      else if (item.branch == "Benin Centre") {
        this.expenses.departmentname = item.department;
        this.expenses.departmentloaning = item.department;
      }
    });

    this.expensesForm = this.formBuilder.group({
      id: [this.expenses.id],
      rev: [this.expenses.rev],
      amountloaned: [this.expenses.amountloaned],
      amountpayable: [this.expenses.amountpayable],
      loanstatus: [this.expenses.loanstatus],
      departmentname: [this.expenses.departmentname],
      staffname: [this.expenses.staffname],
      staffposition: [this.expenses.staffposition],
      departmentloaning: [this.expenses.departmentloaning],
      dateofloan: [this.expenses.dateofloan],
      expensename: [this.expenses.expensename],
      amount: [this.expenses.amount],
      isoncredit: [this.expenses.isoncredit],
      balance: [this.expenses.balance],
      expensetype: [this.expenses.expensetype],
      expenseproduct: [this.expenses.expenseproduct],
      expenseproductid: [this.expenses.expenseproductid],
      description: [this.expenses.description],
      isonlinepayment: [this.expenses.isonlinepayment],
      departmentid: [this.expenses.departmentid],
      staffid: [this.expenses.staffid],
      date: [this.expenses.date],
      allowancebonus: [this.expenses.allowancebonus],
      tax: [this.expenses.tax],
      discount: [this.expenses.discount],
      pending: [this.expenses.pending],
      staffloan: [this.expenses.staffloan],
      isreconciled: [this.expenses.isreconciled],
      iscomplete: [this.expenses.iscomplete],
      totalamount: [this.expenses.totalamount],
      isowing: [this.expenses.isowing],
      color: [this.expenses.color],
      departmentloan: [this.expenses.departmentloan],
      branch: [this.expenses.branch],
      vendorid: [this.expenses.vendorid],
      vendordebt: [this.expenses.vendordebt],
      paymentstatus: [this.expenses.paymentstatus]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCredit(event) {
    if (event.checked) {
      this.expenses.isoncredit = true;
      this.expenses.loanstatus = true;
      this.expenses.balance = 0;
      this.expenses.amount = this.expenses.amount - (this.expenses.amount * this.expenses.discount / 100);
      this.disableBalance = true;
      this.expensesForm.controls.balance.disable();
    }
    else {
      this.expenses.isoncredit = false;
      this.disableBalance = false;
      this.expenses.loanstatus = false;
      this.expensesForm.controls.balance.enable();
    }
  }

  currentAmount() {
    this.totalAmountPaid = this.expenses.amount;
  }

  discounted() {
    this.discountedAmount = this.expenses.amount - (this.expenses.amount * this.expenses.discount / 100);
  }

  submit() {
    this.expenses.totalamount = this.expenses.amount - (this.expenses.amount * this.expenses.discount / 100);
    this.expenses.date = new Date(this.expenses.date).toString();
    if (this.expenses.isoncredit != true) {
      if (this.totalAmountPaid == this.expenses.amount) {
        this.totalAmountPaid = this.totalAmountPaid - (this.totalAmountPaid * this.expenses.discount / 100);
      }
      this.expenses.amount = this.expenses.amount - (this.expenses.amount * this.expenses.discount / 100);
      this.expenses.balance = this.expenses.amount - this.totalAmountPaid;
    }
    else if (this.expenses.isoncredit == true) {
      this.expenses.balance = this.expenses.amount;
      //this.expenses.amount = 0;
    }

    this.expenses.expensename = `${this.expenses.expensename} bought by ${this.expenses.departmentname}`;

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      this.expenses.branch = item.branch;
      if (item.branch == "IUTH(Okada)") {
        this.expenses.departmentname = item.department;
        this.expenses.departmentloaning = item.department;
      }
      else if (item.branch == "Benin Centre") {
        this.expenses.departmentname = item.department;
        this.expenses.departmentloaning = item.department;
      }

      if (this.expenses.balance > 0) {
        this.expenses.isowing = true;
        this.expenses.amount -= this.expenses.balance;
      }
      else if (this.expenses.balance == 0) {
        this.expenses.iscomplete = true;
      }

      this.pouchService.saveExpense(this.expenses).then(result => {
        this.dialogRef.close(true);
        if (result != undefined) {
          this.toastr.success('Item has been Purchased');
          if (item.branch == "IUTH(Okada)") {
            this.sendNotification(result.branch, result.expensename);
          }
          else if (item.branch == "Benin Centre") {
            this.sendNotificationBenin(result.branch, result.expensename);
          }
        }
        else {
          this.toastr.warning('Failed to purchase Item, please try again');
        }
      });
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
