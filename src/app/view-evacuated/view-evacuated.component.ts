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
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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
  timeFrom: any;
  timeTo: any;
  excelBuffer: any;
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook;
  isUserPermitted = true;
  isEvacuate = false;
  isSupervisor = false;
  isRefund = false;
  paginatedEvacuates;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService, private router: Router, private dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.timeFrom = '00:00';
    this.timeTo = '00:00';

    this.pouchService.userPermission().then(result => {
      if (result.department == 'Admin') {
        this.isUserPermitted = false;
      }
    });

    this.checkRoles();
    this.loadEvacuated();
    this.loadTotalEvacuated();
  }

  checkRoles() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      staff.roles.map(role => {
        if (role.role == "Supervisor" && role.isChecked == true) {
          this.isSupervisor = true;
        }
      })
    });
  }

  reloadEvacuated() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getEvacuates().then(data => {
        this.evacuates = data.filter(data => data.branch == staff.branch);

        this.pouchService.paginationId = this.evacuates[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByBranchRemoveItem('evacuate', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedEvacuates = paginatedata;

        });
      });
    });
  }

  loadEvacuated() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getEvacuates().then(data => {
        this.evacuates = data.filter(data => data.branch == staff.branch);

        this.pouchService.paginationId = this.evacuates[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByBranch2('evacuate', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedEvacuates = paginatedata;
          
          $(document).ready(function () {
            $('#dtBasicExample').DataTable({
              "paging": false,
              "searching": false
            });
            $('.dataTables_length').addClass('bs-select');
          });
          this.isNextActive = true;
        });
      });
    });
  }

  next() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.paginationId = this.paginatedEvacuates[this.paginatedEvacuates.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByBranch2('evacuate', this.pouchService.paginationId).then(paginatedata => {
        this.paginatedEvacuates = paginatedata;

        this.isPreviousActive = true;
      });
    });
  }

  previous() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.paginationId = this.paginatedEvacuates[this.paginatedEvacuates.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByBranchPrev2('evacuate', this.pouchService.paginationId).then(paginatedata => {
        this.paginatedEvacuates = paginatedata;

        if (this.paginatedEvacuates.length < this.pouchService.limitRange) {
          this.isPreviousActive = false;
        }
      });
    });
  }

  goToStart() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.isPreviousActive = false;

      this.pouchService.paginationId = this.paginatedEvacuates[this.paginatedEvacuates.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByBranchStart('evacuate', this.pouchService.paginationId).then(paginatedata => {
        this.paginatedEvacuates = paginatedata;

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
          this.reloadEvacuated();
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
      //this.loadEvacuated();;
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
            this.reloadEvacuated();
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
    this.newEvacuates = this.paginatedEvacuates.filter(data => data['selected'] == true);
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
    var inputTimeArray = this.timeFrom.split(':');
    var hours = inputTimeArray[0];
    var minutes = inputTimeArray[1];
    var millisecondsHour = hours * 3600000;
    var millisecondsMinute = minutes * 60000;
    this.dateFrom = new Date(this.dateFrom).getTime();
    var totalMillisecondsFrom = millisecondsHour + millisecondsMinute + this.dateFrom;
    var newDateFrom = new Date().setTime(totalMillisecondsFrom);

    var inputTimeArrayTo = this.timeTo.split(':');
    var hoursTo = inputTimeArrayTo[0];
    var minutesTo = inputTimeArrayTo[1];
    var millisecondsHourTo = hoursTo * 3600000;
    var millisecondsMinuteTo = minutesTo * 60000;
    this.dateTo = new Date(this.dateTo).getTime();
    var totalMillisecondsTo = millisecondsHourTo + millisecondsMinuteTo + this.dateTo;
    var newDateTo = new Date().setTime(totalMillisecondsTo);

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getEvacuates().then(evacuates => {
        evacuates = evacuates.filter(data => data.branch == staff.branch);

        evacuates.map(evacuate => {
          evacuate['timestamp'] = new Date(evacuate.date);
          evacuate['timestamp'] = new Date(evacuate['timestamp']).setSeconds(0);
          evacuate['timestamp'] = evacuate['timestamp'] + 3600000;
          /*  evacuate['timestamp'] = new Date(evacuate['timestamp']).setMinutes(0);
           evacuate['timestamp'] = new Date(evacuate['timestamp']).setHours(0);
  */
        });
        evacuates = evacuates.filter(data => newDateFrom <= data['timestamp']);
        evacuates = evacuates.filter(data => newDateTo >= data['timestamp']);
        this.evacuates = evacuates;

        this.pouchService.paginationId = this.evacuates[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByBranch2('evacuate', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedEvacuates = paginatedata;

          this.paginatedEvacuates.map(paginatedLoan => {
            paginatedLoan['timestamp'] = new Date(paginatedLoan.date);
            paginatedLoan['timestamp'] = new Date(paginatedLoan['timestamp']).setSeconds(0);
            paginatedLoan['timestamp'] = paginatedLoan['timestamp'] + 3600000;
            /*  loan['timestamp'] = new Date(loan['timestamp']).setMinutes(0);
             loan['timestamp'] = new Date(loan['timestamp']).setHours(0); */
          });
          this.paginatedEvacuates = this.paginatedEvacuates.filter(data => newDateFrom <= data['timestamp']);
          this.paginatedEvacuates = this.paginatedEvacuates.filter(data => newDateTo >= data['timestamp']);
        });
      });
    });
  }

  public export(): void {
    var exportedEvacuatesArray = [];

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getEvacuates().then(items => {
        items = items.filter(data => data.branch == staff.branch);

        for (var i = 0; i < items.length; i++) {
          var exportedEvacuates = {
            'S/NO': i + 1,
            NAME: items[i].name,
            'TOTAL AMOUNT': items[i].totalamount,
            'NO OF ITEMS': items[i].noofitems,
            DATE: items[i].date,
            BRANCH: items[i].branch
          }
          exportedEvacuatesArray.push(exportedEvacuates);
          this.worksheet = XLSX.utils.json_to_sheet(exportedEvacuatesArray);
        }
        const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
        this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(this.excelBuffer, 'IUTH Evacuates');
      });
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedEvacuates = [];

    for (let evacuate of this.evacuates) {
      if ((evacuate.name).toLowerCase().indexOf(value) !== -1) {
        this.paginatedEvacuates.push(evacuate);

        this.paginatedEvacuates = this.paginatedEvacuates.slice(0, this.pouchService.limitRange);
      }
    }
  }
}
