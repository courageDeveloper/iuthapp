import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { PouchService } from '../../providers/pouch-service';
import { Staff } from '../../model/staff';
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
  selector: 'app-view-staff',
  templateUrl: './view-staff.component.html',
  styleUrls: ['./view-staff.component.css']
})
export class ViewStaffComponent implements OnInit {
  public tableWidget: any;
  tableCheck = false;
  newStaffs: any;
  show = false;
  files: FileList;
  convertFiles;
  newArray;
  excelBuffer: any;
  public staffs: Array<Staff> = [];
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook
  exportedStaffsArray: any;


  constructor(public pouchService: PouchService, private router: Router, public dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.loadStaff();
  }

  loadStaff() {
    this.pouchService.getStaffs().then(data => {
      this.staffs = data;

      $(document).ready(function () {
        $('#dtBasicExample').DataTable();
        $('.dataTables_length').addClass('bs-select');
      });
    });
  }

  editStaff(staff) {
    this.router.navigate(['edit-user-profile', staff.id]);
  }

  deleteStaff(staff) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: staff
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteStaff(staff).then(res => {
          this.toastr.success('Staff has been deleted successfully');
          this.loadStaff();
        });
      }
    });

  }

  viewHistory() {

  }

  selectedStaff(staff, event) {
    if (event.checked) {
      staff['selected'] = true;
    }
    else {
      staff['selected'] = false;
    }
    this.newStaffs = this.staffs.filter(data => data['selected'] == true);
    if (this.newStaffs.length > 0) {
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
              var arrayCheck = ['USERNAME', 'FIRSTNAME', 'LASTNAME', 'BRANCH', 'DEPARTMENT', 'DOB', 'STAFF CODE', 'POSITION', 'PASSWORD', 'SALARY', 'DEBT', 'ACCOUNT NUMBER', 'BANK NAME',
                'PHONE NUMBER', 'ADDRESS', 'EMAIL', 'DATE OF EMPLOYMENT', 'SEX'];

              for (var i = 0; i < arrayCheck.length; i++) {

                if (item[arrayCheck[i]] == undefined) {
                  item[arrayCheck[i]] = 'N/A';
                }
              }

              setTimeout(() => {
                var staff = {
                  id: '',
                  rev: '',
                  username: item['USERNAME'],
                  firstname: item['FIRSTNAME'],
                  lastname: item['LASTNAME'],
                  branch: item['BRANCH'],
                  department: item['DEPARTMENT'],
                  dob: new Date(item['DOB']),
                  staffcode: item['STAFF CODE'],
                  position: item['POSITION'],
                  password: item['PASSWORD'],
                  salary: item['SALARY'],
                  debt: item['DEBT'],
                  accountnumber: item['ACCOUNT NUMBER'],
                  bankaccount: item['BANK NAME'],
                  mobile: item['PHONE NUMBER'],
                  address: item['ADDRESS'],
                  email: item['EMAIL'],
                  dateofentry: new Date(item['DATE OF EMPLOYMENT']),
                  sex: item['SEX'],
                  notification: [],
                  expenses: []
                }

                this.newArray = [];
                this.newArray.push(staff);

                this.newArray.forEach(arrayStaff => {
                  this.pouchService.saveStaff(arrayStaff).then(res => {
                    this.loadStaff();
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

  deleteSelectedStaff() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newStaffs.forEach(staff => {
          this.pouchService.deleteStaff(staff).then(res => {
            this.loadStaff();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Staffs has been deleted successfully');
      }
    });
  }

  public export(): void {
    var exportedStaffsArray = [];
    this.pouchService.getStaffs().then(items => {
      for (var i = 0; i < items.length; i++) {
        var exportedStaffs = {
          'S/NO': i + 1,
          USERNAME: items[i].username,
          FIRSTNAME: items[i].firstname,
          LASTNAME: items[i].lastname,
          BRANCH: items[i].branch,
          DEPARTMENT: items[i].department,
          DOB: items[i].dob,
          'STAFF CODE': items[i].staffcode,
          POSITION: items[i].position,
          PASSWORD: items[i].password,
          SALARY: items[i].salary,
          DEBT: items[i].debt,
          'ACCOUNT NUMBER': items[i].accountnumber,
          'BANK NAME': items[i].bankaccount,
          'PHONE NUMBER': items[i].mobile,
          ADDRESS: items[i].address,
          EMAIL: items[i].email,
          'DATE OF EMPLOYMENT': items[i].dateofentry,
          SEX: items[i].sex
        }
        exportedStaffsArray.push(exportedStaffs);
        this.worksheet = XLSX.utils.json_to_sheet(exportedStaffsArray);
      }
      const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
      this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(this.excelBuffer, 'IUTH Staff');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
