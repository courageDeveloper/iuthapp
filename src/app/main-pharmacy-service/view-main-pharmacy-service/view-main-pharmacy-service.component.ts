import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddMainPharmacyServiceComponent } from '../add-main-pharmacy-service/add-main-pharmacy-service.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PouchService } from '../../../providers/pouch-service';
import { RenderService } from '../../../model/renderservice';
import { Router } from '@angular/router';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-view-main-pharmacy-service',
  templateUrl: './view-main-pharmacy-service.component.html',
  styleUrls: ['./view-main-pharmacy-service.component.css']
})
export class ViewMainPharmacyServiceComponent implements OnInit {
  //MAIN PHARMACY
  public tableWidget: any;
  tableCheck = false;
  newRenderServices: any;
  show = false;
  files: FileList;
  isUserPermitted = false;
  convertFiles;
  newArray;
  excelBuffer: any;
  public renderServices: Array<RenderService> = [];
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook;
  isStaffSwitchedTable = false;
  isDepartmentSwitchedTable = false;
  isSupervisor = false;
  isPayLoan = false;
  itemSize: number;
  paginatedRenderServices;
  isPreviousActive = false;
  isNextActive = false;

  constructor(private dialog: MatDialog, public toastr: ToastrService, public pouchService: PouchService) { }

  ngOnInit() {
    this.pouchService.userPermission().then(result => {
      if (result.department == 'Main Pharmacy') {
        this.isUserPermitted = true;
      }
    });

    this.checkViewStatus();
    this.checkRoles();
  }

  reloadRenderServices() {
    this.pouchService.getRenderServices().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.department == "Main Pharmacy");
      this.renderServices = items;
      this.itemSize = this.renderServices.length;

      this.pouchService.paginationId = this.renderServices[this.renderServices.length - 1].id; //Reverse of what is meant to be;

      this.pouchService.paginateByDepartmentRemoveItem('renderservice', this.pouchService.paginationId, 'Main Pharmacy').then(paginatedata => {
        this.paginatedRenderServices = paginatedata;

        this.isNextActive = true;
      });
    });
  }

  loadRenderServices() {
    this.pouchService.getRenderServices().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.department == "Main Pharmacy");
      this.renderServices = items;
      this.itemSize = this.renderServices.length;

      this.pouchService.paginationId = this.renderServices[0].id; //Reverse of what is meant to be;

      this.pouchService.paginateByDepartment2('renderservice', this.pouchService.paginationId, 'Main Pharmacy').then(paginatedata => {
        this.paginatedRenderServices = paginatedata;

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
  }

  next() {
    this.pouchService.paginationId = this.paginatedRenderServices[this.paginatedRenderServices.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByDepartment2('renderservice', this.pouchService.paginationId, 'Main Pharmacy').then(paginatedata => {
      this.paginatedRenderServices = paginatedata;

      this.isPreviousActive = true;
    });
  }

  previous() {
    this.pouchService.paginationId = this.paginatedRenderServices[this.paginatedRenderServices.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByDepartmentPrev2('renderservice', this.pouchService.paginationId, 'Main Pharmacy').then(paginatedata => {
      this.paginatedRenderServices = paginatedata;

      if (this.paginatedRenderServices.length < this.pouchService.limitRange) {
        this.isPreviousActive = false;
      }
    });
  }

  goToStart() {
    this.isPreviousActive = false;

    this.pouchService.paginationId = this.paginatedRenderServices[this.paginatedRenderServices.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByDepartmentStart('renderservice', this.pouchService.paginationId, 'Main Pharmacy').then(paginatedata => {
      this.paginatedRenderServices = paginatedata;

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

  editRenderService(renderService) {
    let dialogRef = this.dialog.open(AddMainPharmacyServiceComponent, {
      width: '500px',
      data: {
        renderService: renderService,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      //this.loadRenderServices();
    })
  }

  deleteRenderService(renderService) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: renderService
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteRenderService(renderService).then(res => {
          this.toastr.success('Service has been deleted successfully');
          this.reloadRenderServices();
        });
      }
    });
  }

  checkViewStatus() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.isStaffSwitchedTable = staff.isswitchedtable;
      this.pouchService.getDepartments().then(departments => {
        departments = departments.filter(data => data.name == "Main Pharmacy" && data.branch == staff.branch);
        this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
        this.loadRenderServices();
      });
    });
  }

  switchView(event) {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    if (event.checked) {
      this.pouchService.getStaff(localStorageItem).then(staff => {
        staff.isswitchedtable = true;
        this.isStaffSwitchedTable = staff.isswitchedtable;
        this.pouchService.updateStaff(staff);
        this.pouchService.getDepartments().then(departments => {
          departments = departments.filter(data => data.name == "Main Pharmacy" && data.branch == staff.branch);
          departments[0].isswitchedtable = true;
          this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
          this.pouchService.updateDepartment(departments[0]).then(result => {  //For changes to be made based on department
            this.loadRenderServices();
          });
        });
      });
    }
    else {
      this.pouchService.getStaff(localStorageItem).then(staff => {
        staff.isswitchedtable = false;
        this.isStaffSwitchedTable = staff.isswitchedtable;
        this.pouchService.updateStaff(staff);
        this.pouchService.getDepartments().then(departments => {
          departments = departments.filter(data => data.name == "Main Pharmacy" && data.branch == staff.branch);
          departments[0].isswitchedtable = false;
          this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
          this.pouchService.updateDepartment(departments[0]).then(result => {
            this.loadRenderServices();
          });
        });
      });
    }
  }

  selectedRenderService(renderService, event) {
    if (event.checked) {
      renderService['selected'] = true;
    }
    else {
      renderService['selected'] = false;
    }
    this.newRenderServices = this.paginatedRenderServices.filter(data => data['selected'] == true);
    if (this.newRenderServices.length > 0) {
      this.tableCheck = true;
    }
    else {
      this.tableCheck = false;
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
              var arrayCheck = ['SERVICE NAME', 'COST', 'BRANCH', 'DEPARTMENT'];

              for (var i = 0; i < arrayCheck.length; i++) {

                if (item[arrayCheck[i]] == undefined) {
                  item[arrayCheck[i]] = 'N/A';
                }
              }

              setTimeout(() => {
                var renderService = {
                  id: '',
                  rev: '',
                  servicename: item['SERVICE NAME'],
                  cost: item['COST'],
                  branch: item['BRANCH'],
                  department: item['DEPARTMENT'],
                  sales: []
                }

                this.newArray = [];
                this.newArray.push(renderService);

                this.newArray.forEach(services => {
                  this.pouchService.saveRenderService(services).then(res => {
                    this.reloadRenderServices();
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

  addRenderService() {
    let dialogRef = this.dialog.open(AddMainPharmacyServiceComponent, {
      width: '500px',
      data: {
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      console.log(result);
      this.reloadRenderServices();
    })
  }

  deleteSelectedRenderService() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newRenderServices.forEach(renderService => {
          this.pouchService.deleteRenderService(renderService).then(res => {
            this.reloadRenderServices();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Services has been deleted successfully');
      }
    });
  }

  public export(): void {
    var exportedRenderServicesArray = [];
    this.pouchService.getRenderServices().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.department == "Main Pharmacy");
      for (var i = 0; i < items.length; i++) {
        var exportedRenderServices = {
          'S/NO': i + 1,
          'SERVICE NAME': items[i].servicename,
          'COST': items[i].cost,
          BRANCH: items[i].branch,
          DEPARTMENT: items[i].department
        }
        exportedRenderServicesArray.push(exportedRenderServices);
        this.worksheet = XLSX.utils.json_to_sheet(exportedRenderServicesArray);
      }
      const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
      this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(this.excelBuffer, 'IUTH Main Pharmacy Services');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedRenderServices = [];

    for (let renderService of this.renderServices) {
      if ((renderService.servicename).toLowerCase().indexOf(value) !== -1) {
        this.paginatedRenderServices.push(renderService);
        this.paginatedRenderServices = this.paginatedRenderServices.slice(0, this.pouchService.limitRange);
      }
    }
  }
}
