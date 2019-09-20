import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PouchService } from '../../providers/pouch-service';
import { Evacuate } from '../../model/evacuate';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ConfirmdialogmessageComponent } from '../confirmdialogmessage/confirmdialogmessage.component';
import { DisplayevacuatedComponent } from './displayevacuated/displayevacuated.component';

@Component({
  selector: 'app-view-evacuated',
  templateUrl: './view-evacuated.component.html',
  styleUrls: ['./view-evacuated.component.css']
})
export class ViewEvacuatedComponent implements OnInit {
  public evacuates: Array<Evacuate> = [];
  public totalEvacuates: Array<Evacuate> = [];
  public tableWidget: any;
  tableCheck = false;
  show = false;
  files: FileList;
  newArray;
  total = 0;
  branch;
  newEvacuates: any;
  dateFrom: any;
  dateTo: any;

  constructor(public pouchService: PouchService, private router: Router, private dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.loadEvacuated();
    this.loadTotalEvacuated();
  }

  loadEvacuated() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getEvacuates().then(data => {
        this.evacuates = data.filter(data => data.branch == staff.branch);
        console.log(this.evacuates);
        $(document).ready(function () {
          $('#dtBasicExample').DataTable();
          $('.dataTables_length').addClass('bs-select');
        });
      });
    });
  }

  loadTotalEvacuated() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getEvacuates().then(data => {
        this.totalEvacuates = data;
        this.totalEvacuates = this.totalEvacuates.filter(data => data.branch == staff.branch);
        this.getTotalEvacuates(this.totalEvacuates);
      });
    });
  }

  deleteEvacuated(evacuate) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: evacuate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteEvacuate(evacuate).then(res => {
          this.toastr.success('Evacuated sale has been deleted successfully');
          this.loadEvacuated();
        });
      }
    });
  }

  viewEvacuated(evacuate) {
    let dialogRef = this.dialog.open(DisplayevacuatedComponent, {
      height: '500px',
      width: '500px',
      data: {
        evacuate: evacuate,
        action: 'evacuate'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.loadEvacuated();;
    })
  }

  deleteSelectedEvacuated() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newEvacuates.forEach(evacuate => {
          this.pouchService.deleteEvacuate(evacuate).then(res => {
            this.loadEvacuated();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Evacuated sales has been deleted successfully');
      }
    });
  }

  selectedEvacuated(evacuate, event) {
    if (event.checked) {
      evacuate['selected'] = true;
    }
    else {
      evacuate['selected'] = false;
    }
    this.newEvacuates = this.evacuates.filter(data => data['selected'] == true);
    if (this.newEvacuates.length > 0) {
      this.tableCheck = true;
    }
    else {
      this.tableCheck = false;
    }
  }

  getTotalEvacuates(evacuates) {
    var evacuateArray = [];
    evacuates.forEach(evacuate => {
      evacuateArray.push(evacuate.totalamount);
    });
    return this.total = evacuateArray.reduce((a, b) => a + b, 0);
  }

  filterDate() {
    this.evacuates = [];
    this.dateFrom = new Date(this.dateFrom).getTime();
    this.dateTo = new Date(this.dateTo).getTime();

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getEvacuates().then(evacuates => {
        evacuates = evacuates.filter(data => data.branch == staff.branch);
        
        evacuates.map(evacuate => {
          evacuate['timestamp'] = new Date(evacuate.date).toLocaleString("en-US", { timeZone: "GMT" });
          evacuate['timestamp'] = new Date(evacuate['timestamp']).setSeconds(0);
          evacuate['timestamp'] = new Date(evacuate['timestamp']).setMinutes(0);
          evacuate['timestamp'] = new Date(evacuate['timestamp']).setHours(0);
         
        });
        evacuates = evacuates.filter(data => this.dateFrom <= data['timestamp']);
        evacuates = evacuates.filter(data => this.dateTo >= data['timestamp']);
        this.evacuates = evacuates;
      });
    });
  }
}
