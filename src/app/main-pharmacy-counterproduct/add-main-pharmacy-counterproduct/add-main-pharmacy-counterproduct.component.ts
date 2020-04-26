import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import * as _ from 'lodash' // to help loop over files more succinctly
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { PouchService } from '../../../providers/pouch-service'
import { CounterProducts } from '../../../model/counterproduct'
import { DomSanitizer } from '@angular/platform-browser'
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router'

@Component({
  selector: 'app-add-main-pharmacy-counterproduct',
  templateUrl: './add-main-pharmacy-counterproduct.component.html',
  styleUrls: ['./add-main-pharmacy-counterproduct.component.css'],
})
export class AddMainPharmacyCounterProductComponent implements OnInit {
  title
  public counterProduct: CounterProducts
  counterProducts = []
  files: FileList
  isEditTotalItem = false
  costPrice = 0
  subItem = 0
  localStorageItem: any
  isAdmin = false

  counterProductForm = new FormGroup({
    id: new FormControl(),
    rev: new FormControl(),
    productname: new FormControl(),
    productimage: new FormControl(),
    productcategory: new FormControl(),
    productid: new FormControl(),
    datesupplied: new FormControl(),
    branch: new FormControl(),
    department: new FormControl(),
    suppliedunit: new FormControl(),
    totalsubitem: new FormControl(),
    color: new FormControl(),
    errormessage: new FormControl(),
    isexpired: new FormControl(),
    return: new FormControl(),
    barcode: new FormControl(),
    sourcedepartment: new FormControl(),
    unitsellingprice: new FormControl(),
    isUnitSelling: new FormControl(),
    subitemsellingprice: new FormControl(),
    expirydate: new FormControl(),
    productcatid: new FormControl(),
    costprice: new FormControl(),
    dispatchid: new FormControl(),
    refund: new FormControl(),
    isnoticed: new FormControl(),
    isquantitynoticed: new FormControl(),
    sales: new FormControl(),
  })

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<AddMainPharmacyCounterProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    public _DomSanitizer: DomSanitizer,
    public pouchService: PouchService,
    private formBuilder: FormBuilder,
  ) {
    if (this.data.action == 'add') {
      this.title = 'Add'
      this.counterProduct = {
        id: Math.round(new Date().getTime()).toString(),
        rev: '',
        productname: '',
        productimage: '',
        productcategory: '',
        productid: '',
        datesupplied: new Date(),
        branch: '',
        department: 'Main Pharmacy',
        suppliedunit: 0,
        totalsubitem: 0,
        color: '',
        errormessage: '',
        isexpired: false,
        return: false,
        isUnitSelling: true,
        barcode: '',
        sourcedepartment: '',
        unitsellingprice: 0,
        subitemsellingprice: 0,
        expirydate: new Date(),
        productcatid: '',
        costprice: 0,
        dispatchid: '',
        refund: false,
        isnoticed: false,
        isquantitynoticed: false,
        sales: [],
      }
    } else {
      this.title = 'Edit'
      data.counterproduct.datesupplied = new Date(
        data.counterproduct.datesupplied,
      )
      data.counterproduct.expirydate = new Date(data.counterproduct.expirydate)
      this.counterProduct = data.counterproduct
    }
    this.checkDepartment()
  }

  ngOnInit() {
    this.localStorageItem = JSON.parse(localStorage.getItem('user'))

    this.counterProductForm = this.formBuilder.group({
      id: [this.counterProduct.id],
      rev: [this.counterProduct.rev],
      productname: [this.counterProduct.productname],
      productimage: [this.counterProduct.productimage],
      productcategory: [this.counterProduct.productcategory],
      productid: [this.counterProduct.productid],
      datesupplied: [this.counterProduct.datesupplied],
      branch: [this.counterProduct.branch],
      department: [this.counterProduct.department],
      suppliedunit: [this.counterProduct.suppliedunit],
      totalsubitem: [this.counterProduct.totalsubitem],
      color: [this.counterProduct.color],
      errormessage: [this.counterProduct.errormessage],
      isexpired: [this.counterProduct.isexpired],
      return: [this.counterProduct.return],
      barcode: [this.counterProduct.barcode],
      sourcedepartment: [this.counterProduct.sourcedepartment],
      unitsellingprice: [this.counterProduct.unitsellingprice],
      subitemsellingprice: [this.counterProduct.subitemsellingprice],
      isUnitSelling: [this.counterProduct.isUnitSelling],
      expirydate: [this.counterProduct.expirydate],
      productcatid: [this.counterProduct.productcatid],
      costprice: [this.counterProduct.costprice],
      dispatchid: [this.counterProduct.dispatchid],
      refund: [this.counterProduct.refund],
      isnoticed: [this.counterProduct.isnoticed],
      isquantitynoticed: [this.counterProduct.isquantitynoticed],
      sales: [this.counterProduct.sales],
    })
    this.counterProductForm.controls['productname'].disable()
    this.counterProductForm.controls['suppliedunit'].disable()
    var localStorageItem = JSON.parse(localStorage.getItem('user'))
    this.pouchService.getStaff(localStorageItem).then(staff => {
      console.log(staff.department)
      if (staff.department == 'Admin') {
        this.isAdmin = true;
        this.counterProductForm.controls['suppliedunit'].enable()
      }
    })
    this.counterProductForm.controls['datesupplied'].disable()
    this.counterProductForm.controls['expirydate'].disable()
    this.counterProductForm.controls['costprice'].disable()
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  handleFiles(event) {
    var myThis = this
    this.files = event.target.files
    var reader = new FileReader()
    reader.readAsDataURL(this.files[0])
    reader.onloadend = function() {
      myThis.counterProduct.productimage = reader.result
    }
    reader.onerror = function(error) {
      console.log('Error: ', error)
    }
  }

  edit() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'))
    this.pouchService.getStaff(localStorageItem).then(item => {
      this.counterProduct.branch = item.branch
      this.counterProduct.datesupplied = new Date(
        this.counterProduct.datesupplied,
      ).toString()
      this.counterProduct.expirydate = new Date(
        this.counterProduct.expirydate,
      ).toString()
      this.pouchService.updateCounterProduct(this.counterProduct).then(res => {
        this.toastr.success('Product has been updated')
        this.dialogRef.close(true)
        this.sendNotification(this.counterProduct.branch)
      })
    })
  }

  checkDepartment() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'))
    this.pouchService.getStaff(localStorageItem).then(staff => {
      if (staff.department == 'Admin') {
        this.isAdmin = true
      }
    })
  }

  sendNotification(branch) {
    var notification = {
      id: Math.round(new Date().getTime()).toString(),
      rev: '',
      name: `${this.counterProduct.productname} Supply Notification`,
      department: 'Main Pharmacy',
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${this.counterProduct.productname} selling price has been added at Main Pharmacy`,
      sourceid: this.counterProduct.id,
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch)
      staffs = staffs.filter(
        data =>
          data.department == 'Main Pharmacy' ||
          data.department == this.counterProduct.sourcedepartment ||
          data.department == 'Account' ||
          data.department == 'Audit',
      )
      staffs.forEach(staff => {
        staff.notification.push(notification)
        this.pouchService.updateStaff(staff).then(result => {})
      })
    })
  }
}
