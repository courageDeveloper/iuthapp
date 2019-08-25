import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly

@Component({
  selector: 'app-revenue-pos',
  templateUrl: './revenue-pos.component.html',
  styleUrls: ['./revenue-pos.component.css']
})
export class RevenuePosComponent implements OnInit {
  products: any[];
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

  constructor() { }

  ngOnInit() {
    this.patients = [{ name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'kate', position: 'receptionist', department: 'Revenue', branch: 'Benin Centre', salary: 5000, debt: 0 },
    { name: 'John Bull', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'kate', position: 'receptionist', department: 'Revenue', branch: 'Benin Centre', salary: 5000, debt: 0 },
    { name: 'John Bull', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 },
    { name: 'festus kenny', position: 'accountant', department: 'Account', branch: 'IUTH(Okada)', salary: 10000, debt: 0 }
    ]

    $(document).ready(function () {
      $('#dtBasicExample').DataTable();
      $('.dataTables_length').addClass('bs-select');
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
