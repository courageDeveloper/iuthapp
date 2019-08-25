import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-payroll',
  templateUrl: './add-payroll.component.html',
  styleUrls: ['./add-payroll.component.css']
})
export class AddPayrollComponent implements OnInit {
  staffArray = [];
  title;

  constructor(public dialogRef: MatDialogRef<AddPayrollComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    if (this.data.action == 'add') {
      this.title = 'Pay';
    }
    else {
      this.title = 'Edit';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isActiveToggleTextPassword: Boolean = true;
  toggleTextPassword(): void{
    this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword == true) ? false : true;
  }

  getType() {
    return this.isActiveToggleTextPassword ? 'password' : 'text';
  }

  selectedPayLoan(event) {

  }

}
