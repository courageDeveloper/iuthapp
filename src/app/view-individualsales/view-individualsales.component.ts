import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { PouchService } from '../../providers/pouch-service';
import { IndividualSale } from '../../model/individualsales';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material'
import { ConfirmdialogmessageComponent } from '../confirmdialogmessage/confirmdialogmessage.component';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-view-individualsales',
  templateUrl: './view-individualsales.component.html',
  styleUrls: ['./view-individualsales.component.css']
})
export class ViewIndividualsalesComponent implements OnInit {
  public tableWidget: any;
  tableCheck = false;
  newIndividualsales: any;
  show = false;
  files: FileList;
  convertFiles;
  newArray;
  excelBuffer: any;
  isUserPermitted = false;
  dateFrom: any;
  dateTo: any;
  timeFrom: any;
  timeTo: any;
  total = 0;
  public individualSales: Array<IndividualSale> = [];
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook
  exportedIndividualsalesArray: any;
  isSupervisor = false;
  months: any[];
  years: any[];
  selectedMonth;
  selectedYear = new Date().getFullYear();
  paginatedIndividualSales;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService, private router: Router, public dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.timeFrom = '00:00';
    this.timeTo = '00:00';

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.userPermission().then(result => {
        if (staff.branch == "IUTH(Okada)") {
          if (result.department == 'Revenue') {
            this.isUserPermitted = true;
          }
        }
        else {
          if (result.department == 'Account') {
            this.isUserPermitted = true;
          }
        }
      });
    });

    this.loadIndividualsales();
    this.checkRoles();
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

  filterByMonth() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getIndividualSales().then(data => {
        this.individualSales = data.filter(data => data.branch == staff.branch);
        this.individualSales = this.individualSales.filter(data => {
          var dbMonth = this.months[new Date(data.checkindate).getMonth()];
          var dbYear = new Date(data.checkindate).getFullYear();

          return this.selectedMonth == dbMonth && this.selectedYear == dbYear;
        });
        this.pouchService.paginationId = this.individualSales[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByBranch2('individualsale', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedIndividualSales = paginatedata;
          this.paginatedIndividualSales = this.paginatedIndividualSales.filter(data => {
            var dbMonth = this.months[new Date(data.checkindate).getMonth()];
            var dbYear = new Date(data.checkindate).getFullYear();

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
        if (role.role == "Supervisor" && role.isChecked == true) {
          this.isSupervisor = true;
        }
      })
    });
  }

  reloadIndividualsales() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getIndividualSales().then(data => {
        this.individualSales = data.filter(data => data.branch == staff.branch);
        this.getTotalSales(this.individualSales);

        this.pouchService.paginationId = this.individualSales[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByBranchRemoveItem('individualsale', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedIndividualSales = paginatedata;

        });
      });
    });
  }

  loadIndividualsales() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      
      this.pouchService.getIndividualSales().then(data => {
        
        this.individualSales = data.filter(data => data.branch == staff.branch);
        this.getTotalSales(this.individualSales);
        
        this.pouchService.paginationId = this.individualSales[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByBranch2('individualsale', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedIndividualSales = paginatedata;

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
      this.pouchService.paginationId = this.paginatedIndividualSales[this.paginatedIndividualSales.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByBranch2('individualsale', this.pouchService.paginationId).then(paginatedata => {
        this.paginatedIndividualSales = paginatedata;

        this.isPreviousActive = true;
      });
    });
  }

  previous() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.paginationId = this.paginatedIndividualSales[this.paginatedIndividualSales.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByBranchPrev2('individualsale', this.pouchService.paginationId).then(paginatedata => {
        this.paginatedIndividualSales = paginatedata;

        if (this.paginatedIndividualSales.length < this.pouchService.limitRange) {
          this.isPreviousActive = false;
        }
      });
    });
  }

  goToStart() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.isPreviousActive = false;

      this.pouchService.paginationId = this.paginatedIndividualSales[this.paginatedIndividualSales.length - 1].id;  //Reverse of what is meant to be;

      this.pouchService.paginateByBranchStart('individualsale', this.pouchService.paginationId).then(paginatedata => {
        this.paginatedIndividualSales = paginatedata;

      });
    });
  }

  selectedIndividualSale(individualsale, event) {
    if (event.checked) {
      individualsale.isstroked = true;
      individualsale.strokedvalue = 'strike';
      this.pouchService.updateIndividualSale(individualsale);
      this.reloadIndividualsales();
    }
    else {
      individualsale.isstroked = false;
      individualsale.strokedvalue = '';
      this.pouchService.updateIndividualSale(individualsale);
      this.reloadIndividualsales();
    }
  }

  getTotalSales(individualsales) {
    var individualSalesArray = [];
    individualsales = individualsales.filter(data => data.isstroked == false);
    individualsales.forEach(individualsale => {
      individualSalesArray.push(individualsale.totaldailysales);
    });
    return this.total = individualSalesArray.reduce((a, b) => a + b, 0);
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
              var arrayCheck = ['STAFF NAME', 'BRANCH', 'CHECK IN DATE', 'CHECK OUT DATE', 'TOTAL DAILY SALES', 'DEPARTMENT'];

              for (var i = 0; i < arrayCheck.length; i++) {

                if (item[arrayCheck[i]] == undefined) {
                  item[arrayCheck[i]] = 'N/A';
                }
              }

              setTimeout(() => {
                var individualsale = {
                  id: '',
                  rev: '',
                  totaldailysales: item['TOTAL DAILY SALES'],
                  staffname: item['STAFF NAME'],
                  staffid: '',
                  saleids: [],
                  ischeckedin: false,
                  ischeckedout: true,
                  checkindate: item['CHECK IN DATE'],
                  checkoutdate: item['CHECK OUT DATE'],
                  initiallogincount: 0,
                  branch: item['BRANCH'],
                  department: item['DEPARTMENT'],
                  isstroked: false,
                  strokedvalue: ''
                }

                this.newArray = [];
                this.newArray.push(individualsale);

                this.newArray.forEach(arrayIndividualSale => {
                  arrayIndividualSale.checkindate = new Date((arrayIndividualSale.checkindate - (25567 + 2)) * 86400 * 1000);
                  arrayIndividualSale.checkoutdate = new Date((arrayIndividualSale.checkoutdate - (25567 + 2)) * 86400 * 1000);
                  this.pouchService.saveIndividualSale(arrayIndividualSale).then(res => {
                    this.reloadIndividualsales();
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
    var exportedIndividualsalesArray = [];

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getIndividualSales().then(items => {
        items = items.filter(data => data.isstroked == false);
        items = items.filter(data => data.branch == staff.branch);

        for (var i = 0; i < items.length; i++) {
          var exportedIndividualSales = {
            'S/NO': i + 1,
            'STAFF NAME': items[i].staffname,
            BRANCH: items[i].branch,
            'CHECK IN DATE': items[i].checkindate,
            'CHECK OUT DATE': items[i].checkoutdate,
            'TOTAL DAILY SALES': items[i].totaldailysales,
            DEPARTMENT: items[i].department
          }
          exportedIndividualsalesArray.push(exportedIndividualSales);
          this.worksheet = XLSX.utils.json_to_sheet(exportedIndividualsalesArray);
        }
        const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
        this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(this.excelBuffer, 'IUTH Revenue Staff Daily Sales');
      });
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  filterDate() {
    this.individualSales = [];
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
      this.pouchService.getIndividualSales().then(individualsales => {
        individualsales = individualsales.filter(data => data.branch == staff.branch);

        individualsales.map(individualsale => {
          individualsale['timestamp'] = new Date(individualsale.checkindate).toLocaleString("en-US", { timeZone: "GMT" });
          individualsale['timestamp'] = new Date(individualsale['timestamp']).setSeconds(0);
        });
        individualsales = individualsales.filter(data => newDateFrom <= data['timestamp']);
        individualsales = individualsales.filter(data => newDateTo >= data['timestamp']);
        this.individualSales = individualsales;

        this.pouchService.paginationId = this.individualSales[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByBranch2('individualsale', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedIndividualSales = paginatedata;

          this.paginatedIndividualSales.map(paginatedSale => {
            paginatedSale['timestamp'] = new Date(paginatedSale.date).toLocaleString("en-US", { timeZone: "GMT" });
            paginatedSale['timestamp'] = new Date(paginatedSale['timestamp']).setSeconds(0);
            //paginatedSale['timestamp'] = paginatedSale['timestamp'] + 3600000;
            /*  loan['timestamp'] = new Date(loan['timestamp']).setMinutes(0);
             loan['timestamp'] = new Date(loan['timestamp']).setHours(0); */
          });
          this.paginatedIndividualSales = this.paginatedIndividualSales.filter(data => newDateFrom <= data['timestamp']);
          this.paginatedIndividualSales = this.paginatedIndividualSales.filter(data => newDateTo >= data['timestamp']);
        });
      });
    });
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedIndividualSales = [];

    for (let individualsale of this.individualSales) {
      if ((individualsale.staffname).toLowerCase().indexOf(value) !== -1) {
        this.paginatedIndividualSales.push(individualsale);

        this.paginatedIndividualSales = this.paginatedIndividualSales.slice(0, this.pouchService.limitRange);
      }
    }
  }

}
