import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../providers/pouch-service';
import { Patient } from '../../model/patient';
import {ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {
  sexes: any[];
  public patient: Patient;
  errorMessageUser;
  errorMessage;
  currentUseremail;
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

  constructor(private formBuilder: FormBuilder, public toastr: ToastrService, public pouchService: PouchService, private activatedRoute: ActivatedRoute ) {
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
    let id = this.activatedRoute.snapshot.params['id'];
    this.pouchService.getPatient(id).then(item => {
      item.dob = new Date(item.dob);
      item.dateofregistration = new Date(item.dateofregistration);
      this.patient = item;
      this.currentUseremail = item.email;
    });
  
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
        if (this.patient.email == item.email && item.email != this.currentUseremail) {
          this.errorMessage = "This email already exists";
          this.disabled = true;
        }
      })
    })
  }

  submit() {
    this.patient.dob = new Date(this.patient.dob).toString();
    this.patient.dateofregistration = new Date(this.patient.dateofregistration).toString();
    this.pouchService.updatePatient(this.patient).then(res => {
      this.toastr.success('Patient has been updated successfully');
      this.patient.dob = new Date(res.dob);
      this.patient.dateofregistration = new Date(res.dateofregistration);
    });
  }

}
