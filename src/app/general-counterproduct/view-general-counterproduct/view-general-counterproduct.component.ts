import { Component, OnInit, AfterViewInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { AddMainPharmacyCounterProductComponent } from '../../main-pharmacy-counterproduct/add-main-pharmacy-counterproduct/add-main-pharmacy-counterproduct.component';
import { AddDamagedproductsComponent } from '../../damagedproducts/add-damagedproducts/add-damagedproducts.component';
import { AddGrossProfitComponent } from '../../grossprofit/add-grossprofit/add-grossprofit.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PouchService } from '../../../providers/pouch-service';
import { CounterProducts } from '../../../model/counterproduct';
import { Router } from '@angular/router';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { DataService } from '../../services/data.service';
import { DispatchedProducts } from '../../../model/dispatchedproduct';

@Component({
  selector: 'app-view-general-counterproduct',
  templateUrl: './view-general-counterproduct.component.html',
  styleUrls: ['./view-general-counterproduct.component.css']
})
export class ViewGeneralCounterProductComponent implements OnInit, AfterViewInit {
  counterProducts: Array<CounterProducts> = [];
  public tableWidget: any;
  tableCheck = false;
  newCounterProducts: any;
  show = false;
  files: FileList;
  currentMonthNumber;
  currentMonth;
  convertFiles;
  newArray;
  excelBuffer: any;
  worksheet: XLSX.WorkSheet;
  workbook: XLSX.WorkBook;
  arrayImages: any[];
  itemSize: number;
  noOfProduct: number;
  months: any[];
  years: any[];
  selectedMonth;
  selectedDepartment;
  selectedYear = new Date().getFullYear();
  currentStock: number;
  purchases: number;
  isSupervisor = false;
  departments: any[];
  isFilterMonth = false;
  isFilterDepartment = false;
  public dispatchedProducts: Array<DispatchedProducts> = [];
  paginatedCounterProducts;
  isPreviousActive = false;
  isNextActive = false;

  constructor(private dialog: MatDialog, private data: DataService, private router: Router, public pouchService: PouchService, public _DomSanitizer: DomSanitizer, public toastr: ToastrService) {

  }

  ngOnInit() {
    this.currentStock = 0;
    this.purchases = 0;

    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.departments = ['Main Pharmacy', 'GOPD Pharmacy', 'Laboratory',
      'Radiology'];

    this.arrayImages = ['assets/img/image_placeholder.png', 'assets/img/cover.jpeg'];
    this.loadCounterProducts();
    this.loadDispatchedProducts();

    setInterval(() => {
      this.checkedExpired();
    }, 300000);

    this.getYears();
    this.checkRoles();
    this.getMonths();
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

  getYears() {
    this.years = [];
    var currentYear = new Date().getFullYear();

    for (var i = 1980; i <= currentYear; i++) {

      this.years.push(i);
    }
  }

  getMonths() {
    var indexMonth = new Date().getMonth();
    this.selectedMonth = this.months[indexMonth];
  }

  filterByDepartment() {
    this.isFilterDepartment = true;
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getCounterProducts().then(data => {
        this.counterProducts = data.filter(data => data.branch == staff.branch);
        var p = this.counterProducts.map(async counterproduct => {
          await this.pouchService.getProductcategory(counterproduct.productcatid).then(productcategory => {
            if (productcategory != undefined) {
              if (productcategory.subitemno > 0) {
                counterproduct["subitemcost"] = productcategory.costprice / productcategory.subitemno;
              }
              else if (productcategory.subitemno == 0) {
                counterproduct["subitemcost"] = productcategory.costprice / 1;
              }
            }
            else {
              if (counterproduct['initialsubitem'] > 0) {
                counterproduct["subitemcost"] = counterproduct.costprice / counterproduct['initialsubitem'];
              }
              else if (counterproduct['initialsubitem'] == 0) {
                counterproduct["subitemcost"] = counterproduct.costprice / 1;
              }
            }
          });
          this.getCurrentStock(this.counterProducts);
        });
        Promise.all([p]).then(result => {
          setTimeout(() => {
            console.log("New", this.counterProducts);
          }, 5000);
        });
        this.counterProducts = this.counterProducts.filter(data => {
          var dbMonth = this.months[new Date(data.datesupplied).getMonth()];
          var dbYear = new Date(data.datesupplied).getFullYear();

          if (!this.isFilterMonth) {
            return this.selectedDepartment == data.department;
          }
          else {
            return this.selectedDepartment == data.department && this.selectedMonth == dbMonth && this.selectedYear == dbYear;
          }
        });
        this.noOfProduct = this.counterProducts.length;

        if (!this.isFilterMonth) {
          this.pouchService.paginationId = this.counterProducts[0].id; //Reverse of what is meant to be;

          this.pouchService.paginateByDepartment2('counterproduct', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
            this.paginatedCounterProducts = paginatedata;
          });
        }
        else {
          this.pouchService.paginationId = this.counterProducts[0].id; //Reverse of what is meant to be;

          this.pouchService.paginateByDepartment2('counterproduct', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
            this.paginatedCounterProducts = paginatedata;
            this.paginatedCounterProducts = this.paginatedCounterProducts.filter(data => {
              var dbMonth = this.months[new Date(data.datesupplied).getMonth()];
              var dbYear = new Date(data.datesupplied).getFullYear();

              return this.selectedMonth == dbMonth && this.selectedYear == dbYear;

            });
          });
        }
      });
      //Filter for Dispatched Products;
      this.pouchService.getDispatchedProducts().then(items => {
        items = items.filter(data => data.branch == staff.branch);
        this.dispatchedProducts = items;

        this.dispatchedProducts = this.dispatchedProducts.filter(data => {
          var dbMonth = this.months[new Date(data.datedispatched).getMonth()];
          var dbYear = new Date(data.datedispatched).getFullYear();

          if (!this.isFilterDepartment) {
            return this.selectedMonth == dbMonth && this.selectedYear == dbYear;
          }
          else {
            return this.selectedMonth == dbMonth && this.selectedYear == dbYear && this.selectedDepartment == data.dispatchdepartment;
          }
        })
        this.getPurchases(this.dispatchedProducts);
      });
    });
  }

  filterByMonth() {
    this.isFilterMonth = true;
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getCounterProducts().then(data => {
        this.counterProducts = data.filter(data => data.branch == staff.branch);
        var p = this.counterProducts.map(async counterproduct => {
          await this.pouchService.getProductcategory(counterproduct.productcatid).then(productcategory => {
            if (productcategory != undefined) {
              if (productcategory.subitemno > 0) {
                counterproduct["subitemcost"] = productcategory.costprice / productcategory.subitemno;
              }
              else if (productcategory.subitemno == 0) {
                counterproduct["subitemcost"] = productcategory.costprice / 1;
              }
            }
            else {
              if (counterproduct['initialsubitem'] > 0) {
                counterproduct["subitemcost"] = counterproduct.costprice / counterproduct['initialsubitem'];
              }
              else if (counterproduct['initialsubitem'] == 0) {
                counterproduct["subitemcost"] = counterproduct.costprice / 1;
              }
            }
          });
          this.getCurrentStock(this.counterProducts);
        });
        Promise.all([p]).then(result => {
          setTimeout(() => {
            console.log("New", this.counterProducts);
          }, 5000);
        });

        this.pouchService.paginationId = data[0].id; //Reverse of what is meant to be;

        this.counterProducts = this.counterProducts.filter(data => {

          var dbMonth = this.months[new Date(data.datesupplied).getMonth()];
          var dbYear = new Date(data.datesupplied).getFullYear();
          if (!this.isFilterDepartment) {
            return this.selectedMonth == dbMonth && this.selectedYear == dbYear;
          }
          else {
            return this.selectedMonth == dbMonth && this.selectedYear == dbYear && this.selectedDepartment == data.department;
          }
        });
        this.noOfProduct = this.counterProducts.length;

        if (!this.isFilterDepartment) {
          this.pouchService.paginateByBranch2('counterproduct', this.pouchService.paginationId).then(paginatedata => {
            this.paginatedCounterProducts = paginatedata;
            this.paginatedCounterProducts = this.paginatedCounterProducts.filter(data => {
              var dbMonth = this.months[new Date(data.datesupplied).getMonth()];
              var dbYear = new Date(data.datesupplied).getFullYear();

              return this.selectedMonth == dbMonth && this.selectedYear == dbYear;
            });
          });
        }
        else {
          this.pouchService.paginateByDepartment2('counterproduct', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
            this.paginatedCounterProducts = paginatedata;
            this.paginatedCounterProducts = this.paginatedCounterProducts.filter(data => {
              var dbMonth = this.months[new Date(data.datesupplied).getMonth()];
              var dbYear = new Date(data.datesupplied).getFullYear();

              return this.selectedMonth == dbMonth && this.selectedYear == dbYear;

            });
          });
        }
      });
      //Filter for Dispatched Products;
      this.pouchService.getDispatchedProducts().then(items => {
        items = items.filter(data => data.branch == staff.branch);
        this.dispatchedProducts = items;

        this.dispatchedProducts = this.dispatchedProducts.filter(data => {
          var dbMonth = this.months[new Date(data.datedispatched).getMonth()];
          var dbYear = new Date(data.datedispatched).getFullYear();

          if (!this.isFilterDepartment) {
            return this.selectedMonth == dbMonth && this.selectedYear == dbYear;
          }
          else {
            return this.selectedMonth == dbMonth && this.selectedYear == dbYear && this.selectedDepartment == data.dispatchdepartment;
          }
        })
        this.getPurchases(this.dispatchedProducts);
      });
    });
  }

  ngAfterViewInit() {

  }

  loadDispatchedProducts() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getDispatchedProducts().then(items => {
        items = items.filter(data => data.branch == staff.branch);
        this.dispatchedProducts = items;

        this.getPurchases(this.dispatchedProducts);
      });
    });
  }

  loadCounterProducts() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getCounterProducts().then(items => {
        items = items.filter(data => data.branch == staff.branch);
        
        this.counterProducts = items;
        this.itemSize = this.counterProducts.length;
        this.noOfProduct = this.counterProducts.length;
        var p = this.counterProducts.map(async counterproduct => {
          await this.pouchService.getProductcategory(counterproduct.productcatid).then(productcategory => {
            if (productcategory != undefined) {
              if (productcategory.subitemno > 0) {
                counterproduct["subitemcost"] = productcategory.costprice / productcategory.subitemno;
              }
              else if (productcategory.subitemno == 0) {
                counterproduct["subitemcost"] = productcategory.costprice / 1;
              }
            }
            else {
              if (counterproduct['initialsubitem'] > 0) {
                counterproduct["subitemcost"] = counterproduct.costprice / counterproduct['initialsubitem'];
              }
              else if (counterproduct['initialsubitem'] == 0) {
                counterproduct["subitemcost"] = counterproduct.costprice / 1;
              }
            }
          });
          this.getCurrentStock(this.counterProducts);
          //this.getPurchases(this.counterProducts);

        });
        Promise.all([p]).then(result => {
          setTimeout(() => {
            console.log("New", this.counterProducts);
          }, 5000);
        });

        this.pouchService.paginationId = this.counterProducts[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByBranch2('counterproduct', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedCounterProducts = paginatedata;
          
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
    
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      //this.department = staff.department;

      this.pouchService.paginationId = this.paginatedCounterProducts[this.paginatedCounterProducts.length - 1].id;  //Reverse of what is meant to be;

      if (this.isFilterDepartment) {

        this.pouchService.paginateByDepartment2('counterproduct', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
          this.paginatedCounterProducts = paginatedata;

          this.isPreviousActive = true;
        });

      }
      else {
        this.pouchService.paginateByBranch2('counterproduct', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedCounterProducts = paginatedata;

          this.isPreviousActive = true;
        });
      }
    });
  }

  previous() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      //this.department = staff.department;

      this.pouchService.paginationId = this.paginatedCounterProducts[this.paginatedCounterProducts.length - 1].id;  //Reverse of what is meant to be;

      if (this.isFilterDepartment) {

        this.pouchService.paginateByDepartmentPrev2('counterproduct', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
          this.paginatedCounterProducts = paginatedata;

        });
        if (this.paginatedCounterProducts.length < this.pouchService.limitRange) {
          this.isPreviousActive = false;
        }
      }
      else {
        this.pouchService.paginateByBranchPrev2('counterproduct', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedCounterProducts = paginatedata;

          if (this.paginatedCounterProducts.length < this.pouchService.limitRange) {
            this.isPreviousActive = false;
          }
        });
      }
    });
  }

  goToStart() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      //this.department = staff.department;

      this.isPreviousActive = false;

      this.pouchService.paginationId = this.paginatedCounterProducts[this.paginatedCounterProducts.length - 1].id;  //Reverse of what is meant to be;

      if (this.isFilterDepartment) {

        this.pouchService.paginateByDepartmentStart('counterproduct', this.pouchService.paginationId, this.selectedDepartment).then(paginatedata => {
          this.paginatedCounterProducts = paginatedata;

        });
      }
      else {
        this.pouchService.paginateByBranchStart('counterproduct', this.pouchService.paginationId).then(paginatedata => {
          this.paginatedCounterProducts = paginatedata;

        });
      }
    });
  }

  getCurrentStock(counterproducts) {
    this.currentStock = 0;
    counterproducts = counterproducts.filter(data => data.totalsubitem > 0);
    var subCostArray = [0];  //to ensure reduce() works even when one item exists in array
    counterproducts.map(counterproduct => {
      subCostArray.push(counterproduct.subitemcost * counterproduct.totalsubitem);
      subCostArray.reduce((a, b) => {
        return this.currentStock = a + b;
      });
    });
  }

  getPurchases(dispatchedProducts) {
    this.purchases = 0;
    var subCostArray = [0];  //to ensure reduce() works even when one item exists in array
    dispatchedProducts.map(dispatchedproduct => {
      subCostArray.push(dispatchedproduct.costprice * dispatchedproduct.unitquantity);
      subCostArray.reduce((a, b) => {
        return this.purchases = a + b;
      });
    });
  }

  checkedExpired() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getCounterProducts().then(items => {
        items = items.filter(data => data.branch == staff.branch);
        this.counterProducts = items;
        this.counterProducts.forEach(item => {
          if (new Date(item.expirydate).getTime() <= new Date().getTime()) {
            item.color = 'red';
            item.errormessage = "Drug has expired";
            item.isexpired = true;
            this.pouchService.updateCounterProduct(item);
          }
        });
      });
    });
  }

  editCounterProduct(counterproduct) {
    let dialogRef = this.dialog.open(AddMainPharmacyCounterProductComponent, {
      height: '500px',
      width: '500px',
      data: {
        counterproduct: counterproduct,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.loadCounterProducts();
    })
  }

  addDamagedProduct(counterproduct) {
    let dialogRef = this.dialog.open(AddDamagedproductsComponent, {
      height: '500px',
      width: '500px',
      data: {
        content: counterproduct,
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.loadCounterProducts();
    })
  }

  deleteCounterProduct(counterproduct) {
    let dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
      data: {
        content: counterproduct
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.pouchService.deleteCounterProduct(counterproduct).then(res => {
          this.toastr.success('Product has been deleted successfully');
          this.loadCounterProducts();
        });
      }
    });
  }

  navdamagedproducts() {
    this.router.navigate(['/view-damagedproducts']);
  }

  navdispatchedproducts() {
    this.router.navigate(['/dispatched-products']);
  }

  navsales() {
    this.router.navigate(['/sales']);
  }

  navprofit() {
    this.router.navigate(['/view-grossprofit']);
  }

  refundCounterProduct(counterproduct) {
    counterproduct.refund = true;
    this.pouchService.updateCounterProduct(counterproduct).then(result => {
      this.sendRefundNotification(counterproduct);
      this.loadCounterProducts();
      this.toastr.success(`A refund request has been made for product ${counterproduct.productname}`);
    });
  }

  approveRefund(counterproduct) {
    this.pouchService.getProduct(counterproduct.productid).then(product => {
      product.unitstock = counterproduct.suppliedunit + product.unitstock;
      product.totalsubitem += counterproduct.totalsubitem;
      product.isdispatched = false;
      this.pouchService.updateProduct(product).then(response => {
        this.pouchService.getDispatchedProduct(counterproduct.dispatchid).then(dispatch => {
          this.pouchService.deleteDispatchedProduct(dispatch).then(res => {
            this.pouchService.deleteCounterProduct(counterproduct).then(result => {
              this.toastr.success(`${counterproduct.productname} has been refunded successfully`);
              this.loadCounterProducts();
            });
          });
        });
      });
    }).catch((err: Error) => {
      if (err) {
        this.pouchService.deleteCounterProduct(counterproduct).then(result => {
          this.toastr.success(`${counterproduct.productname} has been refunded successfully`);
          this.loadCounterProducts();
        });
      }
    });
  }

  disapproveRefund(counterproduct) {
    counterproduct.refund = false;
    this.pouchService.updateCounterProduct(counterproduct).then(result => {
      this.sendDisapprovedRefundNotification(counterproduct);
      this.loadCounterProducts();
    });
  }

  sendRefundNotification(counterproduct) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: `${counterproduct.productname} Refund Notification`,
      department: 'Main Pharmacy',
      branch: counterproduct.branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${counterproduct.unitstock} ${counterproduct.productname} has been requested to be refunded back to ${counterproduct.sourcedepartment} by ${counterproduct.department}. Price of the product is ${counterproduct.stockvalue}. Kindly approve or disapprove the request.`,
      sourceid: counterproduct.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == counterproduct.sourcedepartment || data.department == 'Account' || data.department == 'Audit');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {

        })
      })
    });

  }

  sendDisapprovedRefundNotification(counterproduct) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: `${counterproduct.productname} Refund Notification`,
      department: 'Main Pharmacy',
      branch: counterproduct.branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${counterproduct.unitstock} ${counterproduct.productname} has been disapproved to be refunded back to ${counterproduct.sourcedepartment} by Accounts.`,
      sourceid: counterproduct.id
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == counterproduct.sourcedepartment || data.department == 'Account' || data.department == 'Audit');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {

        })
      })
    });
  }


  selectedCounterProduct(counterproduct, event) {
    if (event.checked) {
      counterproduct['selected'] = true;
    }
    else {
      counterproduct['selected'] = false;
    }
    this.newCounterProducts = this.counterProducts.filter(data => data['selected'] == true);
    if (this.newCounterProducts.length > 0) {
      this.tableCheck = true;
    }
    else {
      this.tableCheck = false;
    }
  }

  deleteSelectedCounterProduct() {
    const dialogRef = this.dialog.open(ConfirmdialogmessageComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog has closed');
      if (result) {
        this.newCounterProducts.forEach(counterproduct => {
          this.pouchService.deleteCounterProduct(counterproduct).then(res => {
            this.loadCounterProducts();
            this.tableCheck = false;
          });
        });
        this.toastr.success('Products have been deleted successfully');
      }
    });
  }

  viewImage(counterproduct, i) {
    this.data.changeDepartment(counterproduct.department);
    this.data.changeBranch(counterproduct.branch);
    this.router.navigate(['image-viewer-counterproduct/', i]);
  }

  addGrossProfit() {
    let dialogRef = this.dialog.open(AddGrossProfitComponent, {
      height: '500px',
      width: '500px',
      data: {
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.loadCounterProducts();
    })
  }

  viewStock(){
    this.router.navigate(['/view-stock']);
  }

  filterString(event: any): void {
    const value: string = event.target.value ? event.target.value.toLowerCase() : '';
    this.paginatedCounterProducts = [];

    for (let counterproduct of this.counterProducts) {
      if ((counterproduct.productname).toLowerCase().indexOf(value) !== -1) {
        this.paginatedCounterProducts.push(counterproduct);

        this.paginatedCounterProducts = this.paginatedCounterProducts.slice(0, this.pouchService.limitRange);
      }
    }
  }
}