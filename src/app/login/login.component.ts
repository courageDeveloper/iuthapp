import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavService } from '../services/nav.service';
import { PouchService } from '../../providers/pouch-service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: any;
  username;
  password: string;
  error = "";


  constructor(private router: Router, private spinner: NgxSpinnerService, public navservice: NavService, public pouchService: PouchService, public toastr: ToastrService) {
    this.navservice.hide();
    this.user = [];
  }

  ngOnInit() {
  }

  login() {
    var setAdmin = {
      accountnumber: "3045678389",
      address: "Iginedion University Teaching Hospital, Okada",
      bankaccount: "UBA",
      branch: "IUTH(Okada)",
      dateofentry: "Wed Jul 31 2019 14:14:57 GMT+0100 (British Summer Time)",
      debt: 1000,
      department: "Admin",
      dob: "Thu Feb 14 1991 00:00:00 GMT+0000 (Greenwich Mean Time)",
      email: "bright@gmail.com",
      expenses: [],
      firstname: "Bright",
      fullname: "Bright Osarogie",
      id: "",
      lastname: "Osarogie",
      mobile: "08063007065",
      notification: [],
      password: "admin",
      position: "ICT Admin",
      rev: "",
      roles: [{ role: "Supervisor", isChecked: false }, { role: "Evacuate", isChecked: false }, { role: "Refund/Return", isChecked: false }, { role: "Pay Loan", isChecked: false }],
      salary: 2500,
      sex: "Male",
      staffcode: "64647",
      isswitchedtable: false,
      username: "admin"
    }

    this.error = "";
    this.pouchService.getStaffs().then(users => {
      var found = false;
      if (users.length == 0) {
        this.pouchService.updateStaff(setAdmin);
      }

      for (var i = 0; i < users.length; i++) {
        if (users[i].username == this.username && users[i].password == this.password && users[i].department == "Admin") {
          this.toastr.success('Logged in successfully');
          found = true;
          localStorage.setItem('user', JSON.stringify(users[i].id));
          this.router.navigate(['dashboard']);
        }
        else if (users[i].username == this.username && users[i].password == this.password && users[i].department == "Laboratory") {
          this.toastr.success('Logged in successfully');
          found = true;
          localStorage.setItem('user', JSON.stringify(users[i].id));
          this.router.navigate(['dashboard']);
        }
        else if (users[i].username == this.username && users[i].password == this.password && users[i].department == "Account") {
          this.toastr.success('Logged in successfully');
          found = true;
          localStorage.setItem('user', JSON.stringify(users[i].id));
          this.router.navigate(['dashboard']);
        }
        else if (users[i].username == this.username && users[i].password == this.password && users[i].department == "Radiology") {
          this.toastr.success('Logged in successfully');
          found = true;
          localStorage.setItem('user', JSON.stringify(users[i].id));
          this.router.navigate(['dashboard']);
        }
        else if (users[i].username == this.username && users[i].password == this.password && users[i].department == "Pharmacy Store") {
          this.toastr.success('Logged in successfully');
          found = true;
          localStorage.setItem('user', JSON.stringify(users[i].id));
          this.router.navigate(['dashboard']);
        }
        else if (users[i].username == this.username && users[i].password == this.password && users[i].department == "Central Store") {
          this.toastr.success('Logged in successfully');
          found = true;
          localStorage.setItem('user', JSON.stringify(users[i].id));
          this.router.navigate(['dashboard']);
        }
        else if (users[i].username == this.username && users[i].password == this.password && users[i].department == "Main Pharmacy") {
          this.toastr.success('Logged in successfully');
          found = true;
          localStorage.setItem('user', JSON.stringify(users[i].id));
          this.router.navigate(['dashboard']);
        }
        else if (users[i].username == this.username && users[i].password == this.password && users[i].department == "GOPD Pharmacy") {
          this.toastr.success('Logged in successfully');
          found = true;
          localStorage.setItem('user', JSON.stringify(users[i].id));
          this.router.navigate(['dashboard']);
        }
        else if (users[i].username == this.username && users[i].password == this.password && users[i].department == "Revenue") {
          this.toastr.success('Logged in successfully');
          found = true;
          localStorage.setItem('user', JSON.stringify(users[i].id));
          this.router.navigate(['dashboard']);
        }
        else if (users[i].username == this.username && users[i].password == this.password && users[i].department == "Audit") {
          this.toastr.success('Logged in successfully');
          found = true;
          localStorage.setItem('user', JSON.stringify(users[i].id));
          this.router.navigate(['dashboard']);
        }
        else if (users[i].username == this.username && users[i].password == this.password && users[i].department == "Theatre") {
          this.toastr.success('Logged in successfully');
          found = true;
          localStorage.setItem('user', JSON.stringify(users[i].id));
          this.router.navigate(['dashboard']);
        }
      }
      if (found == false) {
        this.error = "Username or Password is not correct, click forgot password for account recovery";
      }
    })

  }

  syncData() {
    /** spinner starts on init */
    if (this.pouchService.finishSync == undefined) {
      this.spinner.show();
      this.pouchService.checkRemoteSync().then(info => {
        if (info.pull.status == 'complete') {
          this.spinner.hide();
        }
        console.log(info);
      }).catch((err: Error) => {
        console.log(err);
        if (err) {
          this.spinner.hide();
        }
      });
    }
  }
}


