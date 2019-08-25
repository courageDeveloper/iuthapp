import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../../providers/pouch-service';
import { Products } from '../../../model/product';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-centralstore_bc',
  templateUrl: './add-centralstore_bc.component.html',
  styleUrls: ['./add-centralstore_bc.component.css']
})
export class AddCentralStoreBcComponent implements OnInit {
  title;
  public product: Products;
  products = [];
  files: FileList;
  isEditTotalItem = false;
  costPrice = 0;
  subItem = 0;
  localStorageItem: any;


  productForm = new FormGroup({
    id: new FormControl(),
    rev: new FormControl(),
    productname: new FormControl(),
    productimage: new FormControl(),
    subgroup: new FormControl(),
    datesupplied: new FormControl(),
    expiryDate: new FormControl(),
    branch: new FormControl(),
    store: new FormControl(),
    dispatched: new FormControl(),
    color: new FormControl(),
    errormessage: new FormControl(),
    isexpired: new FormControl(),
    isoncredit: new FormControl(),
    iscompletepayment: new FormControl(),
    isowing: new FormControl(),
    refund: new FormControl(),
    productcatid: new FormControl(),
    totalsubitem: new FormControl(),
    expenseid: new FormControl(),
    stockvalue: new FormControl(),
    unitstock: new FormControl(),
    sales: new FormControl()
  });

  constructor(private router: Router, public dialogRef: MatDialogRef<AddCentralStoreBcComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public toastr: ToastrService, public _DomSanitizer: DomSanitizer, public pouchService: PouchService, private formBuilder: FormBuilder) {

    if (this.data.action == 'add') {
      this.title = 'Add';
      this.product = {
        id: Math.round((new Date()).getTime()).toString(),
        rev: '',
        productname: '',
        productimage: '',
        subgroup: '',
        attachments: '',
        datesupplied: new Date(),
        expiryDate: new Date(),
        branch: '',
        color: '',
        errormessage: '',
        expenseid: '',
        isexpired: false,
        store: 'Central Store',
        refund: false,
        totalsubitem: 0,
        productcatid: '',
        unitstock: 0,
        stockvalue: 0,
        isoncredit: false,
        iscompletepayment: false,
        isowing: false,
        sales: []
      }
    }
    else {
      this.title = 'Edit';
      data.centralstorebc.datesupplied = new Date(data.centralstorebc.datesupplied);
      data.centralstorebc.expiryDate = new Date(data.centralstorebc.expiryDate);
      this.product = data.centralstorebc;
    }
  }

  ngOnInit() {
    this.pouchService.getStaffs().then(items => {
       console.log(items);
    });
    this.localStorageItem = JSON.parse(localStorage.getItem('user'));

    this.productForm = this.formBuilder.group({
      id: [this.product.id],
      rev: [this.product.rev],
      productname: [this.product.productname],
      productcatid: [this.product.productcatid],
      productimage: [this.product.productimage],
      subgroup: [this.product.subgroup],
      datesupplied: [this.product.datesupplied],
      expiryDate: [this.product.expiryDate],
      isexpired: [this.product.isexpired],
      isoncredit: [this.product.isoncredit],
      expenseid: [this.product.expenseid],
      iscompletepayment: [this.product.iscompletepayment],
      isowing: [this.product.isowing],
      attachments: [this.product.attachments],
      color: [this.product.color],
      errormessage: [this.product.errormessage],
      branch: [this.product.branch],
      store: [this.product.store],
      refund: [this.product.refund],
      totalsubitem: [this.product.totalsubitem],
      stockvalue: [this.product.stockvalue],
      unitstock: [this.product.unitstock],
      sales: []
    });

    this.pouchService.getProductcategorys().then(items => {
      items = items.filter(data => data.department == 'Central Store' && data.branch == 'Benin Centre')
      this.products = items;
      console.log(this.products);
    });
    this.pouchService.getStaff(this.localStorageItem).then(item => {
      console.log(item);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectProduct(product) {
    if (typeof product !== "string") {
      this.product.productcatid = product.id;
      this.subItem = product.subitemno;
      this.costPrice = product.costprice;
      this.product.subgroup = product.subgroup;
      this.product.productname = product.productname;
      this.totalSubItem();
      this.calculateStockValue();
    }
    this.subItem;
    this.costPrice;

  }

  handleFiles(event) {
    var myThis = this;
    this.files = event.target.files;
    this.product.attachments = this.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.product.attachments);
    reader.onloadend = function() {
      myThis.product.productimage = reader.result;
    }
    reader.onerror = function (error) {
      console.log("Error: ", error);
    }
  }

  totalSubItem() {
    if (this.product.productcatid) {
      this.pouchService.getProductcategory(this.product.productcatid).then(item => {
        this.product.totalsubitem = this.product.unitstock * item.subitemno;
      });
    }
  }

  calculateStockValue() {
    if (this.product.productcatid) {
      this.pouchService.getProductcategory(this.product.productcatid).then(item => {
        this.product.stockvalue = item.costprice * this.product.unitstock;
        this.totalSubItem();
      });
    }
  }

  editTotalItem() {
    this.isEditTotalItem = true;
  }

  closeTotalItem() {
    this.isEditTotalItem = false;
  }

  submit() {
    //Send Notification to accountant
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      this.product.branch = item.branch;

      this.product.datesupplied = new Date(this.product.datesupplied).toString();
      this.product.expiryDate = new Date(this.product.expiryDate).toString();
      this.pouchService.saveProduct(this.product).then(res => {
        this.toastr.success('Product has been added');
        this.dialogRef.close(true);
        this.sendNotification(this.product.branch);
      });
    });
  }

  edit() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      this.product.branch = item.branch;
      this.product.datesupplied = new Date(this.product.datesupplied).toString();
      this.product.expiryDate = new Date(this.product.expiryDate).toString();
      this.pouchService.updateProduct(this.product).then(res => {
        this.toastr.success('Product has been updated');
        this.dialogRef.close(true);
      });
    });
  }

  sendNotification(branch) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: `${this.product.productname} Supply Notification`,
      department: 'Central Store',
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${this.product.unitstock} ${this.product.productname} has been supplied to Central Store for a price of ${this.product.stockvalue} `,
      sourceid: this.product.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == 'Account' || data.department == 'Admin');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {
        })
      })
    });

  }

}
