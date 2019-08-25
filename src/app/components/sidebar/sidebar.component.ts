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
  { path: null, title: 'Point of Sale', icon: 'store', class: '', dropDown: 'add', toggle: true, show: true, matBadgeHidden: true, matBadge: null, children: [{ title: 'Main Pharmacy(POS)', path: '/main-pharmacy-pos' }, { title: 'GOPD Pharmacy(POS)', path: '/gopd-pharmacy-pos' }, { title: 'Laboratory(POS)', path: '/lab-pos' }, { title: 'Radiology(POS)', path: '/radiology-pos' }, { title: 'Revenue(POS)', path: '/revenue-pos' }] },
  { path: null, title: 'Accounts', icon: 'account_balance', class: '', dropDown: 'add', toggle: true, show: true, matBadgeHidden: true, matBadge: null, children: [{ title: 'Pay Roll', path: '/pay-roll' }, { title: 'Sales', path: '/sales' }, { title: 'Expenses', path: '/expenses' }] },
  { path: null, title: 'Inventory Categ..', icon: 'group_work', class: '', dropDown: 'add', toggle: true, show: true, matBadgeHidden: true, matBadge: null, children: [{ title: 'Pharmacy Store Category', path: '/pharmacy-store-category' }, { title: 'Central Store Category', path: '/central-store-category' }, { title: 'Central Store Category(BC)', path: '/central-store-bc-category' }] },
  { path: null, title: 'Inventory', icon: 'local_grocery_store', class: '', dropDown: 'add', toggle: true, show: true, matBadgeHidden: true, matBadge: null, children: [{ title: 'Pharmacy Store', path: '/pharmacy-store' }, { title: 'Central Store', path: '/central-store' }, { title: 'Central Store(BC)', path: '/central-store-bc' }] },
  { path: null, title: 'Services', icon: 'rss_feed', class: '', dropDown: 'add', toggle: true, show: true, matBadgeHidden: true, matBadge: null, children: [{ title: 'Main Pharmacy Services', path: '/main-pharmacy-services' }, { title: 'GOPD Pharmacy Services', path: '/gopd-pharmacy-services' }, { title: 'Laboratory Services', path: '/laboratory-services' }, { title: 'Main Pharmacy Services(BC)', path: '/main-pharmacy-services-bc' }, { title: 'Radiology Services', path: '/radiology-services' }, { title: 'Theater Services', path: '/theater-services' }] },
  /*{ path: null, title: 'Service', icon: 'rss_feed', class: '', dropDown: 'add', toggle: true, show: true, matBadgeHidden: true, matBadge: null, children: [{ title: 'Pharmacy Service', path: '/pharmacy-service' }, { title: 'Laboratory Service', path: '/laboratory-service' }, { title: 'Pharmacy Service(BC)', path: '/pharmacy-service-bc' }, { title: 'Radiology Service', path: '/radiology-service' }, { title: 'Theater Service', path: '/theater-service' }] },
    { path: '/typography', title: 'Typography', icon: 'library_books', class: '', dropDown: '', toggle: false, show: true, children: [] },
   { path: '/icons', title: 'Icons', icon: 'bubble_chart', class: '', dropDown: '', toggle: false, show: true, children: [] },
   { path: '/maps', title: 'Maps', icon: 'location_on', class: '', dropDown: '', toggle: false, show: true, children: [] }, */
  { path: '/notifications', title: 'Notifications', icon: 'notifications', class: '', dropDown: '', toggle: false, show: true, matBadgeHidden: false, matBadge: null, children: [] }
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

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    setInterval(() => {
      var localStorageItem = JSON.parse(localStorage.getItem('user'));
      this.pouchService.getStaff(localStorageItem).then(item => {
        item.notification = item.notification.filter(data => data.viewed == false);
        if (item.notification.length == 0) {
          this.menuItems[8].matBadgeHidden = true;
        }
        else {
          this.menuItems[8].matBadgeHidden = false;
        }
        this.menuItems[8].matBadge = item.notification.length;
      });

      this.navbarNotification(localStorageItem);
    }, 60000);
  }

  navbarNotification(id) {
    this.pouchService.getStaff(id).then(item => {
      item.notification = item.notification.filter(data => data.viewed == false);
      this.notificationNumber = item.notification.length;
      this.notifications = item.notification.slice(Math.max(item.notification.length - 5, 0));
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
