import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../providers/pouch-service';
import { Patient } from '../../model/patient';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {
  sexes: any[];
  public patient: Patient;
  errorMessageUser;
  errorMessage;
  disabled = false;
  emailValidate = "[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})";
  patientForm = new FormGroup({
    id: new FormControl(),
    rev: new FormControl(),
    firstname: new FormControl(),
    lastname: new FormControl(),
    branch: new FormControl(),
    department: new FormControl(),
    dob: new FormControl(),
    patientno: new FormControl(),
    position: new FormControl(),
    mobile: new FormControl(),
    address: new FormControl(),
    email: new FormControl(),
    dateofregistration: new FormControl(),
    sex: new FormControl(),
    debt: new FormControl(),
    sales: new FormControl()
  });

  constructor(private formBuilder: FormBuilder, public toastr: ToastrService, public pouchService: PouchService, ) {
    this.patient = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      firstname: '',
      lastname: '',
      branch: '',
      department: '',
      dob: new Date(),
      patientno: '',
      position: '',
      mobile: '',
      address: '',
      email: '',
      debt: 0,
      dateofregistration: new Date(),
      sex: 'Male',
      sales: []
    }

  }

  ngOnInit() {
  
    this.sexes = ['Male', 'Female'];

    this.patientForm = this.formBuilder.group({
      id: [this.patient.id],
      rev: [this.patient.rev],
      firstname: [this.patient.firstname],
      lastname: [this.patient.lastname],
      branch: [this.patient.branch],
      department: [this.patient.department],
      dob: [this.patient.dob],
      patientno: [this.patient.patientno],
      position: [this.patient.position],
      mobile: [this.patient.mobile],
      address: [this.patient.address],
      debt: [this.patient.debt],
      email: [this.patient.email, Validators.compose([Validators.pattern(this.emailValidate)])],
      dateofregistration: [this.patient.dateofregistration],
      sex: [this.patient.sex],
      sales: [this.patient.sales]
    })
  }

  isActiveToggleTextPassword: Boolean = true;
  toggleTextPassword(): void {
    this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword == true) ? false : true;
  }

  getType() {
    return this.isActiveToggleTextPassword ? 'password' : 'text';
  }

  checkEmail() {
    this.disabled = false;
    this.errorMessage = "";
    this.pouchService.getPatients().then(data => {
      data.forEach(item => {
        if (this.patient.email == item.email) {
          this.errorMessage = "This email already exists";
          this.disabled = true;
        }
      })
    })
  }

  submit() {
    this.patient.dob = new Date(this.patient.dob).toString();
    this.patient.dateofregistration = new Date(this.patient.dateofregistration).toString();
    this.pouchService.savePatient(this.patient).then(res => {
      this.toastr.success('Patient has been registered successfully');
      this.patient = {
        id: Math.round((new Date()).getTime()).toString(),
        rev: '',
        firstname: '',
        lastname: '',
        branch: '',
        department: '',
        dob: new Date(),
        patientno: '',
        position: '',
        mobile: '',
        address: '',
        debt: 0,
        email: '',
        dateofregistration: new Date(),
        sex: 'Male',
        sales: []
      }
    });
  }

}
