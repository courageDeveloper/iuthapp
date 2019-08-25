import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { PouchService } from '../../../providers/pouch-service';
import { DispatchedProducts } from '../../../model/dispatchedproduct';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dispatch-form-pharmacystore',
  templateUrl: './dispatch-form-pharmacystore.component.html',
  styleUrls: ['./dispatch-form-pharmacystore.component.css']
})
export class DispatchFormPharmacyStoreComponent implements OnInit {
  title;
  isChecked = false;
  isCheckedPacket = false;
  isCheckedItem = false;
  dispatchedProducts: DispatchedProducts;
  files: FileList;
  isEditTotalItem = false
  departments: any[];
  localStorageItem: any;
  errorMessage: any;
  isError = false;

  dispatchProductForm = new FormGroup({
    id: new FormControl(),
    rev: new FormControl(),
    productname: new FormControl(),
    productid: new FormControl(),
    dispatchdepartment: new FormControl(),
    dispatched: new FormControl(),
    datedispatched: new FormControl(),
    branch: new FormControl(),
    unitquantity: new FormControl(),
    return: new FormControl(),
    sourcedepartment: new FormControl(),
    sales: new FormControl()
  });

  constructor(private router: Router, public pouchService: PouchService, public toastr: ToastrService, public dialogRef: MatDialogRef<DispatchFormPharmacyStoreComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder) {
    if (this.data.action == 'dispatch') {
      this.title = 'Dispatch';
      this.data.pharmacystore;
      this.dispatchedProducts = {
        id: Math.round((new Date()).getTime()).toString(),
        rev: '',
        productname: this.data.pharmacystore.productname,
        productid: this.data.pharmacystore.id,
        dispatchdepartment: '',
        sourcedepartment: this.data.pharmacystore.store,
        dispatched: false,
        datedispatched: new Date(),
        branch: '',
        unitquantity: 0,
        return: false,
        sales: []
      }
    }

  }

  ngOnInit() {
    this.pouchService.getCounterProducts().then(items => {
      console.log(items);
    });
    this.errorMessage = "";
    if (this.data.pharmacystore.unitstock <= 0) {
      this.errorMessage = "You can not dispatch this item as it is out of stock.";
      this.isError = true;
    }

    if (this.data.pharmacystore)
      this.localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.departments = ['Main Pharmacy', 'GOPD Pharmacy', 'Laboratory', 'Radiology', 'Central Store', 'Theatre'];

    this.dispatchProductForm = this.formBuilder.group({
      id: [this.dispatchedProducts.id],
      rev: [this.dispatchedProducts.rev],
      productname: [{ disabled: this.dispatchedProducts.productname }],
      productid: [this.dispatchedProducts.productid],
      dispatchdepartment: [this.dispatchedProducts.dispatchdepartment],
      dispatched: [this.dispatchedProducts.dispatched],
      datedispatched: [this.dispatchedProducts.datedispatched],
      branch: [this.dispatchedProducts.branch],
      sourcedepartment: [this.dispatchedProducts.sourcedepartment],
      unitquantity: [this.dispatchedProducts.unitquantity],
      return: [this.dispatchedProducts.return],
      sales: []
    });

    this.dispatchProductForm.controls.productname.disable();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkQuantity() {
    this.errorMessage = "";
    var currentUnitStock = this.data.pharmacystore.unitstock - this.dispatchedProducts.unitquantity;
    if (currentUnitStock < 0) {
      this.errorMessage = "You can not dispatch this item as it is out of stock.";
      this.isError = true;
    }
  }

  sendNotification(branch) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: `${this.dispatchedProducts.productname} Dispatch Notification`,
      department: 'Pharmacy Store',
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${this.dispatchedProducts.unitquantity} ${this.dispatchedProducts.productname} has been dispatched to ${this.dispatchedProducts.dispatchdepartment}`,
      sourceid: this.dispatchedProducts.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == 'GOPD Pharmacy' || data.department == 'Laboratory' || data.department == 'Radiology' || data.department == 'Theatre' || data.department == 'Account' || data.department == 'Audit');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {

        })
      })
    });
  }

  submit() {
    this.dispatchedProducts.dispatched = true;
    this.pouchService.getStaff(this.localStorageItem).then(item => {
      this.dispatchedProducts.branch = item.branch;

      this.dispatchedProducts.datedispatched = new Date(this.dispatchedProducts.datedispatched).toString();;
      this.pouchService.saveDispatchedProduct(this.dispatchedProducts).then(results => {
        this.pouchService.getProductcategory(this.data.pharmacystore.productcatid).then(item => {
          this.data.pharmacystore.unitstock = this.data.pharmacystore.unitstock - this.dispatchedProducts.unitquantity;
          this.data.pharmacystore.totalsubitem = this.data.pharmacystore.totalsubitem - this.dispatchedProducts.unitquantity * item.subitemno;
            this.data.pharmacystore.stockvalue = this.data.pharmacystore.unitstock * item.costprice;

          this.pouchService.updateProduct(this.data.pharmacystore);
          var counterProduct = {
            id: Math.round((new Date()).getTime()).toString(),
            rev: '',
            productname: this.data.pharmacystore.productname,
            productimage: this.data.pharmacystore.productimage,
            productcategory: item.subgroup,
            productid: this.data.pharmacystore.id,
            datesupplied: this.dispatchedProducts.datedispatched,
            branch: item.branch,
            department: this.dispatchedProducts.dispatchdepartment,
            suppliedunit: this.dispatchedProducts.unitquantity,
            totalsubitem: this.dispatchedProducts.unitquantity * item.subitemno,
            color: '',
            errormessage: '',
            return: false,
            barcode: '',
            isexpired: this.data.pharmacystore.isexpired,
            sales: []
          }

          this.pouchService.saveCounterProduct(counterProduct);
          this.sendNotification(this.dispatchedProducts.branch);
          this.toastr.success('Product has been dispatched');
          this.dialogRef.close(true);
        });
      });
    });
    //add notification

  }

}
