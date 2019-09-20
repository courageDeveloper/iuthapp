import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PouchService } from '../../providers/pouch-service';

@Component({
  selector: 'app-evacuateerror',
  templateUrl: './evacuateerror.component.html',
  styleUrls: ['./evacuateerror.component.css']
})
export class EvacuateerrorComponent implements OnInit {
  parsedData: any;

  constructor(public pouchService: PouchService, public dialogRef: MatDialogRef<EvacuateerrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
     this.parsedData = this.data.content;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  
}
