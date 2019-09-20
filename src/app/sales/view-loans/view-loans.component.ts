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

@Component({
  selector: 'app-view-loans',
  templateUrl: './view-loans.component.html',
  styleUrls: ['./view-loans.component.css']
})
export class ViewLoansComponent implements OnInit {
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

  constructor(public pouchService: PouchService, private router: Router, private dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.loadLoans();
    this.loadTotalLoans();
  }

  loadLoans() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {

      this.pouchService.getSales().then(data => {
        this.loans = data.filter(data => data.branch == staff.branch);
        this.loans = this.loans.filter(data => data.isoncredit == true || data.isowing == true);
        this.loans = this.loans.filter(data => data.iscomplete == true);
        console.log(this.loans);
        $(document).ready(function () {
          $('#dtBasicExample').DataTable();
          $('.dataTables_length').addClass('bs-select');
        });
      });
    });
  }

  loadTotalLoans() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(data => {
        this.totalLoans = data.filter(data => data.branch == staff.branch);
        this.totalLoans = this.totalLoans.filter(data => data.isoncredit == true || data.isowing == true);
        this.totalLoans = this.totalLoans.filter(data => data.iscomplete == true);
        this.getTotalLoans(this.totalLoans);
      });
    });
  }


  returnLoan(loan) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: loan
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        if (loan.productorder.length != 0) {
          this.promise1 = loan.productorder.map(async productorder => {
            await this.pouchService.getProductcategory(productorder.productcatid).then(productcategory => {
              this.promise2 = this.pouchService.getCounterProduct(productorder.id).then(async counterproduct => {
                if (counterproduct.isUnitSelling == true) {
                  counterproduct.suppliedunit += productorder.qty;
                  counterproduct.totalsubitem += productcategory.subitemno;
                }
                else if (counterproduct.isUnitSelling == false) {
                  counterproduct.totalsubitem += productorder.qty;
                  counterproduct.suppliedunit = Math.floor(counterproduct.totalsubitem / productcategory.subitemno);
                }
                await this.pouchService.updateCounterProduct(counterproduct);
                if (loan.staffloan) {
                   this.pouchService.getStaff(loan.patientid).then(result => {
                     if (result != undefined) {
                       result.debt -= loan.amountloaned;
                       this.pouchService.updateStaff(result);
                     }
                     else {
                       this.pouchService.getPatient(loan.patientid).then(result => {
                         result.debt -= loan.amountloaned;
                         this.pouchService.updatePatient(result)
                       });
                     }
                   });
                 }
                 else if (loan.departmentloan) {
                   this.pouchService.getDepartment(loan.departmentid).then(result => {
                     result.debt -= loan.amountloaned;
                     this.pouchService.updateDepartment(result);
                   });
                 }
                if (loan.isowing) {
                  this.promise3 = this.pouchService.getStaff(loan.patientid).then(async result => {
                    if (result != undefined) {
                      result.debt -= loan.balance;
                      await this.pouchService.updateStaff(result);
                    }
                    else {
                      this.promise4 = this.pouchService.getPatient(loan.patientid).then(async result => {
                        if (result != undefined) {
                          result.debt -= loan.balance;
                          await this.pouchService.updatePatient(result);
                        }
                        else {
                          this.promise5 = this.pouchService.getDepartment(loan.departmentid).then(async result => {
                            result.debt -= loan.balance;
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
                this.pouchService.deleteSale(loan).then(res => {
                  this.loadLoans();
                });
              }, 5000);
            })
          });
        }
        else {
          if (loan.isowing) {
            this.promise3 = this.pouchService.getStaff(loan.patientid).then(async result => {
              if (result != undefined) {
                result.debt -= loan.balance;
                await this.pouchService.updateStaff(result).then(response => {
                  this.pouchService.deleteSale(loan).then(res => {
                    this.loadLoans();
                  });
                });
              }
              else {
                this.promise4 = this.pouchService.getPatient(loan.patientid).then(async result => {
                  if (result != undefined) {
                    result.debt -= loan.balance;
                    await this.pouchService.updatePatient(result).then(response => {
                      this.pouchService.deleteSale(loan).then(res => {
                        this.loadLoans();
                      });
                    });
                  }
                  else {
                    this.promise5 = this.pouchService.getDepartment(loan.departmentid).then(async result => {
                      result.debt -= loan.balance;
                      await this.pouchService.updateDepartment(result).then(response => {
                        this.pouchService.deleteSale(loan).then(res => {
                          this.loadLoans();
                        });
                      });
                    });
                  }
                });
              }
            });
          }
          else {
            this.pouchService.deleteSale(loan).then(res => {
              this.loadLoans();
            });
          }
        }
      }
    });
  }

  getTotalLoans(loans) {

    var loanArray = [];
    loans = loans.filter(data => data.isreconciled == true);
    loans.forEach(loan => {
      loanArray.push(loan.amount);
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
        loans = loans.filter(data => data.branch == staff.branch);

        loans.map(loan => {
          loan['timestamp'] = new Date(loan.date).toLocaleString("en-US", { timeZone: "GMT" });
          loan['timestamp'] = new Date(loan['timestamp']).setSeconds(0);
          loan['timestamp'] = new Date(loan['timestamp']).setMinutes(0);
          loan['timestamp'] = new Date(loan['timestamp']).setHours(0);

        });
        loans = loans.filter(data => this.dateFrom <= data['timestamp']);
        loans = loans.filter(data => this.dateTo >= data['timestamp']);
        this.loans = loans;
      });
    });
  }

    payLoan(loan) {
      console.log(loan);
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
        this.loadLoans();
      })
    }
}
