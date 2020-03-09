import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { PouchService } from '../../../providers/pouch-service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  dropDown: string;
  toggle: boolean;
  show: boolean;
  matBadgeHidden: any;
  matBadge: any;
  children: any
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '', dropDown: '', toggle: false, show: true, matBadgeHidden: true, matBadge: null, children: [] },
  { path: null, title: 'Staff', icon: 'person', class: '', dropDown: 'add', toggle: true, show: true, matBadgeHidden: true, matBadge: null, children: [{ title: 'Register Staff', path: '/user-profile' }, { title: 'View Staff', path: '/viewstaff' }] },
  { path: null, title: 'Patient', icon: 'people', class: '', dropDown: 'add', toggle: true, show: true, matBadgeHidden: true, matBadge: null, children: [{ title: 'Add Patient', path: '/add-patient' }, { title: 'View Patient', path: '/view-patient' }] },
  { path: null, title: 'Vendor', icon: 'people', class: '', dropDown: 'add', toggle: true, show: true, matBadgeHidden: true, matBadge: null, children: [{ title: 'Add Vendor', path: '/add-vendor' }, { title: 'View Vendor', path: '/view-vendor' }] },
  { path: '/view-departments', title: 'Departments', icon: 'library_books', class: '', dropDown: '', toggle: false, show: true, matBadgeHidden: false, matBadge: null, children: [] },
  { path: null, title: 'Point of Sale', icon: 'store', class: '', dropDown: 'add', toggle: true, show: true, matBadgeHidden: true, matBadge: null, children: [{ title: 'Main Pharmacy(POS)', path: '/main-pharmacy-pos' }, { title: 'Main Pharmacy(POS-BC)', path: '/main-pharmacy-pos-bc' }, { title: 'GOPD Pharmacy(POS)', path: '/gopd-pharmacy-pos' }, { title: 'Laboratory(POS)', path: '/laboratory-pos' }, { title: 'Radiology(POS)', path: '/radiology-pos' }, { title: 'Revenue(POS)', path: '/revenue-pos' }, { title: 'Account(POS)', path: '/account-pos' }] },
  { path: null, title: 'Accounts', icon: 'account_balance', class: '', dropDown: 'add', toggle: true, show: true, matBadgeHidden: true, matBadge: null, children: [{ title: 'Pay Roll', path: '/pay-roll' }, { title: 'Sales', path: '/sales' }, { title: 'Expenses', path: '/expenses' }, { title: 'Cash Book', path: '/cash-book' }] },
  { path: null, title: 'Inventory Categ..', icon: 'group_work', class: '', dropDown: 'add', toggle: true, show: true, matBadgeHidden: true, matBadge: null, children: [{ title: 'Pharmacy Store Category', path: '/pharmacy-store-category' }, { title: 'Central Store Category', path: '/central-store-category' }, { title: 'Central Store Category(BC)', path: '/central-store-bc-category' }] },
  { path: null, title: 'Inventory', icon: 'local_grocery_store', class: '', dropDown: 'add', toggle: true, show: true, matBadgeHidden: true, matBadge: null, children: [{ title: 'Pharmacy Store', path: '/pharmacy-store' }, { title: 'Central Store', path: '/central-store' }, { title: 'Central Store(BC)', path: '/central-store-bc' }] },
  { path: null, title: 'Services', icon: 'rss_feed', class: '', dropDown: 'add', toggle: true, show: true, matBadgeHidden: true, matBadge: null, children: [{ title: 'Main Pharmacy Services', path: '/main-pharmacy-services' }, { title: 'GOPD Pharmacy Services', path: '/gopd-pharmacy-services' }, { title: 'Laboratory Services', path: '/laboratory-services' }, { title: 'Main Pharmacy Services(BC)', path: '/main-pharmacy-services-bc' }, { title: 'Radiology Services', path: '/radiology-services' }, { title: 'Theater Services', path: '/theater-services' }, { title: 'General Services', path: '/general-services' }] },
  /*{ path: null, title: 'Service', icon: 'rss_feed', class: '', dropDown: 'add', toggle: true, show: true, matBadgeHidden: true, matBadge: null, children: [{ title: 'Pharmacy Service', path: '/pharmacy-service' }, { title: 'Laboratory Service', path: '/laboratory-service' }, { title: 'Pharmacy Service(BC)', path: '/pharmacy-service-bc' }, { title: 'Radiology Service', path: '/radiology-service' }, { title: 'Theater Service', path: '/theater-service' }] },
    { path: '/typography', title: 'Typography', icon: 'library_books', class: '', dropDown: '', toggle: false, show: true, children: [] },
   { path: '/icons', title: 'Icons', icon: 'bubble_chart', class: '', dropDown: '', toggle: false, show: true, children: [] },
   { path: '/maps', title: 'Maps', icon: 'location_on', class: '', dropDown: '', toggle: false, show: true, children: [] }, */
  { path: '/notifications', title: 'Notifications', icon: 'notifications', class: '', dropDown: '', toggle: false, show: true, matBadgeHidden: false, matBadge: null, children: [] },
  { path: '/drug-notifications', title: 'Drug Notifications', icon: 'notifications', class: '', dropDown: '', toggle: false, show: true, matBadgeHidden: false, matBadge: null, children: [] },
  { path: '/drug-quantity-notifications', title: 'Drug Quantity Notifications', icon: 'notifications', class: '', dropDown: '', toggle: false, show: true, matBadgeHidden: false, matBadge: null, children: [] }
  /* { path: '/upgrade', title: 'Upgrade to PRO', icon: 'unarchive', class: 'active-pro', dropDown: '', toggle: false, show: true, children: [] } */
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  shows: any = false;
  childrens: any[];
  notifications: any[];
  notificationNumber: any;


  constructor(private router: Router, public pouchService: PouchService) {

  }

  showSideMenu() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      if (item.branch == 'IUTH(Okada)') {
        this.menuItems[5].children = [];
        this.menuItems[7].children = [];
        this.menuItems[8].children = [];
        this.menuItems[9].children = [];
        this.menuItems[5].children = [{ title: 'Main Pharmacy(POS)', path: '/main-pharmacy-pos' }, { title: 'GOPD Pharmacy(POS)', path: '/gopd-pharmacy-pos' }, { title: 'Laboratory(POS)', path: '/laboratory-pos' }, { title: 'Radiology(POS)', path: '/radiology-pos' }, { title: 'Revenue(POS)', path: '/revenue-pos' }]
        this.menuItems[7].children = [{ title: 'Pharmacy Store Category', path: '/pharmacy-store-category' }, { title: 'Central Store Category', path: '/central-store-category' }];
        this.menuItems[8].children = [{ title: 'Pharmacy Store', path: '/pharmacy-store' }, { title: 'Central Store', path: '/central-store' }];
        this.menuItems[9].children = [{ title: 'Main Pharmacy Services', path: '/main-pharmacy-services' }, { title: 'GOPD Pharmacy Services', path: '/gopd-pharmacy-services' }, { title: 'Laboratory Services', path: '/laboratory-services' }, { title: 'Radiology Services', path: '/radiology-services' }, { title: 'Theater Services', path: '/theater-services' }, { title: 'General Services', path: '/general-services' }];
      }
      else if (item.branch == 'Benin Centre') {
        this.menuItems[5].children = [];
        this.menuItems[7].children = [];
        this.menuItems[8].children = [];
        this.menuItems[9].children = [];
        this.menuItems[5].children = [{ title: 'Main Pharmacy(POS-BC)', path: '/main-pharmacy-pos-bc' }, { title: 'Account(POS)', path: '/account-pos' }];
        this.menuItems[7].children = [{ title: 'Central Store Category(BC)', path: '/central-store-bc-category' }];
        this.menuItems[8].children = [{ title: 'Central Store(BC)', path: '/central-store-bc' }];
        this.menuItems[9].children = [{ title: 'Main Pharmacy Services(BC)', path: '/main-pharmacy-services-bc' }, { title: 'General Services', path: '/general-services' }]
      }
    });
  }

  ngOnInit() {
    this.showSideMenu();

    /* setInterval(() => {
      var localStorageItem = JSON.parse(localStorage.getItem('user'));
      this.pouchService.getStaff(localStorageItem).then(item => {
        item.notification = item.notification.filter(data => data.viewed == false);
        if (item.notification.length == 0) {
          this.menuItems[10].matBadgeHidden = true;
        }
        else {
          this.menuItems[10].matBadgeHidden = false;
        }
        this.menuItems[10].matBadge = item.notification.length;
      });

      this.navbarNotification(localStorageItem);
      this.checkedExpired(localStorageItem);
      this.drugsNotification();
      this.counterProductQuantitynotification();
      this.productQuantitynotification();
    }, 60000); */
  }

  navbarNotification(id) {
    this.pouchService.getStaff(id).then(item => {
      item.notification = item.notification.filter(data => data.viewed == false);
      this.notificationNumber = item.notification.length;
      this.notifications = item.notification.slice(Math.max(item.notification.length - 5, 0));
    });
  }

  checkedExpired(id) {
    this.pouchService.getStaff(id).then(item => {
      this.pouchService.getCounterProducts().then(items => {
        items = items.filter(data => data.branch == item.branch && data.department == item.department);
        items.forEach(item => {
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

  drugsNotification() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      if (item.department == 'Main Pharmacy' && item.branch == 'IUTH(Okada)') {
        this.pouchService.getCounterProducts().then(counterproducts => {
          counterproducts = counterproducts.filter(data => data.department == 'Main Pharmacy' && data.branch == 'IUTH(Okada)');
          counterproducts = counterproducts.filter(data => {
            var expiryDateTimestamp = new Date(data.expirydate).getTime();
            var currentDateTimestamp = new Date();
            currentDateTimestamp.setSeconds(0);
            currentDateTimestamp.setMinutes(0);
            currentDateTimestamp.setHours(0);
            currentDateTimestamp.setMilliseconds(0);
            var convertedCurrentDateTimestamp = currentDateTimestamp.getTime();
            return (expiryDateTimestamp - convertedCurrentDateTimestamp) <= 2592000000 && data.isnoticed == false;
          });
          if (counterproducts.length == 0) {
            this.menuItems[11].matBadgeHidden = true;
          }
          else {
            this.menuItems[11].matBadgeHidden = false;
          }
          this.menuItems[11].matBadge = counterproducts.length;
        })
      }
      else if (item.department == 'Main Pharmacy' && item.branch == 'Benin Centre') {
        this.pouchService.getCounterProducts().then(counterproducts => {
          counterproducts = counterproducts.filter(data => data.department == 'Main Pharmacy' && data.branch == 'Benin Centre');
          counterproducts = counterproducts.filter(data => {
            var expiryDateTimestamp = new Date(data.expirydate).getTime();
            var currentDateTimestamp = new Date();
            currentDateTimestamp.setSeconds(0);
            currentDateTimestamp.setMinutes(0);
            currentDateTimestamp.setHours(0);
            currentDateTimestamp.setMilliseconds(0);
            var convertedCurrentDateTimestamp = currentDateTimestamp.getTime();
            return (expiryDateTimestamp - convertedCurrentDateTimestamp) <= 2592000000 && data.isnoticed == false;
          });
          if (counterproducts.length == 0) {
            this.menuItems[11].matBadgeHidden = true;
          }
          else {
            this.menuItems[11].matBadgeHidden = false;
          }
          this.menuItems[11].matBadge = counterproducts.length;
        })
      }
      else if (item.department == 'GOPD Pharmacy' && item.branch == 'IUTH(Okada)') {
        this.pouchService.getCounterProducts().then(counterproducts => {
          counterproducts = counterproducts.filter(data => data.department == 'GOPD Pharmacy' && data.branch == 'IUTH(Okada)');
          counterproducts = counterproducts.filter(data => {
            var expiryDateTimestamp = new Date(data.expirydate).getTime();
            var currentDateTimestamp = new Date();
            currentDateTimestamp.setSeconds(0);
            currentDateTimestamp.setMinutes(0);
            currentDateTimestamp.setHours(0);
            currentDateTimestamp.setMilliseconds(0);
            var convertedCurrentDateTimestamp = currentDateTimestamp.getTime();
            return (expiryDateTimestamp - convertedCurrentDateTimestamp) <= 2592000000 && data.isnoticed == false;
          });
          if (counterproducts.length == 0) {
            this.menuItems[11].matBadgeHidden = true;
          }
          else {
            this.menuItems[11].matBadgeHidden = false;
          }
          this.menuItems[11].matBadge = counterproducts.length;
        })
      }
      else if (item.department == 'Laboratory' && item.branch == 'IUTH(Okada)') {
        this.pouchService.getCounterProducts().then(counterproducts => {
          counterproducts = counterproducts.filter(data => data.department == 'Laboratory' && data.branch == 'IUTH(Okada)');
          counterproducts = counterproducts.filter(data => {
            var expiryDateTimestamp = new Date(data.expirydate).getTime();
            var currentDateTimestamp = new Date();
            currentDateTimestamp.setSeconds(0);
            currentDateTimestamp.setMinutes(0);
            currentDateTimestamp.setHours(0);
            currentDateTimestamp.setMilliseconds(0);
            var convertedCurrentDateTimestamp = currentDateTimestamp.getTime();
            return (expiryDateTimestamp - convertedCurrentDateTimestamp) <= 2592000000 && data.isnoticed == false;
          });
          if (counterproducts.length == 0) {
            this.menuItems[11].matBadgeHidden = true;
          }
          else {
            this.menuItems[11].matBadgeHidden = false;
          }
          this.menuItems[11].matBadge = counterproducts.length;
        })
      }
      else if (item.department == 'Radiology' && item.branch == 'IUTH(Okada)') {
        this.pouchService.getCounterProducts().then(counterproducts => {
          counterproducts = counterproducts.filter(data => data.department == 'Radiology' && data.branch == 'IUTH(Okada)');
          counterproducts = counterproducts.filter(data => {
            var expiryDateTimestamp = new Date(data.expirydate).getTime();
            var currentDateTimestamp = new Date();
            currentDateTimestamp.setSeconds(0);
            currentDateTimestamp.setMinutes(0);
            currentDateTimestamp.setHours(0);
            currentDateTimestamp.setMilliseconds(0);
            var convertedCurrentDateTimestamp = currentDateTimestamp.getTime();
            return (expiryDateTimestamp - convertedCurrentDateTimestamp) <= 2592000000 && data.isnoticed == false;
          });
          if (counterproducts.length == 0) {
            this.menuItems[11].matBadgeHidden = true;
          }
          else {
            this.menuItems[11].matBadgeHidden = false;
          }
          this.menuItems[11].matBadge = counterproducts.length;
        })
      }
      else if (item.department == 'Pharmacy Store' && item.branch == 'IUTH(Okada)') {
        this.pouchService.getProducts().then(products => {
          products = products.filter(data => data.store == 'Pharmacy Store' && data.branch == 'IUTH(Okada)');
          products = products.filter(data => {
            var expiryDateTimestamp = new Date(data.expiryDate).getTime();
            var currentDateTimestamp = new Date();
            currentDateTimestamp.setSeconds(0);
            currentDateTimestamp.setMinutes(0);
            currentDateTimestamp.setHours(0);
            currentDateTimestamp.setMilliseconds(0);
            var convertedCurrentDateTimestamp = currentDateTimestamp.getTime();
            return (expiryDateTimestamp - convertedCurrentDateTimestamp) <= 2592000000 && data.isnoticed == false;
          });
          if (products.length == 0) {
            this.menuItems[11].matBadgeHidden = true;
          }
          else {
            this.menuItems[11].matBadgeHidden = false;
          }
          this.menuItems[11].matBadge = products.length;
        })
      }
      else if (item.department == 'Central Store' && item.branch == 'IUTH(Okada)') {
        this.pouchService.getProducts().then(products => {
          products = products.filter(data => data.store == 'Central Store' && data.branch == 'IUTH(Okada)');
          products = products.filter(data => {
            var expiryDateTimestamp = new Date(data.expiryDate).getTime();
            var currentDateTimestamp = new Date();
            currentDateTimestamp.setSeconds(0);
            currentDateTimestamp.setMinutes(0);
            currentDateTimestamp.setHours(0);
            currentDateTimestamp.setMilliseconds(0);
            var convertedCurrentDateTimestamp = currentDateTimestamp.getTime();
            return (expiryDateTimestamp - convertedCurrentDateTimestamp) <= 2592000000 && data.isnoticed == false;
          });
          if (products.length == 0) {
            this.menuItems[11].matBadgeHidden = true;
          }
          else {
            this.menuItems[11].matBadgeHidden = false;
          }
          this.menuItems[11].matBadge = products.length;
        })
      }
      else if (item.department == 'Central Store' && item.branch == 'Benin Centre') {
        this.pouchService.getProducts().then(products => {
          products = products.filter(data => data.store == 'Central Store' && data.branch == 'Benin Centre');
          products = products.filter(data => {
            var expiryDateTimestamp = new Date(data.expiryDate).getTime();
            var currentDateTimestamp = new Date();
            currentDateTimestamp.setSeconds(0);
            currentDateTimestamp.setMinutes(0);
            currentDateTimestamp.setHours(0);
            currentDateTimestamp.setMilliseconds(0);
            var convertedCurrentDateTimestamp = currentDateTimestamp.getTime();
            return (expiryDateTimestamp - convertedCurrentDateTimestamp) <= 2592000000 && data.isnoticed == false;
          });
          if (products.length == 0) {
            this.menuItems[11].matBadgeHidden = true;
          }
          else {
            this.menuItems[11].matBadgeHidden = false;
          }
          this.menuItems[11].matBadge = products.length;
        })
      }
    });
  }

  counterProductQuantitynotification() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      this.pouchService.getCounterProducts().then(counterproducts => {
        counterproducts = counterproducts.filter(data => data.department == item.department && data.branch == item.branch);
        if (counterproducts.length != 0) {
          counterproducts = counterproducts.filter(data => {
            return data.suppliedunit <= 1 && data.isquantitynoticed == false || data.totalsubitem <= 1 && data.isquantitynoticed == false;
          });
          if (counterproducts.length == 0) {
            this.menuItems[12].matBadgeHidden = true;
          }
          else {
            this.menuItems[12].matBadgeHidden = false;
          }
          this.menuItems[12].matBadge = counterproducts.length;
        }
      });
    });
  }

  productQuantitynotification() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      this.pouchService.getProducts().then(products => {
        products = products.filter(data => data.store == item.department && data.branch == item.branch);
        if (products.length != 0) {
          products = products.filter(data => {
            return data.unitstock <= 1 && data.isquantitynoticed == false || data.totalsubitem <= 1 && data.isquantitynoticed == false;
          });
          if (products.length == 0) {
            this.menuItems[12].matBadgeHidden = true;
          }
          else {
            this.menuItems[12].matBadgeHidden = false;
          }
          this.menuItems[12].matBadge = products.length;
        }
      });
    });
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  //My code
  navLogin() {
    this.router.navigate(['login']);
  }


}
