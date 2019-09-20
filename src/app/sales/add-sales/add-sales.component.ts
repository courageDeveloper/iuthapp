import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Sales } from '../../../model/sales';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Patient } from '../../../model/patient';
import { PouchService } from '../../../providers/pouch-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-sales',
  templateUrl: './add-sales.component.html',
  styleUrls: ['./add-sales.component.css']
})
export class AddSalesComponent implements OnInit {
  title;
  sales: Sales;
  isDepartment = false;
  staffArray: any[];
  patientsArray: any[];
  individuals: Array<Patient> = [];
  departments: any;
  disableBalance = false;
  departmentName: any;
  individualName: any;
  individual: any;
  department: any;

  salesForm = new FormGroup({
    id: new FormControl(),
    rev: new FormControl(),
    department: new FormControl(),
    amountloaned: new FormControl(),
    amountpayable: new FormControl(),
    loanstatus: new FormControl(),
    departmentloaned: new FormControl(),
    individualloanid: new FormControl(),
    departmentloaning: new FormControl(),
    dateofloan: new FormControl(),
    salename: new FormControl(),
    amount: new FormControl(),
    description: new FormControl(),
    color: new FormControl(),
    date: new FormControl(),
    iscomplete: new FormControl(),
    isowing: new FormControl(),
    isoncredit: new FormControl(),
    staffloan: new FormControl(),
    departmentloan: new FormControl(),
    balance: new FormControl(),
    departmentid: new FormControl(),
    patientid: new FormControl(),
    isreconciled: new FormControl(),
    isevacuated: new FormControl(),
    evacuatedmessage: new FormControl(),
    branch: new FormControl(),
    posproduct: new FormControl(),
    referencenumber: new FormControl(),
    serviceorder: new FormControl(),
    productorder: new FormControl(),
    products: new FormControl(),
    services: new FormControl()
  });

  constructor(public dialogRef: MatDialogRef<AddSalesComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public toastr: ToastrService, public pouchService: PouchService, private formBuilder: FormBuilder) {
    if (this.data.action == 'add') {
      this.title = 'Add';
      this.sales = {
        id: Math.round((new Date()).getTime()).toString(),
        rev: '',
        department: '',
        amountloaned: 0,
        amountpayable: 0,
        loanstatus: false,
        departmentloaned: '',
        individualloanid: '',
        departmentloaning: '',
        dateofloan: new Date(),
        salename: '',
        amount: 0,
        description: '',
        color: '',
        date: new Date(),
        iscomplete: false,
        isowing: false,
        isoncredit: false,
        staffloan: false,
        departmentloan: false,
        balance: 0,
        departmentid: '',
        patientid: '',
        isreconciled: true,
        isevacuated: false,
        evacuatedmessage: '',
        branch: '',
        posproduct: [],
        referencenumber: '',
        serviceorder: [],
        productorder: [],
        products: [],
        services: []
      }
    }
    else {
      this.title = 'Edit';
    }
  }

  ngOnInit() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      if (item.branch == "IUTH(Okada)") {
        this.sales.department = "Revenue";
        this.sales.departmentloaning = "Revenue";
      }
      else if (item.branch == "Benin Centre") {
        this.sales.department = "Account";
        this.sales.departmentloaning = "Account";
      }
    });

    this.loadIndividuals();
    this.loadDepartments();

    this.salesForm = this.formBuilder.group({
      id: [this.sales.id],
      rev: [this.sales.rev],
      department: [this.sales.department],
      amountloaned: [this.sales.amountloaned],
      amountpayable: [this.sales.amountpayable],
      loanstatus: [this.sales.loanstatus],
      departmentloaned: [this.sales.departmentloaned],
      individualloanid: [this.sales.individualloanid],
      departmentloaning: [this.sales.departmentloaning],
      dateofloan: [this.sales.dateofloan],
      salename: [this.sales.salename],
      amount: [this.sales.amount],
      description: [this.sales.description],
      color: [this.sales.color],
      date: [this.sales.date],
      iscomplete: [this.sales.iscomplete],
      isowing: [this.sales.isowing],
      isoncredit: [this.sales.isoncredit],
      staffloan: [this.sales.staffloan],
      departmentloan: [this.sales.departmentloan],
      balance: [this.sales.balance],
      departmentid: [this.sales.departmentid],
      patientid: [this.sales.patientid],
      isreconciled: [this.sales.isreconciled],
      isevacuated: [this.sales.isevacuated],
      evacuatedmessage: [this.sales.evacuatedmessage],
      branch: [this.sales.branch],
      posproduct: [this.sales.posproduct],
      referencenumber: [this.sales.referencenumber],
      serviceorder: [this.sales.serviceorder],
      productorder: [this.sales.productorder],
      products: [this.sales.products],
      services: [this.sales.services]
    });

  }

  loadIndividuals() {
    this.individuals = [];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getStaffs().then(staffs => {
        this.staffArray = staffs;
        this.pouchService.getPatients().then(patients => {
          this.patientsArray = patients;
          this.individuals = this.staffArray.concat(this.patientsArray);
          this.individuals = this.individuals.filter(data => data.branch == staff.branch);
          this.individuals.forEach(patient => {
            var fullname = patient.firstname + ' ' + patient.lastname;
            patient['fullname'] = fullname;
          });
        })
      });
    });
  }

  loadDepartments() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getDepartments().then(departments => {
        this.departments = departments.filter(data => data.branch == staff.branch);
      });
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  onCredit(event) {
    if (event.checked) {
      this.sales.isoncredit = true;
      //this.sales.amount = 0;
      this.sales.amountloaned = this.sales.amount;
      this.sales.loanstatus = true;
      this.sales.balance = 0;
      this.disableBalance = true;
      this.salesForm.controls.balance.disable();
    }
    else {
      this.sales.isoncredit = false;
      this.disableBalance = false;
      this.sales.loanstatus = false;
      this.salesForm.controls.balance.enable();
    }
  }

  selectCurrentIndividual(individual) {
    this.individual = individual;
    this.sales.patientid = individual.id;
  }

  selectCurrentDepartment(department) {
    this.department = department;
    this.sales.departmentid = department.id;
  }

  selectIndividual() {
    this.isDepartment = false;
  }

  selectDepartment() {
    this.isDepartment = true;
  }

  submit() {

    if (this.sales.isoncredit != true) {
      this.sales.amount = this.sales.amount;
    }
    else if(this.sales.isoncredit == true) {
      this.sales.amount = 0;
    }
    this.sales.iscomplete = true;
    if (this.isDepartment) {
      this.sales.individualloanid = this.sales.departmentid;
      this.sales.salename = `Items bought by ${this.departmentName} from ${this.sales.department}`;
    }
    else if (!this.isDepartment) {
      this.sales.individualloanid = this.sales.patientid;
      this.sales.salename = `${this.individualName} bought ${this.sales.salename} from ${this.sales.department}`;
    }

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      this.sales.branch = item.branch;
      if (item.branch == "IUTH(Okada)") {
        this.sales.department = "Revenue";
        this.sales.departmentloaning = "Revenue";
      }
      else if (item.branch == "Benin Centre") {
        this.sales.department = "Account";
        this.sales.departmentloaning = "Account";
      }

      var randomString = this.generateRandomStrings(3);
      this.sales.referencenumber = 'IUTH' + new Date().getTime() + randomString;
      if (this.sales.balance > 0) {
        this.sales.isowing = true;
        this.sales.amount -= this.sales.balance;
      }

      this.pouchService.saveSale(this.sales).then(result => {
        this.dialogRef.close(true);
        if (result != undefined) {
          this.toastr.success('Item has been sold');
          if (result.isoncredit == true) {
            if (!this.isDepartment) {
              this.individualDebt(result.amountloaned);
            }
            else if (this.isDepartment) {
              this.departmentDebt(result.amountloaned);
            }
          }
          if (result.isowing == true) {
            if (!this.isDepartment) {
              this.individualDebt(result.balance);
            }
            else if (this.isDepartment) {
              this.departmentDebt(result.balance);
            }
          }
          if (item.branch == "IUTH(Okada)") {
          this.sendNotification(result.branch, result.salename);
          }
          else if (item.branch == "Benin Centre") { 
            this.sendNotificationBenin(result.branch, result.salename);
          }
        }
        else {
          this.toastr.warning('Failed to sell Item, please try again');
        }
      });
    });
  }

  generateRandomStrings(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  individualDebt(debt) {
    this.individual.debt += debt;
    if (this.individual.patientno != undefined) {
      this.pouchService.updatePatient(this.individual);
    }
    else if (this.individual.staffcode != undefined) {
      this.pouchService.updateStaff(this.individual);
    }
  }

  departmentDebt(debt) {
    this.department.debt += debt;
    this.pouchService.updateDepartment(this.department);
  }

  sendNotification(branch, salename) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: salename,
      department: this.sales.department,
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${salename} on ${this.sales.date} from ${this.sales.department}`,
      sourceid: this.sales.id
    }
    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == 'GOPD Pharmacy' || data.department == 'Laboratory' || data.department == 'Radiology' || data.department == 'Revenue' || data.department == 'Account' || data.department == 'Audit');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {
        })
      })
    });
  }

  sendNotificationBenin(branch, salename) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: salename,
      department: 'Account',
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${salename} on ${this.sales.date} from ${this.sales.department}`,
      sourceid: this.sales.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Admin' || data.department == 'Account');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {

        })
      })
    });
  }

}
