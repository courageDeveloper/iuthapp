import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import {AddPharmacyServiceComponent} from '../../pharmacyservice/add-pharmacyservice/add-pharmacyservice.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-view-pharmacyservice',
  templateUrl: './view-pharmacyservice.component.html',
  styleUrls: ['./view-pharmacyservice.component.css']
})
export class ViewPharmacyServiceComponent implements OnInit {
  pharmacyservices: any[];
  public tableWidget: any;
  tableCheck = false;
  newPharmacyServices: any;
  show = false;
  files: FileList;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
   this.loadPharmacyServices();
  }

  loadPharmacyServices() {

    this.pharmacyservices = [{ servicename: 'festus kenny', price: 35, description: 'Consultation', date: '9/10/2019'},
    { servicename: 'festus kenny', price: 35,  description: 'Consultation', date: '9/10/2019'},
    { servicename: 'festus kenny',  price: 35,  description: 'Consultation', date: '9/10/2019'},
    { servicename: 'festus kenny',  price: 35,  description: 'Consultation', date: '9/10/2019'},
    { servicename: 'festus kenny',  price: 35,  description: 'Consultation', date: '9/10/2019'},
    { servicename: 'festus kenny',  price: 35,  description: 'Consultation', date: '9/10/2019'},
    { servicename: 'kate',  price: 23,  description: 'Consultation', date: '9/10/2019'},
    { servicename: 'John Bull',  price: 35,  description: 'Consultation', date: '9/10/2019'},
    { servicename: 'festus kenny',  price: 35,  description: 'Consultation', date: '9/10/2019'},
    { servicename: 'festus kenny',  price: 35,  description: 'Consultation', date: '9/10/2019'},
    { servicename: 'festus kenny',  price: 35,  description: 'Consultation', date: '9/10/2019'},
    { servicename: 'festus kenny',  price: 35,  description: 'Consultation', date: '9/10/2019'},
    { servicename: 'festus kenny',  price: 35,  description: 'Consultation', date: '9/10/2019'},
    { servicename: 'festus kenny',  price: 35,  description: 'Consultation', date: '9/10/2019'},
    { servicename: 'festus kenny',  price: 35,  description: 'Consultation', date: '9/10/2019'},
    { servicename: 'festus kenny',  price: 35,  description: 'Consultation', date: '9/10/2019'},
    { servicename: 'festus kenny',  price: 35,  description: 'Consultation', date: '9/10/2019'}
    ]

    $(document).ready(function () {
      $('#dtBasicExample').DataTable();
      $('.dataTables_length').addClass('bs-select');
    });
  }


  editPharmacyService(pharmacyservice) {
    let dialogRef = this.dialog.open(AddPharmacyServiceComponent, {
      width: '500px',
      data: {
        pharmacyservice: pharmacyservice,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(!result) {
        return;
      }
      this.loadPharmacyServices();
    })
  }

  deletePharmacyService() {

  }

  viewPharmacyService() {

  }

  selectedPharmacyService(pharmacyservice, event) {
   if (event.checked) {
    pharmacyservice['selected'] = true;
    }
    else {
      pharmacyservice['selected'] = false;
    }
    this.newPharmacyServices = this.pharmacyservices.filter(data => data.selected == true);
    if (this.newPharmacyServices.length > 0) {
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

  addPharmacyService() {
    let dialogRef = this.dialog.open(AddPharmacyServiceComponent, {
      width: '500px',
      data: {
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        return;
      }
      console.log(result);
      this.loadPharmacyServices();
    })
  }

  editService(pharmacyservice) {

  }

  deleteService(pharmacyservice) {

  }
}
