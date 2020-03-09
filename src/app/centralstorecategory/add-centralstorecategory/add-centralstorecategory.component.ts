import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../../providers/pouch-service';
import { ProductCategory } from '../../../model/productcategory';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-centralstorecategory',
  templateUrl: './add-centralstorecategory.component.html',
  styleUrls: ['./add-centralstorecategory.component.css']
})
export class AddCentralStoreCategoryComponent implements OnInit {
  title;
  isChecked = false;
  isCheckedPacket = false;
  public productcategory: ProductCategory;
  productCategoryForm = new FormGroup({
    id: new FormControl(),
    rev: new FormControl(),
    subgroup: new FormControl(),
    costprice: new FormControl(),
    productname: new FormControl(),
    subitemno: new FormControl(),
    branch: new FormControl(),
    department: new FormControl(),
    products: new FormControl()
  });

  constructor(public dialogRef: MatDialogRef<AddCentralStoreCategoryComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public toastr: ToastrService, public pouchService: PouchService, private formBuilder: FormBuilder, ) {
    this.productcategory = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      productname: '',
      subgroup: '',
      costprice: 0,
      subitemno: 1,
      branch: '',
      department: 'Central Store',
      products: []
    }
  }

  ngOnInit() {  
    if (this.data.action == 'add') {
      this.title = 'Add';
    }
    else {
      this.title = 'Edit';
      this.productcategory = this.data.centralstorecategory;
    }

    this.productCategoryForm = this.formBuilder.group({
      id: [this.productcategory.id],
      rev: [this.productcategory.rev],
      productname: [this.productcategory.productname],
      subgroup: [this.productcategory.subgroup],
      costprice: [this.productcategory.costprice],
      branch: [this.productcategory.branch],
      department: [this.productcategory.department],
      subitemno: [this.productcategory.subitemno],
      products: [this.productcategory.products]
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      this.productcategory.branch = item.branch;
      this.pouchService.saveProductcategory(this.productcategory).then(res => {
        this.toastr.success('Category has been added');
        this.dialogRef.close(true);
      });
    });
  }

  edit() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      this.productcategory.branch = item.branch;
      this.pouchService.updateProductcategory(this.productcategory).then(res => {
        this.toastr.success('Category has been updated');
        this.dialogRef.close(true);
      });
    })
  }

}
