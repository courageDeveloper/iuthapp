import { Component, OnInit } from '@angular/core';
import 'datatables.net';
import 'datatables.net-bs4';
import * as $ from 'jquery';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { CounterProducts } from '../../model/counterproduct';
import { Patient } from '../../model/patient';
import { IndividualSale } from '../../model/individualsales';
import { RenderService } from '../../model/renderservice';
import { PouchService } from '../../providers/pouch-service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Sales } from '../../model/sales';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddRevenueCounterProductComponent } from '../revenue-counterproduct/add-revenue-counterproduct/add-revenue-counterproduct.component';
import { AddPatientDialogComponent } from '../add-patient-dialog/add-patient-dialog.component';
import { ReceiptComponent } from '../receipt/receipt.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../services/data.service';
import { DepartmentDispatch } from '../../model/departmentdispatch';

@Component({
  selector: 'app-revenue-pos',
  templateUrl: './revenue-pos.component.html',
  styleUrls: ['./revenue-pos.component.css']
})
export class RevenuePosComponent implements OnInit {
  counterproducts: Array<CounterProducts> = [];
  patients: Array<Patient> = [];
  sales: Sales;
  individualSales: IndividualSale;
  renderServices: Array<RenderService> = [];
  allIndividualSales: Array<IndividualSale> = [];
  public tableWidget: any;
  departmentdispatch: DepartmentDispatch;
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
  localStorageItem: any;
  disableBalance = false;
  patient: any;
  isInputBox = false;
  department: any;
  isInputServiceBox = false;
  discountedAmount: number;
  referenceNumber: string;
  amountPaid: number;
  amountPaidService: number;
  totalAmountPaid: number;
  inputServiceQuantity = 1;
  inputQuantity = 1;
  referenceNumberError: string;
  testCounterProducts: any;
  isFromDepartment = false;
  tabs = {
    product: true,
    service: false,
    new: false,
    fromdepartment: false
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
    this.loadIndividualSale();
  }

  ngOnInit() {
    console.log(new Date());
    this.localStorageItem = JSON.parse(localStorage.getItem('user'));

    this.amountPaid = 0;
    this.amountPaidService = 0;
    this.totalAmountPaid = 0;

    this.loadCounterProducts();
    this.loadPatients();
    this.loadServices();
    this.loadCategories();
    this.activatetabGroup('individual');
    this.loadDepartments();
    this.loadAllIndividualSales();
  }

  loadPage() {
    this.sales = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      department: 'Revenue',
      amountloaned: 0,
      amountpayable: 0,
      loanstatus: false,
      departmentloaned: '',
      individualloanid: '',
      departmentloaning: 'Revenue',
      dateofloan: new Date().toString(),
      salename: '',
      color: '',
      amount: 0,
      description: '',
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

  loadIndividualSale() {
    this.individualSales = {
      id: '',
      rev: '',
      totaldailysales: 0,
      staffname: '',
      staffid: '',
      ischeckedin: false,
      ischeckedout: true,
      checkindate: new Date(),
      checkoutdate: 'Has not checked out yet.',
      initiallogincount: 0,
      branch: '',
      department: '',
      isstroked: false,
      strokedvalue: '',
      saleids: []
    }
  }

  loadAllIndividualSales() {
    this.pouchService.getStaff(this.localStorageItem).then(staff => {
      this.pouchService.getIndividualSales().then(allIndividualSales => {
        this.allIndividualSales = allIndividualSales.filter(data => data.branch == 'IUTH(Okada)');

        var currentAllIndividualSales = allIndividualSales.filter(data => data.branch == 'IUTH(Okada)');

        var currentlyLoggedIn = currentAllIndividualSales.filter(data => {
          data.checkindate = data.checkindate.split('T');
          data.checkindate = data.checkindate[0];
          var currentDate = new Date().toISOString();
          currentDate = currentDate.split('T')[0];
          return data.checkindate == currentDate && data.staffid == staff.id;

        });
        if (currentlyLoggedIn[0] != undefined) {
          this.individualSales = currentlyLoggedIn[0];
        }
        else {
          this.loadIndividualSale()
        }
      });
    });
  }

  loadCounterProducts() {
    this.data.currentDepartment.subscribe(id => {
      this.departmentId = id;
    });

    this.data.currentProductHistory.subscribe(counterproducts => {
      
      if (counterproducts != 'default message') {
        this.tabs.product = false;
        this.tabs.fromdepartment = true;
        this.counterproducts = counterproducts;
        this.isFromDepartment = true;
        this.counterproducts.map(counterproduct => {
          if (counterproduct.productname == undefined && counterproduct.productimage == undefined) {
            counterproduct['productname'] = counterproduct['servicename'];
            counterproduct['productimage'] = "";
          }
        });

      }
      else {
        this.pouchService.getCounterProducts().then(counterProducts => {
          counterProducts = counterProducts.filter(data => data.branch == 'IUTH(Okada)' && data.isexpired == false);
          this.counterproducts = counterProducts;
          
          this.pouchService.paginationId = this.counterproducts[0].id; //Reverse of what is meant to be;

          this.pouchService.paginateByBranch2('counterproduct', this.pouchService.paginationId, undefined, false, 0).then(paginatedata => {
            this.paginatedCounterProducts = paginatedata;

            this.isNextActive = true;
          });
        });
      }
    });
    this.isSellingPriceError = false;
    this.errorSellingPrice = "";
  }

  //Pagination for counter products
  next() {
    this.pouchService.paginationId = this.paginatedCounterProducts[this.paginatedCounterProducts.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranch2('counterproduct', this.pouchService.paginationId, undefined, false, 0).then(paginatedata => {
      this.paginatedCounterProducts = paginatedata;

      this.isPreviousActive = true;
    });
  }

  previous() {
    this.pouchService.paginationId = this.paginatedCounterProducts[this.paginatedCounterProducts.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranchPrev2('counterproduct', this.pouchService.paginationId, undefined, false, 0).then(paginatedata => {
      this.paginatedCounterProducts = paginatedata;

      if (this.paginatedCounterProducts.length < this.pouchService.limitRange) {
        this.isPreviousActive = false;
      }
    });
  }

  goToStart() {
    this.isPreviousActive = false;

    this.pouchService.paginationId = this.paginatedCounterProducts[this.paginatedCounterProducts.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranchStart('counterproduct', this.pouchService.paginationId, undefined, false, 0).then(paginatedata => {
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
      renderservices = renderservices.filter(data => data.branch == 'IUTH(Okada)');
      this.renderServices = renderservices;

      this.pouchService.paginationId = this.renderServices[this.renderServices.length - 1].id; //Reverse of what is meant to be;

      this.pouchService.paginateByBranch2('renderservice', this.pouchService.paginationId).then(paginatedata => {
        this.paginatedRenderServices = paginatedata;

        this.isNextActiveService = true;
      });
    });
  }

  //Pagination for render services
  nextService() {
    this.pouchService.paginationId = this.paginatedRenderServices[this.paginatedRenderServices.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranch2('renderservice', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedRenderServices = paginatedata;

      this.isPreviousActiveService = true;
    });
  }

  previousService() {
    this.pouchService.paginationId = this.paginatedRenderServices[this.paginatedRenderServices.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranchPrev2('renderservice', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedRenderServices = paginatedata;

      if (this.paginatedRenderServices.length < this.pouchService.limitRange) {
        this.isPreviousActiveService = false;
      }
    });
  }

  goToStartService() {
    this.isPreviousActiveService = false;

    this.pouchService.paginationId = this.paginatedRenderServices[this.paginatedRenderServices.length - 1].id;  //Reverse of what is meant to be;

    this.pouchService.paginateByBranchStart('renderservice', this.pouchService.paginationId).then(paginatedata => {
      this.paginatedRenderServices = paginatedata;

    });
  }

  loadCategories() {
    this.categories = [];
    this.pouchService.getProductcategorys().then(categories => {
      categories = categories.filter(data => data.branch == 'IUTH(Okada)');
      this.pouchService.paginationId = categories[categories.length - 1].id; //Reverse of what is meant to be;

      this.pouchService.paginateByBranch2('productcategory', this.pouchService.paginationId).then(paginatedata => {
        this.paginatedCategories = paginatedata;

        this.isNextActiveCategory = true;

        //Paginated categories looped
        this.paginatedCategories.forEach(category => {
          this.categories.push(category.subgroup);
        })
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
      this.departments = departments.filter(data => data.branch == 'IUTH(Okada)');
    });
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

  navIndividualSale() {
    this.router.navigate(['view-individualsale']);
  }

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
    let dialogRef = this.dialog.open(AddRevenueCounterProductComponent, {
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
    //this.departmentId = department.id;
    this.sales.departmentid = department.id;
    this.isId = true;
  }

  selectPatient(patient) {
    this.patient = patient;
    //this.patientId = patient.id;
    this.sales.patientid = patient.id;
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
      fromdepartment: tab == 'fromdepartment' ? true : false
    }
    if (tab == 'product') {
      this.pouchService.getCounterProducts().then(counterProducts => {
        counterProducts = counterProducts.filter(data => data.branch == 'IUTH(Okada)' && data.isexpired == false);
        this.counterproducts = counterProducts;
        this.isFromDepartment = false;

        this.pouchService.paginationId = this.counterproducts[0].id; //Reverse of what is meant to be;

        this.pouchService.paginateByBranch2('counterproduct', this.pouchService.paginationId, undefined, false).then(paginatedata => {
          this.paginatedCounterProducts = paginatedata;

          this.isNextActive = true;
        });
      });
    }
    else if (tab == 'fromdepartment') {
      this.data.currentProductHistory.subscribe(counterproducts => {
        console.log(counterproducts);
        if (counterproducts != 'default message') {
          this.tabs.product = false;
          this.tabs.fromdepartment = true;
          this.isFromDepartment = true;
          this.counterproducts = counterproducts;
          console.log(this.counterproducts);
          this.counterproducts.map(counterproduct => {
            if (counterproduct.productname == undefined && counterproduct.productimage == undefined) {
              counterproduct['productname'] = counterproduct['servicename'];
              counterproduct['productimage'] = "";
            }
          });
        }
        else {
           this.counterproducts = []
        }
      });
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
      /* else if (this.tabGroups.department) {
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
    var receiptSource = 'Revenue';
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
    this.sales.iscomplete = true;
    this.sales.posproduct = this.order.concat(this.serviceOrder);
    this.sales.productorder = this.order;
    this.sales.serviceorder = this.serviceOrder;
    if (!this.isFromDepartment) {
      this.deductQuantities(this.sales.productorder);
    }
    else if (this.isFromDepartment) {
      this.fromDeductQuantities(this.sales.productorder, this.sales.amount);
    }
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      this.sales.branch = item.branch;
      this.sales['dispenserName'] = `${item.firstname } ${item.lastname}`;

      var randomString = this.generateRandomStrings(4);
      this.sales.referencenumber = 'IUTH' + randomString;
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
        this.updateIndividualSales(result);
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
          if (result.isoncredit == true) {
            if (this.tabGroups.individual) {
              this.patientDebt(result.amountloaned);
            }
            /*  else if (this.tabGroups.department) {
               this.departmentDebt(result.amountloaned);
             } */
          }
          if (result.isowing == true) {
            if (this.tabGroups.individual) {
              this.patientDebt(result.balance);
            }
            /*  else if (this.tabGroups.department) {
               this.departmentDebt(result.balance);
             } */
          }
          this.sendNotification(result.branch, result.salename);
          this.printReceipt(result);
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

  fromDeductQuantities(productorders, saleamount) {
    productorders.forEach(product => {
      //product.sellingPrice
      this.pouchService.getDepartmentDispatch(product.departmentdispatchid).then(counterproduct => {
        counterproduct.dispatchedproducts.forEach(departmentproduct => {
          if (departmentproduct.id == product.id) {
            departmentproduct.qty -= product.qty;
          }
        });
        //counterproduct['sellingprice'] -= this.sales.amount;
        this.pouchService.updateDepartmentDispatch(counterproduct).then(result => {
          this.pouchService.getDepartment(this.departmentId).then(department => {
            department.debt -= saleamount;
            this.pouchService.updateDepartment(department).then(result => {

            });
          });
        });
      });
    });

    /*  productorders.forEach(product => {
       this.pouchService.getDepartment(product.productcatid).then(productcategory => {
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
       });
     }); */
  }

  sendNotification(branch, salename) {
    var notification = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      name: salename,
      department: this.sales.department,
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${salename} on ${this.sales.date} from ${this.sales.department}`,
      sourceid: this.sales.id
    }
    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch);
      staffs = staffs.filter(data => data.department == 'Main Pharmacy' || data.department == 'GOPD Pharmacy' || data.department == 'Laboratory' || data.department == 'Radiology' || data.department == 'Revenue' || data.department == 'Account' || data.department == 'Audit');
      staffs.forEach(staff => {
        staff.notification.push(notification);
        this.pouchService.updateStaff(staff).then(result => {
        })
      })
    });
  }

  patientDebt(debt) {
    this.patient.debt += debt;
    if (this.patient.patientno != undefined) {
      this.pouchService.updatePatient(this.patient);
    }
    else if (this.patient.staffcode != undefined) {
      this.pouchService.updateStaff(this.patient);
    }
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

  patientDebtReference(debt, id) {
    this.pouchService.getPatient(id).then(patient => {
      patient.debt += debt;
      this.pouchService.updatePatient(patient);
    });

    this.pouchService.getStaff(id).then(staff => {
      staff.debt += debt;
      this.pouchService.updateStaff(staff);
    });
  }

  departmentDebtReference(debt, id) {
    this.pouchService.getDepartment(id).then(department => {
      department.debt += debt;
      this.pouchService.updateDepartment(department);
    })
  }

  staffCheckIn() {
    this.individualSales.initiallogincount = 1;
    this.individualSales.ischeckedin = true;
    this.individualSales.ischeckedout = false;

    var allIndividualSales;
    this.pouchService.getIndividualSales().then(IndividualSales => {
      allIndividualSales = IndividualSales
    });
    this.pouchService.getStaff(this.localStorageItem).then(staff => {
      if (allIndividualSales != undefined) {
        allIndividualSales = allIndividualSales.filter(data => {
          data.checkindate = data.checkindate.split('T');
          data.checkindate = data.checkindate[0];
          var currentDate = new Date().toISOString();
          currentDate = currentDate.split('T')[0];
          return data.checkindate == currentDate && data.staffid == staff.id;
        });
      }
      if (allIndividualSales.length != 0) {
        this.pouchService.getIndividualSale(allIndividualSales[0].id).then(individual => {
          individual.initiallogincount = 1;
          individual.checkoutdate = new Date();
          individual.ischeckedout = false;
          individual.ischeckedin = true;
          this.pouchService.updateIndividualSale(individual).then(res => {
            this.loadAllIndividualSales();
          });
        });
      }

      else {
        this.individualSales = {
          id: '',
          rev: '',
          totaldailysales: 0,
          staffname: staff.firstname + ' ' + staff.lastname,
          staffid: staff.id,
          ischeckedin: this.individualSales.ischeckedin,
          ischeckedout: this.individualSales.ischeckedout,
          checkindate: new Date(),
          checkoutdate: this.individualSales.checkoutdate,
          initiallogincount: this.individualSales.initiallogincount,
          branch: staff.branch,
          department: staff.department,
          isstroked: false,
          strokedvalue: '',
          saleids: []
        }
        this.pouchService.saveIndividualSale(this.individualSales);
      }
    });
  }

  staffCheckOut() {
    var allIndividualSales;
    this.pouchService.getIndividualSales().then(IndividualSales => {
      allIndividualSales = IndividualSales
    });

    this.pouchService.getStaff(this.localStorageItem).then(staff => {
      allIndividualSales = allIndividualSales.filter(data => {
        data.checkindate = data.checkindate.split('T');
        data.checkindate = data.checkindate[0];
        var currentDate = new Date().toISOString();
        currentDate = currentDate.split('T')[0];
        return data.checkindate == currentDate && data.staffid == staff.id;
      });
      this.pouchService.getIndividualSale(allIndividualSales[0].id).then(individual => {
        individual.initiallogincount = 0;
        individual.checkoutdate = new Date();
        individual.ischeckedout = true;
        individual.ischeckedin = false;
        this.pouchService.updateIndividualSale(individual).then(res => {
          this.loadAllIndividualSales();
        });
      });
    });
  }

  updateIndividualSales(response) {
    var allIndividualSales;
    this.pouchService.getIndividualSales().then(IndividualSales => {
      allIndividualSales = IndividualSales
    });

    this.pouchService.getStaff(this.localStorageItem).then(staff => {
      if (this.individualSales.initiallogincount == 1) {
        allIndividualSales = allIndividualSales.filter(data => {
          data.checkindate = data.checkindate.split('T');
          data.checkindate = data.checkindate[0];
          var currentDate = new Date().toISOString();
          currentDate = currentDate.split('T')[0];
          return data.checkindate == currentDate && data.staffid == staff.id;
        });
        this.pouchService.getIndividualSale(allIndividualSales[0].id).then(individual => {
          individual.totaldailysales += response.amount;
          individual.saleids.push(response.id);
          //individual.initiallogincount = 0;
          this.pouchService.updateIndividualSale(individual).then(result => {
            this.loadAllIndividualSales();
          });
        });
        //this.individualSales.initiallogincount = 0
      }
    })
  }

  checkReferenceNo() {
    var receiptSource = 'Revenue';
    this.data.changeReceiptSource(receiptSource);

    this.referenceNumberError = "";
    this.pouchService.getSales().then(sales => {
      sales.forEach(sale => {
        if (sale.referencenumber.toLowerCase() === this.referenceNumber.toLowerCase().trim() && sale.iscomplete == false) {
          //this.deductQuantities(sale.productorder);
          sale.iscomplete = true;
          this.referenceNumberError = "";
          this.pouchService.updateSale(sale).then(result => {
            this.updateIndividualSales(result);
            if (result != undefined) {
              this.toastr.success('Product has been sold');
              if (result.isoncredit == true) {
                if (result.staffloan) {
                  this.patientDebtReference(result.amountloaned, result.patientid);
                }
                else if (result.departmentloan) {
                  this.departmentDebtReference(result.amountloaned, result.departmentid);
                }
              }
              if (result.isowing == true) {
                if (result.patientid != "") {
                  this.patientDebtReference(result.balance, result.patientid);
                }
                else if (result.departmentid != "") {
                  this.departmentDebtReference(result.balance, result.departmentid);
                }
              }
              this.sendNotification(result.branch, result.salename);
              this.printReceipt(result);
            }
            else {
              this.toastr.warning('Failed to sell product, please try again');
            }
          });
        }
        else if (sale.referencenumber.toLowerCase() === this.referenceNumber.toLowerCase().trim() && sale.iscomplete == true) {
          this.referenceNumberError = "Reference number has already been used";
        }
        else {
          this.referenceNumberError = "Invalid reference number";
        }
      });
    });
  }

}
