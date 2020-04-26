import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../../providers/pouch-service';
import { Damagedproduct } from '../../../model/damagedproduct';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-damagedproducts',
  templateUrl: './add-damagedproducts.component.html',
  styleUrls: ['./add-damagedproducts.component.css']
})
export class AddDamagedproductsComponent implements OnInit {
  title;
  isChecked = false;
  isCheckedPacket = false;
  product: any;
  public damagedproduct: Damagedproduct;
  damagedproductForm = new FormGroup({
    id: new FormControl(),
    rev: new FormControl(),
    name: new FormControl(),
    amount: new FormControl(),
    productid: new FormControl(),
    date: new FormControl(),
    isrefund: new FormControl(),
    isunit: new FormControl(),
    issubitem: new FormControl(),
    description: new FormControl()
  });

  constructor(public dialogRef: MatDialogRef<AddDamagedproductsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, public toastr: ToastrService, public pouchService: PouchService) {

    this.damagedproduct = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: '',
      branch: '',
      productid: '',
      department: '',
      amount: 0,
      date: new Date().toString(),
      isunit: false,
      issubitem: false,
      description: '',
      isrefund: false
    }
  }

  ngOnInit() {
    this.loadRadio();
    if (this.data.action == 'add') {
      this.title = 'Add';
      this.damagedproduct.name = this.data.content.productname;
      this.damagedproduct.productid = this.data.content.id;
      this.product = this.data.content;
    }
    else {
      this.title = 'Edit';
      this.damagedproduct = this.data.content;
    }

    this.damagedproductForm = this.formBuilder.group({
      id: [this.damagedproduct.id],
      rev: [this.damagedproduct.rev],
      name: [this.damagedproduct.name],
      amount: [this.damagedproduct.amount],
      branch: [this.damagedproduct.branch],
      department: [this.damagedproduct.department],
      date: [this.damagedproduct.date],
      isrefund: [this.damagedproduct.isrefund],
      productid: [this.damagedproduct.productid],
      isunit: [this.damagedproduct.isunit],
      issubitem: [this.damagedproduct.issubitem],
      description: [this.damagedproduct.description]
    });
    this.damagedproductForm.controls.name.disable();

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.damagedproduct.branch = staff.branch;
      this.damagedproduct.department = staff.department;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  loadRadio() {
    this.isChecked = true;
    this.damagedproduct.isunit = true;
    this.damagedproduct.issubitem = false;
  }

  selectOption(damagedproduct, event) {
    if (event.value === 'Unit Selected') {
      this.damagedproduct.isunit = true;
      this.damagedproduct.issubitem = false;
    }
    else if (event.value === 'Subitem Selected') {
      this.damagedproduct.issubitem = true;
      this.damagedproduct.isunit = false;
    }
  }

  updateCounterProduct(damagedproduct) {
    if (damagedproduct.isunit) {
      this.product.suppliedunit -= damagedproduct.amount;
    }
    else if (damagedproduct.issubitem) {
      this.product.totalsubitem -= damagedproduct.amount;
    }
    this.pouchService.updateCounterProduct(this.product);
  }

  updateProduct(damagedproduct) {
    if (damagedproduct.isunit) {
      this.product.unitstock -= damagedproduct.amount;
    }
    else if (damagedproduct.issubitem) {
      this.product.totalsubitem -= damagedproduct.amount;
    }
    this.pouchService.updateProduct(this.product);
  }

  submit() {
    if (this.damagedproduct.isunit) {
      this.damagedproduct.description = `${this.damagedproduct.amount} Unit has been destroyed from ${this.damagedproduct.name}`;
    }
    else if (this.damagedproduct.issubitem) {
      this.damagedproduct.description = `${this.damagedproduct.amount} Subitem has been destroyed from ${this.damagedproduct.name}`;
    }
    this.pouchService.saveDamagedproduct(this.damagedproduct).then(res => {
      if (this.product.suppliedunit != undefined) {
        this.updateCounterProduct(res);
      }
      else {
        this.updateProduct(res);
      }
      this.toastr.success('Damaged Product has been recorded');
      this.dialogRef.close(true);
    });
  }

  /* edit() {
    if (this.damagedproduct.isunit) {
      this.damagedproduct.description = `${this.damagedproduct.amount} Unit has been destroyed`;
    }
    else if (this.damagedproduct.issubitem) {
      this.damagedproduct.description = `${this.damagedproduct.amount} Subitem has been destroyed`;
    }
    this.pouchService.updateDamagedproduct(this.damagedproduct).then(res => {
      this.updateProduct(res);
      this.toastr.success('Damaged Product has been updated');
      this.dialogRef.close(true);
    });
  } */

}
