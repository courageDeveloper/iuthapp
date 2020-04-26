import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddSalesComponent } from '../../sales/add-sales/add-sales.component';
import { EvacuateformComponent } from '../../evacuateform/evacuateform.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PouchService } from '../../../providers/pouch-service';
import { Sales } from '../../../model/sales';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { ReceiptComponent } from '../../receipt/receipt.component';
import { ReceiptAccountComponent } from '../../receipt-account/receipt-account.component';
import { ViewReceiptComponent } from '../../view-receipt/view-receipt.component';
import { ViewReceiptAccountComponent } from '../../view-receipt-account/view-receipt-account.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-ordereditems',
  templateUrl: './ordereditems.component.html',
  styleUrls: ['./ordereditems.component.css']
})
export class OrderedItemsComponent implements OnInit {
  public sales: Array<Sales> = [];
  public totalSales: Array<Sales> = [];
  public tableWidget: any;
  tableCheck = false;
  newSales: any;
  show = false;
  files: FileList;
  convertFiles;
  newArray;
  total = 0;
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
  department: any;
  months: any[];
  years: any[];
  selectedMonth;
  selectedYear = new Date().getFullYear();
  paginatedSales;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService, private router: Router, private data: DataService, private dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.timeFrom = '00:00';
    this.timeTo = '00:00';

    this.pouchService.userPermission().then(result => {
      if (result.department == 'Admin') {
        this.isUserPermitted = false;
      }
    });

    this.loadSales();
    this.loadTotalSales();
    this.getYears();
    this.getMonths();
    this.checkRoles();
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

  reloadSales() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {

      this.pouchService.getSales().then(data => {
        this.sales = data.filter(data => data.branch == staff.branch && data.department == staff.department);
        this.sales = this.sales.filter(data => data.isoncredit == false);
        
        this.pouchService.paginationId = this.sales[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateBySaleRemoveItem('sale', this.pouchService.paginationId, staff.department, false).then(paginatedata => {
          this.paginatedSales = paginatedata;

          this.isNextActive = true;
        });
      });
    });
  }

  filterByMonth() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(data => {
        this.sales = data.filter(data => data.branch == staff.branch && data.department == staff.department);
        this.sales = this.sales.filter(data => data.isoncredit == false);
        this.sales = this.sales.filter(data => {
          var dbMonth = this.months[new Date(data.date).getMonth()];
          var dbYear = new Date(data.date).getFullYear();
          this.getTotalSales(this.sales);
          return this.selectedMonth == dbMonth && this.selectedYear == dbYear;

        });
        this.pouchService.paginationId = this.sales[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateBySale('sale', this.pouchService.paginationId, staff.department, false).then(paginatedata => {
          this.paginatedSales = paginatedata;
          this.paginatedSales = this.paginatedSales.filter(data => {
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
      this.department = staff.department;
      staff.roles.map(role => {
        if (role.role == "Refund/Return" && role.isChecked == true) {
          this.isRefund = true;
        }
      })
    });
  }

  loadSales() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {

      this.pouchService.getSales().then(data => {
        this.sales = data.filter(data => data.branch == staff.branch && data.department == staff.department);
        this.sales = this.sales.filter(data => data.isoncredit == false);
        
        this.pouchService.paginationId = this.sales[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateBySale('sale', this.pouchService.paginationId, staff.department, false).then(paginatedata => {
          this.paginatedSales = paginatedata;
          
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
      this.pouchService.paginationId = this.paginatedSales[this.paginatedSales.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateBySale('sale', this.pouchService.paginationId, staff.department, false).then(paginatedata => {
        this.paginatedSales = paginatedata;

        this.isPreviousActive = true;
      });
    });
  }

  previous() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.department = staff.department;
      this.pouchService.paginationId = this.paginatedSales[this.paginatedSales.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateBySalePrev('sale', this.pouchService.paginationId, staff.department, false).then(paginatedata => {
        this.paginatedSales = paginatedata;

        if (this.paginatedSales.length < this.pouchService.limitRange) {
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

      this.pouchService.paginationId = this.paginatedSales[this.paginatedSales.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateBySaleStart('sale', this.pouchService.paginationId, staff.department, false).then(paginatedata => {
        this.paginatedSales = paginatedata;

      });
    });
  }

  loadTotalSales() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(data => {
        this.totalSales = data.filter(data => data.branch == staff.branch && data.department == staff.department);
        this.totalSales = this.totalSales.filter(data => data.isoncredit == false);
        this.getTotalSales(this.totalSales);
      });
    });
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
                          this.reloadSales();
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
                            this.reloadSales();
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
                                this.reloadSales();
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
                                  this.reloadSales();
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
                      this.reloadSales();
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

  viewReceipt(sale) {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      if (staff.branch == "IUTH(Okada)") {
        var receiptSource = 'Revenue';
        this.data.changeReceiptSource(receiptSource);
        let dialogRef = this.dialog.open(ViewReceiptComponent, {
          height: '500px',
          width: '500px',
          data: {
            sale: sale,
            action: 'print',
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          if (!result) {
            return;
          }
          this.reloadSales();
        });
      }
      else if (staff.branch == "Benin Centre") {
        var receiptSource = 'Account';
        this.data.changeReceiptSource(receiptSource);
        let dialogRef = this.dialog.open(ViewReceiptAccountComponent, {
          height: '500px',
          width: '500px',
          data: {
            sale: sale,
            action: 'print',
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          if (!result) {
            return;
          }
          this.reloadSales();
        });
      }
    });
  }

  printReceipt(sale) {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      if (staff.branch == "IUTH(Okada)") {
        var receiptSource = 'Revenue';
        this.data.changeReceiptSource(receiptSource);
        let dialogRef = this.dialog.open(ReceiptComponent, {
          height: '500px',
          width: '500px',
          data: {
            sale: sale,
            action: 'print',
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          if (!result) {
            return;
          }
          this.reloadSales();
        });
      }
      else if (staff.branch == "Benin Centre") {
        var receiptSource = 'Account';
        this.data.changeReceiptSource(receiptSource);
        let dialogRef = this.dialog.open(ReceiptAccountComponent, {
          height: '500px',
          width: '500px',
          data: {
            sale: sale,
            action: 'print',
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          if (!result) {
            return;
          }
          this.reloadSales();
        });
      }
    });
  }

  import() {
    this.show = true;
  }

  handleFiles(event) {
    this.files = event.target.files;

    var reader: FileReader = new FileReader();
    reader.readAsDataURL(this.files[0]);

    reader.onload = (e) => {
      this.convertFiles = reader.result;

      return new Promise((resolve, reject) => {
        var url = this.convertFiles;
        var oReq = new XMLHttpRequest();
        var workbook: any;
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";
        oReq.onload = (e) => {
          if (oReq.status >= 200 && oReq.status < 300) {
            var arraybuffer = oReq.response;
            var data = new Uint8Array(arraybuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            workbook = XLSX.read(bstr, { type: "binary" });
            var worksheetname = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[worksheetname];
            var json = XLSX.utils.sheet_to_json(worksheet, { raw: true });

            json.forEach(item => {
              var arrayCheck = ['SALE NAME', 'AMOUNT', 'DESCRIPTION', 'DATE'];

              for (var i = 0; i < arrayCheck.length; i++) {

                if (item[arrayCheck[i]] == undefined) {
                  item[arrayCheck[i]] = 'N/A';
                }
              }

              setTimeout(() => {
                var sale = {
                  id: '',
                  rev: '',
                  department: '',
                  amountloaned: 0,
                  amountpayable: 0,
                  loanstatus: false,
                  departmentloaned: '',
                  individualloanid: '',
                  departmentloaning: '',
                  dateofloan: new Date(),
                  salename: item['SALE NAME'],
                  amount: item['AMOUNT'],
                  description: item['DESCRIPTION'],
                  color: '',
                  date: item['DATE'],
                  iscomplete: true,
                  isowing: false,
                  isoncredit: false,
                  staffloan: false,
                  departmentloan: false,
                  balance: 0,
                  departmentid: '',
                  patientid: '',
                  isreconciled: true,
                  isevacuated: false,
                  evacuatedmessage: '',
                  branch: '',
                  posproduct: [],
                  referencenumber: '',
                  serviceorder: [],
                  productorder: [],
                  products: [],
                  services: []
                }

                this.newArray = [];
                this.newArray.push(sale);

                this.newArray.forEach(arraySale => {
                  arraySale.date = new Date((arraySale.date - (25567 + 2)) * 86400 * 1000);

                  var localStorageItem = JSON.parse(localStorage.getItem('user'));
                  this.pouchService.getStaff(localStorageItem).then(staff => {
                    arraySale.department = staff.department;
                    arraySale.departmentloaning = staff.department;
                    arraySale.branch = staff.branch;
                    this.pouchService.saveSale(arraySale).then(res => {
                      this.reloadSales();
                    });
                  });
                });
              }, 3000);
            });

            resolve('Finished generating JSON');
          } else {
            reject(console.log('XMLHttpRequest failed; error code:' + oReq.statusText));
          }
        }
        oReq.send();
      });
    }
  }

  public export(): void {
    var exportedSalesArray = [];

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(items => {
        items = items.filter(data => data.branch == staff.branch && data.department == staff.department);
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

  addSale() {
    let dialogRef = this.dialog.open(AddSalesComponent, {
      width: '450px',
      data: {
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      console.log(result);
      this.reloadSales();
    })
  }

  getTotalSales(sales) {
    sales = sales.filter(data => data.iscomplete == true);

    var saleArray = [];
    sales = sales.filter(data => data.isreconciled == true);
    sales.forEach(sale => {
      saleArray.push(sale.amount);
    });
    return this.total = saleArray.reduce((a, b) => a + b, 0);
  }


  credits() {
    this.router.navigate(['/department-sales-credit']);
  }

  filterDate() {
    this.sales = [];
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
      this.pouchService.getSales().then(sales => {
        sales = sales.filter(data => data.branch == staff.branch && data.department == staff.department);
        sales = sales.filter(data => data.isoncredit == false);

        sales.map(sale => {
          sale['timestamp'] = new Date(sale.date);
          sale['timestamp'] = new Date(sale['timestamp']).setSeconds(0);
          /* sale['timestamp'] = new Date(sale['timestamp']).setMinutes(0);
          sale['timestamp'] = new Date(sale['timestamp']).setHours(0); */

        });
        sales = sales.filter(data => newDateFrom <= data['timestamp']);
        sales = sales.filter(data => newDateTo >= data['timestamp']);
        this.sales = sales;

        this.pouchService.paginationId = this.sales[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateBySale('sale', this.pouchService.paginationId, staff.department, false).then(paginatedata => {
          this.paginatedSales = paginatedata;

          this.paginatedSales.map(paginatedSale => {
            paginatedSale['timestamp'] = new Date(paginatedSale.date);
            paginatedSale['timestamp'] = new Date(paginatedSale['timestamp']).setSeconds(0);
            /*  loan['timestamp'] = new Date(loan['timestamp']).setMinutes(0);
             loan['timestamp'] = new Date(loan['timestamp']).setHours(0); */
          });
          this.paginatedSales = this.paginatedSales.filter(data => newDateFrom <= data['timestamp']);
          this.paginatedSales = this.paginatedSales.filter(data => newDateTo >= data['timestamp']);
        });
      });
    });
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedSales = [];

    for (let sale of this.sales) {
      if ((sale.salename).toLowerCase().indexOf(value) !== -1) {
        this.paginatedSales.push(sale);

        this.paginatedSales = this.paginatedSales.slice(0, this.pouchService.limitRange);
      }
    }
  }
}
