import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'

@Component({
  selector: 'app-expensedialogmessage',
  templateUrl: './expensedialogmessage.component.html',
  styleUrls: ['./expensedialogmessage.component.css']
})
export class ExpensedialogmessageComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ExpensedialogmessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(){
    this.dialogRef.close();
   }

}
