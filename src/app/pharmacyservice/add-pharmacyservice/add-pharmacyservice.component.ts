import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-pharmacyservice',
  templateUrl: './add-pharmacyservice.component.html',
  styleUrls: ['./add-pharmacyservice.component.css']
})
export class AddPharmacyServiceComponent implements OnInit {
  title;
  isChecked = false;
  isCheckedPacket = false;
  serviceArray = [];

  constructor(public dialogRef: MatDialogRef<AddPharmacyServiceComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

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


  selectedCarton(event) {
     this.isChecked = (event.checked == true) ? true : false;
  }

  selectedPacket(event) {
    this.isCheckedPacket = (event.checked == true) ? true : false;
  }

}
