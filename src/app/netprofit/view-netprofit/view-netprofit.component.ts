import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddNetProfitComponent } from '../add-netprofit/add-netprofit.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { Netprofit } from '../../../model/netprofit';
import { PouchService } from '../../../providers/pouch-service';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-netprofit',
  templateUrl: './view-netprofit.component.html',
  styleUrls: ['./view-netprofit.component.css']
})
export class ViewNetProfitComponent implements OnInit {
  public tableWidget: any;
  tableCheck = false;
  show = false;
  files: FileList;
  public netprofits: Array<Netprofit> = [];
  newNetprofits: any;
  localStorageItem: any;
  isSupervisor = false;
  excelBuffer: any;
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook
  years: any[];
  selectedMonth;
  selectedYear = new Date().getFullYear();
  netProfit: number;
  grossProfit: number;
  departments: any[];
  selectedDepartment;
  isFinanceDept;
  isFilterYear = false;
  isFilterDepartment = false;
  paginatedNetProfits;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService, private dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.netProfit = 0;
    this.grossProfit = 0;
    this.departments = ['Pharmacy Store', 'Central Store', 'Main Pharmacy', 'GOPD Pharmacy', 'Laboratory',
      'Radiology', 'Revenue', 'Account', 'Audit', 'Theatre', 'Admin'];

    this.loadNetprofits();
    this.checkRoles();
    this.getYears();
  }

  checkRoles() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      staff.roles.map(role => {
        if (role.role == "Supervisor" && role.isChecked == true) {
          this.isSupervisor = true;
        }
      })
      /* if (staff.department == 'Account' || staff.department == 'Revenue' || staff.department == 'Audit') {
        this.isFinanceDept = true;
      }
      else {
        this.isFinanceDept = false;
      } */
    });
  }

  getYears() {
    this.years = [];
    var currentYear = new Date().getFullYear();

    for (var i = 1980; i <= currentYear; i++) {

      this.years.push(i);
    }
  }

  filterByDepartment() {
    this.isFilterDepartment = true;
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getNetprofits().then(data => {
        if (this.selectedDepartment != "Account" && this.selectedDepartment != "Revenue" && this.selectedDepartment != "Audit") { //If not those departments then filter by specific department logged.
          if (!this.isFilterYear) {
            this.pouchService.paginationId = data[this.netprofits.length - 1].id; //Reverse of what is meant to be;
            this.netprofits = data.filter(data => data.branch == staff.branch && data.department == this.selectedDepartment);

            this.pouchService.paginateByDepartment2('netprofit', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
              this.paginatedNetProfits = paginatedata;
            });
          }
          else {
            this.pouchService.paginationId = data[this.netprofits.length - 1].id; //Reverse of what is meant to be;
            this.netprofits = data.filter(data => data.branch == staff.branch && data.department == this.selectedDepartment && data.year == this.selectedYear);

            this.pouchService.paginateByDepartment2('netprofit', this.pouchService.paginationId, this.selectedDepartment, undefined, undefined, this.selectedYear).then(paginatedata => {
              this.paginatedNetProfits = paginatedata;
            });
          }
        }
        else {
          if (!this.isFilterYear) {
            this.pouchService.paginationId = data[this.netprofits.length - 1].id; //Reverse of what is meant to be;
            this.netprofits = data.filter(data => data.branch == staff.branch);

            this.pouchService.paginateByBranch2('netprofit', this.pouchService.paginationId).then(paginatedata => {
              this.paginatedNetProfits = paginatedata;
            });
          }
          else {
            this.pouchService.paginationId = data[this.netprofits.length - 1].id; //Reverse of what is meant to be;
            this.netprofits = data.filter(data => data.branch == staff.branch && data.year == this.selectedYear);

            this.pouchService.paginateByBranch2('netprofit', this.pouchService.paginationId, this.selectedYear).then(paginatedata => {
              this.paginatedNetProfits = paginatedata;
            });
          }
        }
        //this.getNetProfit(this.grossprofits);
        this.getNetprofit(this.netprofits);
      });
    });
  }

  filterByYear() {
    this.isFilterYear = true;
    this.pouchService.getStaff(this.localStorageItem).then(staff => {
      this.pouchService.getNetprofits().then(data => {
        if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.
          this.netprofits = data.filter(data => data.branch == staff.branch && data.department == staff.department);

          this.pouchService.paginationId = this.netprofits[this.netprofits.length - 1].id; //Reverse of what is meant to be;
          this.pouchService.paginateByDepartment2('netprofit', this.pouchService.paginationId, staff.department, undefined, undefined, this.selectedYear).then(paginatedata => {
            this.paginatedNetProfits = paginatedata;
          });
        }
        else {
          if (!this.isFilterDepartment) {
            this.netprofits = data.filter(data => data.branch == staff.branch);

            this.pouchService.paginationId = this.netprofits[this.netprofits.length - 1].id; //Reverse of what is meant to be;
            this.pouchService.paginateByBranch2('netprofit', this.pouchService.paginationId, this.selectedYear).then(paginatedata => {
              this.paginatedNetProfits = paginatedata;
            });
          }
          else {
            this.netprofits = data.filter(data => data.branch == staff.branch && data.department == this.selectedDepartment);

            this.pouchService.paginationId = this.netprofits[this.netprofits.length - 1].id; //Reverse of what is meant to be;
            this.pouchService.paginateByDepartment2('netprofit', this.pouchService.paginationId, this.selectedDepartment, undefined, undefined, this.selectedYear).then(paginatedata => {
              this.paginatedNetProfits = paginatedata;
            });
          }
        }
        this.netprofits = this.netprofits.filter(data => {
          var dbYear = data.year;

          return this.selectedYear == dbYear;

        });
        //this.getNetProfit(this.grossprofits);
        this.getNetprofit(this.netprofits);
      });
    });
  }

  reloadNetprofits() {
    this.localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(this.localStorageItem).then(staff => {

      this.pouchService.getNetprofits().then(data => {
        if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") {  //If not those departments then filter by specific department logged.
          this.netprofits = data.filter(data => data.branch == staff.branch && data.department == staff.department);

          this.pouchService.paginationId = this.netprofits[0].id; //Reverse of what is meant to be;
          this.pouchService.paginateByDepartmentRemoveItem('netprofit', this.pouchService.paginationId, staff.department).then(paginatedata => {
            this.paginatedNetProfits = paginatedata;
          });
        }
        else {
          this.netprofits = data.filter(data => data.branch == staff.branch);

          this.pouchService.paginationId = this.netprofits[0].id; //Reverse of what is meant to be;
          this.pouchService.paginateByBranchRemoveItem('netprofit', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedNetProfits = paginatedata;

          });
        }
        //this.getNetProfit(this.grossprofits);
        this.getNetprofit(this.netprofits);

      });
    });
  }

  loadNetprofits() {
    this.localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(this.localStorageItem).then(staff => {

      this.pouchService.getNetprofits().then(data => {
        if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") {  //If not those departments then filter by specific department logged.
          this.netprofits = data.filter(data => data.branch == staff.branch && data.department == staff.department);

          this.pouchService.paginationId = this.netprofits[this.netprofits.length - 1].id; //Reverse of what is meant to be;
          this.pouchService.paginateByDepartment2('netprofit', this.pouchService.paginationId, staff.department).then(paginatedata => {
            this.paginatedNetProfits = paginatedata;

            $(document).ready(function () {
              $('#dtBasicExample').DataTable({
                "paging": false,
                "searching": false
              });
              $('.dataTables_length').addClass('bs-select');
            });
            this.isNextActive = true;
          });
        }
        else {
          this.netprofits = data.filter(data => data.branch == staff.branch);

          this.pouchService.paginationId = this.netprofits[this.netprofits.length - 1].id; //Reverse of what is meant to be;
          this.pouchService.paginateByBranch2('netprofit', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedNetProfits = paginatedata;
            console.log(this.paginatedNetProfits);

            $(document).ready(function () {
              $('#dtBasicExample').DataTable({
                "paging": false,
                "searching": false
              });
              $('.dataTables_length').addClass('bs-select');
            });
            this.isNextActive = true;
          });
        }
        //this.getNetProfit(this.grossprofits);
        this.getNetprofit(this.netprofits);

      });
    });
  }

  next() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      //this.department = staff.department;
      this.pouchService.paginationId = this.paginatedNetProfits[this.paginatedNetProfits.length - 1].id;  //Reverse of what is meant to be;

      if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.

        this.pouchService.paginateByDepartment2('netprofit', this.pouchService.paginationId, staff.department).then(paginatedata => {
          this.paginatedNetProfits = paginatedata;

          this.isPreviousActive = true;
        });
      }
      else {
        if (this.isFilterDepartment) {

          this.pouchService.paginateByDepartment2('netprofit', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
            this.paginatedNetProfits = paginatedata;
          });
        }
        else {
          this.pouchService.paginateByBranch2('netprofit', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedNetProfits = paginatedata;
          });
        }
        this.isPreviousActive = true;
      }
    });
  }

  previous() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      //this.department = staff.department;
      this.pouchService.paginationId = this.paginatedNetProfits[this.paginatedNetProfits.length - 1].id;  //Reverse of what is meant to be;

      if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.

        this.pouchService.paginateByDepartmentPrev2('netprofit', this.pouchService.paginationId, staff.department).then(paginatedata => {
          this.paginatedNetProfits = paginatedata;

        });
        if (this.paginatedNetProfits.length < this.pouchService.limitRange) {
          this.isPreviousActive = false;
        }
      }
      else {
        if (this.isFilterDepartment) {

          this.pouchService.paginateByDepartmentPrev2('netprofit', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
            this.paginatedNetProfits = paginatedata;
          });
        }
        else {
          this.pouchService.paginateByBranchPrev2('netprofit', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedNetProfits = paginatedata;
          });
        }
        if (this.paginatedNetProfits.length < this.pouchService.limitRange) {
          this.isPreviousActive = false;
        }
      }
    });
  }

  goToStart() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      //this.department = staff.department;

      this.isPreviousActive = false;

      this.pouchService.paginationId = this.paginatedNetProfits[this.paginatedNetProfits.length - 1].id;  //Reverse of what is meant to be;

      if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.

        this.pouchService.paginateByDepartmentStart('netprofit', this.pouchService.paginationId, staff.department).then(paginatedata => {
          this.paginatedNetProfits = paginatedata;

        });
      }
      else {
        if (this.isFilterDepartment) {

          this.pouchService.paginateByDepartmentStart('netprofit', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
            this.paginatedNetProfits = paginatedata;
          });
        }
        else {
          this.pouchService.paginateByBranchStart('netprofit', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedNetProfits = paginatedata;
          });
        }
        this.isPreviousActive = true;
      }
    });
  }


  getNetprofit(netprofits) {
    this.netProfit = 0;
    var subCostArray = [0];  //to ensure reduce() works even when one item exists in array
    netprofits.map(netprofit => {
      subCostArray.push(netprofit.netprofit);
      subCostArray.reduce((a, b) => {
        return this.netProfit = a + b;
      });
    });
  }


  editNetprotif(netprofit) {
    let dialogRef = this.dialog.open(AddNetProfitComponent, {
      width: '500px',
      data: {
        netprofit: netprofit,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      //this.loadNetprofits();
    })
  }

  deleteNetprofit(netprofit) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: netprofit
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteNetprofit(netprofit).then(res => {
          this.toastr.success('Net profit has been deleted successfully');
          this.reloadNetprofits();
        });
      }
    });
  }

  selectedNetprofit(netprofit, event) {
    if (event.checked) {
      netprofit['selected'] = true;
    }
    else {
      netprofit['selected'] = false;
    }
    this.newNetprofits = this.paginatedNetProfits.filter(data => data['selected'] == true);
    if (this.newNetprofits.length > 0) {
      this.tableCheck = true;
    }
    else {
      this.tableCheck = false;
    }
  }

  deleteSelectedNetprofit() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newNetprofits.forEach(netprofit => {
          this.pouchService.deleteNetprofit(netprofit).then(res => {
            this.reloadNetprofits();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Net profit has been deleted successfully');
      }
    });
  }

  public export(): void {
    var exportedNetprofitsArray = [];

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getNetprofits().then(items => {
        if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.
          items = items.filter(data => data.branch == staff.branch && data.department == staff.department);
        }
        else {
          items = items.filter(data => data.branch == staff.branch);
        }

        for (var i = 0; i < items.length; i++) {
          var exporteNetproit = {
            'S/NO': i + 1,
            'DATE': items[i].date,
            'MONTH': items[i].month,
            'YEAR': items[i].year,
            'BRANCH': items[i].branch,
            'DEPARTMENT': items[i].department,
            'EXPENSES': items[i].expenses,
            'GROSS PROFIT': items[i].grossprofit,
            'NET PROFIT': items[i].netprofit,
          }
          exportedNetprofitsArray.push(exporteNetproit);
          this.worksheet = XLSX.utils.json_to_sheet(exportedNetprofitsArray);
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

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedNetProfits = [];

    for (let netprofit of this.netprofits) {
      if ((netprofit.month).toLowerCase().indexOf(value) !== -1) {
        this.paginatedNetProfits.push(netprofit);

        this.paginatedNetProfits = this.paginatedNetProfits.slice(0, this.pouchService.limitRange);
      }
    }
  }

}
