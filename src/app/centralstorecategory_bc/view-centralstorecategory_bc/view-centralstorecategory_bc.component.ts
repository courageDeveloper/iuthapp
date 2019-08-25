import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import {AddCentralStoreCategoryBcComponent} from '../../centralstorecategory_bc/add-centralstorecategory_bc/add-centralstorecategory_bc.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
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
  selector: 'app-view-centralstorecategory_bc',
  templateUrl: './view-centralstorecategory_bc.component.html',
  styleUrls: ['./view-centralstorecategory_bc.component.css']
})
export class ViewCentralStoreCategoryBcComponent implements OnInit {
  centralstorecategorysbc: Array<ProductCategory> = [];
  public tableWidget: any;
  tableCheck = false;
  newCentralStoreCategorysBc: any;
  show = false;
  files: FileList;
  currentMonthNumber;
  currentMonth;
  months;
  convertFiles;
  newArray;
  excelBuffer: any;
  public productCategorys: Array<ProductCategory> = [];
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook;

  constructor(public pouchService: PouchService, private dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
   this.loadCentralStoreCategorysBc();
  }

  loadCentralStoreCategorysBc() {
    this.pouchService.getProductcategorys().then(items => {
      items = items.filter(data => data.branch == 'Benin Centre' && data.department == "Central Store");
      this.centralstorecategorysbc = items;
      console.log(this.centralstorecategorysbc);
      $(document).ready(function () {
        $('#dtBasicExample').DataTable();
        $('.dataTables_length').addClass('bs-select');
      });
    });
  }


  editCentralStoreCategoryBc(centralstorecategorybc) {
    let dialogRef = this.dialog.open(AddCentralStoreCategoryBcComponent, {
      width: '500px',
      data: {
        centralstorecategorybc: centralstorecategorybc,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(!result) {
        return;
      }
      this.loadCentralStoreCategorysBc();
    })
  }

  deleteCentralStoreCategoryBc(centralstorecategorybc) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: centralstorecategorybc
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteProductcategory(centralstorecategorybc).then(res => {
          this.toastr.success('Category has been deleted successfully');
          this.loadCentralStoreCategorysBc();
        });
      }
    });
  }

  selectedCentralStoreCategoryBc(centralstorecategorybc, event) {
   if (event.checked) {
    centralstorecategorybc['selected'] = true;
    }
    else {
      centralstorecategorybc['selected'] = false;
    }
    this.newCentralStoreCategorysBc = this.centralstorecategorysbc.filter(data => data['selected'] == true);
    if (this.newCentralStoreCategorysBc.length > 0) {
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
                    this.loadCentralStoreCategorysBc();
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

  addCentralStoreCategoryBc() {
    let dialogRef = this.dialog.open(AddCentralStoreCategoryBcComponent, {
      width: '500px',
      data: {
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        return;
      }
      console.log(result);
      this.loadCentralStoreCategorysBc();
    })
  }

  deleteSelectedCentralStoreCategoryBc() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newCentralStoreCategorysBc.forEach(productcategory => {
          this.pouchService.deleteProductcategory(productcategory).then(res => {
            this.loadCentralStoreCategorysBc();
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
      items = items.filter(data => data.branch == 'Benin Centre' && data.department == "Central Store");
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
      this.saveAsExcelFile(this.excelBuffer, 'IUTH Product Category(Benin Centre)');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
