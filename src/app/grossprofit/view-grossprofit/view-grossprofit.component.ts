import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddGrossProfitComponent } from '../add-grossprofit/add-grossprofit.component';
import { AddNetProfitComponent } from '../../netprofit/add-netprofit/add-netprofit.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { Grossprofit } from '../../../model/grossprofit';
import { PouchService } from '../../../providers/pouch-service';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-grossprofit',
  templateUrl: './view-grossprofit.component.html',
  styleUrls: ['./view-grossprofit.component.css']
})
export class ViewGrossProfitComponent implements OnInit {
  public tableWidget: any;
  tableCheck = false;
  show = false;
  files: FileList;
  public grossprofits: Array<Grossprofit> = [];
  newGrossprofits: any;
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
  paginatedGrossProfits;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService, private router: Router, private dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.netProfit = 0;
    this.grossProfit = 0;
    this.departments = ['Main Pharmacy', 'GOPD Pharmacy', 'Laboratory',
      'Radiology', 'Account', 'Revenue', 'Audit'];

    this.loadGrossprofits();
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
      if (staff.department == 'Account' || staff.department == 'Revenue' || staff.department == 'Audit') {
        this.isFinanceDept = true;
      }
      else {
        this.isFinanceDept = false;
      }
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
      this.pouchService.getGrossprofits().then(data => {
        if (this.selectedDepartment != "Account" && this.selectedDepartment != "Revenue" && this.selectedDepartment != "Audit") { //If not those departments then filter by specific department logged.
          if (!this.isFilterYear) {
            this.pouchService.paginationId = data[0].id; //Reverse of what is meant to be;
            this.grossprofits = data.filter(data => data.branch == staff.branch && data.department == this.selectedDepartment);
            
            this.pouchService.paginateByDepartment2('grossprofit', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
              this.paginatedGrossProfits = paginatedata;
            });
          }
          else {
            this.pouchService.paginationId = data[0].id; //Reverse of what is meant to be;
            this.grossprofits = data.filter(data => data.branch == staff.branch && data.department == this.selectedDepartment && data.year == this.selectedYear);
            
            this.pouchService.paginateByDepartment2('grossprofit', this.pouchService.paginationId, this.selectedDepartment, undefined, undefined, this.selectedYear).then(paginatedata => {
              this.paginatedGrossProfits = paginatedata;
            });
          }
        }
        else {
          if (!this.isFilterYear) {
            this.pouchService.paginationId = data[0].id; //Reverse of what is meant to be;
            this.grossprofits = data.filter(data => data.branch == staff.branch && data.department == this.selectedDepartment);
            
            this.pouchService.paginateByBranch2('grossprofit', this.pouchService.paginationId).then(paginatedata => {
              this.paginatedGrossProfits = paginatedata;
            });
          }
          else {
            this.pouchService.paginationId = data[0].id; //Reverse of what is meant to be;
            this.grossprofits = data.filter(data => data.branch == staff.branch && data.year == this.selectedYear);

            this.pouchService.paginateByBranch2('grossprofit', this.pouchService.paginationId, this.selectedYear).then(paginatedata => {
              this.paginatedGrossProfits = paginatedata;
            });
          }
        }
        //this.getNetProfit(this.grossprofits);
        this.getGrossprofit(this.grossprofits);
      });
    });
  }

  filterByYear() {
    this.isFilterYear = true;
    this.pouchService.getStaff(this.localStorageItem).then(staff => {
      this.pouchService.getGrossprofits().then(data => {
        if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.
          this.grossprofits = data.filter(data => data.branch == staff.branch && data.department == staff.department);

          this.pouchService.paginationId = this.grossprofits[0].id; //Reverse of what is meant to be;
          this.pouchService.paginateByDepartment2('grossprofit', this.pouchService.paginationId, staff.department, undefined, undefined, this.selectedYear).then(paginatedata => {
            this.paginatedGrossProfits = paginatedata;
          });
        }
        else {
          if (!this.isFilterDepartment) {
            this.grossprofits = data.filter(data => data.branch == staff.branch);

            this.pouchService.paginationId = this.grossprofits[0].id; //Reverse of what is meant to be;
            this.pouchService.paginateByBranch2('grossprofit', this.pouchService.paginationId, this.selectedYear).then(paginatedata => {
              this.paginatedGrossProfits = paginatedata;
            });
          }
          else {
            this.grossprofits = data.filter(data => data.branch == staff.branch && data.department == this.selectedDepartment);

            this.pouchService.paginationId = this.grossprofits[0].id; //Reverse of what is meant to be;
            this.pouchService.paginateByDepartment2('grossprofit', this.pouchService.paginationId, this.selectedDepartment, undefined, undefined, this.selectedYear).then(paginatedata => {
              this.paginatedGrossProfits = paginatedata;
            });
          }
        }
        this.grossprofits = this.grossprofits.filter(data => {
          var dbYear = data.year;

          return this.selectedYear == dbYear;

        });
        //this.getNetProfit(this.grossprofits);
        this.getGrossprofit(this.grossprofits);
      });
    });
  }

  reloadGrossprofits() {
    this.localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(this.localStorageItem).then(staff => {

      this.pouchService.getGrossprofits().then(data => {
        if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") {  //If not those departments then filter by specific department logged.
          this.grossprofits = data.filter(data => data.branch == staff.branch && data.department == staff.department);

          this.pouchService.paginationId = this.grossprofits[0].id; //Reverse of what is meant to be;
          this.pouchService.paginateByDepartmentRemoveItem('grossprofit', this.pouchService.paginationId, staff.department).then(paginatedata => {
            this.paginatedGrossProfits = paginatedata;
          });
        }
        else {
          this.grossprofits = data.filter(data => data.branch == staff.branch);

          this.pouchService.paginationId = this.grossprofits[0].id; //Reverse of what is meant to be;
          this.pouchService.paginateByBranchRemoveItem('grossprofit', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedGrossProfits = paginatedata;
          });
        }
        //this.getNetProfit(this.grossprofits);
        this.getGrossprofit(this.grossprofits);

      });
    });
  }

  loadGrossprofits() {
    this.localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(this.localStorageItem).then(staff => {

      this.pouchService.getGrossprofits().then(data => {
        if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") {  //If not those departments then filter by specific department logged.
          this.grossprofits = data.filter(data => data.branch == staff.branch && data.department == staff.department);

          this.pouchService.paginationId = this.grossprofits[0].id; //Reverse of what is meant to be;
          this.pouchService.paginateByDepartment2('grossprofit', this.pouchService.paginationId, staff.department).then(paginatedata => {
            this.paginatedGrossProfits = paginatedata;

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
          this.grossprofits = data.filter(data => data.branch == staff.branch);

          this.pouchService.paginationId = this.grossprofits[0].id; //Reverse of what is meant to be;
          this.pouchService.paginateByBranch2('grossprofit', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedGrossProfits = paginatedata;

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
        this.getGrossprofit(this.grossprofits);

      });
    });
  }

  next() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      //this.department = staff.department;
      this.pouchService.paginationId = this.paginatedGrossProfits[this.paginatedGrossProfits.length - 1].id;  //Reverse of what is meant to be;

      if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.

        this.pouchService.paginateByDepartment2('grossprofit', this.pouchService.paginationId, staff.department).then(paginatedata => {
          this.paginatedGrossProfits = paginatedata;

          this.isPreviousActive = true;
        });
      }
      else {
        if (this.isFilterDepartment) {

          this.pouchService.paginateByDepartment2('grossprofit', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
            this.paginatedGrossProfits = paginatedata;
          });
        }
        else {
          this.pouchService.paginateByBranch2('grossprofit', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedGrossProfits = paginatedata;
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
      this.pouchService.paginationId = this.paginatedGrossProfits[this.paginatedGrossProfits.length - 1].id;  //Reverse of what is meant to be;

      if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.

        this.pouchService.paginateByDepartmentPrev2('grossprofit', this.pouchService.paginationId, staff.department).then(paginatedata => {
          this.paginatedGrossProfits = paginatedata;

        });
        if (this.paginatedGrossProfits.length < this.pouchService.limitRange) {
          this.isPreviousActive = false;
        }
      }
      else {
        if (this.isFilterDepartment) {

          this.pouchService.paginateByDepartmentPrev2('grossprofit', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
            this.paginatedGrossProfits = paginatedata;
          });
        }
        else {
          this.pouchService.paginateByBranchPrev2('grossprofit', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedGrossProfits = paginatedata;
          });
        }
        if (this.paginatedGrossProfits.length < this.pouchService.limitRange) {
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

      this.pouchService.paginationId = this.paginatedGrossProfits[this.paginatedGrossProfits.length - 1].id;  //Reverse of what is meant to be;

      if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.

        this.pouchService.paginateByDepartmentStart('grossprofit', this.pouchService.paginationId, staff.department).then(paginatedata => {
          this.paginatedGrossProfits = paginatedata;

        });
      }
      else {
        if (this.isFilterDepartment) {

          this.pouchService.paginateByDepartmentStart('grossprofit', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
            this.paginatedGrossProfits = paginatedata;
          });
        }
        else {
          this.pouchService.paginateByBranchStart('grossprofit', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedGrossProfits = paginatedata;
          });
        }
        this.isPreviousActive = true;
      }
    });
  }


  /* getNetProfit(grossprofits) {
    this.netProfit = 0;
    var subCostArray = [0];  //to ensure reduce() works even when one item exists in array
    grossprofits.map(grossprofit => {
      subCostArray.push(grossprofit.netprofit);
      subCostArray.reduce((a, b) => {
        return this.netProfit = a + b;
      });
    });
  } */

  getGrossprofit(grossprofits) {
    this.grossProfit = 0;
    var subCostArray = [0];  //to ensure reduce() works even when one item exists in array
    grossprofits.map(grossprofit => {
      subCostArray.push(grossprofit.grossprofit);
      subCostArray.reduce((a, b) => {
        return this.grossProfit = a + b;
      });
    });
  }


  editGrossprotif(grossprofit) {
    let dialogRef = this.dialog.open(AddGrossProfitComponent, {
      width: '500px',
      data: {
        grossprofit: grossprofit,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      //this.loadGrossprofits();
    })
  }

  navnetprofit() {
    this.router.navigate(['/view-net-profit']);
  }

  navexpenses() {
    this.router.navigate(['/expenses']);
  }

  deleteGrossprofit(grossprofit) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: grossprofit
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteGrossprofit(grossprofit).then(res => {
          this.toastr.success('Gross profit has been deleted successfully');
          this.reloadGrossprofits();
        });
      }
    });
  }

  selectedGrossprofit(grossprofit, event) {
    if (event.checked) {
      grossprofit['selected'] = true;
    }
    else {
      grossprofit['selected'] = false;
    }
    this.newGrossprofits = this.paginatedGrossProfits.filter(data => data['selected'] == true);
    if (this.newGrossprofits.length > 0) {
      this.tableCheck = true;
    }
    else {
      this.tableCheck = false;
    }
  }

  deleteSelectedGrossprofit() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newGrossprofits.forEach(grossprofit => {
          this.pouchService.deleteGrossprofit(grossprofit).then(res => {
            this.reloadGrossprofits();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Gross profit has been deleted successfully');
      }
    });
  }

  public export(): void {
    var exportedGrossprofitsArray = [];

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getGrossprofits().then(items => {
        if (staff.department != "Account" && staff.department != "Revenue" && staff.department != "Audit") { //If not those departments then filter by specific department logged.
          items = items.filter(data => data.branch == staff.branch && data.department == staff.department);
        }
        else {
          items = items.filter(data => data.branch == staff.branch);
        }

        for (var i = 0; i < items.length; i++) {
          var exporteGrossproit = {
            'S/NO': i + 1,
            'OPENING STOCK': items[i].openingstock,
            'PURCHASES': items[i].purchases,
            'CLOSING STOCK': items[i].closingstock,
            'DATE': items[i].date,
            'SALE PER MONTH': items[i].salespermonth,
            'MONTH': items[i].month,
            'YEAR': items[i].year,
            'BRANCH': items[i].branch,
            'DEPARTMENT': items[i].department,
            'COST OF GOODS SOLD': items[i].cogs,
            'EXPENSES': items[i].expenses,
            'GROSS PROFIT': items[i].grossprofit,
          }
          exportedGrossprofitsArray.push(exporteGrossproit);
          this.worksheet = XLSX.utils.json_to_sheet(exportedGrossprofitsArray);
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

  addNetProfit() {
    let dialogRef = this.dialog.open(AddNetProfitComponent, {
      height: '500px',
      width: '500px',
      data: {
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.reloadGrossprofits();
    })
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedGrossProfits = [];

    for (let grossprofit of this.grossprofits) {
      if ((grossprofit.month).toLowerCase().indexOf(value) !== -1) {
        this.paginatedGrossProfits.push(grossprofit);

        this.paginatedGrossProfits = this.paginatedGrossProfits.slice(0, this.pouchService.limitRange);
      }
    }
  }

}
