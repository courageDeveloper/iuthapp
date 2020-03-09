import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../providers/pouch-service';
import { Vendor } from '../../model/vendor';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.css']
})
export class AddVendorComponent implements OnInit {
  sexes: any[];
  public vendor: Vendor;
  branchNames: any[];
  departmentNames: any[];
  errorMessageUser;
  errorMessage;
  checkboxes: any;
  disabled = false;
  emailValidate = "[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})";
  vendorForm = new FormGroup({
    id: new FormControl(),
    rev: new FormControl(),
    fullname: new FormControl(),
    branch: new FormControl(),
    mobile: new FormControl(),
    address: new FormControl(),
    email: new FormControl(),
    dateofregistration: new FormControl(),
    balance: new FormControl(),
    bankname: new FormControl(),
    accountnumber: new FormControl(),
    expenses: new FormControl()
  });

  constructor(public toastr: ToastrService, public pouchService: PouchService, private formBuilder: FormBuilder, private router: Router) {
    this.vendor = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      fullname: '',
      branch: '',
      mobile: '',
      address: '',
      email: '',
      dateofregistration: new Date(),
      bankname: '',
      accountnumber: '',
      balance: 0,
      expenses: []
    }
  }

  ngOnInit() {
    this.branchNames = ['IUTH(Okada)', 'Benin Centre'];

    this.vendorForm = this.formBuilder.group({
      id: [this.vendor.id],
      rev: [this.vendor.rev],
      fullname: [this.vendor.fullname],
      branch: [this.vendor.branch],
      mobile: [this.vendor.mobile],
      address: [this.vendor.address],
      email: [this.vendor.email, Validators.compose([Validators.pattern(this.emailValidate)])],
      dateofregistration: [this.vendor.dateofregistration],
      balance: [this.vendor.balance],
      accountnumber: [this.vendor.accountnumber],
      bankname: [this.vendor.bankname],
      expenses: [this.vendor.expenses]
    });

  }

  checkEmail() {
    this.disabled = false;
    this.errorMessage = "";
    this.pouchService.getVendors().then(data => {
      data.forEach(item => {
        if (this.vendor.email == item.email && this.vendor.email != "") {
          this.errorMessage = "This email already exists";
          this.disabled = true;
        }
      })
    })
  }

  submit() {
    this.vendor.dateofregistration = new Date(this.vendor.dateofregistration).toString();
    this.pouchService.saveVendor(this.vendor).then(res => {
      this.toastr.success('Vendor has been registered successfully');
      this.vendor = {
        id: Math.round((new Date()).getTime()).toString(),
        rev: '',
        fullname: '',
        branch: '',
        mobile: '',
        address: '',
        email: '',
        dateofregistration: new Date(),
        bankname: '',
        accountnumber: '',
        balance: 0,
        expenses: []
      }
    });
  }

}
