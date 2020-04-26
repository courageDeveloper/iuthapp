import { Component, OnInit } from '@angular/core';
import { PouchService } from './../providers/pouch-service';
import { NgxSpinnerService } from "ngx-spinner";
import { DrugpromptComponent } from './drugprompt/drugprompt.component';
import { MatDialog } from '@angular/material'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public pouchService: PouchService, public dialog: MatDialog, private spinner: NgxSpinnerService) {
    if (!this.expired()) {
      this.pouchService.initDB();
    }
  }

  ngOnInit() {
    console.log(this.expired());
    if (!this.expired()) {
      this.syncData();
    }

   /*  setInterval(() => {
      var localStorageItem = JSON.parse(localStorage.getItem('user'));
      this.checkCounterProducts(localStorageItem);
      this.checkProducts(localStorageItem);
      this.checkQuantityCounterProducts(localStorageItem);
      this.checkQuantityProducts(localStorageItem);
    }, 100000); */
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

  expired() {
    var currentDateString = new Date().toISOString().split('T')[0];
    var currentDate = new Date(currentDateString);
    var expiryDateString = new Date('2020-05-15').toISOString().split('T')[0];
    var expiryDate = new Date(expiryDateString);

    if (currentDate.getTime() >= expiryDate.getTime()) {
      return true;
    }
    else {
      return false;
    }
  }

  checkCounterProducts(id) {
    this.pouchService.getStaff(id).then(item => {
      this.pouchService.getCounterProducts().then(counterproducts => {
        counterproducts = counterproducts.filter(data => data.department == item.department && data.branch == item.branch);
        if (counterproducts.length != 0) {
          counterproducts = counterproducts.filter(data => {
            var expiryDateTimestamp = new Date(data.expirydate).getTime();
            var currentDateTimestamp = new Date();
            currentDateTimestamp.setSeconds(0);
            currentDateTimestamp.setMinutes(0);
            currentDateTimestamp.setHours(0);
            currentDateTimestamp.setMilliseconds(0);
            var convertedCurrentDateTimestamp = currentDateTimestamp.getTime();
            return (expiryDateTimestamp - convertedCurrentDateTimestamp) <= 2592000000 && data.isnoticed == false;
          });
          if (counterproducts.length != 0) {
            var message = {
              name: `${item.department} drug expiration`,
              date: new Date(),
              message: `Some drugs from ${item.department} are about to expire`,
              url: '/drug-notifications'
            }
            let dialogRef = this.dialog.open(DrugpromptComponent, {
              width: '450px',
              data: {
                content: message
              }
            });

            dialogRef.afterClosed().subscribe(result => {
              console.log('This dialog has closed');
              if (result) {

              }
            });
          }
        }
      });
    });
  }

  checkProducts(id) {
    this.pouchService.getStaff(id).then(item => {
      this.pouchService.getProducts().then(products => {
        products = products.filter(data => data.store == item.department && data.branch == item.branch);
        if (products.length != 0) {
          products = products.filter(data => {
            var expiryDateTimestamp = new Date(data.expiryDate).getTime();
            var currentDateTimestamp = new Date();
            currentDateTimestamp.setSeconds(0);
            currentDateTimestamp.setMinutes(0);
            currentDateTimestamp.setHours(0);
            currentDateTimestamp.setMilliseconds(0);
            var convertedCurrentDateTimestamp = currentDateTimestamp.getTime();
            return (expiryDateTimestamp - convertedCurrentDateTimestamp) <= 2592000000 && data.isnoticed == false;
          });
          if (products.length != 0) {
            var message = {
              name: `${item.department} drug expiration`,
              date: new Date(),
              message: `Some drugs from ${item.department} are about to expire`,
              url: '/drug-notifications'
            }
            let dialogRef = this.dialog.open(DrugpromptComponent, {
              width: '450px',
              data: {
                content: message
              }
            });

            dialogRef.afterClosed().subscribe(result => {
              console.log('This dialog has closed');
              if (result) {

              }
            });
          }
        }
      })
    });
  }

  checkQuantityCounterProducts(id) {
    this.pouchService.getStaff(id).then(item => {
      this.pouchService.getCounterProducts().then(counterproducts => {
        counterproducts = counterproducts.filter(data => data.department == item.department && data.branch == item.branch);
        if (counterproducts.length != 0) {
          counterproducts = counterproducts.filter(data => {
            return data.suppliedunit <= 1 && data.isquantitynoticed == false || data.totalsubitem <= 1 && data.isquantitynoticed == false;
          });
          if (counterproducts.length != 0) {
            var message = {
              name: `${item.department} drug is running out`,
              date: new Date(),
              message: `Some drugs from ${item.department} are about to finish, please order for them`,
              url: '/drug-quantity-notifications'
            }
            let dialogRef = this.dialog.open(DrugpromptComponent, {
              width: '450px',
              data: {
                content: message
              }
            });

            dialogRef.afterClosed().subscribe(result => {
              console.log('This dialog has closed');
              if (result) {

              }
            });
          }
        }
      });
    });
  }

  checkQuantityProducts(id) {
    this.pouchService.getStaff(id).then(item => {
      this.pouchService.getProducts().then(products => {
        products = products.filter(data => data.store == item.department && data.branch == item.branch);
        if (products.length != 0) {
          products = products.filter(data => {
            return data.unitstock <= 1 && data.isquantitynoticed == false || data.totalsubitem <= 1 && data.isquantitynoticed == false;
          });
          if (products.length != 0) {
            var message = {
              name: `${item.department} drug is running out`,
              date: new Date(),
              message: `Some drugs from ${item.department} are about to finish, please order for them`,
              url: '/drug-quantity-notifications'
            }
            let dialogRef = this.dialog.open(DrugpromptComponent, {
              width: '450px',
              data: {
                content: message
              }
            });

            dialogRef.afterClosed().subscribe(result => {
              console.log('This dialog has closed');
              if (result) {

              }
            });
          }
        }
      })
    });
  }

}
