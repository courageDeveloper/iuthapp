import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { MatDialog, MatDialogRef } from '@angular/material';
import { PouchService } from '../../../providers/pouch-service';
import { Sales } from '../../../model/sales';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { AddPayloanComponent } from '../../sales/pay-loan/pay-loan.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-history-patient',
  templateUrl: './view-history-patient.component.html',
  styleUrls: ['./view-history-patient.component.css']
})
export class ViewHistoryPatientComponent implements OnInit {
  public loans: Array<Sales> = [];
  public totalLoans: Array<Sales> = [];
  public tableWidget: any;
  tableCheck = false;
  newLoans: any;
  show = false;
  files: FileList;
  convertFiles;
  newArray;
  total = 0;
  isUserPermitted = false;
  excelBuffer: any;
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook;
  branch;
  promise1;
  promise2;
  promise3;
  promise4;
  promise5;
  dateFrom: any;
  dateTo: any;
  isPayloan = false;
  paginatedLoans;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService, private router: Router, private dialog: MatDialog, public toastr: ToastrService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.pouchService.userPermission().then(result => {
      if (result.department == 'Account' || result.department == 'Audit') {
        this.isUserPermitted = true;
      }
    })

    this.loadLoans();
    this.loadTotalLoans();
    this.checkRoles();
  }

  checkRoles() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      staff.roles.map(role => {
        if (role.role == "Pay Loan" && role.isChecked == true) {
          this.isPayloan = true;
        }
      })
    });
  }

  reloadLoans() {
    let id = this.activatedRoute.snapshot.params['id'];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {

      this.pouchService.getSales().then(data => {
        this.loans = data.filter(data => data.branch == staff.branch);
        this.loans = this.loans.filter(data => data.isoncredit == true || data.isowing == true);
        this.loans = this.loans.filter(data => data.iscomplete == true);
        this.loans = this.loans.filter(data => data.patientid == id);

        this.pouchService.paginationId = this.loans[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateBySaleRemoveItem('sale', this.pouchService.paginationId, undefined, true, true, true, id).then(paginatedata => {
          this.paginatedLoans = paginatedata;
        });
      });
    });
  }

  loadLoans() {
    let id = this.activatedRoute.snapshot.params['id'];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {

      this.pouchService.getSales().then(data => {
        this.loans = data.filter(data => data.branch == staff.branch);
        this.loans = this.loans.filter(data => data.isoncredit == true || data.isowing == true);
        this.loans = this.loans.filter(data => data.iscomplete == true);
        this.loans = this.loans.filter(data => data.patientid == id);
        
        this.pouchService.paginationId = this.loans[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateBySale('sale', this.pouchService.paginationId, undefined, true, true, true, id).then(paginatedata => {
          this.paginatedLoans = paginatedata;

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
    let id = this.activatedRoute.snapshot.params['id'];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.paginationId = this.paginatedLoans[this.paginatedLoans.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateBySale('sale', this.pouchService.paginationId, undefined, true, true, true, id).then(paginatedata => {
        this.paginatedLoans = paginatedata;

        this.isPreviousActive = true;
      });
    });
  }

  previous() {
    let id = this.activatedRoute.snapshot.params['id'];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.paginationId = this.paginatedLoans[this.paginatedLoans.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateBySalePrev('sale', this.pouchService.paginationId, undefined, true, true, true, id).then(paginatedata => {
        this.paginatedLoans = paginatedata;

        if (this.paginatedLoans.length < this.pouchService.limitRange) {
          this.isPreviousActive = false;
        }
      });
    });
  }

  goToStart() {
    let id = this.activatedRoute.snapshot.params['id'];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.isPreviousActive = false;

      this.pouchService.paginationId = this.paginatedLoans[this.paginatedLoans.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateBySaleStart('sale', this.pouchService.paginationId, undefined, true, true, true, id).then(paginatedata => {
        this.paginatedLoans = paginatedata;

      });
    });
  }


  loadTotalLoans() {
    let id = this.activatedRoute.snapshot.params['id'];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(data => {
        this.totalLoans = data.filter(data => data.branch == staff.branch);
        this.totalLoans = this.totalLoans.filter(data => data.isoncredit == true || data.isowing == true);
        this.totalLoans = this.totalLoans.filter(data => data.iscomplete == true);
        this.totalLoans = this.totalLoans.filter(data => data.patientid == id);
        this.getTotalLoans(this.totalLoans);
      });
    });
  }

  getTotalLoans(loans) {

    var loanArray = [];
    loans = loans.filter(data => data.isreconciled == true);
    loans.forEach(loan => {
      loanArray.push(loan.amountloaned);
      loanArray.push(loan.balance);
    });
    return this.total = loanArray.reduce((a, b) => a + b, 0);
  }

  filterDate() {
    this.loans = [];
    this.dateFrom = new Date(this.dateFrom).getTime();
    this.dateTo = new Date(this.dateTo).getTime();

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(loans => {
        let id = this.activatedRoute.snapshot.params['id'];

        loans = loans.filter(data => data.branch == staff.branch);
        loans = loans.filter(data => data.isoncredit == true || data.isowing == true);
        loans = loans.filter(data => data.iscomplete == true);
        loans = loans.filter(data => data.patientid == id);
        
        loans.map(loan => {
          loan['timestamp'] = new Date(loan.date);
          loan['timestamp'] = new Date(loan['timestamp']).setSeconds(0);
          loan['timestamp'] = new Date(loan['timestamp']).setMinutes(0);
          loan['timestamp'] = new Date(loan['timestamp']).setHours(0);

        });
        
        loans = loans.filter(data => this.dateFrom <= data['timestamp']);
        loans = loans.filter(data => this.dateTo >= data['timestamp']);
        this.loans = loans;

        this.pouchService.paginationId = this.loans[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateBySale('sale', this.pouchService.paginationId, undefined, true, true, true, id).then(paginatedata => {
          this.paginatedLoans = paginatedata;

          this.paginatedLoans.map(paginatedLoan => {
            paginatedLoan['timestamp'] = new Date(paginatedLoan.date);
            paginatedLoan['timestamp'] = new Date(paginatedLoan['timestamp']).setSeconds(0);
            paginatedLoan['timestamp'] = new Date(paginatedLoan['timestamp']).setMinutes(0);
            paginatedLoan['timestamp'] = new Date(paginatedLoan['timestamp']).setHours(0);
          });
          this.paginatedLoans = this.paginatedLoans.filter(data => this.dateFrom <= data['timestamp']);
          this.paginatedLoans = this.paginatedLoans.filter(data => this.dateTo >= data['timestamp']);
        });
      });
    });
  }

  payLoan(loan) {
    let dialogRef = this.dialog.open(AddPayloanComponent, {
      width: '450px',
      data: {
        action: 'add',
        loan: loan
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      console.log(result);
      this.reloadLoans();
    })
  }

  public export(): void {
    var exportedSalesArray = [];

    let id = this.activatedRoute.snapshot.params['id'];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(items => {
        items = items.filter(data => data.branch == staff.branch);
        items = items.filter(data => data.isoncredit == true || data.isowing == true);
        items = items.filter(data => data.iscomplete == true);
        items = items.filter(data => data.patientid == id);

        for (var i = 0; i < items.length; i++) {
          var exportedSales = {
            'S/NO': i + 1,
            DEPARTMENT: items[i].department,
            'AMOUNT LOANED': items[i].amountloaned,
            'AMOUNT PAYABLE': items[i].amountpayable,
            'DEPARTMENT LOANED': items[i].departmentloaned,
            'DEPARTMENT LOANING': items[i].departmentloaning,
            'DATE OF LOAN': items[i].dateofloan,
            'SALE NAME': items[i].salename,
            AMOUNT: items[i].amount,
            DESCRIPTION: items[i].description,
            COLOR: items[i].color,
            DATE: items[i].date,
            BALANCE: items[i].balance,
            'EVACUATED MESSAGE': items[i].evacuatedmessage,
            'BRANCH': items[i].branch
          }
          exportedSalesArray.push(exportedSales);
          this.worksheet = XLSX.utils.json_to_sheet(exportedSalesArray);
        }
        const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
        this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(this.excelBuffer, 'IUTH Loans');
      });
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedLoans = [];

    for (let loan of this.loans) {
      if ((loan.salename).toLowerCase().indexOf(value) !== -1) {
        this.paginatedLoans.push(loan);

        this.paginatedLoans = this.paginatedLoans.slice(0, this.pouchService.limitRange);
      }
    }
  }
}
