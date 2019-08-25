import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NavService} from  '../services/nav.service';
import { PouchService } from '../../providers/pouch-service';
import { ToastrService } from 'ngx-toastr';

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
 

  constructor(private router: Router,  public navservice: NavService, public pouchService: PouchService, public toastr: ToastrService) {
    this.navservice.hide();
    this.user = [];
   }

  ngOnInit() {
  }

  login(){
    this.error = "";
    this.pouchService.getStaffs().then(users => {
      var found = false;

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
      }
      if (found == false) {
        this.error = "Username or Password is not correct, click forgot password for account recovery";
      }
    })
  }
}
