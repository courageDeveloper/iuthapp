import { Component, OnInit, AfterViewInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PouchService } from '../../providers/pouch-service';
import { Sales } from '../../model/sales';
import { Expenses } from '../../model/expense';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { ConfirmdialogmessageComponent } from '../confirmdialogmessage/confirmdialogmessage.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-cash-book',
  templateUrl: './cash-book.component.html',
  styleUrls: ['./cash-book.component.css']
})
export class CashBookComponent implements OnInit, AfterViewInit {
  public sales: Array<Sales> = [];
  public expenses: Array<Expenses> = [];
  public totalSales: Array<Sales> = [];
  public totalExpenses: Array<Expenses> = [];
  public tableWidget: any;
  tableCheck = false;
  newSales: any;
  newExpenses: any;
  show = false;
  files: FileList;
  convertFiles;
  newArray;
  totalInward = 0;
  totalOutward = 0;
  excelBuffer: any;
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook
  exportedSalesArray: any;
  isUserPermitted = true;
  branch;
  promise1;
  promise2;
  promise3;
  promise4;
  promise5;
  dateFrom: any;
  dateTo: any;
  timeFrom: any;
  timeTo: any;
  isEvacuate = false;
  isSupervisor = false;
  isRefund = false;
  departments: any[];
  selectedDepartment;
  months: any[];
  years: any[];
  selectedMonth;
  selectedYear = new Date().getFullYear();
  isFilterMonth = false;
  isFilterDepartment = false;
  cashBookArray: any[];
  paginatedCashBookArray: any[];
  cashBook: any;
  paginatedCashBook: any;
  paginatedSales;
  paginatedExpenses;
  isPreviousActive = false;
  isNextActive = false;


  constructor(public pouchService: PouchService, private router: Router, private data: DataService, private dialog: MatDialog, public toastr: ToastrService) {
    this.cashBook = {
      saleId: '',
      saleDate: '',
      saleParticular: '',
      saleAmount: '',
      saleIsReconciled: true,
      salecolor: '',
      expenseId: '',
      expenseDate: '',
      expenseParticular: '',
      expenseAmount: '',
      expenseIsReconciled: true,
      expensecolor: '',
    }
  }

  ngOnInit() {
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.departments = ['Main Pharmacy', 'GOPD Pharmacy', 'Laboratory',
      'Radiology', 'Account', 'Revenue', 'Audit'];

    this.timeFrom = '00:00';
    this.timeTo = '00:00';

    this.pouchService.userPermission().then(result => {
      if (result.department == 'Admin') {
        this.isUserPermitted = false;
      }
    });

    this.loadCashbook();
    this.getYears();
    this.getMonths();
    this.checkRoles();
  }

  ngAfterViewInit() {

  }

  getYears() {
    this.years = [];
    var currentYear = new Date().getFullYear();

    for (var i = 1980; i <= currentYear; i++) {

      this.years.push(i);
    }
  }

  getMonths() {
    var indexMonth = new Date().getMonth();
    this.selectedMonth = this.months[indexMonth];
  }

  filterByMonth() {
    this.isFilterMonth = true;
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(data => {
        if (data.length != 0) {
          this.pouchService.paginationId = data[0].id; //Reverse of what is meant to be;
        }
        this.pouchService.paginateByBranch2('sale', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedSales = paginatedata;
          this.pouchService.getExpenses().then(expensedata => {
            if (expensedata.length != 0) {
              this.pouchService.paginationId = expensedata[0].id; //Reverse of what is meant to be;
            }
            this.pouchService.paginateByBranch2('expense', this.pouchService.paginationId).then(paginatedata => {
              this.paginatedExpenses = paginatedata;
              if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.
                this.sales = data.filter(data => data.branch == staff.branch);
                this.expenses = expensedata.filter(expensedata => expensedata.branch == staff.branch);
                //Paginated Data
                this.paginatedSales = this.paginatedSales.filter(data => data.branch == staff.branch);
                this.paginatedExpenses = this.paginatedExpenses.filter(expensedata => expensedata.branch == staff.branch);
              }
              else {
                if (!this.isFilterDepartment) {
                  this.sales = data.filter(data => data.branch == staff.branch);
                  this.expenses = expensedata.filter(expensedata => expensedata.branch == staff.branch);

                  //Paginated Data
                  this.paginatedSales = this.paginatedSales.filter(data => data.branch == staff.branch);
                  this.paginatedExpenses = this.paginatedExpenses.filter(expensedata => expensedata.branch == staff.branch);
                }
                else {
                  this.sales = data.filter(data => data.branch == staff.branch && data.department == this.selectedDepartment);
                  this.expenses = expensedata.filter(expensedata => expensedata.branch == staff.branch && expensedata.departmentname == this.selectedDepartment);

                  //Paginated Data
                  this.paginatedSales = this.paginatedSales.filter(data => data.branch == staff.branch && data.department == this.selectedDepartment);
                  this.paginatedExpenses = this.paginatedExpenses.filter(expensedata => expensedata.branch == staff.branch && expensedata.departmentname == this.selectedDepartment);
                }
              }
              this.sales = this.sales.filter(data => data.iscomplete == true);
              this.sales = this.sales.filter(data => data.isoncredit == false);
              this.expenses = this.expenses.filter(expensedata => expensedata.iscomplete == true || expensedata.isowing == true);
              this.expenses = this.expenses.filter(expensedata => expensedata.isoncredit == false);

              //Paginated Data
              this.paginatedSales = this.paginatedSales.filter(data => data.iscomplete == true);
              this.paginatedSales = this.paginatedSales.filter(data => data.isoncredit == false);
              this.paginatedExpenses = this.paginatedExpenses.filter(expensedata => expensedata.iscomplete == true || expensedata.isowing == true);
              this.paginatedExpenses = this.paginatedExpenses.filter(expensedata => expensedata.isoncredit == false);

              this.sales = this.sales.filter(data => {
                var dbMonth = this.months[new Date(data.date).getMonth()];
                var dbYear = new Date(data.date).getFullYear();

                return this.selectedMonth == dbMonth && this.selectedYear == dbYear;

              });
              this.expenses = this.expenses.filter(data => {
                var dbMonth = this.months[new Date(data.date).getMonth()];
                var dbYear = new Date(data.date).getFullYear();

                return this.selectedMonth == dbMonth && this.selectedYear == dbYear;

              });

              //Pagianted Data
              this.paginatedSales = this.paginatedSales.filter(data => {
                var dbMonth = this.months[new Date(data.date).getMonth()];
                var dbYear = new Date(data.date).getFullYear();

                return this.selectedMonth == dbMonth && this.selectedYear == dbYear;

              });
              this.paginatedExpenses = this.paginatedExpenses.filter(data => {
                var dbMonth = this.months[new Date(data.date).getMonth()];
                var dbYear = new Date(data.date).getFullYear();

                return this.selectedMonth == dbMonth && this.selectedYear == dbYear;

              });
              this.getCashBookRecords(this.sales, this.expenses, this.paginatedSales, this.paginatedExpenses);
              this.getTotalInwards(this.cashBookArray);
              this.getTotalOutwards(this.cashBookArray);
            });
          });
        });
      });
    });
  }

  checkRoles() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      staff.roles.map(role => {
        if (role.role == "Evacuate" && role.isChecked == true) {
          this.isEvacuate = true;
        }
        if (role.role == "Refund/Return" && role.isChecked == true) {
          this.isRefund = true;
        }
      })
    });
  }

  filterByDepartment() {
    this.isFilterDepartment = true;
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(data => {
        if (data.length != 0) {
          this.pouchService.paginationId = data[0].id; //Reverse of what is meant to be;
        }
        this.pouchService.paginateByBranch2('sale', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedSales = paginatedata;
          this.pouchService.getExpenses().then(expensedata => {
            if (expensedata.length != 0) {
              this.pouchService.paginationId = expensedata[0].id; //Reverse of what is meant to be;
            }
            this.pouchService.paginateByBranch2('expense', this.pouchService.paginationId).then(paginatedata => {
              this.paginatedExpenses = paginatedata;
              if (this.selectedDepartment != "Account" && this.selectedDepartment != "Revenue" && this.selectedDepartment != "Audit") { //If not those departments then filter by specific department logged.
                if (!this.isFilterMonth) {
                  this.sales = data.filter(data => data.branch == staff.branch && data.department == this.selectedDepartment);
                  this.expenses = expensedata.filter(expensedata => expensedata.branch == staff.branch && expensedata.departmentname == this.selectedDepartment);

                  //Paginated Data;
                  this.paginatedSales = this.paginatedSales.filter(data => data.department == this.selectedDepartment);
                  this.paginatedExpenses = this.paginatedExpenses.filter(expensedata => expensedata.departmentname == this.selectedDepartment);
                }
                else {
                  this.sales = data.filter(data => {
                    var dbMonth = this.months[new Date(data.date).getMonth()];
                    var dbYear = new Date(data.date).getFullYear();
                    return this.selectedMonth == dbMonth && this.selectedYear == dbYear && data.branch == staff.branch && data.department == this.selectedDepartment;
                  });
                  this.expenses = this.expenses.filter(data => {
                    var dbMonth = this.months[new Date(data.date).getMonth()];
                    var dbYear = new Date(data.date).getFullYear();

                    return this.selectedMonth == dbMonth && this.selectedYear == dbYear && data.branch == staff.branch && data.departmentname == this.selectedDepartment;
                  });

                  //Paginated Data;
                  this.paginatedSales = this.paginatedSales.filter(data => {
                    var dbMonth = this.months[new Date(data.date).getMonth()];
                    var dbYear = new Date(data.date).getFullYear();
                    return this.selectedMonth == dbMonth && this.selectedYear == dbYear && data.branch == staff.branch && data.department == this.selectedDepartment;
                  });
                  this.paginatedExpenses = this.paginatedExpenses.filter(data => {
                    var dbMonth = this.months[new Date(data.date).getMonth()];
                    var dbYear = new Date(data.date).getFullYear();

                    return this.selectedMonth == dbMonth && this.selectedYear == dbYear && data.branch == staff.branch && data.departmentname == this.selectedDepartment;
                  });
                }
              }
              else {
                if (!this.isFilterMonth) {
                  this.sales = data.filter(data => data.branch == staff.branch);
                  this.expenses = expensedata.filter(expensedata => expensedata.branch == staff.branch);

                  //Paginated Data;
                  this.paginatedSales = this.paginatedSales.filter(data => data.branch == staff.branch);
                  this.paginatedExpenses = this.paginatedExpenses.filter(expensedata => expensedata.branch == staff.branch);
                }
                else {
                  this.sales = data.filter(data => {
                    var dbMonth = this.months[new Date(data.date).getMonth()];
                    var dbYear = new Date(data.date).getFullYear();
                    return this.selectedMonth == dbMonth && this.selectedYear == dbYear && data.branch == staff.branch;
                  });
                  this.expenses = this.expenses.filter(data => {
                    var dbMonth = this.months[new Date(data.date).getMonth()];
                    var dbYear = new Date(data.date).getFullYear();

                    return this.selectedMonth == dbMonth && this.selectedYear == dbYear && data.branch == staff.branch;
                  });

                  //Paginated Data;
                  this.paginatedSales = this.paginatedSales.filter(data => {
                    var dbMonth = this.months[new Date(data.date).getMonth()];
                    var dbYear = new Date(data.date).getFullYear();
                    return this.selectedMonth == dbMonth && this.selectedYear == dbYear && data.branch == staff.branch;
                  });
                  this.paginatedExpenses = this.paginatedExpenses.filter(data => {
                    var dbMonth = this.months[new Date(data.date).getMonth()];
                    var dbYear = new Date(data.date).getFullYear();

                    return this.selectedMonth == dbMonth && this.selectedYear == dbYear && data.branch == staff.branch;
                  });
                }
              }
              this.sales = this.sales.filter(data => data.iscomplete == true);
              this.sales = this.sales.filter(data => data.isoncredit == false);
              this.expenses = this.expenses.filter(expensedata => expensedata.iscomplete == true || expensedata.isowing == true);
              this.expenses = this.expenses.filter(expensedata => expensedata.isoncredit == false);

              //Paginated Data;
              this.paginatedSales = this.paginatedSales.filter(data => data.iscomplete == true);
              this.paginatedSales = this.paginatedSales.filter(data => data.isoncredit == false);
              this.paginatedExpenses = this.paginatedExpenses.filter(expensedata => expensedata.iscomplete == true || expensedata.isowing == true);
              this.paginatedExpenses = this.paginatedExpenses.filter(expensedata => expensedata.isoncredit == false);
              this.getCashBookRecords(this.sales, this.expenses, this.paginatedSales, this.paginatedExpenses);
              this.getTotalInwards(this.cashBookArray);
              this.getTotalOutwards(this.cashBookArray);
            });
          });
        });
        this.isNextActive = true;
      });
    });
  }

  relaodCashBook() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {

      this.pouchService.getSales().then(data => {
        this.sales = data.filter(data => data.branch == staff.branch);
        if (this.sales.length != 0) {
          this.pouchService.paginationId = this.sales[0].id; //Reverse of what is meant to be;
        }
        this.pouchService.paginateByBranch2('sale', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedSales = paginatedata;

          this.paginatedSales = this.paginatedSales.filter(data => data.iscomplete == true);
          this.paginatedSales = this.paginatedSales.filter(data => data.isoncredit == false);

          this.sales = this.sales.filter(data => data.iscomplete == true);
          this.sales = this.sales.filter(data => data.isoncredit == false);

          this.pouchService.getExpenses().then(data => {
            this.expenses = data.filter(data => data.branch == staff.branch);
            if (this.expenses.length != 0) {
              this.pouchService.paginationId = this.expenses[0].id; //Reverse of what is meant to be;
            }
            this.pouchService.paginateByBranch2('expense', this.pouchService.paginationId).then(paginatedata => {
              this.paginatedExpenses = paginatedata;

              this.paginatedExpenses = this.paginatedExpenses.filter(data => data.iscomplete == true);
              this.paginatedExpenses = this.paginatedExpenses.filter(data => data.isoncredit == false);

              this.expenses = this.expenses.filter(data => data.iscomplete == true || data.isowing == true);
              this.expenses = this.expenses.filter(data => data.isoncredit == false);

              this.getCashBookRecords(this.sales, this.expenses, this.paginatedSales, this.paginatedExpenses);
              this.isNextActive = true;
            });
          });
          this.isNextActive = true;
        });
      });
    });
  }

  loadCashbook() {
    this.cashBookArray = [];

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {

      this.pouchService.getSales().then(data => {
        this.sales = data.filter(data => data.branch == staff.branch);
        if (this.sales.length != 0) {
          this.pouchService.paginationId = this.sales[0].id; //Reverse of what is meant to be;
        }
        this.pouchService.paginateByBranch2('sale', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedSales = paginatedata;

          this.paginatedSales = this.paginatedSales.filter(data => data.iscomplete == true);
          this.paginatedSales = this.paginatedSales.filter(data => data.isoncredit == false);

          this.sales = this.sales.filter(data => data.iscomplete == true);
          this.sales = this.sales.filter(data => data.isoncredit == false);

          this.pouchService.getExpenses().then(data => {
            this.expenses = data.filter(data => data.branch == staff.branch);
            if (this.expenses.length != 0) {
              this.pouchService.paginationId = this.expenses[0].id; //Reverse of what is meant to be;
            }
            this.pouchService.paginateByBranch2('expense', this.pouchService.paginationId).then(paginatedata => {
              this.paginatedExpenses = paginatedata;

              this.paginatedExpenses = this.paginatedExpenses.filter(data => data.iscomplete == true);
              this.paginatedExpenses = this.paginatedExpenses.filter(data => data.isoncredit == false);

              this.expenses = this.expenses.filter(data => data.iscomplete == true || data.isowing == true);
              this.expenses = this.expenses.filter(data => data.isoncredit == false);

              this.getCashBookRecords(this.sales, this.expenses, this.paginatedSales, this.paginatedExpenses);

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
          this.isNextActive = true;
        });
      });
    });
  }

  next() {
    if (this.paginatedSales.length != 0) {
      this.pouchService.paginationId = this.paginatedSales[this.paginatedSales.length - 1].id;  //Reverse of what is meant to be;
    }
    if (this.paginatedExpenses.length != 0) {
      this.pouchService.paginationId = this.paginatedExpenses[this.paginatedExpenses.length - 1].id;
    }

    this.pouchService.paginateByBranch2('sale', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedSales = paginatedata;

      this.paginatedSales = this.paginatedSales.filter(data => data.iscomplete == true);
      this.paginatedSales = this.paginatedSales.filter(data => data.isoncredit == false);

      this.pouchService.paginateByBranch2('expense', this.pouchService.paginationId).then(paginatedata => {
        this.paginatedExpenses = paginatedata;

        this.paginatedExpenses = this.paginatedExpenses.filter(data => data.iscomplete == true);
        this.paginatedExpenses = this.paginatedExpenses.filter(data => data.isoncredit == false);

        this.isPreviousActive = true;

        this.getCashBookRecords(this.sales, this.expenses, this.paginatedSales, this.paginatedExpenses);
      });
    });
  }

  previous() {
    if (this.paginatedSales.length != 0) {
      this.pouchService.paginationId = this.paginatedSales[this.paginatedSales.length - 1].id;  //Reverse of what is meant to be;
    }
    if (this.paginatedExpenses.length != 0) {
      this.pouchService.paginationId = this.paginatedExpenses[this.paginatedExpenses.length - 1].id;
    }

    this.pouchService.paginateByBranchPrev2('sale', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedSales = paginatedata;

      this.paginatedSales = this.paginatedSales.filter(data => data.iscomplete == true);
      this.paginatedSales = this.paginatedSales.filter(data => data.isoncredit == false);

      this.pouchService.paginateByBranchPrev2('expense', this.pouchService.paginationId).then(paginatedata => {
        this.paginatedExpenses = paginatedata;

        this.paginatedExpenses = this.paginatedExpenses.filter(data => data.iscomplete == true);
        this.paginatedExpenses = this.paginatedExpenses.filter(data => data.isoncredit == false);

        if (this.paginatedSales.length < this.pouchService.limitRange && this.paginatedExpenses.length < this.pouchService.limitRange) {
          this.isPreviousActive = false;
        }

        this.getCashBookRecords(this.sales, this.expenses, this.paginatedSales, this.paginatedExpenses);
      });
    });
  }

  goToStart() {
    this.isPreviousActive = false;

    if (this.paginatedSales.length != 0) {
      this.pouchService.paginationId = this.paginatedSales[this.paginatedSales.length - 1].id;  //Reverse of what is meant to be;
    }
    if (this.paginatedExpenses.length != 0) {
      this.pouchService.paginationId = this.paginatedExpenses[this.paginatedExpenses.length - 1].id;
    }

    this.pouchService.paginateByBranchStart('sale', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedSales = paginatedata;

      this.paginatedSales = this.paginatedSales.filter(data => data.iscomplete == true);
      this.paginatedSales = this.paginatedSales.filter(data => data.isoncredit == false);

      this.pouchService.paginateByBranchStart('expense', this.pouchService.paginationId).then(paginatedata => {
        this.paginatedExpenses = paginatedata;

        this.paginatedExpenses = this.paginatedExpenses.filter(data => data.iscomplete == true);
        this.paginatedExpenses = this.paginatedExpenses.filter(data => data.isoncredit == false);

        this.getCashBookRecords(this.sales, this.expenses, this.paginatedSales, this.paginatedExpenses);
      });
    });
  }

  viewCounterProduct() {
    this.router.navigate(['/general-counter-product']);
  }

  loadTotalCashBook(cashBookArray) {
    this.getTotalInwards(cashBookArray);
    this.getTotalOutwards(cashBookArray);
  }

  getCashBookRecords(sales, expenses, paginatedSales, paginatedExpenses) {
    this.cashBookArray = [];
    this.paginatedCashBookArray = [];
    console.log(paginatedSales);

    if (expenses.length <= sales.length) {
      for (var i = 0; i < sales.length; i++) {
        if (expenses[i] != undefined) {
          this.cashBook = {
            saleId: sales[i].id,
            saleDate: sales[i].date,
            saleParticular: sales[i].salename,
            saleAmount: sales[i].amount,
            saleIsReconciled: sales[i].isreconciled,
            salecolor: sales[i].color,
            expenseId: expenses[i].id,
            expenseDate: expenses[i].date,
            expenseParticular: expenses[i].expensename,
            expenseAmount: expenses[i].amount,
            expenseIsReconciled: expenses[i].isreconciled,
            expensecolor: expenses[i].color
          }
          this.cashBookArray.push(this.cashBook);
        }
        if (expenses[i] == undefined) {
          this.cashBook = {
            saleId: sales[i].id,
            saleDate: sales[i].date,
            saleParticular: sales[i].salename,
            saleAmount: sales[i].amount,
            saleIsReconciled: sales[i].isreconciled,
            salecolor: sales[i].color,
            expenseId: '',
            expenseDate: '',
            expenseParticular: '',
            expenseAmount: '',
            expenseIsReconciled: true,
            expensecolor: ''
          }
          this.cashBookArray.push(this.cashBook);
        }
      }
    }
    else if (expenses.length >= sales.length) {
      for (var i = 0; i < expenses.length; i++) {
        if (sales[i] != undefined) {
          this.cashBook = {
            saleId: sales[i].id,
            saleDate: sales[i].date,
            saleParticular: sales[i].salename,
            saleAmount: sales[i].amount,
            saleIsReconciled: sales[i].isreconciled,
            salecolor: sales[i].color,
            expenseId: expenses[i].id,
            expenseDate: expenses[i].date,
            expenseParticular: expenses[i].expensename,
            expenseAmount: expenses[i].amount,
            expenseIsReconciled: expenses[i].isreconciled,
            expensecolor: expenses[i].color
          }
          this.cashBookArray.push(this.cashBook);
        }
        if (sales[i] == undefined) {
          this.cashBook = {
            saleId: '',
            saleDate: '',
            saleParticular: '',
            saleAmount: '',
            saleIsReconciled: true,
            salecolor: '',
            expenseId: expenses[i].id,
            expenseDate: expenses[i].date,
            expenseParticular: expenses[i].expensename,
            expenseAmount: expenses[i].amount,
            expenseIsReconciled: expenses[i].isreconciled,
            expensecolor: expenses[i].color
          }
          this.cashBookArray.push(this.cashBook);
        }
      }
    }
    this.loadTotalCashBook(this.cashBookArray);

    //Paginated data
    if (paginatedExpenses.length <= paginatedSales.length) {
      for (var i = 0; i < sales.length; i++) {
        if (paginatedExpenses[i] != undefined) {
          this.paginatedCashBook = {
            saleId: paginatedSales[i].id,
            saleDate: paginatedSales[i].date,
            saleParticular: paginatedSales[i].salename,
            saleAmount: paginatedSales[i].amount,
            saleIsReconciled: paginatedSales[i].isreconciled,
            salecolor: paginatedSales[i].color,
            expenseId: paginatedExpenses[i].id,
            expenseDate: paginatedExpenses[i].date,
            expenseParticular: paginatedExpenses[i].expensename,
            expenseAmount: paginatedExpenses[i].amount,
            expenseIsReconciled: paginatedExpenses[i].isreconciled,
            expensecolor: paginatedExpenses[i].color
          }
          this.paginatedCashBookArray.push(this.paginatedCashBook);
        }
        if (paginatedExpenses[i] == undefined) {
          this.paginatedCashBook = {
            saleId: paginatedSales[i].id,
            saleDate: paginatedSales[i].date,
            saleParticular: paginatedSales[i].salename,
            saleAmount: paginatedSales[i].amount,
            saleIsReconciled: paginatedSales[i].isreconciled,
            salecolor: paginatedSales[i].color,
            expenseId: '',
            expenseDate: '',
            expenseParticular: '',
            expenseAmount: '',
            expenseIsReconciled: true,
            expensecolor: ''
          }
          this.paginatedCashBookArray.push(this.paginatedCashBook);
          console.log(this.paginatedCashBookArray);
        }
      }
    }
    else if (paginatedExpenses.length >= paginatedSales.length) {
      for (var i = 0; i < paginatedExpenses.length; i++) {
        if (paginatedSales[i] != undefined) {
          this.cashBook = {
            saleId: paginatedSales[i].id,
            saleDate: paginatedSales[i].date,
            saleParticular: paginatedSales[i].salename,
            saleAmount: paginatedSales[i].amount,
            saleIsReconciled: paginatedSales[i].isreconciled,
            salecolor: paginatedSales[i].color,
            expenseId: paginatedExpenses[i].id,
            expenseDate: paginatedExpenses[i].date,
            expenseParticular: paginatedExpenses[i].expensename,
            expenseAmount: paginatedExpenses[i].amount,
            expenseIsReconciled: paginatedExpenses[i].isreconciled,
            expensecolor: paginatedExpenses[i].color
          }
          this.paginatedCashBookArray.push(this.paginatedCashBook);
        }
        if (paginatedSales[i] == undefined) {
          this.paginatedCashBook = {
            saleId: '',
            saleDate: '',
            saleParticular: '',
            saleAmount: '',
            saleIsReconciled: true,
            salecolor: '',
            expenseId: paginatedExpenses[i].id,
            expenseDate: paginatedExpenses[i].date,
            expenseParticular: paginatedExpenses[i].expensename,
            expenseAmount: paginatedExpenses[i].amount,
            expenseIsReconciled: paginatedExpenses[i].isreconciled,
            expensecolor: paginatedExpenses[i].color
          }
          this.paginatedCashBookArray.push(this.paginatedCashBook);
        }
      }
    }
  }

  returnSale(sale) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: sale
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        if (sale.productorder.length != 0) {
          this.promise1 = sale.productorder.map(async productorder => {
            await this.pouchService.getProductcategory(productorder.productcatid).then(productcategory => {
              this.promise2 = this.pouchService.getCounterProduct(productorder.id).then(async counterproduct => {
                if (productcategory != undefined) {
                  if (counterproduct.isUnitSelling == true) {
                    counterproduct.suppliedunit += productorder.qty;
                    counterproduct.totalsubitem += productcategory.subitemno;
                  }
                  else if (counterproduct.isUnitSelling == false) {
                    counterproduct.totalsubitem += productorder.qty;
                    counterproduct.suppliedunit = Math.floor(counterproduct.totalsubitem / productcategory.subitemno);
                  }
                }
                else {
                  if (counterproduct.isUnitSelling == true) {
                    counterproduct.suppliedunit += productorder.qty;
                    counterproduct.totalsubitem += counterproduct['initialsubitem'];
                  }
                  else if (counterproduct.isUnitSelling == false) {
                    counterproduct.totalsubitem += productorder.qty;
                    counterproduct.suppliedunit = Math.floor(counterproduct.totalsubitem / counterproduct['initialsubitem']);
                  }
                }
                await this.pouchService.updateCounterProduct(counterproduct);
                /*  if (sale.staffloan) {
                   this.pouchService.getStaff(sale.patientid).then(result => {
                     console.log(result);
                     if (result != undefined) {
                       result.debt -= sale.balance;
                       this.pouchService.updateStaff(result);
                     }
                     else {
                       this.pouchService.getPatient(sale.patientid).then(result => {
                         result.debt -= sale.balance;
                         this.pouchService.updatePatient(result)
                       });
                     }
                   });
                 }
                 else if (sale.departmentloan) {
                   this.pouchService.getDepartment(sale.departmentid).then(result => {
                     result.debt -= sale.balance;
                     this.pouchService.updateDepartment(result);
                   });
                 } */
                if (sale.isowing) {
                  this.promise3 = this.pouchService.getStaff(sale.patientid).then(async result => {
                    if (result != undefined) {
                      result.debt -= sale.balance;
                      await this.pouchService.updateStaff(result);
                    }
                    else {
                      this.promise4 = this.pouchService.getPatient(sale.patientid).then(async result => {
                        if (result != undefined) {
                          result.debt -= sale.balance;
                          await this.pouchService.updatePatient(result);
                        }
                        else {
                          this.promise5 = this.pouchService.getDepartment(sale.departmentid).then(async result => {
                            result.debt -= sale.balance;
                            await this.pouchService.updateDepartment(result);
                          });
                        }
                      });
                    }
                  });
                }
              });
            });
            Promise.all([this.promise1, this.promise2, this.promise3, this.promise4, this.promise5]).then(res => {
              setTimeout(() => {
                this.pouchService.getIndividualSales().then(individualsales => {
                  individualsales.map(individualsale => {
                    individualsale.saleids.filter(data => data == sale.id);
                    if (individualsale.saleids.length != 0) {
                      individualsale.totaldailysales -= sale.amount;
                      this.pouchService.updateIndividualSale(individualsale).then(res => {
                        this.pouchService.deleteSale(sale).then(res => {
                          this.loadCashbook();
                        });
                      });
                    }
                  });
                });
              }, 5000);
            })
          });
        }
        else {
          if (sale.isowing) {
            this.promise3 = this.pouchService.getStaff(sale.patientid).then(async result => {
              if (result != undefined) {
                result.debt -= sale.balance;
                await this.pouchService.updateStaff(result).then(response => {
                  this.pouchService.getIndividualSales().then(individualsales => {
                    individualsales.map(individualsale => {
                      individualsale.saleids.filter(data => data == sale.id);
                      if (individualsale.saleids.length != 0) {
                        individualsale.totaldailysales -= sale.amount;
                        this.pouchService.updateIndividualSale(individualsale).then(res => {
                          this.pouchService.deleteSale(sale).then(res => {
                            this.loadCashbook();
                          });
                        });
                      }
                    });
                  });
                });
              }
              else {
                this.promise4 = this.pouchService.getPatient(sale.patientid).then(async result => {
                  if (result != undefined) {
                    result.debt -= sale.balance;
                    await this.pouchService.updatePatient(result).then(response => {
                      this.pouchService.getIndividualSales().then(individualsales => {
                        individualsales.map(individualsale => {
                          individualsale.saleids.filter(data => data == sale.id);
                          if (individualsale.saleids.length != 0) {
                            individualsale.totaldailysales -= sale.amount;
                            this.pouchService.updateIndividualSale(individualsale).then(res => {
                              this.pouchService.deleteSale(sale).then(res => {
                                this.loadCashbook();
                              });
                            });
                          }
                        });
                      });
                    });
                  }
                  else {
                    this.promise5 = this.pouchService.getDepartment(sale.departmentid).then(async result => {
                      result.debt -= sale.balance;
                      await this.pouchService.updateDepartment(result).then(response => {
                        this.pouchService.getIndividualSales().then(individualsales => {
                          individualsales.map(individualsale => {
                            individualsale.saleids.filter(data => data == sale.id);
                            if (individualsale.saleids.length != 0) {
                              individualsale.totaldailysales -= sale.amount;
                              this.pouchService.updateIndividualSale(individualsale).then(res => {
                                this.pouchService.deleteSale(sale).then(res => {
                                  this.loadCashbook();
                                });
                              });
                            }
                          });
                        });
                      });
                    });
                  }
                });
              }
            });
          }
          else {
            this.pouchService.getIndividualSales().then(individualsales => {
              individualsales.map(individualsale => {
                individualsale.saleids.filter(data => data == sale.id);
                if (individualsale.saleids.length != 0) {
                  individualsale.totaldailysales -= sale.amount;
                  this.pouchService.updateIndividualSale(individualsale).then(res => {
                    this.pouchService.deleteSale(sale).then(res => {
                      this.loadCashbook();
                    });
                  });
                }
              });
            });
          }
        }
      }
    });
  }

  flagInwardReconciliation(cashbook, event) {
    if (event.checked) {
      cashbook.salecolor = "red";
      cashbook.saleIsReconciled = false;
      this.pouchService.getSale(cashbook.saleId).then(result => {
        result.color = "red";
        result.isreconciled = false;
        this.pouchService.updateSale(result)
        this.loadTotalCashBook(this.cashBookArray);
        this.relaodCashBook();
      });
    }
    else {
      cashbook.salecolor = "";
      cashbook.saleIsReconciled = true;
      this.pouchService.getSale(cashbook.saleId).then(result => {
        result.color = "";
        result.isreconciled = true;
        this.pouchService.updateSale(result);
        this.loadTotalCashBook(this.cashBookArray);
        this.relaodCashBook();
      });
    }
  }

  flagOutwardReconciliation(cashbook, event) {
    if (event.checked) {
      cashbook.expensecolor = "red";
      cashbook.expenseIsReconciled = false;
      this.pouchService.getExpense(cashbook.expenseId).then(result => {
        result.color = "red";
        result.isreconciled = false;
        this.pouchService.updateExpense(result)
        this.loadTotalCashBook(this.cashBookArray);
        this.relaodCashBook();
      });
    }
    else {
      cashbook.expensecolor = "";
      cashbook.expenseIsReconciled = true;
      this.pouchService.getExpense(cashbook.expenseId).then(result => {
        result.color = "";
        result.isreconciled = true;
        this.pouchService.updateExpense(result);
        this.loadTotalCashBook(this.cashBookArray);
        this.relaodCashBook();
      });
    }
  }


  public export(): void {
    var exportedSalesArray = [];

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(items => {
        items = items.filter(data => data.branch == staff.branch);
        items = items.filter(data => data.iscomplete == true);
        items = items.filter(data => data.isoncredit == false);

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
        this.saveAsExcelFile(this.excelBuffer, 'IUTH Sales');
      });
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  getTotalInwards(cashBookArray) {

    var saleArray = [];
    cashBookArray = cashBookArray.filter(data => data.saleIsReconciled == true);
    cashBookArray.forEach(sale => {
      saleArray.push(sale.saleAmount);
    });
    return this.totalInward = saleArray.reduce((a, b) => a + b, 0);
  }

  getTotalOutwards(cashBookArray) {

    var saleArray = [];
    cashBookArray = cashBookArray.filter(data => data.expenseIsReconciled == true);
    cashBookArray.forEach(expense => {
      saleArray.push(expense.expenseAmount);
    });
    return this.totalOutward = saleArray.reduce((a, b) => a + b, 0);
  }

  cashInHand() {
    return this.totalInward - this.totalOutward;
  }

  evacuateList() {
    this.router.navigate(['view-evacuated-sales']);
  }

  loans() {
    this.router.navigate(['loans']);
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedCashBookArray = [];

    for (let cashBook of this.cashBookArray) {
      if ((cashBook.saleParticular).toLowerCase().indexOf(value) !== -1 || (cashBook.expenseParticular).toLowerCase().indexOf(value) !== -1) {
        this.paginatedCashBookArray.push(cashBook);
        this.paginatedCashBookArray = this.paginatedCashBookArray.slice(0, this.pouchService.limitRange);
      }
    }
  }

}
