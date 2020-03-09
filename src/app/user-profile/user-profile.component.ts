import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../providers/pouch-service';
import { Staff } from '../../model/staff';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  sexes: any[];
  public staff: Staff;
  branchNames: any[];
  departmentNames: any[];
  errorMessageUser;
  errorMessage;
  checkboxes: any;
  disabled = false;
  emailValidate = "[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})";
  staffForm = new FormGroup({
    id: new FormControl(),
    rev: new FormControl(),
    username: new FormControl(),
    firstname: new FormControl(),
    lastname: new FormControl(),
    branch: new FormControl(),
    department: new FormControl(),
    dob: new FormControl(),
    staffcode: new FormControl(),
    position: new FormControl(),
    password: new FormControl(),
    salary: new FormControl(),
    debt: new FormControl(),
    accountnumber: new FormControl(),
    bankaccount: new FormControl(),
    mobile: new FormControl(),
    address: new FormControl(),
    email: new FormControl(),
    dateofentry: new FormControl(),
    sex: new FormControl(),
    roles: new FormControl(),
    isswitchedtable: new FormControl(),
    notification: new FormControl(),
    expenses: new FormControl()
  });

  constructor(public toastr: ToastrService, public pouchService: PouchService, private formBuilder: FormBuilder, private router: Router) {
    this.staff = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      username: '',
      firstname: '',
      lastname: '',
      branch: '',
      department: '',
      dob: new Date(),
      staffcode: '',
      position: '',
      password: '',
      salary: 0,
      debt: 0,
      accountnumber: '',
      bankaccount: '',
      mobile: '',
      address: '',
      email: '',
      dateofentry: new Date(),
      sex: 'Male',
      isswitchedtable: false,
      roles: [],
      notification: [],
      expenses: []
    }
  }

  ngOnInit() {
    this.staff.roles = [{ role: 'Supervisor', isChecked: false }, { role: 'Evacuate', isChecked: false }, { role: 'Refund/Return', isChecked: false }, { role: 'Pay Loan', isChecked: false }];

    this.sexes = ['Male', 'Female'];
    this.branchNames = ['IUTH(Okada)', 'Benin Centre'];
    this.departmentNames = ['Pharmacy Store', 'Central Store', 'Main Pharmacy', 'GOPD Pharmacy', 'Laboratory',
      'Radiology', 'Revenue', 'Account', 'Audit', 'Theatre', 'Admin'];

    this.staffForm = this.formBuilder.group({
      id: [this.staff.id],
      rev: [this.staff.rev],
      username: [this.staff.username],
      firstname: [this.staff.firstname],
      lastname: [this.staff.lastname],
      branch: [this.staff.branch],
      department: [this.staff.department],
      dob: [this.staff.dob],
      staffcode: [this.staff.staffcode],
      position: [this.staff.position],
      password: [this.staff.password],
      salary: [this.staff.salary],
      debt: [this.staff.debt],
      accountnumber: [this.staff.accountnumber],
      bankaccount: [this.staff.bankaccount],
      mobile: [this.staff.mobile],
      address: [this.staff.address],
      email: [this.staff.email, Validators.compose([Validators.pattern(this.emailValidate)])],
      dateofentry: [this.staff.dateofentry],
      sex: [this.staff.sex],
      isswitchedtable: [this.staff.isswitchedtable],
      roles: [this.staff.roles],
      notification: [this.staff.notification],
      expenses: [this.staff.expenses]
    })

  }

  changeBranch(branch) {
    if (branch == 'Benin Centre') {
      this.departmentNames = ['Central Store', 'Main Pharmacy', 'Account', 'Admin'];
    }
    else {
      this.departmentNames = ['Pharmacy Store', 'Central Store', 'Main Pharmacy', 'GOPD Pharmacy', 'Laboratory',
        'Radiology', 'Revenue', 'Account', 'Audit', 'Theatre', 'Admin'];
    }
  }

  isActiveToggleTextPassword: Boolean = true;
  toggleTextPassword(): void {
    this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword == true) ? false : true;
  }

  getType() {
    return this.isActiveToggleTextPassword ? 'password' : 'text';
  }

  checkUser() {
    this.disabled = false;
    this.errorMessageUser = "";
    this.pouchService.getStaffs().then(data => {
      data.forEach(item => {
        if (this.staff.username == item.username && this.staff.username != "") {
          this.errorMessageUser = "This User name is already taken";
          this.disabled = true;
        }
      })
    })
  }

  checkEmail() {
    this.disabled = false;
    this.errorMessage = "";
    this.pouchService.getStaffs().then(data => {
      data.forEach(item => {
        if (this.staff.email == item.email && this.staff.email != "") {
          this.errorMessage = "This email already exists";
          this.disabled = true;
        }
      })
    })
  }

  submit() {

    this.staff.dob = new Date(this.staff.dob).toString();
    this.staff.dateofentry = new Date(this.staff.dateofentry).toString();
    this.pouchService.saveStaff(this.staff).then(res => {
      this.toastr.success('Staff has been registered successfully');
      this.staff = {
        id: Math.round((new Date()).getTime()).toString(),
        rev: '',
        username: '',
        firstname: '',
        lastname: '',
        branch: '',
        department: '',
        dob: new Date(),
        staffcode: '',
        position: '',
        password: '',
        salary: 0,
        debt: 0,
        accountnumber: '',
        bankaccount: '',
        mobile: '',
        address: '',
        email: '',
        isswitchedtable: false,
        dateofentry: new Date(),
        sex: 'Male',
        roles: [{ role: 'Supervisor', isChecked: false }, { role: 'Evacuate', isChecked: false }, { role: 'Refund/Return', isChecked: false }, { role: 'Pay Loan', isChecked: false }],
        notification: [],
        expenses: []
      }
    });
  }



  selectCheckbox(event, i) {
    if (event.checked) {
      var role = this.staff.roles[i];
      role.isChecked = true;
    }
    else {
      var role = this.staff.roles[i];
      role.isChecked = false;
    }
  }

}
