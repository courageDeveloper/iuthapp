import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddPharmacyStoreCategoryComponent } from '../../pharmacystorecategory/add-pharmacystorecategory/add-pharmacystorecategory.component';
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
  selector: 'app-view-pharmacystorecategory',
  templateUrl: './view-pharmacystorecategory.component.html',
  styleUrls: ['./view-pharmacystorecategory.component.css']
})
export class ViewPharmacyStoreCategoryComponent implements OnInit {
  pharmacystorecategorys: Array<ProductCategory> = [];
  public tableWidget: any;
  tableCheck = false;
  newPharmacyStoreCategorys: any;
  show = false;
  files: FileList;
  isStaffSwitchedTable = false;
  isDepartmentSwitchedTable = false;
  convertFiles;
  isUserPermitted = false;
  newArray;
  excelBuffer: any;
  //public productCategorys: Array<ProductCategory> = [];
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook;
  isSupervisor = false;
  itemSize: number;
  paginatedPharmacyStorecats;
  isPreviousActive = false;
  isNextActive = false;

  constructor(public pouchService: PouchService, private dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.pouchService.userPermission().then(result => {
      if (result.department == 'Pharmacy Store') {
        this.isUserPermitted = true;
      }
    });

    this.checkViewStatus();
    this.checkRoles();
  }

  reloadPharmacyStoreCategorys() {
    this.pouchService.getProductcategorys().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.department == "Pharmacy Store");
      this.pharmacystorecategorys = items;
      this.itemSize = this.pharmacystorecategorys.length;

      this.pouchService.paginationId = this.pharmacystorecategorys[0].id; //Reverse of what is meant to be;

      this.pouchService.paginateByDepartmentRemoveItem('productcategory', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
        this.paginatedPharmacyStorecats = paginatedata;

      });
    });
  }

  loadPharmacyStoreCategorys() {
    this.pouchService.getProductcategorys().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.department == "Pharmacy Store");
      this.pharmacystorecategorys = items;
      this.itemSize = this.pharmacystorecategorys.length;
      
      this.pouchService.paginationId = this.pharmacystorecategorys[this.pharmacystorecategorys.length - 1].id; //Reverse of what is meant to be;

      this.pouchService.paginateByDepartment2('productcategory', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
        this.paginatedPharmacyStorecats = paginatedata;
        
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
    this.pouchService.paginationId = this.paginatedPharmacyStorecats[this.paginatedPharmacyStorecats.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByDepartment2('productcategory', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
      this.paginatedPharmacyStorecats = paginatedata;

      this.isPreviousActive = true;
    });
  }

  previous() {
    this.pouchService.paginationId = this.paginatedPharmacyStorecats[this.paginatedPharmacyStorecats.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByDepartmentPrev2('productcategory', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
      this.paginatedPharmacyStorecats = paginatedata;

      if (this.paginatedPharmacyStorecats.length < this.pouchService.limitRange) {
        this.isPreviousActive = false;
      }
    });
  }

  goToStart() {
    this.isPreviousActive = false;

    this.pouchService.paginationId = this.paginatedPharmacyStorecats[this.paginatedPharmacyStorecats.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByDepartmentStart('productcategory', this.pouchService.paginationId, 'Pharmacy Store').then(paginatedata => {
      this.paginatedPharmacyStorecats = paginatedata;

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


  editPharmacyStoreCategory(pharmacystorecategory) {
    let dialogRef = this.dialog.open(AddPharmacyStoreCategoryComponent, {
      width: '500px',
      data: {
        pharmacystorecategory: pharmacystorecategory,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      //this.loadPharmacyStoreCategorys();
    })
  }

  deletePharmacyStoreCategory(pharmacystorecategory) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: pharmacystorecategory
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteProductcategory(pharmacystorecategory).then(res => {
          this.toastr.success('Category has been deleted successfully');
          this.reloadPharmacyStoreCategorys();
        });
      }
    });
  }

  checkViewStatus() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.isStaffSwitchedTable = staff.isswitchedtable;
      this.pouchService.getDepartments().then(departments => {
        departments = departments.filter(data => data.name == "Pharmacy Store" && data.branch == staff.branch);
        this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
        this.loadPharmacyStoreCategorys();
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
          departments = departments.filter(data => data.name == "Pharmacy Store" && data.branch == staff.branch);
          departments[0].isswitchedtable = true;
          this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
          this.pouchService.updateDepartment(departments[0]).then(result => {  //For changes to be made based on department
            this.loadPharmacyStoreCategorys();
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
          departments = departments.filter(data => data.name == "Pharmacy Store" && data.branch == staff.branch);
          departments[0].isswitchedtable = false;
          this.isDepartmentSwitchedTable = departments[0].isswitchedtable;
          this.pouchService.updateDepartment(departments[0]).then(result => {
            this.loadPharmacyStoreCategorys();
          });
        });
      });
    }
  }

  selectedPharmacyStoreCategory(pharmacystorecategory, event) {
    if (event.checked) {
      pharmacystorecategory['selected'] = true;
    }
    else {
      pharmacystorecategory['selected'] = false;
    }
    this.newPharmacyStoreCategorys = this.paginatedPharmacyStorecats.filter(data => data['selected'] == true);
    if (this.newPharmacyStoreCategorys.length > 0) {
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
                    this.reloadPharmacyStoreCategorys();
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

  addPharmacyStoreCategory() {
    let dialogRef = this.dialog.open(AddPharmacyStoreCategoryComponent, {
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
      this.reloadPharmacyStoreCategorys();
    })
  }

  deleteSelectedPharmacyStoreCategory() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newPharmacyStoreCategorys.forEach(productcategory => {
          this.pouchService.deleteProductcategory(productcategory).then(res => {
            this.reloadPharmacyStoreCategorys();
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
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.department == "Pharmacy Store");
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
    this.paginatedPharmacyStorecats = [];

    for (let pharmacystorecategory of this.pharmacystorecategorys) {
      if ((pharmacystorecategory.productname).toLowerCase().indexOf(value) !== -1) {
        this.paginatedPharmacyStorecats.push(pharmacystorecategory);
        this.paginatedPharmacyStorecats = this.paginatedPharmacyStorecats.slice(0, this.pouchService.limitRange);
      }
    }
  }

}
