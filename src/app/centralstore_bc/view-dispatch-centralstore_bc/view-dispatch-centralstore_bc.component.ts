import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { PouchService } from '../../../providers/pouch-service';
import { DispatchedProducts } from '../../../model/dispatchedproduct';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material'
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-view-dispatch-centralstore_bc',
  templateUrl: './view-dispatch-centralstore_bc.component.html',
  styleUrls: ['./view-dispatch-centralstore_bc.component.css']
})
export class ViewDispatchCentralStoreBcComponent implements OnInit {
  public tableWidget: any;
  tableCheck = false;
  newDispatchedProducts: any;
  show = false;
  files: FileList;
  convertFiles;
  newArray;
  excelBuffer: any;
  public dispatchedProducts: Array<DispatchedProducts> = [];
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook
  exportedDispatchedProductsArray: any;


  constructor(public pouchService: PouchService, private router: Router, public dialog: MatDialog, public toastr: ToastrService) { }

  ngOnInit() {
    this.loadDispatchedProducts();
  }

  loadDispatchedProducts() {
    this.pouchService.getDispatchedProducts().then(data => {
      this.dispatchedProducts = data;
      this.dispatchedProducts = this.dispatchedProducts.filter(data => data.sourcedepartment == 'Central Store' && data.branch == 'Benin Centre');
      $(document).ready(function () {
        $('#dtBasicExample').DataTable();
        $('.dataTables_length').addClass('bs-select');
      });
    });
  }

  deleteDispatchedProduct(dispatchedProduct) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: dispatchedProduct
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteDispatchedProduct(dispatchedProduct).then(res => {
          this.toastr.success('Dispatched Product has been deleted successfully');
          this.loadDispatchedProducts();
        });
      }
    });

  }

  public export(): void {
    var exportedDispatchedProductsArray = [];
    this.pouchService.getDispatchedProducts().then(items => {
      items = items.filter(data => data.branch == 'Benin Centre' && data.sourcedepartment == "Central Store");
      for (var i = 0; i < items.length; i++) {
        var exportedDispatchedProduct = {
          'S/NO': i + 1,
          'PRODUCT NAME': items[i].productname,
          'QUANTITY DISPATCHED': items[i].unitquantity,
          'RECEIVING DEPARTMENT': items[i].dispatchdepartment,
          BRANCH: items[i].branch,
          'SOURCE DEPARTMENT': items[i].sourcedepartment,
          'DATE DISPATCHED': items[i].datedispatched      
        }
        exportedDispatchedProductsArray.push(exportedDispatchedProduct);
        this.worksheet = XLSX.utils.json_to_sheet(exportedDispatchedProductsArray);
      }
      const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
      this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(this.excelBuffer, 'IUTH Dispatched Product(Central Store(BC))');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
