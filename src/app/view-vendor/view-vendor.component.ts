import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { PouchService } from '../../providers/pouch-service';
import { Vendor } from '../../model/vendor';
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
  selector: 'app-view-vendor',
  templateUrl: './view-vendor.component.html',
  styleUrls: ['./view-vendor.component.css']
})
export class ViewVendorComponent implements OnInit {
  public tableWidget: any;
  tableCheck = false;
  newVendors: any;
  show = false;
  files: FileList;
  convertFiles;
  newArray;
  excelBuffer: any;
  isUserPermitted = false;
  public vendors: Array<Vendor> = [];
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook
  exportedVendorsArray: any;
  paginatedVendors;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService, private router: Router, public dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.pouchService.userPermission().then(result => {
      if (result.department == 'Admin') {
        this.isUserPermitted = true;
      }
    });

    this.loadVendor();
  }

  reloadVendor() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getVendors().then(data => {
        this.vendors = data.filter(data => data.branch == staff.branch);

        this.pouchService.paginateByBranchRemoveItem('vendor', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedVendors = paginatedata;

        });
      });
    });
  }

  loadVendor() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getVendors().then(data => {
        this.vendors = data.filter(data => data.branch == staff.branch);
        
        this.pouchService.paginationId = this.vendors[this.vendors.length - 1].id; //Reverse of what is meant to be;

        this.pouchService.paginateByBranch2('vendor', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedVendors = paginatedata;

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
    this.pouchService.paginationId = this.paginatedVendors[this.paginatedVendors.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranch2('vendor', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedVendors = paginatedata;

      this.isPreviousActive = true;
    });
  }

  previous() {
    this.pouchService.paginationId = this.paginatedVendors[this.paginatedVendors.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranchPrev2('vendor', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedVendors = paginatedata;

      if (this.paginatedVendors.length < this.pouchService.limitRange) {
        this.isPreviousActive = false;
      }
    });
  }

  goToStart() {
    this.isPreviousActive = false;

    this.pouchService.paginationId = this.paginatedVendors[this.paginatedVendors.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranchStart('vendor', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedVendors = paginatedata;

    });
  }


  editVendor(vendor) {
    this.router.navigate(['edit-vendor', vendor.id]);
  }

  deleteVendor(vendor) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: vendor
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteVendor(vendor).then(res => {
          this.toastr.success('Vendor has been deleted successfully');
          this.reloadVendor();
        });
      }
    });

  }

  selectedVendor(vendor, event) {
    if (event.checked) {
      vendor['selected'] = true;
    }
    else {
      vendor['selected'] = false;
    }
    this.newVendors = this.paginatedVendors.filter(data => data['selected'] == true);
    if (this.newVendors.length > 0) {
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
              var arrayCheck = ['FULLNAME', 'BRANCH', 'BALANCE', 'ACCOUNT NUMBER', 'BANK NAME',
                'PHONE NUMBER', 'ADDRESS', 'EMAIL', 'DATE OF REGISTRATION'];

              for (var i = 0; i < arrayCheck.length; i++) {

                if (item[arrayCheck[i]] == undefined) {
                  item[arrayCheck[i]] = 'N/A';
                }
              }

              setTimeout(() => {
                var vendor = {
                  id: '',
                  rev: '',
                  fullname: item['FULLNAME'],
                  branch: item['BRANCH'],
                  balance: item['BALANCE'],
                  accountnumber: item['ACCOUNT NUMBER'],
                  bankname: item['BANK NAME'],
                  mobile: item['PHONE NUMBER'],
                  address: item['ADDRESS'],
                  email: item['EMAIL'],
                  dateofregistration: item['DATE OF REGISTRATION'],
                  expenses: []
                }

                this.newArray = [];
                this.newArray.push(vendor);

                this.newArray.forEach(arrayVendor => {
                  arrayVendor.dateofregistration = new Date((arrayVendor.dateofregistration - (25567 + 2)) * 86400 * 1000);
                  this.pouchService.saveVendor(arrayVendor).then(res => {
                    this.reloadVendor();
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

  deleteSelectedVendor() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newVendors.forEach(vendor => {
          this.pouchService.deleteVendor(vendor).then(res => {
            this.reloadVendor();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Vendors has been deleted successfully');
      }
    });
  }

  public export(): void {
    var exportedVendorsArray = [];
    this.pouchService.getVendors().then(items => {
      for (var i = 0; i < items.length; i++) {
        var exportedVendors = {
          'S/NO': i + 1,
          FULLNAME: items[i].fullname,
          BRANCH: items[i].branch,
          BALANCE: items[i].balance,
          'ACCOUNT NUMBER': items[i].accountnumber,
          'BANK NAME': items[i].bankname,
          'PHONE NUMBER': items[i].mobile,
          ADDRESS: items[i].address,
          EMAIL: items[i].email,
          'DATE OF REGISTRATION': items[i].dateofregistration
        }
        exportedVendorsArray.push(exportedVendors);
        this.worksheet = XLSX.utils.json_to_sheet(exportedVendorsArray);
      }
      const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
      this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(this.excelBuffer, 'IUTH Vendor');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  viewHistory(vendor) {
    this.router.navigate(['view-history-vendor', vendor.id]);
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedVendors = [];

    for (let vendor of this.vendors) {
      if ((vendor.fullname).toLowerCase().indexOf(value) !== -1) {
        this.paginatedVendors.push(vendor);
        this.paginatedVendors = this.paginatedVendors.slice(0, this.pouchService.limitRange);
      }
    }
  }

}
