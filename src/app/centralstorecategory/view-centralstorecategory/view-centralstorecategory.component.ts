import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddCentralStoreCategoryComponent } from '../../centralstorecategory/add-centralstorecategory/add-centralstorecategory.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PouchService } from '../../../providers/pouch-service';
import { ProductCategory } from '../../../model/productcategory';
import { Router } from '@angular/router';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-view-centralstorecategory',
  templateUrl: './view-centralstorecategory.component.html',
  styleUrls: ['./view-centralstorecategory.component.css']
})
export class ViewCentralStoreCategoryComponent implements OnInit {
  centralstorecategorys: Array<ProductCategory> = [];
  public tableWidget: any;
  tableCheck = false;
  newCentralStoreCategorys: any;
  show = false;
  files: FileList;
  currentMonthNumber;
  currentMonth;
  months;
  isUserPermitted = false;
  convertFiles;
  newArray;
  isStaffSwitchedTable = false;
  isDepartmentSwitchedTable = false;
  excelBuffer: any;
  public productCategorys: Array<ProductCategory> = [];
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook;
  isSupervisor = false;
  itemSize: number;
  paginatedCentralStorecats;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService, private dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.pouchService.userPermission().then(result => {
      if (result.department == 'Central Store') {
        this.isUserPermitted = true;
      }
    });

    this.checkViewStatus();
    this.checkRoles();
  }

  reloadCentralStoreCategorys() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getProductcategorys().then(items => {
        items = items.filter(data => data.branch == staff.branch && data.department == "Central Store");
        this.centralstorecategorys = items;
        this.itemSize = this.centralstorecategorys.length;

        this.pouchService.paginationId = this.centralstorecategorys[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByDepartmentRemoveItem('productcategory', this.pouchService.paginationId, 'Central Store').then(paginatedata => {
          this.paginatedCentralStorecats = paginatedata;

          this.isNextActive = true;
        });
      });
    });
  }

  loadCentralStoreCategorys() {
    this.pouchService.getProductcategorys().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.department == "Central Store");
      this.centralstorecategorys = items;
      this.itemSize = this.centralstorecategorys.length;

      this.pouchService.paginationId = this.centralstorecategorys[this.centralstorecategorys.length - 1].id; //Reverse of what is meant to be;

      this.pouchService.paginateByDepartment2('productcategory', this.pouchService.paginationId, 'Central Store').then(paginatedata => {
        this.paginatedCentralStorecats = paginatedata;

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
    this.pouchService.paginationId = this.paginatedCentralStorecats[this.paginatedCentralStorecats.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByDepartment2('productcategory', this.pouchService.paginationId, 'Central Store').then(paginatedata => {
      this.paginatedCentralStorecats = paginatedata;

      this.isPreviousActive = true;
    });
  }

  previous() {
    this.pouchService.paginationId = this.paginatedCentralStorecats[this.paginatedCentralStorecats.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByDepartmentPrev2('productcategory', this.pouchService.paginationId, 'Central Store').then(paginatedata => {
      this.paginatedCentralStorecats = paginatedata;

      if (this.paginatedCentralStorecats.length < this.pouchService.limitRange) {
        this.isPreviousActive = false;
      }
    });
  }

  goToStart() {
    this.isPreviousActive = false;

    this.pouchService.paginationId = this.paginatedCentralStorecats[this.paginatedCentralStorecats.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByDepartmentStart('productcategory', this.pouchService.paginationId, 'Central Store').then(paginatedata => {
      this.paginatedCentralStorecats = paginatedata;

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

  editCentralStoreCategory(centralstorecategory) {
    let dialogRef = this.dialog.open(AddCentralStoreCategoryComponent, {
      width: '500px',
      data: {
        centralstorecategory: centralstorecategory,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      //this.loadCentralStoreCategorys();
    })
  }

  deleteCentralStoreCategory(centralstorecategory) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: centralstorecategory
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteProductcategory(centralstorecategory).then(res => {
          this.toastr.success('Category has been deleted successfully');
          this.reloadCentralStoreCategorys();
        });
      }
    });
  }

  checkViewStatus() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.isStaffSwitchedTable = staff.isswitchedtable;
      this.pouchService.getDepartments().then(departments => {
        departments = departments.filter(data => data.name == "Central Store" && data.branch == staff.branch);
        this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
        this.loadCentralStoreCategorys();
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
          departments = departments.filter(data => data.name == "Central Store" && data.branch == staff.branch);
          departments[0].isswitchedtable = true;
          this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
          this.pouchService.updateDepartment(departments[0]).then(result => {  //For changes to be made based on department
            this.loadCentralStoreCategorys();
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
          departments = departments.filter(data => data.name == "Central Store" && data.branch == staff.branch);
          departments[0].isswitchedtable = false;
          this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
          this.pouchService.updateDepartment(departments[0]).then(result => {
            this.loadCentralStoreCategorys();
          });
        });
      });
    }
  }

  selectedCentralStoreCategory(centralstorecategory, event) {
    if (event.checked) {
      centralstorecategory['selected'] = true;
    }
    else {
      centralstorecategory['selected'] = false;
    }
    this.newCentralStoreCategorys = this.paginatedCentralStorecats.filter(data => data['selected'] == true);
    if (this.newCentralStoreCategorys.length > 0) {
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
              var arrayCheck = ['PRODUCT NAME', 'COST PRICE', 'TABLETS/SUB-ITEM NUMBER', 'SUB GROUP', 'BRANCH', 'DEPARTMENT'];

              for (var i = 0; i < arrayCheck.length; i++) {

                if (item[arrayCheck[i]] == undefined) {
                  item[arrayCheck[i]] = 'N/A';
                }
              }

              setTimeout(() => {
                var productCategory = {
                  id: '',
                  rev: '',
                  productname: item['PRODUCT NAME'],
                  costprice: item['COST PRICE'],
                  subitemno: item['TABLETS/SUB-ITEM NUMBER'],
                  subgroup: item['SUB GROUP'],
                  branch: item['BRANCH'],
                  department: item['DEPARTMENT'],
                  products: []
                }

                this.newArray = [];
                this.newArray.push(productCategory);

                this.newArray.forEach(arrayProductCategory => {
                  this.pouchService.saveProductcategory(arrayProductCategory).then(res => {
                    this.reloadCentralStoreCategorys();
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

  addCentralStoreCategory() {
    let dialogRef = this.dialog.open(AddCentralStoreCategoryComponent, {
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
      this.reloadCentralStoreCategorys();
    })
  }

  deleteSelectedCentralStoreCategory() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newCentralStoreCategorys.forEach(productcategory => {
          this.pouchService.deleteProductcategory(productcategory).then(res => {
            this.reloadCentralStoreCategorys();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Categories has been deleted successfully');
      }
    });
  }

  public export(): void {
    var exportedProductCategorysArray = [];
    this.pouchService.getProductcategorys().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.department == "Central Store");
      for (var i = 0; i < items.length; i++) {
        var exportedProductCategorys = {
          'S/NO': i + 1,
          'PRODUCT NAME': items[i].productname,
          'COST PRICE': items[i].costprice,
          'TABLETS/SUB-ITEM NUMBER': items[i].subitemno,
          'SUB GROUP': items[i].subgroup,
          BRANCH: items[i].branch,
          DEPARTMENT: items[i].department
        }
        exportedProductCategorysArray.push(exportedProductCategorys);
        this.worksheet = XLSX.utils.json_to_sheet(exportedProductCategorysArray);
      }
      const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
      this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(this.excelBuffer, 'IUTH Product Category');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedCentralStorecats = [];

    for (let centralstorecategory of this.centralstorecategorys) {
      if ((centralstorecategory.productname).toLowerCase().indexOf(value) !== -1) {
        this.paginatedCentralStorecats.push(centralstorecategory);
        this.paginatedCentralStorecats = this.paginatedCentralStorecats.slice(0, this.pouchService.limitRange);
      }
    }
  }

}
