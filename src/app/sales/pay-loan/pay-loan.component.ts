import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Sales } from '../../../model/sales';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Patient } from '../../../model/patient';
import { PouchService } from '../../../providers/pouch-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pay-loan',
  templateUrl: './pay-loan.component.html',
  styleUrls: ['./pay-loan.component.css']
})
export class AddPayloanComponent implements OnInit {
  title;
  sales: Sales;
  amount: any;
  amountToPay: any;
  isError = false;
  errorMessage = '';
  globalBalance: any;
  globalAmountLoaned: any;

  constructor(public dialogRef: MatDialogRef<AddPayloanComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public toastr: ToastrService, public pouchService: PouchService) {
    this.title = 'Pay';
    data.loan;
  }

  ngOnInit() {
    if (this.data.loan.isoncredit) {
      this.amountToPay = this.data.loan.amountloaned;
    }
    else if (!this.data.loan.isoncredit) {
      this.amountToPay = this.data.loan.balance;
    }

  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  amountChanged(event) {
    if (this.data.loan.isoncredit) {
      if (this.data.loan.amountloaned < this.amount) {
        this.errorMessage = "You have exceded the amount meant to be paid";
        this.isError = true;
      }
      else {
        this.errorMessage = "";
        this.isError = false;
      }
    }
    else if (!this.data.loan.isoncredit) {
      if (this.data.loan.balance < this.amount) {
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
    if (this.data.loan.isoncredit) {
      this.data.loan.amount = this.amount;
      if (this.amount > 0) {
        this.data.loan.isoncredit = false;
        this.data.loan.loanstatus = false;
        this.data.loan.staffloan = false;
        this.data.loan.departmentloan = false;
      }
      if (this.data.loan.amountloaned - this.amount > 0) {
        this.data.loan.balance = this.data.loan.amountloaned - this.amount;
        this.data.loan.isowing = true;
        this.data.loan.amountloaned = 0
      }
      else if (this.data.loan.amountloaned - this.amount <= 0) {
        this.data.loan.amountloaned = this.data.loan.amountloaned - this.amount;
      }
    }
    else if (!this.data.loan.isoncredit) {
      this.data.loan.amount += this.amount;
      this.data.loan.balance = this.data.loan.balance - this.amount;
      if (this.data.loan.balance <= 0) {
        this.data.loan.isowing = false;
      }
    }
    this.pouchService.updateSale(this.data.loan).then(result => {
      if (this.data.loan.patientid != "") {
        this.staffDebtUpdate(this.data.loan.patientid);
      }
      else if (this.data.loan.patientid == "") {
        this.staffDebtUpdate(this.data.loan.departmentid);
      }
      this.dialogRef.close(true);
    });

  }

  staffDebtUpdate(id) {
    this.pouchService.getStaff(id).then(staff => {
      if (staff != undefined) {
        staff.debt -= this.amount;
        this.pouchService.updateStaff(staff);
      }
      else if (staff == undefined) {
        this.pouchService.getPatient(id).then(patient => {
          if (patient != undefined) {
            patient.debt -= this.amount;
            this.pouchService.updatePatient(patient);
          }
          else if (staff == undefined && patient == undefined) {
            console.log('reached');
            this.pouchService.getDepartment(id).then(department => {
              department.debt -= this.amount;
              this.pouchService.updateDepartment(department);
            });
          }
        });
      }
    });
  }


  sendNotification(branch, salename) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: salename,
      department: this.sales.department,
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${salename} on ${this.sales.date} from ${this.sales.department}`,
      sourceid: this.sales.id
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

  sendNotificationBenin(branch, salename) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: salename,
      department: 'Account',
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${salename} on ${this.sales.date} from ${this.sales.department}`,
      sourceid: this.sales.id
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
