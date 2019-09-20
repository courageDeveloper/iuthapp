import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { CounterProducts } from '../../model/counterproduct';
import { Patient } from '../../model/patient';
import { RenderService } from '../../model/renderservice';
import { PouchService } from '../../providers/pouch-service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Sales } from '../../model/sales';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddRadiologyCounterProductComponent } from '../radiology-counterproduct/add-radiology-counterproduct/add-radiology-counterproduct.component';
import { AddPatientDialogComponent } from '../add-patient-dialog/add-patient-dialog.component';
import { ReceiptComponent } from '../receipt/receipt.component';
import { AddRadiologyServiceComponent } from '../radiology-service/add-radiology-service/add-radiology-service.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-radiology-pos',
  templateUrl: './radiology-pos.component.html',
  styleUrls: ['./radiology-pos.component.css']
})
export class RadiologyPosComponent implements OnInit {
  counterproducts: Array<CounterProducts> = [];
  patients: Array<Patient> = [];
  sales: Sales;
  renderServices: Array<RenderService> = [];
  public tableWidget: any;
  tableCheck = false;
  newPatients: any;
  show = false;
  openside = false;
  calculator = false;
  productarray = [];
  servicearray = [];
  customers = [];
  isChecked = false;
  public customer: any;
  files: FileList;
  quantity: number;
  errorSellingPrice;
  counterProductsErrorArray: any[];
  staffArray: any[];
  patientsArray: any[];
  isSellingPriceError = false;
  patientId: any;
  departmentId: any;
  categories: any;
  departments: any;
  isId = false;
  departmentName: any;
  patientName: any;
  itemExceededError: string;
  isitemExceededError = false;
  disableBalance = false;
  tabs = {
    product: true,
    service: false,
    new: false
  }
  tabGroups = {
    individual: false,
    department: false
  }
  order = [];
  serviceOrder = [];

  constructor(private dialog: MatDialog, public toastr: ToastrService, private data: DataService, private router: Router, public pouchService: PouchService, public _DomSanitizer: DomSanitizer) {
    this.loadPage();
  }

  ngOnInit() {
    this.loadCounterProducts();
    this.loadPatients();
    this.loadServices();
    this.loadCategories();
    this.activatetabGroup('individual');
    this.loadDepartments();

  }

  loadPage() {
    this.sales = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      department: 'Radiology',
      amountloaned: 0,
      amountpayable: 0,
      loanstatus: false,
      departmentloaned: '',
      individualloanid: '',
      departmentloaning: 'Radiology',
      dateofloan: new Date(),
      salename: '',
      amount: 0,
      description: '',
      color: '',
      date: new Date(),
      iscomplete: false,
      isowing: false,
      isoncredit: false,
      staffloan: false,
      departmentloan: false,
      balance: 0,
      departmentid: '',
      patientid: '',
      isreconciled: true,
      isevacuated: false,
      evacuatedmessage: '',
      branch: '',
      posproduct: [],
      referencenumber: '',
      serviceorder: [],
      productorder: [],
      products: [],
      services: []
    }
  }

  loadCounterProducts() {
    this.pouchService.getCounterProducts().then(counterProducts => {
      counterProducts = counterProducts.filter(data => data.branch == 'IUTH(Okada)' && data.department == "Radiology" && data.isexpired == false);
      this.counterproducts = counterProducts;
    });
    this.isSellingPriceError = false;
    this.errorSellingPrice = "";
  }

  loadPatients() {
    this.patients = [];
    this.pouchService.getStaffs().then(staffs => {
      this.staffArray = staffs;
      this.pouchService.getPatients().then(patients => {
        this.patientsArray = patients;
        this.patients = this.staffArray.concat(this.patientsArray);
        this.patients = this.patients.filter(data => data.branch == 'IUTH(Okada)');
        this.patients.forEach(patient => {
          var fullname = patient.firstname + ' ' + patient.lastname;
          patient['fullname'] = fullname;
        });
      })
    });
  }

  loadServices() {
    this.pouchService.getRenderServices().then(renderservices => {
      renderservices = renderservices.filter(data => data.branch == 'IUTH(Okada)' && data.department == "Radiology");
      this.renderServices = renderservices;
    });
  }

  loadCategories() {
    this.categories = [];
    this.pouchService.getProductcategorys().then(categories => {
      categories = categories.filter(data => data.branch == 'IUTH(Okada)');
      categories.forEach(category => {
        this.categories.push(category.subgroup);
      })
    });
  }

  loadDepartments() {
    this.pouchService.getDepartments().then(departments => {
      this.departments = departments.filter(data => data.branch == 'IUTH(Okada)');
   });
  }

  viewRadiologyCounterProducts() {
    this.router.navigate(['view-radiology-counterproduct']);
  }

  getDate() {
    var today = new Date();
    var mm = today.getMonth() + 1;
    var dd = today.getDate();
    var yyyy = today.getFullYear();

    var date = dd + "/" + mm + "/" + yyyy

    return date
  };


  addToOrder(item, qty) {
    this.counterProductsErrorArray = [];
    this.counterProductsErrorArray.push(item);
    this.counterProductsErrorArray.forEach(counterproduct => {
      if (counterproduct.unitsellingprice == 0 && counterproduct.subitemsellingprice == 0) {
        this.errorSellingPrice = "Add selling price to item";
        this.isSellingPriceError = true;
      }
      else {
        this.isSellingPriceError = false;
        this.errorSellingPrice = "";
      }
    });
    var flag = 0;
    if (this.order.length > 0) {
      for (var i = 0; i < this.order.length; i++) {
        if (item.id === this.order[i].id) {
          item.qty += qty;
          flag = 1;
          break;
        }
      }
      if (flag === 0) {
        item.qty = 1;
      }
      if (item.qty < 2) {
        this.order.push(item);
      }
    } else {
      item.qty = qty;
      this.order.push(item);
    }

    this.isChecked = true;
    this.selectOption(item, event);
  };

  removeOneEntity(item) {
    for (var i = 0; i < this.order.length; i++) {
      if (item.id === this.order[i].id) {
        item.qty -= 1;
        if (item.qty === 0) {
          this.order.splice(i, 1);
        }
      }
    }
    this.itemExceededError = '';
    this.isitemExceededError = false;
  };

  removeItem(item, index) {
    for (var i = 0; i < this.order.length; i++) {
      if (item.id === this.order[i].id) {
        this.order[i].isUnitSelling = true;
        this.order.splice(i, 1);
        this.order.forEach(counterproduct => {
          if (counterproduct.unitsellingprice == 0 || counterproduct.subitemsellingprice == 0) {
            this.errorSellingPrice = "Add selling price to item";
            this.isSellingPriceError = true;
          }
          else {
            this.isSellingPriceError = false;
            this.errorSellingPrice = "";
          }
        });
      }
    }
    this.itemExceededError = '';
    this.isitemExceededError = false;
  };

  clearOrder() {
    this.order = [];
    this.serviceOrder = [];
    this.isSellingPriceError = false;
    this.errorSellingPrice = "";
  };

  addToServiceOrder(item, qty) {
    var flag = 0;
    if (this.serviceOrder.length > 0) {
      for (var i = 0; i < this.serviceOrder.length; i++) {
        if (item.id === this.serviceOrder[i].id) {
          item.qty += qty;
          flag = 1;
          break;
        }
      }
      if (flag === 0) {
        item.qty = 1;
      }
      if (item.qty < 2) {
        this.serviceOrder.push(item);
      }
    } else {
      item.qty = qty;
      this.serviceOrder.push(item);
    }

    this.isChecked = true;
    this.selectOption(item, event);
  };

  removeOneServiceEntity(item) {
    for (var i = 0; i < this.serviceOrder.length; i++) {
      if (item.id === this.serviceOrder[i].id) {
        item.qty -= 1;
        if (item.qty === 0) {
          this.serviceOrder.splice(i, 1);
        }
      }
    }
  };

  removeServiceItem(item, index) {
    for (var i = 0; i < this.serviceOrder.length; i++) {
      if (item.id === this.serviceOrder[i].id) {
        this.serviceOrder.splice(i, 1);
      }
    }
  };

  selectOption(counterproduct, event) {
    if (event.value === 'unitsellingprice') {
      counterproduct.isUnitSelling = true;
    }
    else if (event.value === 'subitemsellingprice') {
      counterproduct.isUnitSelling = false;
    }

    this.counterProductsErrorArray.forEach(counterproducts => {
      if (counterproduct.isUnitSelling == true) {
        if (counterproducts.suppliedunit - counterproducts.qty < 0) {
          this.itemExceededError = 'You have exceeded the amount of item available for product';
          this.isitemExceededError = true;
        }
         else {
          this.itemExceededError = '';
          this.isitemExceededError = false;
        }
      }
      else if (counterproduct.isUnitSelling == false) {
        if (counterproducts.totalsubitem - counterproducts.qty < 0) {
          this.itemExceededError = 'You have exceeded the amount of item available for product';
          this.isitemExceededError = true;
        }
         else {
          this.itemExceededError = '';
          this.isitemExceededError = false;
        }
      }
    });
  }

  editProduct(counterproduct) {
    let dialogRef = this.dialog.open(AddRadiologyCounterProductComponent, {
      height: '500px',
      width: '500px',
      data: {
        counterproduct: counterproduct,
        action: 'edit',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.loadCounterProducts();
    });
  }

  serviceChanged(newVal) {
    this.addToServiceOrder(newVal, 1);
    this.isChecked = true;
    this.selectOption(newVal, event);
  }

  selectProduct(newVal) {
    this.addToOrder(newVal, 1);
    this.isChecked = true;
    this.selectOption(newVal, event);

    this.counterProductsErrorArray
    this.counterProductsErrorArray.push(newVal);
    this.counterProductsErrorArray.forEach(counterproduct => {
      if (counterproduct.unitsellingprice == 0 && counterproduct.subitemsellingprice == 0) {
        this.errorSellingPrice = "Add selling price to item";
        this.isSellingPriceError = true;
      }
      else {
        this.isSellingPriceError = false;
        this.errorSellingPrice = "";
      }
    });
  }

  selectDepartment(department) {
    this.sales.departmentid = department.id;
    //this.departmentId = department.id
    this.isId = true;
  }

  selectPatient(patient) {
    this.sales.patientid = patient.id;
    //this.patientId = patient.id
    this.isId = true;
  }

  newPatient() {
    let dialogRef = this.dialog.open(AddPatientDialogComponent, {
      height: '500px',
      width: '500px',
      data: {
        action: 'add',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.loadCounterProducts();
    });
  }

  newService() {
    let dialogRef = this.dialog.open(AddRadiologyServiceComponent, {
      height: '500px',
      width: '500px',
      data: {
        action: 'add',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.loadCounterProducts();
    });
  }

  selectCategory(category) {
    this.pouchService.getCounterProducts().then(counterproducts => {
      this.counterproducts = counterproducts.filter(counterproduct => counterproduct.productcategory == category);
    })
  }

  toggleSide() {
    this.openside = !this.openside;
    this.calculator = false;
    this.activatetab('product');
  }

  toggleCalculator() {
    this.openside = false;
    this.calculator = !this.calculator;
  }

  activatetab(tab) {
    this.tabs = {
      service: tab == 'service' ? true : false,
      product: tab == 'product' ? true : false,
      new: tab == 'new' ? true : false,
    }
  }

  activatetabGroup(tab) {
    this.tabGroups = {
      individual: tab == 'individual' ? true : false,
      department: tab == 'department' ? true : false
    }
    if (tab == 'individual') {
      this.departmentName = "";
    }
    else if (tab == 'department') {
      this.patientName = "";
    }
  }

  getTotal() {
    var tot = 0;
    for (var i = 0; i < this.order.length; i++) {
      if (this.order[i].isUnitSelling) {
        tot += (this.order[i].unitsellingprice * this.order[i].qty)
      }
      else if (!this.order[i].isUnitSelling) {
        tot += (this.order[i].subitemsellingprice * this.order[i].qty)
      }
    }
    for (var j = 0; j < this.serviceOrder.length; j++) {
      tot += (this.serviceOrder[j].cost * this.serviceOrder[j].qty)
    }
    return tot;
  };

  onCredit(event) {
    if (event.checked) {
      this.sales.isoncredit = true;
      this.sales.amount = 0;
      this.sales.amountloaned = this.getTotal();
      this.sales.loanstatus = true;
      this.sales.balance = 0;
      this.disableBalance = true;
      if (this.tabGroups.individual) {
        this.sales.staffloan = true;
      }
      else if (this.tabGroups.department) {
        this.sales.departmentloan = true;
      }
    }
    else {
      this.sales.isoncredit = false;
      this.disableBalance = false;
    }
  }


  checkout() {
    var receiptSource = 'default message';
    this.data.changeReceiptSource(receiptSource);
    
    if (this.sales.isoncredit != true) {
      this.sales.amount = this.getTotal();
    }

    this.sales.posproduct = this.order.concat(this.serviceOrder);
    this.sales.productorder = this.order;
    this.sales.serviceorder = this.serviceOrder;
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      this.sales.branch = item.branch;

      var randomString = this.generateRandomStrings(3);
      this.sales.referencenumber = 'IUTH' + new Date().getTime() + randomString;
      if (this.tabGroups.individual) {
        this.sales.individualloanid = this.sales.patientid;
        this.sales.salename = `Items bought by ${this.patientName} from ${this.sales.department}`;
      }
      else if (this.tabGroups.department) {
        this.sales.individualloanid = this.sales.departmentid;
        this.sales.salename = `Items bought by ${this.departmentName} from ${this.sales.department}`;
      }
      if (this.sales.balance > 0) {
        this.sales.isowing = true;
        this.sales.amount -= this.sales.balance;
      }

      this.pouchService.saveSale(this.sales).then(result => {
        this.loadPage();
        this.departmentName = "";
        this.patientName = "";
        this.order = [];
        this.serviceOrder = [];
        if (result != undefined) {
          this.toastr.success('Product has been sold');
          this.printReceipt(result);
        }
        else {
          this.toastr.warning('Failed to sell product, please try again');
        }
      });
    });
  }

  generateRandomStrings(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  printReceipt(sale) {
    let dialogRef = this.dialog.open(ReceiptComponent, {
      height: '500px',
      width: '500px',
      data: {
        sale: sale,
        action: 'print',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) {
        return;
      }
      this.loadCounterProducts();
    });
  }

}
