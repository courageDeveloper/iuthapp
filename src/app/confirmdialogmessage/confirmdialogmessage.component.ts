import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'

@Component({
  selector: 'app-confirmdialogmessage',
  templateUrl: './confirmdialogmessage.component.html',
  styleUrls: ['./confirmdialogmessage.component.css']
})
export class ConfirmdialogmessageComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmdialogmessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(){
    this.dialogRef.close();
   }

}
