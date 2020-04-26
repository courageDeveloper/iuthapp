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
import { PinMessageComponent } from '../../pin-message/pin-message.component';

@Component({
  selector: 'app-creditordereditems',
  templateUrl: './creditordereditems.component.html',
  styleUrls: ['./creditordereditems.component.css']
})
export class CreditOrderedItemsComponent implements OnInit {
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
  timeFrom: any;
  timeTo: any;
  isUserPermitted = true;
  isEvacuate = false;
  isSupervisor = false;
  isRefund = false;
  isPayLoan = false;
  department: any;
  months: any[];
  years: any[];
  selectedMonth;
  selectedYear = new Date().getFullYear();
  paginatedLoans;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService, private router: Router, private dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.timeFrom = '00:00';
    this.timeTo = '00:00';

    this.pouchService.userPermission().then(result => {
      if (result.department == 'Admin') {
        this.isUserPermitted = false;
      }
    });

    this.checkRoles();
    this.loadLoans();
    this.loadTotalLoans();
    this.getYears();
    this.getMonths();
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

  reloadLoans() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.department = staff.department;
      this.pouchService.getSales().then(data => {
        
        this.loans = data.filter(data => data.branch == staff.branch && data.department == staff.department);
        this.loans = this.loans.filter(data => data.isoncredit == true || data.isowing == true);
        
        this.pouchService.paginationId = this.loans[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateBySaleRemoveItem('sale', this.pouchService.paginationId, staff.department, true, true).then(paginatedata => {
          this.paginatedLoans = paginatedata;
          
          this.isNextActive = true;
        });
      });
    });
  }

  filterByMonth() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(data => {
        this.loans = data.filter(data => data.branch == staff.branch && data.department == staff.department);
        this.loans = this.loans.filter(data => data.isoncredit == true || data.isowing == true);
        this.loans = this.loans.filter(data => {
          var dbMonth = this.months[new Date(data.date).getMonth()];
          var dbYear = new Date(data.date).getFullYear();

          this.getTotalLoans(this.loans);
          return this.selectedMonth == dbMonth && this.selectedYear == dbYear;
        });
        this.pouchService.paginationId = this.loans[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateBySale('sale', this.pouchService.paginationId, staff.department, true, true).then(paginatedata => {
          this.paginatedLoans = paginatedata;
          this.paginatedLoans = this.paginatedLoans.filter(data => {
            var dbMonth = this.months[new Date(data.date).getMonth()];
            var dbYear = new Date(data.date).getFullYear();

            return this.selectedMonth == dbMonth && this.selectedYear == dbYear;

          });
        });
      });
    });
  }

  checkRoles() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      staff.roles.map(role => {
        if (role.role == "Refund/Return" && role.isChecked == true) {
          this.isRefund = true;
        }
      })
    });
  }

  loadLoans() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.department = staff.department;
      this.pouchService.getSales().then(data => {
        
        this.loans = data.filter(data => data.branch == staff.branch && data.department == staff.department);
        this.loans = this.loans.filter(data => data.isoncredit == true || data.isowing == true);
        
        this.pouchService.paginationId = this.loans[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateBySale('sale', this.pouchService.paginationId, staff.department, true, true).then(paginatedata => {
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
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.department = staff.department;
      this.pouchService.paginationId = this.paginatedLoans[this.paginatedLoans.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateBySale('sale', this.pouchService.paginationId, staff.department, true, true).then(paginatedata => {
        this.paginatedLoans = paginatedata;

        this.isPreviousActive = true;
      });
    });
  }

  previous() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.department = staff.department;
      this.pouchService.paginationId = this.paginatedLoans[this.paginatedLoans.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateBySalePrev('sale', this.pouchService.paginationId, staff.department, true, true).then(paginatedata => {
        this.paginatedLoans = paginatedata;

        if (this.paginatedLoans.length < this.pouchService.limitRange) {
          this.isPreviousActive = false;
        }
      });
    });
  }

  goToStart() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.department = staff.department;
      this.isPreviousActive = false;

      this.pouchService.paginationId = this.paginatedLoans[this.paginatedLoans.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateBySaleStart('sale', this.pouchService.paginationId, staff.department, true, true).then(paginatedata => {
        this.paginatedLoans = paginatedata;

      });
    });
  }

  loadTotalLoans() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(data => {
        this.totalLoans = data.filter(data => data.branch == staff.branch && data.department == staff.department);
        this.totalLoans = this.totalLoans.filter(data => data.isoncredit == true || data.isowing == true);
        this.getTotalLoans(this.totalLoans);
      });
    });
  }

  generateRandomStrings(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  generatePin(loan) {
    loan.referencenumber = 'IUTH' + this.generateRandomStrings(4);
    let dialogRef = this.dialog.open(PinMessageComponent, {
      height: '500px',
      width: '500px',
      data: {
        loan: loan,
        action: 'pin',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.reloadLoans();
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
                this.pouchService.getIndividualSales().then(individualsales => {
                  individualsales.map(individualsale => {
                    individualsale.saleids.filter(data => data == loan.id);
                    if (individualsale.saleids.length != 0) {
                      individualsale.totaldailysales -= loan.amount;
                      this.pouchService.updateIndividualSale(individualsale).then(res => {
                        this.pouchService.deleteSale(loan).then(res => {
                          this.reloadLoans();
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
          if (loan.isowing) {
            this.promise3 = this.pouchService.getStaff(loan.patientid).then(async result => {
              if (result != undefined) {
                result.debt -= loan.balance;
                await this.pouchService.updateStaff(result).then(response => {
                  this.pouchService.getIndividualSales().then(individualsales => {
                    individualsales.map(individualsale => {
                      individualsale.saleids.filter(data => data == loan.id);
                      if (individualsale.saleids.length != 0) {
                        individualsale.totaldailysales -= loan.amount;
                        this.pouchService.updateIndividualSale(individualsale).then(res => {
                          this.pouchService.deleteSale(loan).then(res => {
                            this.reloadLoans();
                          });
                        });
                      }
                    });
                  });
                });
              }
              else {
                this.promise4 = this.pouchService.getPatient(loan.patientid).then(async result => {
                  if (result != undefined) {
                    result.debt -= loan.balance;
                    await this.pouchService.updatePatient(result).then(response => {
                      this.pouchService.getIndividualSales().then(individualsales => {
                        individualsales.map(individualsale => {
                          individualsale.saleids.filter(data => data == loan.id);
                          if (individualsale.saleids.length != 0) {
                            individualsale.totaldailysales -= loan.amount;
                            this.pouchService.updateIndividualSale(individualsale).then(res => {
                              this.pouchService.deleteSale(loan).then(res => {
                                this.reloadLoans();
                              });
                            });
                          }
                        });
                      });
                    });
                  }
                  else {
                    this.promise5 = this.pouchService.getDepartment(loan.departmentid).then(async result => {
                      result.debt -= loan.balance;
                      await this.pouchService.updateDepartment(result).then(response => {
                        this.pouchService.getIndividualSales().then(individualsales => {
                          individualsales.map(individualsale => {
                            individualsale.saleids.filter(data => data == loan.id);
                            if (individualsale.saleids.length != 0) {
                              individualsale.totaldailysales -= loan.amount;
                              this.pouchService.updateIndividualSale(individualsale).then(res => {
                                this.pouchService.deleteSale(loan).then(res => {
                                  this.reloadLoans();
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
                individualsale.saleids.filter(data => data == loan.id);
                if (individualsale.saleids.length != 0) {
                  individualsale.totaldailysales -= loan.amount;
                  this.pouchService.updateIndividualSale(individualsale).then(res => {
                    this.pouchService.deleteSale(loan).then(res => {
                      this.reloadLoans();
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
      this.pouchService.getSales().then(loans => {
        loans = loans.filter(data => data.branch == staff.branch && data.department == staff.department);
        loans = loans.filter(data => data.isoncredit == true || data.isowing == true);

        loans.map(loan => {
          loan['timestamp'] = new Date(loan.date);
          loan['timestamp'] = new Date(loan['timestamp']).setSeconds(0);
          /* loan['timestamp'] = new Date(loan['timestamp']).setMinutes(0);
          loan['timestamp'] = new Date(loan['timestamp']).setHours(0); */

        });
        loans = loans.filter(data => newDateFrom <= data['timestamp']);
        loans = loans.filter(data => newDateTo >= data['timestamp']);
        this.loans = loans;

        this.pouchService.paginationId = this.loans[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateBySale('sale', this.pouchService.paginationId, staff.department, true, true).then(paginatedata => {
          this.paginatedLoans = paginatedata;

          this.paginatedLoans.map(paginatedLoan => {
            paginatedLoan['timestamp'] = new Date(paginatedLoan.date);
            paginatedLoan['timestamp'] = new Date(paginatedLoan['timestamp']).setSeconds(0);
            /*  loan['timestamp'] = new Date(loan['timestamp']).setMinutes(0);
             loan['timestamp'] = new Date(loan['timestamp']).setHours(0); */
          });
          this.paginatedLoans = this.paginatedLoans.filter(data => newDateFrom <= data['timestamp']);
          this.paginatedLoans = this.paginatedLoans.filter(data => newDateTo >= data['timestamp']);
        });
      });
    });
  }

  public export(): void {
    var exportedSalesArray = [];

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(items => {
        items = items.filter(data => data.branch == staff.branch && data.department == staff.department);
        items = items.filter(data => data.isoncredit == true || data.isowing == true);

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
