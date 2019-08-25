import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { CounterProducts } from '../../model/counterproduct';
import { PouchService } from '../../providers/pouch-service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-main-pharmacy-pos',
  templateUrl: './main-pharmacy-pos.component.html',
  styleUrls: ['./main-pharmacy-pos.component.css']
})
export class MainPharmacyPosComponent implements OnInit {
  counterproducts: Array<CounterProducts> = [];
  services: any[];
  patients: any[];
  public tableWidget: any;
  tableCheck = false;
  newPatients: any;
  show = false;
  openside = false;
  calculator = false;
  productarray = [];
  servicearray = [];
  customers = [];
  public customer: any;
  files: FileList;
  tabs = {
    product: true,
    service: false,
    new: false,
    expense: false
  }
  order = [];

  constructor(private dialog: MatDialog, private router: Router, public pouchService: PouchService, public _DomSanitizer: DomSanitizer) { }

  ngOnInit() {
   this.loadCounterProducts();
  }

  loadCounterProducts() {
    this.pouchService.getCounterProducts().then(counterProducts => {
        counterProducts = counterProducts.filter(data => data.branch=='IUTH(Okada)' && data.department == "Main Pharmacy");
        this.counterproducts = counterProducts;
        console.log(this.counterproducts);
      });
  }


  editPatient() {

  }

  deletePatient() {

  }

  viewHistory() {

  }

  deleteSelectedPatient() {

  }

  getDate() {
    var today = new Date();
    var mm = today.getMonth() + 1;
    var dd = today.getDate();
    var yyyy = today.getFullYear();

    var date = dd + "/" + mm + "/" + yyyy

    return date
};


  addToOrder(item, qty) {
    var flag = 0;
    if (this.order.length > 0) {
        for (var i = 0; i < this.order.length; i++) {
            if (item.id === this.order[i].id) {
                item.qty += qty;
                flag = 1;
                break;
            }
        }
        if (flag === 0) {
            item.qty = 1;
        }
        if (item.qty < 2) {
            this.order.push(item);
        }
    } else {
        item.qty = qty;
        this.order.push(item);
    }
};


  selectProduct(newVal) {
    this.addToOrder(newVal, 1);
  }

  selectCategory(category) {

  }

  toggleSide() {
    this.openside = !this.openside;
    this.calculator = false;
    this.activatetab('product');
  }

  toggleCalculator() {
    this.openside = false;
    this.calculator = !this.calculator;
  }

  activatetab(tab) {
    this.tabs = {
      service: tab == 'service' ? true : false,
      product: tab == 'product' ? true : false,
      new: tab == 'new' ? true : false,
      expense: tab == 'expense' ? true : false
    }
  }

  selectedPatient(patient, event) {
    if (event.checked) {
      patient['selected'] = true;
    }
    else {
      patient['selected'] = false;
    }
    this.newPatients = this.patients.filter(data => data.selected == true);
    if (this.newPatients.length > 0) {
      this.tableCheck = true;
    }
    else {
      this.tableCheck = false;
    }
  }

  import() {
    this.show = true;
  }

  handleFiles(event) {
    this.files = event.target.files;
  }
}
