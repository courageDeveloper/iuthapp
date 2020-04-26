import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../providers/pouch-service';
import { Vendor } from '../../model/vendor';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.css']
})
export class EditVendorComponent implements OnInit {
  public vendor: Vendor;
  branchNames: any[];
  departmentNames: any[];
  errorMessageUser;
  isUserPermitted = false;
  checkboxes: any;
  errorMessage;
  currentUseremail;
  isChecked = false;
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


  constructor(public toastr: ToastrService, public pouchService: PouchService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) {
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
    this.pouchService.userPermission().then(result => {
      if (result.department == 'Admin') {
        this.isUserPermitted = true;
      }
    });

    let id = this.activatedRoute.snapshot.params['id'];
    this.pouchService.getVendor(id).then(item => {
      item.dateofregistration = new Date(item.dateofregistration);
      this.vendor = item;
      this.currentUseremail = item.email;
    })

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
        if (this.vendor.email == item.email && item.email != this.currentUseremail && this.vendor.email != "") {
          this.errorMessage = "This email already exists";
          this.disabled = true;
        }
      })
    })
  }

  submit() {
    this.vendor.dateofregistration = new Date(this.vendor.dateofregistration).toString();
    this.pouchService.updateVendor(this.vendor).then(res => {
      this.toastr.success('Staff has been updated successfully');
      this.vendor.dateofregistration = new Date(res.dateofregistration);
    });
  }

}
