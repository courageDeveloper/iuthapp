import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { MatDialog, MatDialogRef } from '@angular/material';
import { PouchService } from '../../../providers/pouch-service';
import { Expenses } from '../../../model/expense';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { AddPayborrowComponent } from '../../expenses/pay-borrow/pay-borrow.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-history-vendor',
  templateUrl: './view-history-vendor.component.html',
  styleUrls: ['./view-history-vendor.component.css']
})
export class ViewHistoryVendorComponent implements OnInit {
  public balances: Array<Expenses> = [];
  public totalBalances: Array<Expenses> = [];
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
  isPayloan = false
  paginatedBalances;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService, private router: Router, private dialog: MatDialog, public toastr: ToastrService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.pouchService.userPermission().then(result => {
      if (result.department == 'Account' || result.department == 'Audit') {
        this.isUserPermitted = true;
      }
    });

    this.loadBalances();
    this.loadTotalBalances();
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

  reloadBalances() {
    let id = this.activatedRoute.snapshot.params['id'];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {

      this.pouchService.getExpenses().then(data => {
        this.balances = data.filter(data => data.branch == staff.branch);
        this.balances = this.balances.filter(data => data.isoncredit == true || data.isowing == true);
        //this.balances = this.balances.filter(data => data.iscomplete == true);
        this.balances = this.balances.filter(data => data.vendorid == id);

        this.pouchService.paginationId = this.balances[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByExpenseRemoveItem('expense', this.pouchService.paginationId, undefined, undefined, undefined, false, undefined, id).then(paginatedata => {
          this.paginatedBalances = paginatedata;

        });
      });
    });
  }

  loadBalances() {
    let id = this.activatedRoute.snapshot.params['id'];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {

      this.pouchService.getExpenses().then(data => {
        this.balances = data.filter(data => data.branch == staff.branch);

        //this.balances = this.balances.filter(data => data.isoncredit == true || data.isowing == true);
        this.balances = this.balances.filter(data => data.iscomplete == false);
        this.balances = this.balances.filter(data => data.vendorid == id);

        this.pouchService.paginationId = this.balances[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByExpense('expense', this.pouchService.paginationId, undefined, undefined, undefined, false, undefined, id).then(paginatedata => {
          this.paginatedBalances = paginatedata;

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
      this.pouchService.paginationId = this.paginatedBalances[this.paginatedBalances.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByExpense('expense', this.pouchService.paginationId, undefined, undefined, undefined, false, undefined, id).then(paginatedata => {
        this.paginatedBalances = paginatedata;

        this.isPreviousActive = true;
      });
    });
  }

  previous() {
    let id = this.activatedRoute.snapshot.params['id'];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.paginationId = this.paginatedBalances[this.paginatedBalances.length - 1].id;  //Reverse of what is meant to be;
      
      this.pouchService.paginateByExpensePrev('expense', this.pouchService.paginationId, undefined, undefined, undefined, false, undefined, id).then(paginatedata => {
        this.paginatedBalances = paginatedata;

        if (this.paginatedBalances.length < this.pouchService.limitRange) {
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
      
      this.pouchService.paginationId = this.paginatedBalances[this.paginatedBalances.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByExpenseStart('expense', this.pouchService.paginationId, undefined, undefined, undefined, false, undefined, id).then(paginatedata => {
        this.paginatedBalances = paginatedata;

      });
    });
  }

  loadTotalBalances() {
    let id = this.activatedRoute.snapshot.params['id'];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getExpenses().then(data => {
        this.totalBalances = data.filter(data => data.branch == staff.branch);
        this.totalBalances = this.totalBalances.filter(data => data.isoncredit == true || data.isowing == true);
        //this.totalBalances = this.totalBalances.filter(data => data.iscomplete == true);
        this.totalBalances = this.totalBalances.filter(data => data.vendorid == id);
        this.getTotalBalances(this.totalBalances);
      });
    });
  }

  getTotalBalances(balances) {

    var balanceArray = [];
    balances = balances.filter(data => data.isreconciled == true);
    balances.forEach(balance => {
      balanceArray.push(balance.amountloaned);
      balanceArray.push(balance.balance);
    });
    return this.total = balanceArray.reduce((a, b) => a + b, 0);
  }

  filterDate() {
    this.balances = [];
    this.dateFrom = new Date(this.dateFrom).getTime();
    this.dateTo = new Date(this.dateTo).getTime();

    let id = this.activatedRoute.snapshot.params['id'];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getExpenses().then(balances => {
        balances = balances.filter(data => data.branch == staff.branch);
        balances = balances.filter(data => data.isoncredit == true || data.isowing == true);
        balances = balances.filter(data => data.vendorid == id);

        balances.map(balance => {
          balance['timestamp'] = new Date(balance.date);
          balance['timestamp'] = new Date(balance['timestamp']).setSeconds(0);
          balance['timestamp'] = new Date(balance['timestamp']).setMinutes(0);
          balance['timestamp'] = new Date(balance['timestamp']).setHours(0);

        });
        balances = balances.filter(data => this.dateFrom <= data['timestamp']);
        balances = balances.filter(data => this.dateTo >= data['timestamp']);
        this.balances = balances;

        this.pouchService.paginationId = this.balances[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByExpense('expense', this.pouchService.paginationId, undefined, undefined, undefined, false, undefined, id).then(paginatedata => {
          this.paginatedBalances = paginatedata;

          this.paginatedBalances.map(paginatedBalance => {
            paginatedBalance['timestamp'] = new Date(paginatedBalance.date);
            paginatedBalance['timestamp'] = new Date(paginatedBalance['timestamp']).setSeconds(0);
            paginatedBalance['timestamp'] = new Date(paginatedBalance['timestamp']).setMinutes(0);
            paginatedBalance['timestamp'] = new Date(paginatedBalance['timestamp']).setHours(0);
          });
          this.paginatedBalances = this.paginatedBalances.filter(data => this.dateFrom <= data['timestamp']);
          this.paginatedBalances = this.paginatedBalances.filter(data => this.dateTo >= data['timestamp']);
        });
      });
    });
  }

  payVendorBalance(balance) {
    let dialogRef = this.dialog.open(AddPayborrowComponent, {
      width: '450px',
      data: {
        action: 'add',
        borrow: balance
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      console.log(result);
      this.reloadBalances();
    })
  }

  public export(): void {
    var exportedExpensesArray = [];

    let id = this.activatedRoute.snapshot.params['id'];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getExpenses().then(items => {
        items = items.filter(data => data.branch == staff.branch);
        items = items.filter(data => data.isoncredit == true || data.isowing == true);
        items = items.filter(data => data.vendorid == id);

        for (var i = 0; i < items.length; i++) {
          var exportedExpenses = {
            'S/NO': i + 1,
            DEPARTMENT: items[i].departmentname,
            'AMOUNT LOANED': items[i].amountloaned,
            'AMOUNT PAYABLE': items[i].amountpayable,
            //'VENDOR': items[i].vendorname,
            //'VENDOR BANK': items[i].vendorbank,
            //'VENDOR ACCOUNT': items[i].vendoraccount,
            'DEPARTMENT LOANING': items[i].departmentloaning,
            'DATE OF LOAN': items[i].dateofloan,
            'EXPENSE NAME': items[i].expensename,
            AMOUNT: items[i].amount,
            DESCRIPTION: items[i].description,
            COLOR: items[i].color,
            DATE: items[i].date,
            BALANCE: items[i].balance,
            'BRANCH': items[i].branch
          }
          exportedExpensesArray.push(exportedExpenses);
          this.worksheet = XLSX.utils.json_to_sheet(exportedExpensesArray);
        }
        const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
        this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(this.excelBuffer, 'IUTH Balances');
      });
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedBalances = [];

    for (let balance of this.balances) {
      if ((balance.expensename).toLowerCase().indexOf(value) !== -1) {
        this.paginatedBalances.push(balance);

        this.paginatedBalances = this.paginatedBalances.slice(0, this.pouchService.limitRange);
      }
    }
  }
}
