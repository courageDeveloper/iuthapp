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
import { AddMainPharmacyCounterProductBcComponent } from '../main-pharmacy-counterproduct_bc/add-main-pharmacy-counterproduct_bc/add-main-pharmacy-counterproduct_bc.component';
import { AddPatientDialogComponent } from '../add-patient-dialog/add-patient-dialog.component';
import { ReceiptAccountComponent } from '../receipt-account/receipt-account.component';
import { AddMainPharmacyServiceBcComponent } from '../main-pharmacy-service_bc/add-main-pharmacy-service_bc/add-main-pharmacy-service_bc.component';
import { ToastrService } from 'ngx-toastr';
import { DepartmentDispatch } from '../../model/departmentdispatch';
import { DataService } from '../services/data.service';
import { CreditMessageComponent } from '../credit-message/credit-message.component';

@Component({
  selector: 'app-main-pharmacy-pos_bc',
  templateUrl: './main-pharmacy-pos_bc.component.html',
  styleUrls: ['./main-pharmacy-pos_bc.component.css']
})
export class MainPharmacyPosBcComponent implements OnInit {
  counterproducts: Array<CounterProducts> = [];
  patients: Array<Patient> = [];
  sales: Sales;
  renderServices: Array<RenderService> = [];
  public tableWidget: any;
  tableCheck = false;
  newPatients: any;
  show = false;
  departmentdispatch: DepartmentDispatch;
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
  inputQuantity = 1;
  inputServiceQuantity = 1;
  isInputBox = false;
  amountPaid: number;
  amountPaidService: number;
  totalAmountPaid: number;
  isInputServiceBox = false;
  discountedAmount: number;
  isitemExceededError = false;
  disableBalance = false;
  department: any;
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
  paginatedCounterProducts;
  isPreviousActive = false;
  isNextActive = false;
  paginatedRenderServices;
  isPreviousActiveService = false;
  isNextActiveService = false;
  paginatedCategories;
  isPreviousActiveCategory = false;
  isNextActiveCategory = false;

  constructor(private dialog: MatDialog, public toastr: ToastrService, private data: DataService, private router: Router, public pouchService: PouchService, public _DomSanitizer: DomSanitizer) {
    this.loadPage();
  }

  ngOnInit() {
    this.amountPaid = 0;
    this.amountPaidService = 0;
    this.totalAmountPaid = 0;

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
      department: 'Main Pharmacy',
      amountloaned: 0,
      amountpayable: 0,
      loanstatus: false,
      departmentloaned: '',
      individualloanid: '',
      departmentloaning: 'Main Pharmacy',
      dateofloan: new Date().toString(),
      salename: '',
      amount: 0,
      description: '',
      color: '',
      date: new Date().toString(),
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
      discount: 0,
      totalamount: 0,
      posproduct: [],
      referencenumber: '',
      serviceorder: [],
      productorder: [],
      products: [],
      services: []
    }

    this.departmentdispatch = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      dispatchedproducts: []
    }
  }

  loadCounterProducts() {
    this.pouchService.getCounterProducts().then(counterProducts => {
      counterProducts = counterProducts.filter(data => data.branch == 'Benin Centre' && data.department == "Main Pharmacy" && data.isexpired == false);
      this.counterproducts = counterProducts;

      this.pouchService.paginationId = this.counterproducts[0].id; //Reverse of what is meant to be;

      this.pouchService.paginateByDepartment2('counterproduct', this.pouchService.paginationId, "Main Pharmacy", undefined, undefined, undefined, false, 0).then(paginatedata => {
        this.paginatedCounterProducts = paginatedata;

        this.isNextActive = true;
      });
    });
    this.isSellingPriceError = false;
    this.errorSellingPrice = "";
  }

  //Pagination for counter products
  next() {
    this.pouchService.paginationId = this.paginatedCounterProducts[this.paginatedCounterProducts.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByDepartment2('counterproduct', this.pouchService.paginationId, "Main Pharmacy", undefined, undefined, undefined, false, 0).then(paginatedata => {
      this.paginatedCounterProducts = paginatedata;

      this.isPreviousActive = true;
    });
  }

  previous() {
    this.pouchService.paginationId = this.paginatedCounterProducts[this.paginatedCounterProducts.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByDepartmentPrev2('counterproduct', this.pouchService.paginationId, "Main Pharmacy", undefined, undefined, undefined, false, 0).then(paginatedata => {
      this.paginatedCounterProducts = paginatedata;

      if (this.paginatedCounterProducts.length < this.pouchService.limitRange) {
        this.isPreviousActive = false;
      }
    });
  }

  goToStart() {
    this.isPreviousActive = false;

    this.pouchService.paginationId = this.paginatedCounterProducts[this.paginatedCounterProducts.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByDepartmentStart('counterproduct', this.pouchService.paginationId, "Main Pharmacy", undefined, undefined, undefined, false, 0).then(paginatedata => {
      this.paginatedCounterProducts = paginatedata;

    });
  }

  loadPatients() {
    this.patients = [];
    this.pouchService.getStaffs().then(staffs => {
      this.staffArray = staffs;
      this.pouchService.getPatients().then(patients => {
        this.patientsArray = patients;
        this.patients = this.staffArray.concat(this.patientsArray);
        this.patients = this.patients.filter(data => data.branch == 'Benin Centre');
        this.patients.forEach(patient => {
          var fullname = patient.firstname + ' ' + patient.lastname;
          patient['fullname'] = fullname;
        });
      })
    });
  }

  loadServices() {
    this.pouchService.getRenderServices().then(renderservices => {
      renderservices = renderservices.filter(data => data.branch == 'Benin Centre' && data.department == "Main Pharmacy");
      this.renderServices = renderservices;

      this.pouchService.paginationId = this.renderServices[this.renderServices.length - 1].id; //Reverse of what is meant to be;

      this.pouchService.paginateByDepartment2('renderservice', this.pouchService.paginationId, "Main Pharmacy").then(paginatedata => {
        this.paginatedRenderServices = paginatedata;

        this.isNextActiveService = true;
      });
    });
  }

  //Pagination for render services
  nextService() {
    this.pouchService.paginationId = this.paginatedRenderServices[this.paginatedRenderServices.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByDepartment2('renderservice', this.pouchService.paginationId, "Main Pharmacy").then(paginatedata => {
      this.paginatedRenderServices = paginatedata;

      this.isPreviousActiveService = true;
    });
  }

  previousService() {
    this.pouchService.paginationId = this.paginatedRenderServices[this.paginatedRenderServices.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByDepartmentPrev2('renderservice', this.pouchService.paginationId, "Main Pharmacy").then(paginatedata => {
      this.paginatedRenderServices = paginatedata;

      if (this.paginatedRenderServices.length < this.pouchService.limitRange) {
        this.isPreviousActiveService = false;
      }
    });
  }

  goToStartService() {
    this.isPreviousActiveService = false;

    this.pouchService.paginationId = this.paginatedRenderServices[this.paginatedRenderServices.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByDepartmentStart('renderservice', this.pouchService.paginationId, "Main Pharmacy").then(paginatedata => {
      this.paginatedRenderServices = paginatedata;

    });
  }

  loadCategories() {
    this.categories = [];
    this.pouchService.getProductcategorys().then(categories => {
      categories = categories.filter(data => data.branch == 'Benin Centre');
      this.pouchService.paginationId = categories[categories.length - 1].id; //Reverse of what is meant to be;

      this.pouchService.paginateByBranch2('productcategory', this.pouchService.paginationId).then(paginatedata => {
        this.paginatedCategories = paginatedata;

        this.isNextActiveCategory = true;

        this.paginatedCategories.forEach(category => {
          this.categories.push(category.subgroup);
        });
      });
    });
  }

  //Pagination for counter products
  nextCategory() {
    this.categories = [];
    this.pouchService.paginationId = this.paginatedCategories[this.paginatedCategories.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranch2('productcategory', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedCategories = paginatedata;

      this.isPreviousActiveCategory = true;

      //Paginated categories looped
      this.paginatedCategories.forEach(category => {
        this.categories.push(category.subgroup);
      })
    });
  }

  previousCategory() {
    this.pouchService.paginationId = this.paginatedCategories[this.paginatedCategories.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranchPrev2('productcategory', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedCategories = paginatedata;

      if (this.paginatedCategories.length < this.pouchService.limitRange) {
        this.isPreviousActiveCategory = false;
      }

      //Paginated categories looped
      this.paginatedCategories.forEach(category => {
        this.categories.push(category.subgroup);
      })
    });
  }

  goToStartCategory() {
    this.isPreviousActiveCategory = false;

    this.pouchService.paginationId = this.paginatedCategories[this.paginatedCategories.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranchStart('productcategory', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedCategories = paginatedata;

      //Paginated categories looped
      this.paginatedCategories.forEach(category => {
        this.categories.push(category.subgroup);
      })
    });
  }

  loadDepartments() {
    this.pouchService.getDepartments().then(departments => {
      this.departments = departments.filter(data => data.branch == 'Benin Centre');
    });
  }

  viewPharmacyCounterProducts() {
    this.router.navigate(['view-main-pharmacy-counterproduct_bc']);
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
    this.inputQuantity = 1;
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
    this.getAmountPaid(this.order, null);
  };

  inputAddToOrder(item) {
    item.qty = this.inputQuantity;
    this.getAmountPaid(this.order, null);
    this.selectOption(item, event);
    if (this.inputQuantity == null) {
      this.inputQuantity = 0;
      if (this.inputQuantity == 0) {
        this.removeOneInputEntity(item);
      }
    }
    else if (this.inputQuantity == 0) {
      this.removeOneInputEntity(item);
    }
  }

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
    this.getAmountPaid(this.order, null);
  };

  removeOneInputEntity(item) {
    for (var i = 0; i < this.order.length; i++) {
      if (item.id === this.order[i].id) {
        if (item.qty === 0) {
          this.order.splice(i, 1);
        }
      }
    }
    this.itemExceededError = '';
    this.isitemExceededError = false;
    this.getAmountPaid(this.order, null);
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
    this.getAmountPaid(this.order, null);
  };

  clearOrder() {
    this.order = [];
    this.serviceOrder = [];
    this.isSellingPriceError = false;
    this.errorSellingPrice = "";
    this.discountedAmount = 0;
    this.sales.discount = 0;
    this.getAmountPaid(this.order, null);
    this.getAmountPaid(null, this.serviceOrder);
  };

  addToServiceOrder(item, qty) {
    this.inputServiceQuantity = 1;
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
    //this.selectOption(item, event);
    this.getAmountPaid(null, this.serviceOrder);
  };

  inputAddToServiceOrder(item) {
    item.qty = this.inputServiceQuantity;
    this.getAmountPaid(null, this.serviceOrder);
    this.selectOption(item, event);
    if (this.inputServiceQuantity == null) {
      this.inputServiceQuantity = 0;
      if (this.inputServiceQuantity == 0) {
        this.removeOneServiceInputEntity(item);
      }
    }
    else if (this.inputServiceQuantity == 0) {
      this.removeOneServiceInputEntity(item);
    }
  }

  removeOneServiceInputEntity(item) {
    for (var i = 0; i < this.serviceOrder.length; i++) {
      if (item.id === this.serviceOrder[i].id) {
        if (item.qty === 0) {
          this.serviceOrder.splice(i, 1);
        }
      }
    }
    this.getAmountPaid(null, this.serviceOrder);
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
    this.getAmountPaid(null, this.serviceOrder);
  };

  removeServiceItem(item, index) {
    for (var i = 0; i < this.serviceOrder.length; i++) {
      if (item.id === this.serviceOrder[i].id) {
        this.serviceOrder.splice(i, 1);
      }
    }
    this.getAmountPaid(null, this.serviceOrder);
  };

  selectOption(counterproduct, event) {
    if (event.value === 'unitsellingprice') {
      counterproduct.isUnitSelling = true;
      this.getAmountPaid(this.order, null);
    }
    else if (event.value === 'subitemsellingprice') {
      counterproduct.isUnitSelling = false;
      this.getAmountPaid(this.order, null);
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
    let dialogRef = this.dialog.open(AddMainPharmacyCounterProductBcComponent, {
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
    this.department = department;
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
      this.loadPatients();
    });
  }

  newService() {
    let dialogRef = this.dialog.open(AddMainPharmacyServiceBcComponent, {
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
      this.loadServices();
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

  getAmountPaid(order, serviceorder) {
    if (order != null) {
      this.amountPaid = 0;
      for (var i = 0; i < order.length; i++) {
        if (order[i].isUnitSelling) {
          this.amountPaid += (order[i].unitsellingprice * order[i].qty)
        }
        else if (!order[i].isUnitSelling) {
          this.amountPaid += (order[i].subitemsellingprice * order[i].qty)
        }
      }
      if (order.length == 0) {
        this.amountPaid = 0;
      }
    }
    if (serviceorder != null) {
      this.amountPaidService = 0;
      for (var j = 0; j < serviceorder.length; j++) {
        this.amountPaidService += (serviceorder[j].cost * serviceorder[j].qty)
      }
      if (serviceorder.length == 0) {
        this.amountPaidService = 0;
      }
    }
    this.totalAmountPaid = this.amountPaid + this.amountPaidService;
    return this.totalAmountPaid;
  }

  onCredit(event) {
    if (event.checked) {
      this.sales.isoncredit = true;
      this.sales.amount = 0;
      this.sales.amountloaned = this.getTotal();
      this.sales.loanstatus = true;
      this.sales.balance = 0;
      this.sales.amountloaned = this.sales.amountloaned - (this.sales.amountloaned * this.sales.discount / 100);
      this.disableBalance = true;
      if (this.tabGroups.individual) {
        this.sales.staffloan = true;
      }
      /*  else if (this.tabGroups.department) {
         this.sales.departmentloan = true;
       } */
    }
    else {
      this.sales.isoncredit = false;
      this.disableBalance = false;
    }
  }

  switchInput(event) {
    if (event.checked) {
      this.isInputBox = true;
    }
    else {
      this.isInputBox = false;
    }
  }

  switchInputService(event) {
    if (event.checked) {
      this.isInputServiceBox = true;
    }
    else {
      this.isInputServiceBox = false;
    }
  }

  discounted() {
    this.discountedAmount = this.getTotal() - (this.getTotal() * this.sales.discount / 100);
  }


  checkout() {
    var receiptSource = 'default message';
    this.data.changeReceiptSource(receiptSource);
    this.sales.totalamount = this.getTotal() - (this.getTotal() * this.sales.discount / 100);

    if (this.sales.isoncredit != true) {
      this.sales.amount = this.getTotal();
      this.sales.amount = this.sales.amount - (this.sales.amount * this.sales.discount / 100);
      if (this.totalAmountPaid == this.getTotal()) {
        this.totalAmountPaid = this.totalAmountPaid - (this.totalAmountPaid * this.sales.discount / 100);
      }
      this.sales.balance = this.sales.amount - this.totalAmountPaid;
    }

    this.sales.posproduct = this.order.concat(this.serviceOrder);
    this.sales.productorder = this.order;
    this.sales.serviceorder = this.serviceOrder;
    this.deductQuantities(this.sales.productorder);
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      this.sales.branch = item.branch;
      this.sales['dispenserName'] = `${item.firstname } ${item.lastname}`;

      if (!this.sales.isoncredit) {
        var randomString = this.generateRandomStrings(4);
        this.sales.referencenumber = 'IUTH' + randomString;
      }
      if (this.tabGroups.individual) {
        this.sales.individualloanid = this.sales.patientid;
        this.sales.salename = `Items bought by ${this.patientName} from ${this.sales.department}`;
      }
      /* else if (this.tabGroups.department) {
        this.sales.individualloanid = this.sales.departmentid;
        this.sales.salename = `Items bought by ${this.departmentName} from ${this.sales.department}`;
      } */
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
        this.discountedAmount = 0;
        this.totalAmountPaid = 0;
        this.sales.discount = 0;
        if (result != undefined) {
          this.toastr.success('Product has been sold');
          if (!result.isoncredit) {
            this.printReceipt(result);
          }
          else {
            this.creditMessage(result);
          }
        }
        else {
          this.toastr.warning('Failed to sell product, please try again');
        }
      });
    });
  }

  dispatch() {
    this.sales.totalamount = this.getTotal() - (this.getTotal() * this.sales.discount / 100);
    this.sales.productorder = this.order;
    this.sales.posproduct = this.order.concat(this.serviceOrder);
    this.departmentDebt(this.sales.totalamount, this.sales.posproduct);
    this.deductQuantities(this.sales.productorder);
  }

  departmentDebt(debt, solditems) {
    this.department.debt += debt;
    solditems.forEach(solditem => {
      this.departmentdispatch.dispatchedproducts.push(solditem);
    });
    this.pouchService.saveDepartmentDispatch(this.departmentdispatch).then(result => {
      /*  result.dispatchedproducts.map(product => {
         product['departmentdispatchid'] = result.id;
         product['departmentdispatchrev'] = result.rev;
         
       }); */
      this.department.producthistory.push(result.id);
      this.pouchService.updateDepartment(this.department).then(res => {
        this.toastr.success('Product has been dispatched successfully');
        this.loadPage();
        this.departmentName = "";
        this.patientName = "";
        this.order = [];
        this.serviceOrder = [];
        this.discountedAmount = 0;
        this.totalAmountPaid = 0;
        this.sales.discount = 0;
      });
    });
  }

  deductQuantities(productorders) {
    productorders.forEach(product => {
      this.pouchService.getProductcategory(product.productcatid).then(productcategory => {
        if (productcategory != undefined) {
          if (product.isUnitSelling == true) {
            product.suppliedunit -= product.qty;
            product.totalsubitem -= productcategory.subitemno;
          }
          else if (product.isUnitSelling == false) {
            product.totalsubitem -= product.qty;
            product.suppliedunit = Math.floor(product.totalsubitem / productcategory.subitemno);
          }
          this.pouchService.updateCounterProduct(product).then(result => {

          });
        }
        else {
          if (product.isUnitSelling == true) {
            //var remainingTotalSubItem = product.totalsubitem / product.suppliedunit;
            product.suppliedunit -= product.qty;
            product.totalsubitem -= product.initialsubitem;
          }
          else if (product.isUnitSelling == false) {
            //var subItemNumber = product.totalsubitem / product.suppliedunit;
            product.totalsubitem -= product.qty;
            product.suppliedunit = Math.floor(product.totalsubitem / product.initialsubitem);
          }
          this.pouchService.updateCounterProduct(product).then(result => {

          });
        }
      })/* .catch((err: Error) => {
        if (err) {}
      }); */
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
    let dialogRef = this.dialog.open(ReceiptAccountComponent, {
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

  creditMessage(sale) {
    let dialogRef = this.dialog.open(CreditMessageComponent, {
      height: '500px',
      width: '500px',
      data: {
        sale: sale,
        action: 'display',
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
