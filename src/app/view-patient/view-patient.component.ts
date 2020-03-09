import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { PouchService } from '../../providers/pouch-service';
import { Patient } from '../../model/patient';
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
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.css']
})
export class ViewPatientComponent implements OnInit {
  public tableWidget: any;
  tableCheck = false;
  newPatients: any;
  show = false;
  files: FileList;
  convertFiles;
  newArray;
  isUserPermitted = false;
  excelBuffer: any;
  public patients: Array<Patient> = [];
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook
  exportedPatientsArray: any;
  paginatedPatients;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService, private router: Router, public dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.pouchService.userPermission().then(result => {
      if (result.department == 'Admin') {
        this.isUserPermitted = true;
      }
    });

    this.loadPatients();
  }

  reloadPatients() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getPatients().then(data => {
        this.patients = data.filter(data => data.branch == staff.branch);

        this.pouchService.paginationId = this.patients[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByBranchRemoveItem('patient', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedPatients = paginatedata;

        });

      });
    });
  }

  loadPatients() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getPatients().then(data => {
        this.patients = data.filter(data => data.branch == staff.branch);

        this.pouchService.paginationId = this.patients[this.patients.length - 1].id; //Reverse of what is meant to be;

        this.pouchService.paginateByBranch2('patient', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedPatients = paginatedata;

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
    this.pouchService.paginationId = this.paginatedPatients[this.paginatedPatients.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranch2('patient', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedPatients = paginatedata;

      this.isPreviousActive = true;
    });
  }

  previous() {
    this.pouchService.paginationId = this.paginatedPatients[this.paginatedPatients.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranchPrev2('patient', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedPatients = paginatedata;

      if (this.paginatedPatients.length < this.pouchService.limitRange) {
        this.isPreviousActive = false;
      }
    });
  }

  goToStart() {
    this.isPreviousActive = false;

    this.pouchService.paginationId = this.paginatedPatients[this.paginatedPatients.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranchStart('patient', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedPatients = paginatedata;
      
    });
  }

  editPatient(patient) {
    this.router.navigate(['edit-patient', patient.id]);
  }

  deletePatient(patient) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: patient
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deletePatient(patient).then(res => {
          this.toastr.success('Patient has been deleted successfully');
          this.reloadPatients();
        });
      }
    });
  }

  viewHistory(patient) {
    this.router.navigate(['view-history-patient', patient.id]);
  }

  deleteSelectedPatient() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newPatients.forEach(patient => {
          this.pouchService.deletePatient(patient).then(res => {
            this.reloadPatients();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Patients has been deleted successfully');
      }
    });
  }

  selectedPatient(patient, event) {
    if (event.checked) {
      patient['selected'] = true;
    }
    else {
      patient['selected'] = false;
    }
    this.newPatients = this.paginatedPatients.filter(data => data['selected'] == true);
    if (this.newPatients.length > 0) {
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
              var arrayCheck = ['FIRSTNAME', 'LASTNAME', 'BRANCH', 'DEPARTMENT', 'DOB', 'PATIENT NUMBER', 'POSITION',
                'PHONE NUMBER', 'ADDRESS', 'EMAIL', 'DATE OF REGISTRATION', 'DEBT', 'SEX'];

              for (var i = 0; i < arrayCheck.length; i++) {

                if (item[arrayCheck[i]] == undefined) {
                  item[arrayCheck[i]] = 'N/A';
                }
              }
              setTimeout(() => {
                var patient = {
                  id: '',
                  rev: '',
                  firstname: item['FIRSTNAME'],
                  lastname: item['LASTNAME'],
                  branch: item['BRANCH'],
                  department: item['DEPARTMENT'],
                  dob: item['DOB'],
                  patientno: item['PATIENT NUMBER'],
                  position: item['POSITION'],
                  mobile: item['PHONE NUMBER'],
                  address: item['ADDRESS'],
                  email: item['EMAIL'],
                  debt: item['DEBT'],
                  dateofregistration: item['DATE OF REGISTRATION'],
                  sex: item['SEX'],
                  sales: []
                }

                this.newArray = [];
                this.newArray.push(patient);

                this.newArray.forEach(arrayPatient => {
                  arrayPatient.dob = new Date((arrayPatient.dob - (25567 + 2)) * 86400 * 1000);
                  arrayPatient.dateofregistration = new Date((arrayPatient.dateofregistration - (25567 + 2)) * 86400 * 1000);
                  this.pouchService.savePatient(arrayPatient).then(res => {
                    this.reloadPatients();
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
    var exportedPatientsArray = [];
    this.pouchService.getPatients().then(items => {
      for (var i = 0; i < items.length; i++) {
        var exportedPatients = {
          'S/NO': i + 1,
          FIRSTNAME: items[i].firstname,
          LASTNAME: items[i].lastname,
          BRANCH: items[i].branch,
          DEPARTMENT: items[i].department,
          DOB: items[i].dob,
          'PATIENT NUMBER': items[i].patientno,
          POSITION: items[i].position,
          'PHONE NUMBER': items[i].mobile,
          ADDRESS: items[i].address,
          EMAIL: items[i].email,
          'DATE OF REGISTRATION': items[i].dateofregistration,
          SEX: items[i].sex
        }
        exportedPatientsArray.push(exportedPatients);
        this.worksheet = XLSX.utils.json_to_sheet(exportedPatientsArray);
      }
      const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
      this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(this.excelBuffer, 'IUTH Patients');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  
  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedPatients = [];

    for (let patient of this.patients) {
      if ((patient.firstname + ' ' + patient.lastname).toLowerCase().indexOf(value) !== -1) {
        this.paginatedPatients.push(patient);
        this.paginatedPatients = this.paginatedPatients.slice(0, this.pouchService.limitRange);
      }
    }
  }
}
