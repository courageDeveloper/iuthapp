import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Expenses } from '../../../model/expense';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../../providers/pouch-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-payroll',
  templateUrl: './add-payroll.component.html',
  styleUrls: ['./add-payroll.component.css']
})
export class AddPayrollComponent implements OnInit {
  title;
  payroll: Expenses;
  staffs: any;
  staffposition: any;
  isShown = false;
  initialDebtValue;
  staffDebt;
  payLoan;
  isId = false;
  loans: any;
  debtAmount;
  isExcedeedSalary = false;
  excedeedSalaryMessage = '';
  saleObject: any;
  isClickedPayDebt = false;
  isEvacuate = false;
  isSupervisor = false;
  isRefund = false;
  isPayLoan = false;
  isSaleChanged = false;
  initialAmount: number;

  payrollForm = new FormGroup({
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
    allowancebonus: new FormControl(),
    tax: new FormControl(),
    discount: new FormControl(),
    totalamount: new FormControl(),
    posproduct: new FormControl(),
    referencenumber: new FormControl(),
    serviceorder: new FormControl(),
    productorder: new FormControl(),
    products: new FormControl(),
    services: new FormControl(),
    vendorid: new FormControl(),
    vendordebt: new FormControl(),
    paymentstatus: new FormControl()
  });

  constructor(public dialogRef: MatDialogRef<AddPayrollComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public toastr: ToastrService, public pouchService: PouchService, private formBuilder: FormBuilder) {

    if (this.data.action == 'add') {
      this.title = 'Pay';
      this.payroll = {
        id: Math.round((new Date()).getTime()).toString(),
        rev: '',
        amountloaned: 0,
        amountpayable: 0,
        loanstatus: false,
        departmentname: '',
        staffname: '',
        staffposition: '',
        departmentloaning: '',
        dateofloan: new Date().toString(),
        expensename: '',
        amount: 0,
        isoncredit: false,
        balance: 0,
        expensetype: 'Staff Payroll',
        expenseproduct: '',
        expenseproductid: '',
        description: '',
        isonlinepayment: false,
        departmentid: '',
        staffid: '',
        date: new Date(),
        allowancebonus: 0,
        tax: 0,
        discount: 0,
        totalamount: 0,
        pending: false,
        staffloan: false,
        isreconciled: true,
        iscomplete: false,
        isowing: false,
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
    this.loadStaffs();

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      if (item.branch == "IUTH(Okada)") {
        this.payroll.branch = "IUTH(Okada)";
        this.payroll.departmentname = "Revenue";
      }
      else if (item.branch == "Benin Centre") {
        this.payroll.branch = "Benin Centre";
        this.payroll.departmentname = "Account";
      }
    });

    this.payrollForm = this.formBuilder.group({
      id: [this.payroll.id],
      rev: [this.payroll.rev],
      amountloaned: [this.payroll.amountloaned],
      amountpayable: [this.payroll.amountpayable],
      loanstatus: [this.payroll.loanstatus],
      departmentname: [this.payroll.departmentname],
      staffname: [this.payroll.staffname],
      staffposition: [this.payroll.staffposition],
      departmentloaning: [this.payroll.departmentloaning],
      dateofloan: [this.payroll.dateofloan],
      expensename: [this.payroll.expensename],
      amount: [this.payroll.amount],
      isoncredit: [this.payroll.isoncredit],
      balance: [this.payroll.balance],
      expensetype: [this.payroll.expensetype],
      expenseproduct: [this.payroll.expenseproduct],
      expenseproductid: [this.payroll.expenseproductid],
      description: [this.payroll.description],
      isonlinepayment: [this.payroll.isonlinepayment],
      departmentid: [this.payroll.departmentid],
      staffid: [this.payroll.staffid],
      date: [this.payroll.date],
      pending: [this.payroll.pending],
      staffloan: [this.payroll.staffloan],
      isreconciled: [this.payroll.isreconciled],
      iscomplete: [this.payroll.iscomplete],
      isowing: [this.payroll.isowing],
      allowancebonus: [this.payroll.allowancebonus],
      tax: [this.payroll.tax],
      discount: [this.payroll.discount],
      totalamount: [this.payroll.totalamount],
      color: [this.payroll.color],
      departmentloan: [this.payroll.departmentloan],
      branch: [this.payroll.branch],
      vendorid: [this.payroll.vendorid],
      vendordebt: [this.payroll.vendordebt],
      paymentstatus: [this.payroll.paymentstatus]
    });
    this.payrollForm.controls.amount.disable();
    this.payrollForm.controls.staffposition.disable();

    this.checkRoles();
  }

  checkRoles() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      staff.roles.map(role => {
        if (role.role == "Pay Loan" && role.isChecked == true) {
          this.isPayLoan = true;
        }
      })
    });
  }

  loadStaffs() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getStaffs().then(staffs => {
        this.staffs = staffs.filter(data => data.branch == staff.branch);
        this.staffs.forEach(staff => {
          var fullname = staff.firstname + ' ' + staff.lastname;
          staff['fullname'] = fullname;
        });
      });
    });
  }

  loadOwedSales(staffId) {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {

      this.pouchService.getSales().then(data => {
        this.loans = data.filter(data => data.branch == staff.branch);
        this.loans = this.loans.filter(data => data.isoncredit == true || data.isowing == true);
        this.loans = this.loans.filter(data => data.iscomplete == true);
        this.loans = this.loans.filter(data => data.patientid == staffId);
      });
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectedPayLoan(event) {
    if (event.checked) {
      this.isShown = true;
      /*  this.payLoan = this.payroll.amount;
       this.staffDebt -= this.payLoan; */
    }
    else {
      this.payroll.amount = this.initialAmount;
      this.isSaleChanged = false;
      this.isShown = false;
      this.staffDebt = this.initialDebtValue;
      this.isExcedeedSalary = false;
      this.excedeedSalaryMessage = "";
      /* this.payLoan = 0; */
    }
  }

  staffChanged(staff) {
    this.initialAmount = staff.salary
    this.payroll.staffname = staff.fullname;
    this.payroll.staffid = staff.id;
    this.payroll.staffposition = staff.position;
    this.payroll.amount = staff.salary;
    this.initialDebtValue = staff.debt;
    this.staffDebt = staff.debt;
    if (staff.id) {
      this.isId = true;
    }
    this.loadOwedSales(this.payroll.staffid);

  }

  saleChanged(sale) {
    this.saleObject = sale;
    this.isSaleChanged = true;
    if (this.isSaleChanged) {
      this.payroll.amount += this.payroll.allowancebonus;
      var totalDiscount = this.payroll.discount + this.payroll.tax;
      this.payroll.totalamount = this.payroll.amount - (this.payroll.amount * totalDiscount / 100);
      this.payroll.amount = this.payroll.amount - (this.payroll.amount * totalDiscount / 100);
    }

    if (sale.isoncredit) {
      if (this.payroll.amount <= sale.amountloaned) {
        this.isExcedeedSalary = true;
        this.excedeedSalaryMessage = "Salary can not pay debt at this time, pay on a later date."
      }
      else if (this.payroll.amount >= sale.amountloaned) {
        this.isExcedeedSalary = false;
        this.excedeedSalaryMessage = "";
      }

      this.staffDebt -= sale.amountloaned;
      this.payroll.amount -= sale.amountloaned;
    }
    else if (sale.isowing) {
      if (this.payroll.amount <= sale.balance) {
        this.isExcedeedSalary = true;
        this.excedeedSalaryMessage = "Salary can not pay debt at this time, pay on a later date."
      }
      else if (this.payroll.amount >= sale.balance) {
        this.isExcedeedSalary = false;
        this.excedeedSalaryMessage = "";
      }

      this.staffDebt -= sale.balance;
      this.payroll.amount -= sale.balance;
    }
  }

  payDebt() {
    this.isShown = false;
    this.pouchService.getStaff(this.payroll.staffid).then(result => {
      result.debt = this.staffDebt;
      this.pouchService.updateStaff(result).then(response => {
        this.updateSale()
      });
    });
  }

  updateSale() {
    this.pouchService.getSale(this.saleObject.id).then(result => {
      if (result.isoncredit) {
        result.amountloaned -= this.saleObject.amountloaned;
        result.amount = this.saleObject.amountloaned;
        result.isoncredit = false;
        result.loanstatus = false;
        result.staffloan = false;
      }
      else if (result.isowing) {
        result.balance -= this.saleObject.balance;
        result.amount += this.saleObject.balance;
        result.isowing = false;
      }
      this.pouchService.updateSale(result).then(res => {
        this.loadOwedSales(this.payroll.staffid);
      });
    });
  }

  payOnline() {

  }

  payOffline() {
    if (!this.isSaleChanged) {
      this.payroll.amount = this.payroll.amount + this.payroll.allowancebonus;
      var totalDiscount = this.payroll.discount + this.payroll.tax;
      this.payroll.totalamount = this.payroll.amount - (this.payroll.amount * totalDiscount / 100);
      this.payroll.amount = this.payroll.amount - (this.payroll.amount * totalDiscount / 100);
    }
    this.payroll.date = new Date(this.payroll.date).toString();
    this.payroll.expensename = `Payment of Salary for ${this.payroll.staffname} on ${this.payroll.date}`;
    this.payroll.iscomplete = true;
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      this.pouchService.saveExpense(this.payroll).then(result => {
        this.dialogRef.close(true);
        if (result != undefined) {
          this.toastr.success(`${this.payroll.staffname} has been paid`);
          if (item.branch == "IUTH(Okada)") {
            this.sendNotification(result.branch, result.expensename);
          }
          else if (item.branch == "Benin Centre") {
            this.sendNotificationBenin(result.branch, result.expensename);
          }
        }
        else {
          this.toastr.warning('Failed to pay staff, please try again');
        }
      });
    });
  }

  sendNotification(branch, expensename) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: expensename,
      department: this.payroll.departmentname,
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${expensename} on ${this.payroll.date} by ${this.payroll.departmentname}`,
      sourceid: this.payroll.id
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
      message: `${expensename} on ${this.payroll.date} from ${this.payroll.departmentname}`,
      sourceid: this.payroll.id
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
