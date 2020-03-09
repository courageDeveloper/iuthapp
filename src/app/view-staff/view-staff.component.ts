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
  isUserPermitted = false;
  public staffs: Array<Staff> = [];
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook
  exportedStaffsArray: any;
  paginatedStaffs;
  isPreviousActive = false;
  isNextActive = false;


  constructor(public pouchService: PouchService, private router: Router, public dialog: MatDialog, public toastr: ToastrService) {

  }

  ngOnInit() {
    this.pouchService.paginationId = null;
    this.pouchService.userPermission().then(result => {
      if (result.department == 'Admin') {
        this.isUserPermitted = true;
      }
    });

    this.loadStaff();
  }

  reloadStaff() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getStaffs().then(data => {
        //console.log(data);
        this.staffs = data.filter(data => data.branch == staff.branch);

        this.pouchService.paginationId = this.paginatedStaffs[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByBranchRemoveItem('staff', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedStaffs = paginatedata;
          
          this.isNextActive = true;
        });
      });
    });

  }

  loadStaff() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getStaffs().then(data => {
        
        this.staffs = data.filter(data => data.branch == staff.branch);
        this.pouchService.paginationId = this.staffs[this.staffs.length - 1].id; //Reverse of what is meant to be;

        this.pouchService.paginateByBranch2('staff', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedStaffs = paginatedata;

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
    this.pouchService.paginationId = this.paginatedStaffs[this.paginatedStaffs.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranch2('staff', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedStaffs = paginatedata;

      this.isPreviousActive = true;
    });
  }

  previous() {
    this.pouchService.paginationId = this.paginatedStaffs[this.paginatedStaffs.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranchPrev2('staff', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedStaffs = paginatedata;

      if (this.paginatedStaffs.length < this.pouchService.limitRange) {
        this.isPreviousActive = false;
      }
    });
  }

  goToStart() {
    this.isPreviousActive = false;

    this.pouchService.paginationId = this.paginatedStaffs[this.paginatedStaffs.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranchStart('staff', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedStaffs = paginatedata;
      
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
          this.reloadStaff();
        });
      }
    });

  }

  selectedStaff(staff, event) {
    if (event.checked) {
      staff['selected'] = true;
    }
    else {
      staff['selected'] = false;
    }
    this.newStaffs = this.paginatedStaffs.filter(data => data['selected'] == true);
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
                  dob: item['DOB'],
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
                  dateofentry: item['DATE OF EMPLOYMENT'],
                  sex: item['SEX'],
                  roles: [{ role: 'Supervisor', isChecked: false }, { role: 'Evacuate', isChecked: false }, { role: 'Refund/Return', isChecked: false }, { role: 'Pay Loan', isChecked: false }],
                  notification: [],
                  expenses: []
                }

                this.newArray = [];
                this.newArray.push(staff);

                this.newArray.forEach(arrayStaff => {
                  arrayStaff.dob = new Date((arrayStaff.dob - (25567 + 2)) * 86400 * 1000);
                  arrayStaff.dateofentry = new Date((arrayStaff.dateofentry - (25567 + 2)) * 86400 * 1000);
                  this.pouchService.saveStaff(arrayStaff).then(res => {
                    this.reloadStaff();
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
            this.reloadStaff();
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

  viewHistory(staff) {
    this.router.navigate(['view-history-staff', staff.id]);
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedStaffs = [];

    for (let staff of this.staffs) {
      if ((staff.firstname + ' ' + staff.lastname).toLowerCase().indexOf(value) !== -1) {
        this.paginatedStaffs.push(staff);
        this.paginatedStaffs = this.paginatedStaffs.slice(0, this.pouchService.limitRange);
      }
    }
  }

}
