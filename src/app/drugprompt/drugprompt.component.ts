import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'

@Component({
  selector: 'app-drugprompt',
  templateUrl: './drugprompt.component.html',
  styleUrls: ['./drugprompt.component.css']
})
export class DrugpromptComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DrugpromptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(){
    this.dialogRef.close();
   }

}
