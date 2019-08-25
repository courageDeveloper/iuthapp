import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.css']
})
export class AddExpensesComponent implements OnInit {
  title;

  constructor(public dialogRef: MatDialogRef<AddExpensesComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    if (this.data.action == 'add') {
      this.title = 'Add';
    }
    else {
      this.title = 'Edit';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isActiveToggleTextPassword: Boolean = true;
  toggleTextPassword(): void {
    this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword == true) ? false : true;
  }

  getType() {
    return this.isActiveToggleTextPassword ? 'password' : 'text';
  }


}
