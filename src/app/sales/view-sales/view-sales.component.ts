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

@Component({
  selector: 'app-view-sales',
  templateUrl: './view-sales.component.html',
  styleUrls: ['./view-sales.component.css']
})
export class ViewSalesComponent implements OnInit {
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
    this.loadSales();
    this.loadTotalSales();
  }

  loadSales() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {

      this.pouchService.getSales().then(data => {
        this.sales = data.filter(data => data.branch == staff.branch);
        this.sales = this.sales.filter(data => data.iscomplete == true || data.isowing == true);
        this.sales = this.sales.filter(data => data.isoncredit == false);
        
        $(document).ready(function () {
          $('#dtBasicExample').DataTable();
          $('.dataTables_length').addClass('bs-select');
        });
      });
    });
  }

  loadTotalSales() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(data => {
        this.totalSales = data.filter(data => data.branch == staff.branch);
        this.totalSales = this.totalSales.filter(data => data.iscomplete == true || data.isowing == true);
        this.totalSales = this.totalSales.filter(data => data.isoncredit == false);
        this.getTotalSales(this.totalSales);
      });
    });
  }


  evacuate() {
    let dialogRef = this.dialog.open(EvacuateformComponent, {

    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      console.log(result);
      this.loadSales();
      this.router.navigate(['sales']);
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
                if (counterproduct.isUnitSelling == true) {
                  counterproduct.suppliedunit += productorder.qty;
                  counterproduct.totalsubitem += productcategory.subitemno;
                }
                else if (counterproduct.isUnitSelling == false) {
                  counterproduct.totalsubitem += productorder.qty;
                  counterproduct.suppliedunit = Math.floor(counterproduct.totalsubitem / productcategory.subitemno);
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
                this.pouchService.deleteSale(sale).then(res => {
                  this.loadSales();
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
                  this.pouchService.deleteSale(sale).then(res => {
                    this.loadSales();
                  });
                });
              }
              else {
                this.promise4 = this.pouchService.getPatient(sale.patientid).then(async result => {
                  if (result != undefined) {
                    result.debt -= sale.balance;
                    await this.pouchService.updatePatient(result).then(response => {
                      this.pouchService.deleteSale(sale).then(res => {
                        this.loadSales();
                      });
                    });
                  }
                  else {
                    this.promise5 = this.pouchService.getDepartment(sale.departmentid).then(async result => {
                      result.debt -= sale.balance;
                      await this.pouchService.updateDepartment(result).then(response => {
                        this.pouchService.deleteSale(sale).then(res => {
                          this.loadSales();
                        });
                      });
                    });
                  }
                });
              }
            });
          }
          else {
            this.pouchService.deleteSale(sale).then(res => {
              this.loadSales();
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
          this.loadSales();
        });
      }
      else if (staff.branch == "Benin Centre") {
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
          this.loadSales();
        });
      }
    });
  }

  printReceipt(sale) {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      if (staff.branch == "IUTH(Okada)") {
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
          this.loadSales();
        });
      }
      else if (staff.branch == "Benin Centre") {
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
          this.loadSales();
        });
      }
    });
  }

  flagReconciliation(sale, event) {
    if (event.checked) {
      sale.color = "red";
      sale.isreconciled = false;
      this.pouchService.getSale(sale.id).then(result => {
        result.color = "red";
        result.isreconciled = false;
        this.pouchService.updateSale(result)
        this.loadTotalSales();
      });
    }
    else {
      sale.color = "";
      sale.isreconciled = true;
      this.pouchService.getSale(sale.id).then(result => {
        result.color = "";
        result.isreconciled = true;
        this.pouchService.updateSale(result);
        this.loadTotalSales();
      });
    }
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
                    if (staff.branch == "IUTH(Okada)") {
                      arraySale.department = "Revenue";
                      arraySale.departmentloaning = "Revenue";
                      arraySale.branch = "IUTH(Okada)";
                    }
                    else if (staff.branch == "Benin Centre") {
                      arraySale.department = "Account";
                      arraySale.departmentloaning = "Account";
                      arraySale.branch = "Benin Centre";
                    }
                    this.pouchService.saveSale(arraySale).then(res => {
                      this.loadSales();
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
    this.pouchService.getSales().then(items => {
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
      this.loadSales();
    })
  }

  getTotalSales(sales) {

    var saleArray = [];
    sales = sales.filter(data => data.isreconciled == true);
    sales.forEach(sale => {
      saleArray.push(sale.amount);
    });
    return this.total = saleArray.reduce((a, b) => a + b, 0);
  }

  evacuateList() {
    this.router.navigate(['view-evacuated-sales']);
  }

  loans() {
    this.router.navigate(['loans']);
  }

  excludeEvacuated(event) {
    if (event.checked) {
      this.sales = this.sales.filter(data => data.isevacuated == false);
      this.totalSales = this.totalSales.filter(data => data.isevacuated == false);
    }
    else {
      this.sales = [];
      this.totalSales = [];
      this.loadSales();
      this.loadTotalSales();
    }
  }

  filterDate() {
    this.sales = [];
    this.dateFrom = new Date(this.dateFrom).getTime();
    this.dateTo = new Date(this.dateTo).getTime();

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(sales => {
        sales = sales.filter(data => data.branch == staff.branch);
        sales = sales.filter(data => data.iscomplete == true || data.isowing == true);
        sales = sales.filter(data => data.isoncredit == false);

        sales.map(sale => {
          sale['timestamp'] = new Date(sale.date).toLocaleString("en-US", { timeZone: "GMT" });
          sale['timestamp'] = new Date(sale['timestamp']).setSeconds(0);
          sale['timestamp'] = new Date(sale['timestamp']).setMinutes(0);
          sale['timestamp'] = new Date(sale['timestamp']).setHours(0);

        });
        sales = sales.filter(data => this.dateFrom <= data['timestamp']);
        sales = sales.filter(data => this.dateTo >= data['timestamp']);
        this.sales = sales;
      });
    });
  }
}
