import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { PouchService } from '../../../providers/pouch-service';
import { DispatchedProducts } from '../../../model/dispatchedproduct';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dispatch-form-centralstore',
  templateUrl: './dispatch-form-centralstore.component.html',
  styleUrls: ['./dispatch-form-centralstore.component.css']
})
export class DispatchFormCentralStoreComponent implements OnInit {
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

  constructor(private router: Router, public pouchService: PouchService, public toastr: ToastrService, public dialogRef: MatDialogRef<DispatchFormCentralStoreComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder) {
    if (this.data.action == 'dispatch') {
      this.title = 'Dispatch';
      this.data.centralstore;
      this.dispatchedProducts = {
        id: Math.round((new Date()).getTime()).toString(),
        rev: '',
        productname: this.data.centralstore.productname,
        productid: this.data.centralstore.id,
        dispatchdepartment: '',
        sourcedepartment: this.data.centralstore.store,
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
    console.log(this.data.centralstore);
    this.errorMessage = "";
    if (this.data.centralstore.unitstock <= 0) {
      this.errorMessage = "You can not dispatch this item as it is out of stock.";
      this.isError = true;
    }

    if (this.data.centralstore)
      this.localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.departments = ['Main Pharmacy', 'GOPD Pharmacy', 'Laboratory', 'Radiology', 'Pharmacy Store', 'Theatre'];

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
    var currentUnitStock = this.data.centralstore.unitstock - this.dispatchedProducts.unitquantity;
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
      department: 'Central Store',
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
        this.pouchService.getProductcategory(this.data.centralstore.productcatid).then(item => {
          this.data.centralstore.unitstock = this.data.centralstore.unitstock - this.dispatchedProducts.unitquantity;
          this.data.centralstore.totalsubitem = this.data.centralstore.totalsubitem - this.dispatchedProducts.unitquantity * item.subitemno;
          this.data.centralstore.stockvalue = this.data.centralstore.unitstock * item.costprice;
          this.data.centralstore.isdispatched = true;

          this.pouchService.updateProduct(this.data.centralstore);
          var counterProduct = {
            id: Math.round((new Date()).getTime()).toString(),
            rev: '',
            productname: this.data.centralstore.productname,
            productimage: this.data.centralstore.productimage,
            productcategory: item.subgroup,
            productid: this.data.centralstore.id,
            datesupplied: this.dispatchedProducts.datedispatched,
            branch: item.branch,
            department: this.dispatchedProducts.dispatchdepartment,
            suppliedunit: this.dispatchedProducts.unitquantity,
            totalsubitem: this.dispatchedProducts.unitquantity * item.subitemno,
            color: '',
            errormessage: '',
            return: false,
            sourcedepartment: this.data.centralstore.store,
            unitsellingprice: 0,
            subitemsellingprice: 0,
            costprice: item.costprice,
            expirydate: this.data.centralstore.expiryDate,
            productcatid: this.data.centralstore.productcatid,
            barcode: '',
            dispatchid: results.id,
            refund: false,
            isUnitSelling: true,
            isexpired: this.data.centralstore.isexpired,
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
