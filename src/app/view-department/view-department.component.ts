import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { PouchService } from '../../providers/pouch-service';
import { Department } from '../../model/department';
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
  selector: 'app-view-department',
  templateUrl: './view-department.component.html',
  styleUrls: ['./view-department.component.css']
})
export class ViewDepartmentComponent implements OnInit {
  public tableWidget: any;
  tableCheck = false;
  newDepartments: any;
  show = false;
  files: FileList;
  convertFiles;
  newArray;
  excelBuffer: any;
  public departments: Array<Department> = [];
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook
  exportedDepartmentsArray: any;
  localStorageItem: any;

  constructor(public pouchService: PouchService, private router: Router, public dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.localStorageItem = JSON.parse(localStorage.getItem('user'));

    this.pouchService.getStaff(this.localStorageItem).then(staff => {
      this.pouchService.getDepartments().then(data => {
        this.departments = data;
        this.departments = this.departments.filter(data => data.branch == staff.branch);
  
        $(document).ready(function () {
          $('#dtBasicExample').DataTable();
          $('.dataTables_length').addClass('bs-select');
        });
      });
    });
  }

  viewHistory() {

  }

  public export(): void {
    var exportedDepartmentsArray = [];
    this.pouchService.getDepartments().then(items => {
      for (var i = 0; i < items.length; i++) {
        var exportedDepartments = {
          'S/NO': i + 1,
          NAME: items[i].name,
          BRANCH: items[i].branch,
          DEBT: items[i].debt
        }
        exportedDepartmentsArray.push(exportedDepartments);
        this.worksheet = XLSX.utils.json_to_sheet(exportedDepartmentsArray);
      }
      const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
      this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(this.excelBuffer, 'IUTH Departments');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
