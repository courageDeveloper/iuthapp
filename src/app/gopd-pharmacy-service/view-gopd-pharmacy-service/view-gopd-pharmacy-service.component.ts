import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddGopdPharmacyServiceComponent } from '../add-gopd-pharmacy-service/add-gopd-pharmacy-service.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PouchService } from '../../../providers/pouch-service';
import { RenderService } from '../../../model/renderservice';
import { Router } from '@angular/router';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-view-gopd-pharmacy-service',
  templateUrl: './view-gopd-pharmacy-service.component.html',
  styleUrls: ['./view-gopd-pharmacy-service.component.css']
})
export class ViewGopdPharmacyServiceComponent implements OnInit {
  public tableWidget: any;
  tableCheck = false;
  newRenderServices: any;
  show = false;
  files: FileList;
  convertFiles;
  newArray;
  excelBuffer: any;
  public renderServices: Array<RenderService> = [];
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook;

  constructor(private dialog: MatDialog, public toastr: ToastrService, public pouchService: PouchService) { }

  ngOnInit() {
    this.loadRenderServices();
  }

  loadRenderServices() {
    this.pouchService.getRenderServices().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.department == "GOPD Pharmacy");
      this.renderServices = items;
    });
  }


  editRenderService(renderService) {
    let dialogRef = this.dialog.open(AddGopdPharmacyServiceComponent, {
      width: '500px',
      data: {
        renderService: renderService,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.loadRenderServices();
    })
  }

  deleteRenderService(renderService) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: renderService
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteRenderService(renderService).then(res => {
          this.toastr.success('Service has been deleted successfully');
          this.loadRenderServices();
        });
      }
    });
  }

  selectedRenderService(renderService, event) {
    if (event.checked) {
      renderService['selected'] = true;
    }
    else {
      renderService['selected'] = false;
    }
    this.newRenderServices = this.renderServices.filter(data => data['selected'] == true);
    if (this.newRenderServices.length > 0) {
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
              var arrayCheck = ['SERVICE NAME', 'COST', 'BRANCH', 'DEPARTMENT'];

              for (var i = 0; i < arrayCheck.length; i++) {

                if (item[arrayCheck[i]] == undefined) {
                  item[arrayCheck[i]] = 'N/A';
                }
              }

              setTimeout(() => {
                var renderService = {
                  id: '',
                  rev: '',
                  servicename: item['SERVICE NAME'],
                  cost: item['COST'],
                  branch: item['BRANCH'],
                  department: item['DEPARTMENT'],               
                  sales: []
                }

                this.newArray = [];
                this.newArray.push(renderService);

                this.newArray.forEach(services => {
                  this.pouchService.saveRenderService(services).then(res => {
                    this.loadRenderServices();
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

  addRenderService() {
    let dialogRef = this.dialog.open(AddGopdPharmacyServiceComponent, {
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
      this.loadRenderServices();
    })
  }

  deleteSelectedRenderService() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newRenderServices.forEach(renderService => {
          this.pouchService.deleteRenderService(renderService).then(res => {
            this.loadRenderServices();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Services has been deleted successfully');
      }
    });
  }

  public export(): void {
    var exportedRenderServicesArray = [];
    this.pouchService.getRenderServices().then(items => {
      items = items.filter(data => data.branch == 'IUTH(Okada)' && data.department == "GOPD Pharmacy");
      for (var i = 0; i < items.length; i++) {
        var exportedRenderServices = {
          'S/NO': i + 1,
          'SERVICE NAME': items[i].servicename,
          'COST': items[i].cost,
          BRANCH: items[i].branch,
          DEPARTMENT: items[i].department          
        }
        exportedRenderServicesArray.push(exportedRenderServices);
        this.worksheet = XLSX.utils.json_to_sheet(exportedRenderServicesArray);
      }
      const workbook: XLSX.WorkBook = { Sheets: { 'data': this.worksheet }, SheetNames: ['data'] };
      this.excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(this.excelBuffer, 'IUTH GOPD Pharmacy Services');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
