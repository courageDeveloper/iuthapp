import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { MatDialog, MatDialogRef } from '@angular/material';
import { PouchService } from '../../../providers/pouch-service';
import { Sales } from '../../../model/sales';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { AddPayloanComponent } from '../../sales/pay-loan/pay-loan.component';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-view-history-department',
  templateUrl: './view-history-department.component.html',
  styleUrls: ['./view-history-department.component.css']
})
export class ViewHistoryDepartmentComponent implements OnInit {
  public loans: Array<Sales> = [];
  public totalLoans: Array<Sales> = [];
  public tableWidget: any;
  tableCheck = false;
  newLoans: any;
  show = false;
  files: FileList;
  convertFiles;
  newArray;
  isUserPermitted = false;
  total = 0;
  excelBuffer: any;
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook;
  branch;
  promise1;
  promise2;
  promise3;
  promise4;
  promise5;
  dateFrom: any;
  dateTo: any;
  productHistory: any[];
  departments: any[];
  isFilterDepartment = false;
  id: any;

  constructor(public pouchService: PouchService, private data: DataService, private router: Router, private dialog: MatDialog, public toastr: ToastrService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.departments = ['Pharmacy Store', 'Central Store', 'Main Pharmacy', 'GOPD Pharmacy', 'Laboratory',
      'Radiology', 'Revenue', 'Account', 'Audit', 'Theatre', 'Admin'];

    this.pouchService.userPermission().then(result => {
      if (result.department == 'Account' || result.department == 'Revenue') {
        this.isUserPermitted = true;
      }
    });

    this.loadLoans();
    //this.loadTotalLoans();
  }

  loadLoans(department?) {
    var newDispatchedProduct = [];
    this.id = this.activatedRoute.snapshot.params['id'];
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {

      this.pouchService.getDepartment(this.id).then(data => {
        data.producthistory.map(id => {
          this.pouchService.getDepartmentDispatch(id).then(departmentdispatch => {
            console.log(departmentdispatch.dispatchedproducts);
            departmentdispatch.dispatchedproducts.map(product => {
              product['departmentdispatchid'] = id; //insert the dispatch id to dispatched products array.
              newDispatchedProduct.push(product);
            });
            console.log(newDispatchedProduct);
            if (this.isFilterDepartment) {
              newDispatchedProduct = newDispatchedProduct.filter(data => data.department == department);
            }
            newDispatchedProduct.map(product => {
              if (product.isUnitSelling) {
                product['sellingprice'] = product.qty * product.unitsellingprice;
              }
              else if (!product.isUnitSelling) {
                product['sellingprice'] = product.qty * product.subitemsellingprice;
              }
              if (product.isUnitSelling == undefined) {
                product['sellingprice'] = product.cost;
              }
            });
            newDispatchedProduct = newDispatchedProduct.filter(data => data.qty > 0);
            this.productHistory = newDispatchedProduct;
            this.getTotalPrices(this.productHistory);

            $(document).ready(function () {
              $('#dtBasicExample').DataTable();
              $('.dataTables_length').addClass('bs-select');
            });
          });
        });
      });
    });
  }

  filterByDepartment(department) {
    this.isFilterDepartment = true;
    this.loadLoans(department);
  }


  getTotalPrices(products) {
    var productArray = [];
    products.forEach(product => {
      productArray.push(product.sellingprice);
    });
    return this.total = productArray.reduce((a, b) => a + b, 0);
  }


  payProduct() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      if (staff.branch == 'IUTH(Okada)') {
        this.data.changeProductHistory(this.productHistory);
        this.data.changeDepartment(this.id);
        this.router.navigate(['/revenue-pos']);
      }
      else {
        this.data.changeProductHistory(this.productHistory);
        this.data.changeDepartment(this.id);
        this.router.navigate(['/account-pos']);
      }
    });
  }

  public export(): void {
    var exportedSalesArray = [];
    var productName;

    for (var i = 0; i < this.productHistory.length; i++) {
      if (this.productHistory[i].productname != undefined) {
        productName = this.productHistory[i].productname;
      }
      else {
        productName = this.productHistory[i].servicename;
      }

      var exportedSales = {
        'S/NO': i + 1,
        'PRODUCT NAME': productName,
        'PRODUCT PRICE': this.productHistory[i].sellingprice,
        'QUANTITY': this.productHistory[i].qty,
        'DISPATCHED FROM': this.productHistory[i].department
      }
      exportedSalesArray.push(exportedSales);
      this.worksheet = XLSX.utils.json_to_sheet(exportedSalesArray);
    }
    const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
    this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(this.excelBuffer, 'IUTH Department Loaned Products');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
