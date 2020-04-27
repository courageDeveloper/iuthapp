(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html":
/*!**************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n<ngx-spinner>\n    <p style=\"font-size: 20px; color: white\">Syncing data, Please wait.....</p>\n</ngx-spinner>\n<router-outlet></router-outlet>\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/footer/footer.component.html":
/*!***********************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/components/footer/footer.component.html ***!
  \***********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<footer class=\"footer \">\n    <div class=\"container-fluid\">\n        <nav class=\"pull-left\">\n            <ul>\n                <li>\n                    <a>\n                        IUTH Account Manager\n                    </a>\n                </li>\n            </ul>\n        </nav>\n        <div class=\"copyright pull-right\">\n            &copy;\n            {{test | date: 'yyyy'}}, made with love by\n            <a href=\"https://sarutech.com/\" target=\"_blank\"><b style=\"color: black;\">Sarutech</b></a>\n        </div>\n    </div>\n</footer>\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/navbar/navbar.component.html":
/*!***********************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/components/navbar/navbar.component.html ***!
  \***********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<nav class=\"navbar navbar-expand-lg navbar-transparent  navbar-absolute fixed-top\">\n    <div class=\"container-fluid\">\n        <div class=\"navbar-wrapper\">\n          <a class=\"navbar-brand\" href=\"javascript:void(0)\">{{getTitle()}}</a>\n        </div>\n        <button mat-raised-button class=\"navbar-toggler\" type=\"button\" (click)=\"sidebarToggle()\">\n            <span class=\"sr-only\">Toggle navigation</span>\n            <span class=\"navbar-toggler-icon icon-bar\"></span>\n            <span class=\"navbar-toggler-icon icon-bar\"></span>\n            <span class=\"navbar-toggler-icon icon-bar\"></span>\n        </button>\n        <div class=\"collapse navbar-collapse justify-content-end\" id=\"navigation\">\n            <form class=\"navbar-form\">\n                <div class=\"input-group no-border\">\n                    <input type=\"text\" value=\"\" class=\"form-control\" placeholder=\"Search...\">\n                    <button mat-raised-button type=\"submit\" class=\"btn btn-white btn-round btn-just-icon\">\n                        <i class=\"material-icons\">search</i>\n                        <div class=\"ripple-container\"></div>\n                    </button>\n                </div>\n            </form>\n            <ul class=\"navbar-nav\">\n                <li class=\"nav-item\">\n                    <a class=\"nav-link\" (click)=\"navDashboard()\">\n                        <i class=\"material-icons\">dashboard</i>\n                        <p>\n                            <span class=\"d-lg-none d-md-block\">Stats</span>\n                        </p>\n                    </a>\n                </li>\n                <li class=\"nav-item dropdown\">\n                    <a class=\"nav-link\" href=\"javascript:void(0)\" id=\"navbarDropdownMenuLink\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                        <i class=\"material-icons\">notifications</i>\n                        <span *ngIf=\"notificationNumber != 0\" class=\"notification\">{{notificationNumber}}</span>\n                        <p>\n                            <span class=\"d-lg-none d-md-block\">Some Actions</span>\n                        </p>\n                    </a>\n                    <div *ngIf=\"notificationNumber != 0\" class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"navbarDropdownMenuLink\">\n                        <a *ngFor=\"let notification of notifications\" class=\"dropdown-item\" [routerLink]=\"[notification.url]\">{{notification.name}}</a>\n                    </div>\n                </li>\n                <li class=\"nav-item\">\n                    <a class=\"nav-link\" (click)=\"userProfile()\">\n                        <i class=\"material-icons\">person</i>\n                        <p>\n                            <span class=\"d-lg-none d-md-block\">Account</span>\n                        </p>\n                    </a>\n                </li>\n                <li class=\"nav-item\">\n                    <a class=\"nav-link\" (click)=\"navLogin()\">\n                        <i class=\"material-icons\">exit_to_app</i>\n                        <p>\n                            <span class=\"d-lg-none d-md-block\">Logout</span>\n                        </p>\n                    </a>\n                </li>\n            </ul>\n        </div>\n    </div>\n</nav>\n\n<!--\n\n<nav class=\"navbar navbar-transparent navbar-absolute\">\n    <div class=\"container-fluid\">\n        <div class=\"navbar-header\">\n            <button mat-raised-button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" (click)=\"sidebarToggle()\">\n                <span class=\"sr-only\">Toggle navigation</span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n            </button>\n            <a class=\"navbar-brand\" href=\"javascript:void(0)\">{{getTitle()}}</a>\n        </div>\n        <div class=\"collapse navbar-collapse\">\n            <ul class=\"nav navbar-nav navbar-right\">\n                <li>\n                    <a href=\"javascript:void(0)\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n                        <i class=\"material-icons\">dashboard</i>\n                        <p class=\"hidden-lg hidden-md\">Dashboard</p>\n                    </a>\n                </li>\n                <li class=\"dropdown\">\n                    <a href=\"javascript:void(0)\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n                        <i class=\"material-icons\">notifications</i>\n                        <span class=\"notification\">5</span>\n                        <p class=\"hidden-lg hidden-md\">Notifications</p>\n                    </a>\n                    <ul class=\"dropdown-menu\">\n                        <li><a href=\"javascript:void(0)\">Mike John responded to your email</a></li>\n                        <li><a href=\"javascript:void(0)\">You have 5 new tasks</a></li>\n                        <li><a href=\"javascript:void(0)\">You're now friend with Andrew</a></li>\n                        <li><a href=\"javascript:void(0)\">Another Notification</a></li>\n                        <li><a href=\"javascript:void(0)\">Another One</a></li>\n                    </ul>\n                </li>\n                <li>\n                    <a href=\"javascript:void(0)\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n                       <i class=\"material-icons\">person</i>\n                       <p class=\"hidden-lg hidden-md\">Profile</p>\n                    </a>\n                </li>\n            </ul>\n\n            <form class=\"navbar-form navbar-right\" role=\"search\">\n                <div class=\"form-group form-black is-empty\">\n                    <input type=\"text\" class=\"form-control\" placeholder=\"Search\">\n                    <span class=\"material-input\"></span>\n                </div>\n                <button mat-raised-button type=\"submit\" class=\"btn btn-white btn-round btn-just-icon\">\n                    <i class=\"material-icons\">search</i><div class=\"ripple-container\"></div>\n                </button>\n            </form>\n        </div>\n    </div>\n</nav> -->\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/sidebar/sidebar.component.html":
/*!*************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/components/sidebar/sidebar.component.html ***!
  \*************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"logo\">\n    <a href=\"https://sarutech.com/\" class=\"simple-text\">\n        <div class=\"container-fluid\">\n            <div class=\"row\">\n                <div class=\"col-md-12\" style=\"text-align: center\">\n                    <img src=\"./assets/img/IUTHlogo.jpg\" width=\"50px\" height=\"50px\" />\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"col-md-12\" style=\"text-align: center\">\n                    IUTH Account Manager\n                </div>\n            </div>\n        </div>\n    </a>\n</div>\n<div class=\"sidebar-wrapper\">\n    <div *ngIf=\"isMobileMenu()\">\n        <form class=\"navbar-form\">\n            <span class=\"bmd-form-group\">\n                <div class=\"input-group no-border\">\n                    <input type=\"text\" value=\"\" class=\"form-control\" placeholder=\"Search...\">\n                    <button mat-raised-button type=\"submit\" class=\"btn btn-white btn-round btn-just-icon\">\n                        <i class=\"material-icons\">search</i>\n                        <div class=\"ripple-container\"></div>\n                    </button>\n                </div>\n            </span>\n        </form>\n        <ul class=\"nav navbar-nav nav-mobile-menu\">\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" href=\"javascript:void(0)\">\n                    <i class=\"material-icons\">dashboard</i>\n                    <p>\n                        <span class=\"d-lg-none d-md-block\">Stats</span>\n                    </p>\n                </a>\n            </li>\n            <li class=\"nav-item dropdown\">\n                <a class=\"nav-link\" href=\"javascript:void(0)\" id=\"navbarDropdownMenuLink\" data-toggle=\"dropdown\"\n                    aria-haspopup=\"true\" aria-expanded=\"false\">\n                    <i class=\"material-icons\">notifications</i>\n                    <span *ngIf=\"notificationNumber != 0\" class=\"notification\">{{notificationNumber}}</span>\n                    <p>\n                        <span class=\"d-lg-none d-md-block\">Some Actions</span>\n                    </p>\n                </a>\n                <div *ngIf=\"notificationNumber != 0\" class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"navbarDropdownMenuLink\">\n                    <a *ngFor=\"let notification of notifications\" class=\"dropdown-item\" [routerLink]=\"[notification.url]\">{{notification.name}}</a>\n                </div>\n            </li>\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" (click)=\"userProfile()\">\n                    <i class=\"material-icons\">person</i>\n                    <p>\n                        <span class=\"d-lg-none d-md-block\">Account</span>\n                    </p>\n                </a>\n            </li>\n            <li class=\"nav-item\">\n                <a class=\"nav-link\" (click)=\"navLogin()\">\n                    <i class=\"material-icons\">exit_to_app</i>\n                    <p>\n                        <span class=\"d-lg-none d-md-block\">Logout</span>\n                    </p>\n                </a>\n            </li>\n        </ul>\n    </div>\n    <ul class=\"nav\">\n        <div *ngFor=\"let menuItem of menuItems\">\n            <li routerLinkActive=\"active\" *ngIf=\"menuItem.show\" class=\"{{menuItem.class}} nav-item\">\n                <a class=\"nav-link\" [routerLink]=\"[menuItem.path]\">\n                    <i class=\"material-icons\" matBadge=\"{{menuItem.matBadge}}\" matBadgeColor=\"warn\" matBadgeHidden=\"{{menuItem.matBadgeHidden}}\">{{menuItem.icon}}</i>\n                    <i class=\"material-icons align-end\">{{menuItem.dropDown}}</i>\n                    <p>{{menuItem.title}}\n                        <mat-select *ngIf=\"menuItem.toggle\">\n                            <div *ngFor=\"let menuItem of menuItem.children\">\n                                <a class=\"nav-link focus-color\" [routerLink]=\"[menuItem.path]\">\n                                    <mat-option>{{menuItem.title}}</mat-option>\n                                </a>\n                            </div>\n                        </mat-select>\n                    </p>\n\n                </a>\n            </li>\n        </div>\n    </ul>\n</div>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/drugprompt/drugprompt.component.html":
/*!********************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/drugprompt/drugprompt.component.html ***!
  \********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<h1 mat-dialog-title>{{data.content.name}}</h1>\n<div mat-dialog-content>\n  {{data.content.message}} proceed to view them?\n</div>\n<div mat-dialog-actions>\n  <button mat-button (click)=\"dialogRef.close(false)\" class=\"btn btn-danger\">No Thanks</button>\n  <button mat-button (click)=\"dialogRef.close(true)\" [routerLink]=\"[data.content.url]\" class=\"btn btn-success\" cdkFocusInitial>OK</button>\n</div>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/layouts/admin-layout/admin-layout.component.html":
/*!********************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/layouts/admin-layout/admin-layout.component.html ***!
  \********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"wrapper\">\n    <div *ngIf=\"navservice.visible\" class=\"sidebar\" data-color=\"navy-blue\" data-background-color=\"white\" data-image=\"./assets/img/sidebar-1.jpg\">\n        <app-sidebar></app-sidebar>\n        <div class=\"sidebar-background\" style=\"background-image: url(./assets/img/sidebar-3.jpg)\"></div>\n    </div>\n    <div  class=\"main-panel\">\n        <app-navbar *ngIf=\"navservice.visible\"></app-navbar>\n        <router-outlet></router-outlet>\n        <div *ngIf=\"isMaps('maps')\">\n            <app-footer></app-footer>\n        </div>\n    </div>\n    <!-- <div *ngIf=\"navservice.visible\" class=\"fixed-plugin\">\n        <div class=\"dropdown show-dropdown open show\">\n            <a href=\"#\" data-toggle=\"dropdown\" aria-expanded=\"true\">\n                <i class=\"fa fa-cog fa-2x\"> </i>\n            </a>\n            <ul class=\"dropdown-menu show\" x-placement=\"bottom-start\" style=\"position: absolute; top: 41px; left: -231px; will-change: top, left;\">\n                <li class=\"header-title\"> Sidebar Filters</li>\n                <li class=\"adjustments-line\">\n                    <a href=\"javascript:void(0)\" class=\"switch-trigger active-color\">\n                        <div class=\"ml-auto mr-auto\">\n                            <span class=\"badge filter badge-purple\" data-color=\"purple\"></span>\n                            <span class=\"badge filter badge-azure\" data-color=\"azure\"></span>\n                            <span class=\"badge filter badge-green\" data-color=\"green\"></span>\n                            <span class=\"badge filter badge-orange\" data-color=\"orange\"></span>\n                            <span class=\"badge filter badge-danger active\" data-color=\"danger\"></span>\n                            <span class=\"badge filter badge-navy-blue active\" data-color=\"navy-blue\"></span>\n                        </div>\n                        <div class=\"clearfix\"></div>\n                    <div class=\"ripple-container\"></div></a>\n                </li>\n                <li class=\"header-title\">Images</li>\n                <li>\n                    <a class=\"img-holder switch-trigger\" href=\"javascript:void(0)\">\n                        <img src=\"./assets/img/sidebar-1.jpg\" alt=\"\">\n                    </a>\n                </li>\n                <li>\n                    <a class=\"img-holder switch-trigger\" href=\"javascript:void(0)\">\n                        <img src=\"./assets/img/sidebar-2.jpg\" alt=\"\">\n                    <div class=\"ripple-container\"></div></a>\n                </li>\n                <li>\n                    <a class=\"img-holder switch-trigger\" href=\"javascript:void(0)\">\n                        <img src=\"./assets/img/sidebar-3.jpg\" alt=\"\">\n                    </a>\n                </li>\n                <li class=\"active\">\n                    <a class=\"img-holder switch-trigger\" href=\"javascript:void(0)\">\n                        <img src=\"./assets/img/sidebar-4.jpg\" alt=\"\">\n                    </a>\n                </li>\n                <li class=\"button-container\">\n                    <div>\n                        <button class=\"btn btn-info btn-block btn-fill\" data-toggle=\"modal\" data-target=\"#buy\">\n                            Download Free\n                        </button>\n                    </div>\n                </li>\n                <li class=\"button-container\">\n                    <div>\n                        <button class=\"btn btn-warning btn-block btn-fill\" data-toggle=\"modal\" data-target=\"#buy\">\n                            Buy Pro\n                        </button>\n                    </div>\n                </li>\n                <li class=\"button-container text-center\" routerLinkActive=\"active\">\n                  <div>\n                    <a class=\"btn btn-default btn-block\" href=\"https://demos.creative-tim.com/material-dashboard-angular2/#/documentation/tutorial\">\n                        View Documentation\n                    </a>\n                  </div>\n                </li>\n            </ul>\n        </div>\n    </div> -->\n</div>\n<!-- Buy-Modal-angular -->\n<!-- <div class=\"modal modal-angular fade\" id=\"buy\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\">\n<div class=\"modal-dialog\" role=\"document\">\n    <div class=\"modal-content\">\n        <div class=\"modal-body text-center\">\n            <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n            <h4 class=\"margin-top\">\n                Free Version\n            </h4>\n            <div class=\"separator\"></div>\n            <a href=\"https://www.creative-tim.com/product/material-dashboard\" class=\"modal-button\" target=\"_blank\">\n                <div class=\"wrapper-card\">\n                    <div class=\"image-container\">\n                        <img src=\"./assets/img/html.png\" alt=\"unloaded\">\n                    </div>\n                    Html5\n                    <div class=\"separator\"></div>\n                    <div class=\"product-type\">\n                        FREE\n                    </div>\n                </div>\n            </a>\n            <a href=\"https://www.creative-tim.com/product/material-dashboard-angular2\" class=\"modal-button\" target=\"_blank\">\n                <div class=\"wrapper-card\">\n                    <div class=\"image-container image-angular-cli\">\n                        <img src=\"./assets/img/angular.png\" alt=\"unloaded\">\n                    </div>\n                    Angular\n                    <div class=\"separator\"></div>\n                    <div class=\"product-type\">\n                        FREE\n                    </div>\n                </div>\n            </a>\n            <h4>\n                PRO Version\n            </h4>\n            <div class=\"separator\"></div>\n            <a href=\"https://www.creative-tim.com/product/material-dashboard-pro\" class=\"modal-button\" target=\"_blank\">\n                <div class=\"image-container\">\n                    <img src=\"./assets/img/html.png\" alt=\"unloaded\">\n                </div>\n                Html5\n                <div class=\"separator\"></div>\n                <div class=\"price\">\n                    from\n                    <span>\n                        49\n                        <i class=\"fa fa-usd\" aria-hidden=\"true\"></i>\n                    </span>\n                </div>\n            </a>\n            <a href=\"https://www.creative-tim.com/product/material-dashboard-pro-angular2\" class=\"modal-button\" target=\"_blank\">\n                <div class=\"image-container image-angular-cli\">\n                    <img src=\"./assets/img/angular.png\" alt=\"unloaded\">\n                </div>\n                Angular\n                <div class=\"separator\"></div>\n                <div class=\"price\">\n                    from\n                    <span>\n                        59\n                        <i class=\"fa fa-usd\" aria-hidden=\"true\"></i>\n                    </span>\n                </div>\n            </a>\n        </div>\n    </div>\n</div>\n\n</div> -->\n");

/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./layouts/admin-layout/admin-layout.module": [
		"./src/app/layouts/admin-layout/admin-layout.module.ts",
		"layouts-admin-layout-admin-layout-module"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(function() {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIn0= */");

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _providers_pouch_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../providers/pouch-service */ "./src/providers/pouch-service.ts");
/* harmony import */ var ngx_spinner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-spinner */ "./node_modules/ngx-spinner/fesm5/ngx-spinner.js");
/* harmony import */ var _drugprompt_drugprompt_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./drugprompt/drugprompt.component */ "./src/app/drugprompt/drugprompt.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};





var AppComponent = /** @class */ (function () {
    function AppComponent(pouchService, dialog, spinner) {
        this.pouchService = pouchService;
        this.dialog = dialog;
        this.spinner = spinner;
        if (!this.expired()) {
            this.pouchService.initDB();
        }
    }
    AppComponent.prototype.ngOnInit = function () {
        console.log(this.expired());
        if (!this.expired()) {
            this.syncData();
        }
        /*  setInterval(() => {
           var localStorageItem = JSON.parse(localStorage.getItem('user'));
           this.checkCounterProducts(localStorageItem);
           this.checkProducts(localStorageItem);
           this.checkQuantityCounterProducts(localStorageItem);
           this.checkQuantityProducts(localStorageItem);
         }, 100000); */
    };
    AppComponent.prototype.syncData = function () {
        var _this = this;
        /** spinner starts on init */
        if (this.pouchService.finishSync == undefined) {
            this.spinner.show();
            this.pouchService.checkRemoteSync().then(function (info) {
                if (info.pull.status == 'complete') {
                    _this.spinner.hide();
                }
                console.log(info);
            }).catch(function (err) {
                console.log(err);
                if (err) {
                    _this.spinner.hide();
                }
            });
        }
    };
    AppComponent.prototype.expired = function () {
        var currentDateString = new Date().toISOString().split('T')[0];
        var currentDate = new Date(currentDateString);
        var expiryDateString = new Date('2020-05-15').toISOString().split('T')[0];
        var expiryDate = new Date(expiryDateString);
        if (currentDate.getTime() >= expiryDate.getTime()) {
            return true;
        }
        else {
            return false;
        }
    };
    AppComponent.prototype.checkCounterProducts = function (id) {
        var _this = this;
        this.pouchService.getStaff(id).then(function (item) {
            _this.pouchService.getCounterProducts().then(function (counterproducts) {
                counterproducts = counterproducts.filter(function (data) { return data.department == item.department && data.branch == item.branch; });
                if (counterproducts.length != 0) {
                    counterproducts = counterproducts.filter(function (data) {
                        var expiryDateTimestamp = new Date(data.expirydate).getTime();
                        var currentDateTimestamp = new Date();
                        currentDateTimestamp.setSeconds(0);
                        currentDateTimestamp.setMinutes(0);
                        currentDateTimestamp.setHours(0);
                        currentDateTimestamp.setMilliseconds(0);
                        var convertedCurrentDateTimestamp = currentDateTimestamp.getTime();
                        return (expiryDateTimestamp - convertedCurrentDateTimestamp) <= 2592000000 && data.isnoticed == false;
                    });
                    if (counterproducts.length != 0) {
                        var message = {
                            name: item.department + " drug expiration",
                            date: new Date(),
                            message: "Some drugs from " + item.department + " are about to expire",
                            url: '/drug-notifications'
                        };
                        var dialogRef = _this.dialog.open(_drugprompt_drugprompt_component__WEBPACK_IMPORTED_MODULE_3__["DrugpromptComponent"], {
                            width: '450px',
                            data: {
                                content: message
                            }
                        });
                        dialogRef.afterClosed().subscribe(function (result) {
                            console.log('This dialog has closed');
                            if (result) {
                            }
                        });
                    }
                }
            });
        });
    };
    AppComponent.prototype.checkProducts = function (id) {
        var _this = this;
        this.pouchService.getStaff(id).then(function (item) {
            _this.pouchService.getProducts().then(function (products) {
                products = products.filter(function (data) { return data.store == item.department && data.branch == item.branch; });
                if (products.length != 0) {
                    products = products.filter(function (data) {
                        var expiryDateTimestamp = new Date(data.expiryDate).getTime();
                        var currentDateTimestamp = new Date();
                        currentDateTimestamp.setSeconds(0);
                        currentDateTimestamp.setMinutes(0);
                        currentDateTimestamp.setHours(0);
                        currentDateTimestamp.setMilliseconds(0);
                        var convertedCurrentDateTimestamp = currentDateTimestamp.getTime();
                        return (expiryDateTimestamp - convertedCurrentDateTimestamp) <= 2592000000 && data.isnoticed == false;
                    });
                    if (products.length != 0) {
                        var message = {
                            name: item.department + " drug expiration",
                            date: new Date(),
                            message: "Some drugs from " + item.department + " are about to expire",
                            url: '/drug-notifications'
                        };
                        var dialogRef = _this.dialog.open(_drugprompt_drugprompt_component__WEBPACK_IMPORTED_MODULE_3__["DrugpromptComponent"], {
                            width: '450px',
                            data: {
                                content: message
                            }
                        });
                        dialogRef.afterClosed().subscribe(function (result) {
                            console.log('This dialog has closed');
                            if (result) {
                            }
                        });
                    }
                }
            });
        });
    };
    AppComponent.prototype.checkQuantityCounterProducts = function (id) {
        var _this = this;
        this.pouchService.getStaff(id).then(function (item) {
            _this.pouchService.getCounterProducts().then(function (counterproducts) {
                counterproducts = counterproducts.filter(function (data) { return data.department == item.department && data.branch == item.branch; });
                if (counterproducts.length != 0) {
                    counterproducts = counterproducts.filter(function (data) {
                        return data.suppliedunit <= 1 && data.isquantitynoticed == false || data.totalsubitem <= 1 && data.isquantitynoticed == false;
                    });
                    if (counterproducts.length != 0) {
                        var message = {
                            name: item.department + " drug is running out",
                            date: new Date(),
                            message: "Some drugs from " + item.department + " are about to finish, please order for them",
                            url: '/drug-quantity-notifications'
                        };
                        var dialogRef = _this.dialog.open(_drugprompt_drugprompt_component__WEBPACK_IMPORTED_MODULE_3__["DrugpromptComponent"], {
                            width: '450px',
                            data: {
                                content: message
                            }
                        });
                        dialogRef.afterClosed().subscribe(function (result) {
                            console.log('This dialog has closed');
                            if (result) {
                            }
                        });
                    }
                }
            });
        });
    };
    AppComponent.prototype.checkQuantityProducts = function (id) {
        var _this = this;
        this.pouchService.getStaff(id).then(function (item) {
            _this.pouchService.getProducts().then(function (products) {
                products = products.filter(function (data) { return data.store == item.department && data.branch == item.branch; });
                if (products.length != 0) {
                    products = products.filter(function (data) {
                        return data.unitstock <= 1 && data.isquantitynoticed == false || data.totalsubitem <= 1 && data.isquantitynoticed == false;
                    });
                    if (products.length != 0) {
                        var message = {
                            name: item.department + " drug is running out",
                            date: new Date(),
                            message: "Some drugs from " + item.department + " are about to finish, please order for them",
                            url: '/drug-quantity-notifications'
                        };
                        var dialogRef = _this.dialog.open(_drugprompt_drugprompt_component__WEBPACK_IMPORTED_MODULE_3__["DrugpromptComponent"], {
                            width: '450px',
                            data: {
                                content: message
                            }
                        });
                        dialogRef.afterClosed().subscribe(function (result) {
                            console.log('This dialog has closed');
                            if (result) {
                            }
                        });
                    }
                }
            });
        });
    };
    AppComponent.ctorParameters = function () { return [
        { type: _providers_pouch_service__WEBPACK_IMPORTED_MODULE_1__["PouchService"] },
        { type: _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatDialog"] },
        { type: ngx_spinner__WEBPACK_IMPORTED_MODULE_2__["NgxSpinnerService"] }
    ]; };
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __importDefault(__webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")).default]
        }),
        __metadata("design:paramtypes", [_providers_pouch_service__WEBPACK_IMPORTED_MODULE_1__["PouchService"], _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatDialog"], ngx_spinner__WEBPACK_IMPORTED_MODULE_2__["NgxSpinnerService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var ngx_spinner__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-spinner */ "./node_modules/ngx-spinner/fesm5/ngx-spinner.js");
/* harmony import */ var _app_routing__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./app.routing */ "./src/app/app.routing.ts");
/* harmony import */ var _components_components_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/components.module */ "./src/app/components/components.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _providers_pouch_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../providers/pouch-service */ "./src/providers/pouch-service.ts");
/* harmony import */ var _agm_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @agm/core */ "./node_modules/@agm/core/index.js");
/* harmony import */ var _layouts_admin_layout_admin_layout_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./layouts/admin-layout/admin-layout.component */ "./src/app/layouts/admin-layout/admin-layout.component.ts");
/* harmony import */ var _drugprompt_drugprompt_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./drugprompt/drugprompt.component */ "./src/app/drugprompt/drugprompt.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};

















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_0__["BrowserAnimationsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
                _angular_http__WEBPACK_IMPORTED_MODULE_3__["HttpModule"],
                ngx_spinner__WEBPACK_IMPORTED_MODULE_8__["NgxSpinnerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_16__["MatDialogModule"],
                _components_components_module__WEBPACK_IMPORTED_MODULE_10__["ComponentsModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_5__["CommonModule"],
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__["BrowserModule"],
                ngx_toastr__WEBPACK_IMPORTED_MODULE_7__["ToastrModule"].forRoot(),
                _app_routing__WEBPACK_IMPORTED_MODULE_9__["AppRoutingModule"],
                _agm_core__WEBPACK_IMPORTED_MODULE_13__["AgmCoreModule"].forRoot({
                    apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
                })
            ],
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_11__["AppComponent"],
                _layouts_admin_layout_admin_layout_component__WEBPACK_IMPORTED_MODULE_14__["AdminLayoutComponent"],
                _drugprompt_drugprompt_component__WEBPACK_IMPORTED_MODULE_15__["DrugpromptComponent"]
            ],
            providers: [_providers_pouch_service__WEBPACK_IMPORTED_MODULE_12__["PouchService"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_11__["AppComponent"]],
            entryComponents: [_drugprompt_drugprompt_component__WEBPACK_IMPORTED_MODULE_15__["DrugpromptComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/app.routing.ts":
/*!********************************!*\
  !*** ./src/app/app.routing.ts ***!
  \********************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _layouts_admin_layout_admin_layout_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./layouts/admin-layout/admin-layout.component */ "./src/app/layouts/admin-layout/admin-layout.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};





var routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    }, {
        path: '',
        component: _layouts_admin_layout_admin_layout_component__WEBPACK_IMPORTED_MODULE_4__["AdminLayoutComponent"],
        children: [{
                path: '',
                loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
            }]
    }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["BrowserModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forRoot(routes, {
                    useHash: true
                })
            ],
            exports: [],
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/components/components.module.ts":
/*!*************************************************!*\
  !*** ./src/app/components/components.module.ts ***!
  \*************************************************/
/*! exports provided: ComponentsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ComponentsModule", function() { return ComponentsModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _footer_footer_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./footer/footer.component */ "./src/app/components/footer/footer.component.ts");
/* harmony import */ var _navbar_navbar_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./navbar/navbar.component */ "./src/app/components/navbar/navbar.component.ts");
/* harmony import */ var _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./sidebar/sidebar.component */ "./src/app/components/sidebar/sidebar.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};







var ComponentsModule = /** @class */ (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_6__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_6__["MatInputModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_6__["MatBadgeModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_6__["MatRippleModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_6__["MatFormFieldModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_6__["MatTooltipModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_6__["MatSelectModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_6__["MatOptionModule"]
            ],
            declarations: [
                _footer_footer_component__WEBPACK_IMPORTED_MODULE_3__["FooterComponent"],
                _navbar_navbar_component__WEBPACK_IMPORTED_MODULE_4__["NavbarComponent"],
                _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_5__["SidebarComponent"]
            ],
            exports: [
                _footer_footer_component__WEBPACK_IMPORTED_MODULE_3__["FooterComponent"],
                _navbar_navbar_component__WEBPACK_IMPORTED_MODULE_4__["NavbarComponent"],
                _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_5__["SidebarComponent"]
            ]
        })
    ], ComponentsModule);
    return ComponentsModule;
}());



/***/ }),

/***/ "./src/app/components/footer/footer.component.css":
/*!********************************************************!*\
  !*** ./src/app/components/footer/footer.component.css ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQuY3NzIn0= */");

/***/ }),

/***/ "./src/app/components/footer/footer.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/components/footer/footer.component.ts ***!
  \*******************************************************/
/*! exports provided: FooterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FooterComponent", function() { return FooterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};

var FooterComponent = /** @class */ (function () {
    function FooterComponent() {
        this.test = new Date();
    }
    FooterComponent.prototype.ngOnInit = function () {
    };
    FooterComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-footer',
            template: __importDefault(__webpack_require__(/*! raw-loader!./footer.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/footer/footer.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./footer.component.css */ "./src/app/components/footer/footer.component.css")).default]
        }),
        __metadata("design:paramtypes", [])
    ], FooterComponent);
    return FooterComponent;
}());



/***/ }),

/***/ "./src/app/components/navbar/navbar.component.css":
/*!********************************************************!*\
  !*** ./src/app/components/navbar/navbar.component.css ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".nav-link {\r\n   cursor: pointer;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9uYXZiYXIvbmF2YmFyLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7R0FDRyxlQUFlO0FBQ2xCIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9uYXZiYXIvbmF2YmFyLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubmF2LWxpbmsge1xyXG4gICBjdXJzb3I6IHBvaW50ZXI7XHJcbn0iXX0= */");

/***/ }),

/***/ "./src/app/components/navbar/navbar.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/components/navbar/navbar.component.ts ***!
  \*******************************************************/
/*! exports provided: NavbarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavbarComponent", function() { return NavbarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../sidebar/sidebar.component */ "./src/app/components/sidebar/sidebar.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _providers_pouch_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../providers/pouch-service */ "./src/providers/pouch-service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};





var NavbarComponent = /** @class */ (function () {
    function NavbarComponent(location, element, router, pouchService) {
        this.element = element;
        this.router = router;
        this.pouchService = pouchService;
        this.mobile_menu_visible = 0;
        this.location = location;
        this.sidebarVisible = false;
    }
    NavbarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.listTitles = _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_1__["ROUTES"].filter(function (listTitle) { return listTitle; });
        var navbar = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe(function (event) {
            _this.sidebarClose();
            var $layer = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                _this.mobile_menu_visible = 0;
            }
        });
        /* setInterval(() => {
            var localStorageItem = JSON.parse(localStorage.getItem('user'));
            this.pouchService.getStaff(localStorageItem).then(item => {
                item.notification = item.notification.filter(data => data.viewed == false);
                this.notificationNumber = item.notification.length;
                this.notifications = item.notification.slice(Math.max(item.notification.length - 5, 0));
            });
        }, 60000); */
    };
    NavbarComponent.prototype.sidebarOpen = function () {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');
        this.sidebarVisible = true;
    };
    ;
    NavbarComponent.prototype.sidebarClose = function () {
        var body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    ;
    NavbarComponent.prototype.sidebarToggle = function () {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        }
        else {
            this.sidebarClose();
        }
        var body = document.getElementsByTagName('body')[0];
        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);
            this.mobile_menu_visible = 0;
        }
        else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);
            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');
            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }
            else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }
            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);
            $layer.onclick = function () {
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);
            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;
        }
    };
    ;
    NavbarComponent.prototype.getTitle = function () {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].children.length == 0) {
                if (this.listTitles[item].path === titlee) {
                    return this.listTitles[item].title;
                }
            }
            else {
                for (var childItem = 0; childItem < this.listTitles[item].children.length; childItem++) {
                    if (this.listTitles[item].children[childItem].path === titlee) {
                        return this.listTitles[item].children[childItem].title;
                    }
                }
            }
        }
        return 'Dashboard';
    };
    //My code
    NavbarComponent.prototype.navLogin = function () {
        localStorage.removeItem('user');
        this.router.navigate(['login']);
    };
    NavbarComponent.prototype.navDashboard = function () {
        this.router.navigate(['dashboard']);
    };
    NavbarComponent.ctorParameters = function () { return [
        { type: _angular_common__WEBPACK_IMPORTED_MODULE_2__["Location"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] },
        { type: _providers_pouch_service__WEBPACK_IMPORTED_MODULE_4__["PouchService"] }
    ]; };
    NavbarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-navbar',
            template: __importDefault(__webpack_require__(/*! raw-loader!./navbar.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/navbar/navbar.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./navbar.component.css */ "./src/app/components/navbar/navbar.component.css")).default]
        }),
        __metadata("design:paramtypes", [_angular_common__WEBPACK_IMPORTED_MODULE_2__["Location"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _providers_pouch_service__WEBPACK_IMPORTED_MODULE_4__["PouchService"]])
    ], NavbarComponent);
    return NavbarComponent;
}());



/***/ }),

/***/ "./src/app/components/sidebar/sidebar.component.css":
/*!**********************************************************!*\
  !*** ./src/app/components/sidebar/sidebar.component.css ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".nav-link {\r\n    cursor: pointer;\r\n }\r\n\r\n .focus-color :focus{\r\n    background-color: #00254e;\r\n    color: #ffff;\r\n }\r\n\r\n .align-end {\r\n     float: right !important;\r\n }\r\n\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9zaWRlYmFyL3NpZGViYXIuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLGVBQWU7Q0FDbEI7O0NBRUE7SUFDRyx5QkFBeUI7SUFDekIsWUFBWTtDQUNmOztDQUVBO0tBQ0ksdUJBQXVCO0NBQzNCIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9zaWRlYmFyL3NpZGViYXIuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5uYXYtbGluayB7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiB9XHJcblxyXG4gLmZvY3VzLWNvbG9yIDpmb2N1c3tcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDI1NGU7XHJcbiAgICBjb2xvcjogI2ZmZmY7XHJcbiB9XHJcblxyXG4gLmFsaWduLWVuZCB7XHJcbiAgICAgZmxvYXQ6IHJpZ2h0ICFpbXBvcnRhbnQ7XHJcbiB9XHJcbiJdfQ== */");

/***/ }),

/***/ "./src/app/components/sidebar/sidebar.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/components/sidebar/sidebar.component.ts ***!
  \*********************************************************/
/*! exports provided: ROUTES, SidebarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ROUTES", function() { return ROUTES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SidebarComponent", function() { return SidebarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _providers_pouch_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../providers/pouch-service */ "./src/providers/pouch-service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};



var ROUTES = [
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
var SidebarComponent = /** @class */ (function () {
    function SidebarComponent(router, pouchService) {
        this.router = router;
        this.pouchService = pouchService;
        this.shows = false;
    }
    SidebarComponent.prototype.showSideMenu = function () {
        var _this = this;
        this.menuItems = ROUTES.filter(function (menuItem) { return menuItem; });
        var localStorageItem = JSON.parse(localStorage.getItem('user'));
        this.pouchService.getStaff(localStorageItem).then(function (item) {
            if (item.branch == 'IUTH(Okada)') {
                _this.menuItems[5].children = [];
                _this.menuItems[7].children = [];
                _this.menuItems[8].children = [];
                _this.menuItems[9].children = [];
                _this.menuItems[5].children = [{ title: 'Main Pharmacy(POS)', path: '/main-pharmacy-pos' }, { title: 'GOPD Pharmacy(POS)', path: '/gopd-pharmacy-pos' }, { title: 'Laboratory(POS)', path: '/laboratory-pos' }, { title: 'Radiology(POS)', path: '/radiology-pos' }, { title: 'Revenue(POS)', path: '/revenue-pos' }];
                _this.menuItems[7].children = [{ title: 'Pharmacy Store Category', path: '/pharmacy-store-category' }, { title: 'Central Store Category', path: '/central-store-category' }];
                _this.menuItems[8].children = [{ title: 'Pharmacy Store', path: '/pharmacy-store' }, { title: 'Central Store', path: '/central-store' }];
                _this.menuItems[9].children = [{ title: 'Main Pharmacy Services', path: '/main-pharmacy-services' }, { title: 'GOPD Pharmacy Services', path: '/gopd-pharmacy-services' }, { title: 'Laboratory Services', path: '/laboratory-services' }, { title: 'Radiology Services', path: '/radiology-services' }, { title: 'Theater Services', path: '/theater-services' }, { title: 'General Services', path: '/general-services' }];
            }
            else if (item.branch == 'Benin Centre') {
                _this.menuItems[5].children = [];
                _this.menuItems[7].children = [];
                _this.menuItems[8].children = [];
                _this.menuItems[9].children = [];
                _this.menuItems[5].children = [{ title: 'Main Pharmacy(POS-BC)', path: '/main-pharmacy-pos-bc' }, { title: 'Account(POS)', path: '/account-pos' }];
                _this.menuItems[7].children = [{ title: 'Central Store Category(BC)', path: '/central-store-bc-category' }];
                _this.menuItems[8].children = [{ title: 'Central Store(BC)', path: '/central-store-bc' }];
                _this.menuItems[9].children = [{ title: 'Main Pharmacy Services(BC)', path: '/main-pharmacy-services-bc' }, { title: 'General Services', path: '/general-services' }];
            }
        });
    };
    SidebarComponent.prototype.ngOnInit = function () {
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
    };
    SidebarComponent.prototype.navbarNotification = function (id) {
        var _this = this;
        this.pouchService.getStaff(id).then(function (item) {
            item.notification = item.notification.filter(function (data) { return data.viewed == false; });
            _this.notificationNumber = item.notification.length;
            _this.notifications = item.notification.slice(Math.max(item.notification.length - 5, 0));
        });
    };
    SidebarComponent.prototype.checkedExpired = function (id) {
        var _this = this;
        this.pouchService.getStaff(id).then(function (item) {
            _this.pouchService.getCounterProducts().then(function (items) {
                items = items.filter(function (data) { return data.branch == item.branch && data.department == item.department; });
                items.forEach(function (item) {
                    if (new Date(item.expirydate).getTime() <= new Date().getTime()) {
                        item.color = 'red';
                        item.errormessage = "Drug has expired";
                        item.isexpired = true;
                        _this.pouchService.updateCounterProduct(item);
                    }
                });
            });
        });
    };
    SidebarComponent.prototype.drugsNotification = function () {
        var _this = this;
        var localStorageItem = JSON.parse(localStorage.getItem('user'));
        this.pouchService.getStaff(localStorageItem).then(function (item) {
            if (item.department == 'Main Pharmacy' && item.branch == 'IUTH(Okada)') {
                _this.pouchService.getCounterProducts().then(function (counterproducts) {
                    counterproducts = counterproducts.filter(function (data) { return data.department == 'Main Pharmacy' && data.branch == 'IUTH(Okada)'; });
                    counterproducts = counterproducts.filter(function (data) {
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
                        _this.menuItems[11].matBadgeHidden = true;
                    }
                    else {
                        _this.menuItems[11].matBadgeHidden = false;
                    }
                    _this.menuItems[11].matBadge = counterproducts.length;
                });
            }
            else if (item.department == 'Main Pharmacy' && item.branch == 'Benin Centre') {
                _this.pouchService.getCounterProducts().then(function (counterproducts) {
                    counterproducts = counterproducts.filter(function (data) { return data.department == 'Main Pharmacy' && data.branch == 'Benin Centre'; });
                    counterproducts = counterproducts.filter(function (data) {
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
                        _this.menuItems[11].matBadgeHidden = true;
                    }
                    else {
                        _this.menuItems[11].matBadgeHidden = false;
                    }
                    _this.menuItems[11].matBadge = counterproducts.length;
                });
            }
            else if (item.department == 'GOPD Pharmacy' && item.branch == 'IUTH(Okada)') {
                _this.pouchService.getCounterProducts().then(function (counterproducts) {
                    counterproducts = counterproducts.filter(function (data) { return data.department == 'GOPD Pharmacy' && data.branch == 'IUTH(Okada)'; });
                    counterproducts = counterproducts.filter(function (data) {
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
                        _this.menuItems[11].matBadgeHidden = true;
                    }
                    else {
                        _this.menuItems[11].matBadgeHidden = false;
                    }
                    _this.menuItems[11].matBadge = counterproducts.length;
                });
            }
            else if (item.department == 'Laboratory' && item.branch == 'IUTH(Okada)') {
                _this.pouchService.getCounterProducts().then(function (counterproducts) {
                    counterproducts = counterproducts.filter(function (data) { return data.department == 'Laboratory' && data.branch == 'IUTH(Okada)'; });
                    counterproducts = counterproducts.filter(function (data) {
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
                        _this.menuItems[11].matBadgeHidden = true;
                    }
                    else {
                        _this.menuItems[11].matBadgeHidden = false;
                    }
                    _this.menuItems[11].matBadge = counterproducts.length;
                });
            }
            else if (item.department == 'Radiology' && item.branch == 'IUTH(Okada)') {
                _this.pouchService.getCounterProducts().then(function (counterproducts) {
                    counterproducts = counterproducts.filter(function (data) { return data.department == 'Radiology' && data.branch == 'IUTH(Okada)'; });
                    counterproducts = counterproducts.filter(function (data) {
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
                        _this.menuItems[11].matBadgeHidden = true;
                    }
                    else {
                        _this.menuItems[11].matBadgeHidden = false;
                    }
                    _this.menuItems[11].matBadge = counterproducts.length;
                });
            }
            else if (item.department == 'Pharmacy Store' && item.branch == 'IUTH(Okada)') {
                _this.pouchService.getProducts().then(function (products) {
                    products = products.filter(function (data) { return data.store == 'Pharmacy Store' && data.branch == 'IUTH(Okada)'; });
                    products = products.filter(function (data) {
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
                        _this.menuItems[11].matBadgeHidden = true;
                    }
                    else {
                        _this.menuItems[11].matBadgeHidden = false;
                    }
                    _this.menuItems[11].matBadge = products.length;
                });
            }
            else if (item.department == 'Central Store' && item.branch == 'IUTH(Okada)') {
                _this.pouchService.getProducts().then(function (products) {
                    products = products.filter(function (data) { return data.store == 'Central Store' && data.branch == 'IUTH(Okada)'; });
                    products = products.filter(function (data) {
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
                        _this.menuItems[11].matBadgeHidden = true;
                    }
                    else {
                        _this.menuItems[11].matBadgeHidden = false;
                    }
                    _this.menuItems[11].matBadge = products.length;
                });
            }
            else if (item.department == 'Central Store' && item.branch == 'Benin Centre') {
                _this.pouchService.getProducts().then(function (products) {
                    products = products.filter(function (data) { return data.store == 'Central Store' && data.branch == 'Benin Centre'; });
                    products = products.filter(function (data) {
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
                        _this.menuItems[11].matBadgeHidden = true;
                    }
                    else {
                        _this.menuItems[11].matBadgeHidden = false;
                    }
                    _this.menuItems[11].matBadge = products.length;
                });
            }
        });
    };
    SidebarComponent.prototype.counterProductQuantitynotification = function () {
        var _this = this;
        var localStorageItem = JSON.parse(localStorage.getItem('user'));
        this.pouchService.getStaff(localStorageItem).then(function (item) {
            _this.pouchService.getCounterProducts().then(function (counterproducts) {
                counterproducts = counterproducts.filter(function (data) { return data.department == item.department && data.branch == item.branch; });
                if (counterproducts.length != 0) {
                    counterproducts = counterproducts.filter(function (data) {
                        return data.suppliedunit <= 1 && data.isquantitynoticed == false || data.totalsubitem <= 1 && data.isquantitynoticed == false;
                    });
                    if (counterproducts.length == 0) {
                        _this.menuItems[12].matBadgeHidden = true;
                    }
                    else {
                        _this.menuItems[12].matBadgeHidden = false;
                    }
                    _this.menuItems[12].matBadge = counterproducts.length;
                }
            });
        });
    };
    SidebarComponent.prototype.productQuantitynotification = function () {
        var _this = this;
        var localStorageItem = JSON.parse(localStorage.getItem('user'));
        this.pouchService.getStaff(localStorageItem).then(function (item) {
            _this.pouchService.getProducts().then(function (products) {
                products = products.filter(function (data) { return data.store == item.department && data.branch == item.branch; });
                if (products.length != 0) {
                    products = products.filter(function (data) {
                        return data.unitstock <= 1 && data.isquantitynoticed == false || data.totalsubitem <= 1 && data.isquantitynoticed == false;
                    });
                    if (products.length == 0) {
                        _this.menuItems[12].matBadgeHidden = true;
                    }
                    else {
                        _this.menuItems[12].matBadgeHidden = false;
                    }
                    _this.menuItems[12].matBadge = products.length;
                }
            });
        });
    };
    SidebarComponent.prototype.isMobileMenu = function () {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };
    ;
    //My code
    SidebarComponent.prototype.navLogin = function () {
        this.router.navigate(['login']);
    };
    SidebarComponent.ctorParameters = function () { return [
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"] },
        { type: _providers_pouch_service__WEBPACK_IMPORTED_MODULE_2__["PouchService"] }
    ]; };
    SidebarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-sidebar',
            template: __importDefault(__webpack_require__(/*! raw-loader!./sidebar.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/sidebar/sidebar.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./sidebar.component.css */ "./src/app/components/sidebar/sidebar.component.css")).default]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _providers_pouch_service__WEBPACK_IMPORTED_MODULE_2__["PouchService"]])
    ], SidebarComponent);
    return SidebarComponent;
}());



/***/ }),

/***/ "./src/app/drugprompt/drugprompt.component.css":
/*!*****************************************************!*\
  !*** ./src/app/drugprompt/drugprompt.component.css ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RydWdwcm9tcHQvZHJ1Z3Byb21wdC5jb21wb25lbnQuY3NzIn0= */");

/***/ }),

/***/ "./src/app/drugprompt/drugprompt.component.ts":
/*!****************************************************!*\
  !*** ./src/app/drugprompt/drugprompt.component.ts ***!
  \****************************************************/
/*! exports provided: DrugpromptComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrugpromptComponent", function() { return DrugpromptComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};


var DrugpromptComponent = /** @class */ (function () {
    function DrugpromptComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    DrugpromptComponent.prototype.ngOnInit = function () {
    };
    DrugpromptComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    DrugpromptComponent.ctorParameters = function () { return [
        { type: _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"] },
        { type: undefined, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"], args: [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"],] }] }
    ]; };
    DrugpromptComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-drugprompt',
            template: __importDefault(__webpack_require__(/*! raw-loader!./drugprompt.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/drugprompt/drugprompt.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./drugprompt.component.css */ "./src/app/drugprompt/drugprompt.component.css")).default]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object])
    ], DrugpromptComponent);
    return DrugpromptComponent;
}());



/***/ }),

/***/ "./src/app/layouts/admin-layout/admin-layout.component.scss":
/*!******************************************************************!*\
  !*** ./src/app/layouts/admin-layout/admin-layout.component.scss ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2xheW91dHMvYWRtaW4tbGF5b3V0L2FkbWluLWxheW91dC5jb21wb25lbnQuc2NzcyJ9 */");

/***/ }),

/***/ "./src/app/layouts/admin-layout/admin-layout.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/layouts/admin-layout/admin-layout.component.ts ***!
  \****************************************************************/
/*! exports provided: AdminLayoutComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminLayoutComponent", function() { return AdminLayoutComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var rxjs_add_operator_filter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/add/operator/filter */ "./node_modules/rxjs-compat/_esm5/add/operator/filter.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var perfect_scrollbar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! perfect-scrollbar */ "./node_modules/perfect-scrollbar/dist/perfect-scrollbar.esm.js");
/* harmony import */ var _services_nav_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/nav.service */ "./src/app/services/nav.service.ts");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_6__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};







var AdminLayoutComponent = /** @class */ (function () {
    function AdminLayoutComponent(location, router, activateRoute, navservice) {
        this.location = location;
        this.router = router;
        this.activateRoute = activateRoute;
        this.navservice = navservice;
        this.yScrollStack = [];
    }
    AdminLayoutComponent.prototype.ngOnInit = function () {
        var _this = this;
        var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
        if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
            // if we are on windows OS we activate the perfectScrollbar function
            document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
        }
        else {
            document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
        }
        var elemMainPanel = document.querySelector('.main-panel');
        var elemSidebar = document.querySelector('.sidebar .sidebar-wrapper');
        this.location.subscribe(function (ev) {
            _this.lastPoppedUrl = ev.url;
        });
        this.router.events.subscribe(function (event) {
            if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__["NavigationStart"]) {
                if (event.url != _this.lastPoppedUrl)
                    _this.yScrollStack.push(window.scrollY);
            }
            else if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__["NavigationEnd"]) {
                if (event.url == _this.lastPoppedUrl) {
                    _this.lastPoppedUrl = undefined;
                    window.scrollTo(0, _this.yScrollStack.pop());
                }
                else
                    window.scrollTo(0, 0);
            }
        });
        this._router = this.router.events.filter(function (event) { return event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__["NavigationEnd"]; }).subscribe(function (event) {
            elemMainPanel.scrollTop = 0;
            elemSidebar.scrollTop = 0;
        });
        if (window.matchMedia("(min-width: 960px)").matches && !this.isMac()) {
            var ps = new perfect_scrollbar__WEBPACK_IMPORTED_MODULE_4__["default"](elemMainPanel);
            ps = new perfect_scrollbar__WEBPACK_IMPORTED_MODULE_4__["default"](elemSidebar);
        }
        var window_width = jquery__WEBPACK_IMPORTED_MODULE_6__(window).width();
        var $sidebar = jquery__WEBPACK_IMPORTED_MODULE_6__('.sidebar');
        var $sidebar_responsive = jquery__WEBPACK_IMPORTED_MODULE_6__('body > .navbar-collapse');
        var $sidebar_img_container = $sidebar.find('.sidebar-background');
        if (window_width > 767) {
            if (jquery__WEBPACK_IMPORTED_MODULE_6__('.fixed-plugin .dropdown').hasClass('show-dropdown')) {
                jquery__WEBPACK_IMPORTED_MODULE_6__('.fixed-plugin .dropdown').addClass('open');
            }
        }
        jquery__WEBPACK_IMPORTED_MODULE_6__('.fixed-plugin a').click(function (event) {
            // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
            if (jquery__WEBPACK_IMPORTED_MODULE_6__(this).hasClass('switch-trigger')) {
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
                else if (window.event) {
                    window.event.cancelBubble = true;
                }
            }
        });
        jquery__WEBPACK_IMPORTED_MODULE_6__('.fixed-plugin .badge').click(function () {
            var $full_page_background = jquery__WEBPACK_IMPORTED_MODULE_6__('.full-page-background');
            jquery__WEBPACK_IMPORTED_MODULE_6__(this).siblings().removeClass('active');
            jquery__WEBPACK_IMPORTED_MODULE_6__(this).addClass('active');
            var new_color = jquery__WEBPACK_IMPORTED_MODULE_6__(this).data('color');
            if ($sidebar.length !== 0) {
                $sidebar.attr('data-color', new_color);
            }
            if ($sidebar_responsive.length != 0) {
                $sidebar_responsive.attr('data-color', new_color);
            }
        });
        jquery__WEBPACK_IMPORTED_MODULE_6__('.fixed-plugin .img-holder').click(function () {
            var $full_page_background = jquery__WEBPACK_IMPORTED_MODULE_6__('.full-page-background');
            jquery__WEBPACK_IMPORTED_MODULE_6__(this).parent('li').siblings().removeClass('active');
            jquery__WEBPACK_IMPORTED_MODULE_6__(this).parent('li').addClass('active');
            var new_image = jquery__WEBPACK_IMPORTED_MODULE_6__(this).find("img").attr('src');
            if ($sidebar_img_container.length != 0) {
                $sidebar_img_container.fadeOut('fast', function () {
                    $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
                    $sidebar_img_container.fadeIn('fast');
                });
            }
            if ($full_page_background.length != 0) {
                $full_page_background.fadeOut('fast', function () {
                    $full_page_background.css('background-image', 'url("' + new_image + '")');
                    $full_page_background.fadeIn('fast');
                });
            }
            if ($sidebar_responsive.length != 0) {
                $sidebar_responsive.css('background-image', 'url("' + new_image + '")');
            }
        });
    };
    AdminLayoutComponent.prototype.ngAfterViewInit = function () {
        this.runOnRouteChange();
    };
    AdminLayoutComponent.prototype.isMaps = function (path) {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice(1);
        if (path == titlee) {
            return false;
        }
        else {
            return true;
        }
    };
    AdminLayoutComponent.prototype.runOnRouteChange = function () {
        if (window.matchMedia("(min-width: 960px)").matches && !this.isMac()) {
            var elemMainPanel = document.querySelector('.main-panel');
            var ps = new perfect_scrollbar__WEBPACK_IMPORTED_MODULE_4__["default"](elemMainPanel);
            ps.update();
        }
    };
    AdminLayoutComponent.prototype.isMac = function () {
        var bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    };
    AdminLayoutComponent.ctorParameters = function () { return [
        { type: _angular_common__WEBPACK_IMPORTED_MODULE_1__["Location"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"] },
        { type: _services_nav_service__WEBPACK_IMPORTED_MODULE_5__["NavService"] }
    ]; };
    AdminLayoutComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-admin-layout',
            template: __importDefault(__webpack_require__(/*! raw-loader!./admin-layout.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/layouts/admin-layout/admin-layout.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./admin-layout.component.scss */ "./src/app/layouts/admin-layout/admin-layout.component.scss")).default]
        }),
        __metadata("design:paramtypes", [_angular_common__WEBPACK_IMPORTED_MODULE_1__["Location"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"], _services_nav_service__WEBPACK_IMPORTED_MODULE_5__["NavService"]])
    ], AdminLayoutComponent);
    return AdminLayoutComponent;
}());



/***/ }),

/***/ "./src/app/services/nav.service.ts":
/*!*****************************************!*\
  !*** ./src/app/services/nav.service.ts ***!
  \*****************************************/
/*! exports provided: NavService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavService", function() { return NavService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};

var NavService = /** @class */ (function () {
    function NavService() {
        this.visible = true;
    }
    NavService.prototype.hide = function () {
        this.visible = false;
    };
    NavService.prototype.show = function () {
        this.visible = true;
    };
    NavService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], NavService);
    return NavService;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
var environment = {
    production: false
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_4__);
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};





if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"]);


/***/ }),

/***/ "./src/model/relational-schema.ts":
/*!****************************************!*\
  !*** ./src/model/relational-schema.ts ***!
  \****************************************/
/*! exports provided: Schema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Schema", function() { return Schema; });
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
/**
 * Schema defining the db relations
 */
var Schema = [
    {
        singular: 'staff',
        plural: 'staffs',
        relations: {
            department: {
                belongsTo: 'department'
            },
            expenses: {
                hasMany: {
                    type: 'expense',
                }
            }
        }
    },
    {
        singular: 'department',
        plural: 'departments',
        relations: {
            staffs: {
                hasMany: {
                    type: 'staff',
                    options: {
                        queryInverse: 'department'
                    }
                }
            },
        }
    },
    {
        singular: 'evacuate',
        plural: 'evacuates',
    },
    {
        singular: 'stock',
        plural: 'stocks',
    },
    {
        singular: 'departmentdispatch',
        plural: 'departmentdispatchs',
    },
    {
        singular: 'damagedproduct',
        plural: 'damagedproducts',
    },
    {
        singular: 'individualsale',
        plural: 'individualsales',
    },
    {
        singular: 'grossprofit',
        plural: 'grossprofits',
    },
    {
        singular: 'netprofit',
        plural: 'netprofits',
    },
    {
        singular: 'sale',
        plural: 'sales',
        relations: {
            patient: {
                belongsTo: 'patient'
            },
            counterproduct: {
                belongsTo: 'counterproduct'
            },
            products: {
                hasMany: {
                    type: 'product',
                    options: {
                        async: true
                    }
                },
            },
            services: {
                hasMany: {
                    type: 'service',
                    options: {
                        async: true
                    }
                },
            },
            renderservice: {
                belongsTo: 'renderservice'
            }
        }
    },
    {
        singular: 'expense',
        plural: 'expenses',
        relations: {
            staff: {
                belongsTo: 'staff'
            },
            vendor: {
                belongsTo: 'vendor'
            },
        }
    },
    {
        singular: 'product',
        plural: 'products',
        relations: {
            productcategory: {
                belongsTo: 'productcategory'
            },
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'bec_pharmproduct',
        plural: 'bec_pharmproducts',
        relations: {
            productcategory: {
                belongsTo: 'productcategory'
            },
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'gopdproduct',
        plural: 'gopdproducts',
        relations: {
            productcategory: {
                belongsTo: 'productcategory'
            },
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'labproduct',
        plural: 'labproducts',
        relations: {
            productcategory: {
                belongsTo: 'productcategory'
            },
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'counterproduct',
        plural: 'counterproducts',
        relations: {
            productcategory: {
                belongsTo: 'productcategory'
            },
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'radiologyproduct',
        plural: 'radiologyproducts',
        relations: {
            productcategory: {
                belongsTo: 'productcategory'
            },
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'theaterproduct',
        plural: 'theaterproducts',
        relations: {
            productcategory: {
                belongsTo: 'productcategory'
            },
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'productcategory',
        plural: 'productcategorys',
        relations: {
            products: {
                hasMany: {
                    type: 'product',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'service',
        plural: 'services',
        relations: {
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'renderservice',
        plural: 'renderservices',
        relations: {
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'patient',
        plural: 'patients',
        relations: {
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'vendor',
        plural: 'vendors',
        relations: {
            expenses: {
                hasMany: {
                    type: 'expense',
                    options: {
                        async: true
                    }
                },
            }
        }
    },
    {
        singular: 'dispatchedproduct',
        plural: 'dispatchedproducts',
        relations: {
            sales: {
                hasMany: {
                    type: 'sale',
                    options: {
                        async: true
                    }
                },
            }
        }
    }
];


/***/ }),

/***/ "./src/providers/pouch-service.ts":
/*!****************************************!*\
  !*** ./src/providers/pouch-service.ts ***!
  \****************************************/
/*! exports provided: PouchService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PouchService", function() { return PouchService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var pouchdb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pouchdb */ "./node_modules/pouchdb/lib/index-browser.es.js");
/* harmony import */ var rxjs_add_operator_map__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/add/operator/map */ "./node_modules/rxjs-compat/_esm5/add/operator/map.js");
/* harmony import */ var _model_relational_schema__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../model/relational-schema */ "./src/model/relational-schema.ts");
/* harmony import */ var ngx_spinner__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-spinner */ "./node_modules/ngx-spinner/fesm5/ngx-spinner.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
/**
 * Service provider for PouchDB
 * @name pouch-service.ts
 * @author Agbonaye Osaru - osaru@sarutech.com
 */


pouchdb__WEBPACK_IMPORTED_MODULE_1__["default"].plugin(__webpack_require__(/*! pouchdb-find */ "../node_modules/pouchdb-find/lib/index.js"));
pouchdb__WEBPACK_IMPORTED_MODULE_1__["default"].plugin(__webpack_require__(/*! relational-pouch */ "./node_modules/relational-pouch/lib/index.js"));
pouchdb__WEBPACK_IMPORTED_MODULE_1__["default"].plugin(__webpack_require__(/*! pouchdb-upsert */ "./node_modules/pouchdb-upsert/index.js"));
__webpack_require__(/*! pouchdb-all-dbs */ "./node_modules/pouchdb-all-dbs/lib/index.js")(pouchdb__WEBPACK_IMPORTED_MODULE_1__["default"]);
//PouchDB.plugin(require('pouchdb-adapter-websql'));



var PouchService = /** @class */ (function () {
    /**
    * Constructor
    */
    function PouchService(spinner) {
        this.spinner = spinner;
        this.paginationId = null;
        this.limitRange = 21;
        console.log('constructor');
    }
    /**
    * Initialize PouchDB database
    */
    PouchService.prototype.initDB = function () {
        //
        this.db = new pouchdb__WEBPACK_IMPORTED_MODULE_1__["default"]('iuth', { revs_limit: 1, auto_compaction: true });
        this.db.setSchema(_model_relational_schema__WEBPACK_IMPORTED_MODULE_3__["Schema"]);
        this.enableSyncing();
        this.checkRemoteSync();
        this.db.info().then(function (info) {
            console.log(info);
        });
        this.db.createIndex({
            index: {
                fields: ['data.branch', 'data.store', 'data.sourcedepartment', 'data.department', 'data.departmentname',
                    'data.isoncredit', 'data.isowing', 'data.iscomplete', 'data.isnoticed', 'data.isquantitynoticed', 'data.year',
                    'data.notification', 'data.expensetype', 'data.isexpired', 'data.patientid', 'data.vendorid', 'data.totalsubitem', 'data.productname']
            }
        });
    };
    PouchService.prototype.enableSyncing = function () {
        var options = {
            Auth: {
                username: 'iuth',
                password: 'iuth'
            },
            live: true,
            retry: true,
            batch_size: 10
        };
        /* this.remote = 'http://127.0.0.1:5984/iuth'; */
        this.remote = 'http://169.254.232.218:5984/iuth';
        this.db.sync(this.remote, options).on('change', function (change) {
            console.log('check change', change);
            console.log('changed');
        }).on('complete', function (complete) {
            console.log('complete fetch', complete);
            console.log('complete');
        }).on('error', function (err) {
            console.log('offline');
        });
    };
    PouchService.prototype.checkRemoteSync = function () {
        this.remote = 'http://169.254.232.218:5984/iuth';
        /* if (this.finishSync == undefined) {
            this.spinner.show(); */
        return this.db.sync(this.remote).on('complete', function (info) {
            this.finishSync = info;
            console.log(this.finishSync.pull.status);
            /* if (this.finishSync.pull.status == 'complete') {
                //this.spinner.hide();
            } */
            console.log('complete', info);
        }).on('error', function (err) {
            console.log('offline');
            return err;
            //this.spinner.hide();
        });
        //}
    };
    /***********
      * staff
      **********/
    /**
     * Save a staff
     * @param {staff} staff
     *
     * @return Promise<staff>
     */
    PouchService.prototype.saveStaff = function (staff) {
        staff.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('staff', staff).then(function (data) {
            if (data && data.staffs && data.staffs[0]) {
                return data.staffs[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /*  getPaginatedStaffs(): Promise<Array<Staff>> {
 
         var pageSize = 11;
         var options = { startkey: this.paginationId, limit: pageSize };
         console.log(this.paginationId);
         return this.db.rel.find('staff', options).then((data: any) => {
             //options['limit'] = 11;
             //data.staffs = data.staffs.filter(data => data.branch == 'IUTH(Okada)');
               if (data.staffs.length != 11) {
                  options.limit = pageSize + 5;
              }
             let staffs = data.staffs ? data.staffs : [];
             //staffs = staffs.filter(data => data.branch == 'IUTH(Okada)');
               let sortBy = 'DESC';
  
              switch (sortBy) {
                  case 'ASC':
                      staffs.sort((a: any, b: any) => {
                          return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                      })
                      break;
                  case 'DESC':
                      staffs.sort((a: any, b: any) => {
                          return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                      });
                      break;
                  default:
                      break;
              }
             console.log(staffs);
             //if (data.staffs.length != 11) {
             return staffs;
             //}
         }).catch((err: any) => {
             console.log(err);
         });
     } */
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByBranchRemoveItem = function (type, id, year, expired, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.year': { $eq: year }, 'data.totalsubitem': { $ne: productquantity }, 'data.isexpired': { $eq: expired }, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    PouchService.prototype.paginateByCentralStoreRemoveItem = function (type, id, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: 'Central Store' }, 'data.totalsubitem': { $ne: productquantity }, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    PouchService.prototype.paginateByStoreRemoveItem = function (type, id, store, isnoticed, isquantitynoticed, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: store }, 'data.totalsubitem': { $ne: productquantity }, 'data.isnoticed': { $eq: isnoticed }, 'data.isquantitynoticed': { $eq: isquantitynoticed }, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    PouchService.prototype.paginateByDispatchedProductRemoveItem = function (type, id) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: 'Central Store' }, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    PouchService.prototype.paginateByGeneralDispatchedProductRemoveItem = function (type, id, sourcedepartment) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: sourcedepartment }, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    PouchService.prototype.paginateByDepartmentRemoveItem = function (type, id, department, isnoticed, isquantitynoticed, year, expired, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department }, 'data.isnoticed': { $eq: isnoticed }, 'data.isquantitynoticed': { $eq: isquantitynoticed }, 'data.totalsubitem': { $ne: productquantity }, 'data.year': { $eq: year }, 'data.isexpired': { $eq: expired }, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    PouchService.prototype.paginateByExpenseRemoveItem = function (type, id, department, oncredit, owing, complete, expensetype, vendorid) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.departmentname': { $eq: department }, 'data.isoncredit': { $eq: oncredit }, 'data.isowing': { $eq: owing }, 'data.iscomplete': { $eq: complete }, 'data.expensetype': { $eq: expensetype }, 'data.vendorid': { $eq: vendorid }, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    PouchService.prototype.paginateBySaleRemoveItem = function (type, id, department, oncredit, owing, complete, patientid) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department }, $or: [{ 'data.isoncredit': oncredit }, { 'data.isowing': owing }], 'data.iscomplete': { $eq: complete }, 'data.patientid': { $eq: patientid }, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByBranch2 = function (type, id, year, expired, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.year': { $eq: year }, 'data.totalsubitem': { $ne: productquantity }, 'data.isexpired': { $eq: expired }, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                console.log(res);
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByNotification = function (type, id, year) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.notification': { $all: ['Pharmacy Store'] }, _id: { $eq: type + '_2_' + staff.id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByCentralStore = function (type, id, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: 'Central Store' }, 'data.totalsubitem': { $ne: productquantity }, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByStore = function (type, id, store, isnoticed, isquantitynoticed, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: store }, 'data.totalsubitem': { $ne: productquantity }, 'data.isnoticed': { $eq: isnoticed }, 'data.isquantitynoticed': { $eq: isquantitynoticed }, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByDispatchedProduct = function (type, id) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: 'Central Store' }, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByGeneralDispatchedProduct = function (type, id, sourcedepartment) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: sourcedepartment }, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByDepartment2 = function (type, id, department, isnoticed, isquantitynoticed, year, expired, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department }, 'data.isnoticed': { $eq: isnoticed }, 'data.isquantitynoticed': { $eq: isquantitynoticed }, 'data.year': { $eq: year }, 'data.isexpired': { $eq: expired }, 'data.totalsubitem': { $ne: productquantity }, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    //Paginate by inputstring
    PouchService.prototype.paginateByInputString = function (type, id, department, isnoticed, isquantitynoticed, year, expired, productquantity, inputstring) {
        var _this = this;
        var localStorageItem;
        console.log(inputstring);
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department }, 'data.isnoticed': { $eq: isnoticed }, 'data.isquantitynoticed': { $eq: isquantitynoticed }, 'data.year': { $eq: year }, 'data.isexpired': { $eq: expired }, 'data.totalsubitem': { $ne: productquantity }, 'data.productname': { $lte: inputstring }, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByExpense = function (type, id, department, oncredit, owing, complete, expensetype, vendorid) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.departmentname': { $eq: department }, 'data.isoncredit': { $eq: oncredit }, 'data.isowing': { $eq: owing }, 'data.iscomplete': { $eq: complete }, 'data.expensetype': { $eq: expensetype }, 'data.vendorid': { $eq: vendorid }, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateBySale = function (type, id, department, oncredit, owing, complete, patientid) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department }, $or: [{ 'data.isoncredit': oncredit }, { 'data.isowing': owing }], 'data.iscomplete': { $eq: complete }, 'data.patientid': { $eq: patientid }, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    console.log(paginatedtypes);
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByBranchPrev2 = function (type, id, year, expired, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.year': { $eq: year }, 'data.totalsubitem': { $ne: productquantity }, 'data.isexpired': { $eq: expired }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByCentralStorePrev = function (type, id, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: 'Central Store' }, 'data.totalsubitem': { $ne: productquantity }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByStorePrev = function (type, id, store, isnoticed, isquantitynoticed, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: store }, 'data.totalsubitem': { $ne: productquantity }, 'data.isnoticed': { $eq: isnoticed }, 'data.isquantitynoticed': { $eq: isquantitynoticed }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByDispatchedProductPrev = function (type, id) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: 'Central Store' }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByGeneralDispatchedProductPrev = function (type, id, sourcedepartment) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: sourcedepartment }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByDepartmentPrev2 = function (type, id, department, isnoticed, isquantitynoticed, year, expired, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department }, 'data.isnoticed': { $eq: isnoticed }, 'data.isquantitynoticed': { $eq: isquantitynoticed }, 'data.totalsubitem': { $ne: productquantity }, 'data.year': { $eq: year }, 'data.isexpired': { $eq: expired }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateByExpensePrev = function (type, id, department, oncredit, owing, complete, expensetype, vendorid) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.departmentname': { $eq: department }, 'data.isoncredit': { $eq: oncredit }, 'data.isowing': { $eq: owing }, 'data.iscomplete': { $eq: complete }, 'data.expensetype': { $eq: expensetype }, 'data.vendorid': { $eq: vendorid }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Faster choice than using the query method; */
    PouchService.prototype.paginateBySalePrev = function (type, id, department, oncredit, owing, complete, patientid) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department }, $or: [{ 'data.isoncredit': oncredit }, { 'data.isowing': owing }], 'data.iscomplete': { $eq: complete }, 'data.patientid': { $eq: patientid }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Go to begin of page; */
    PouchService.prototype.paginateByBranchStart = function (type, id, year, expired, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.year': { $eq: year }, 'data.totalsubitem': { $ne: productquantity }, 'data.isexpired': { $eq: expired }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Go to begin of page; */
    PouchService.prototype.paginateByCentralStoreStart = function (type, id, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: 'Central Store' }, 'data.totalsubitem': { $ne: productquantity }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Go to begin of page; */
    PouchService.prototype.paginateByStoreStart = function (type, id, store, isnoticed, isquantitynoticed, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: store }, 'data.totalsubitem': { $ne: productquantity }, 'data.isnoticed': { $eq: isnoticed }, 'data.isquantitynoticed': { $eq: isquantitynoticed }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Go to begin of page; */
    PouchService.prototype.paginateByDispatchedProductStart = function (type, id) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: 'Central Store' }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Go to begin of page; */
    PouchService.prototype.paginateByGeneralDispatchedProductStart = function (type, id, sourcedepartment) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: sourcedepartment }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Go to begin of page; */
    PouchService.prototype.paginateByDepartmentStart = function (type, id, department, isnoticed, isquantitynoticed, year, expired, productquantity) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department }, 'data.isnoticed': { $eq: isnoticed }, 'data.isquantitynoticed': { $eq: isquantitynoticed }, 'data.totalsubitem': { $ne: productquantity }, 'data.year': { $eq: year }, 'data.isexpired': { $eq: expired }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Go to begin of page; */
    PouchService.prototype.paginateByExpenseStart = function (type, id, department, oncredit, owing, complete, expensetype, vendorid) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.departmentname': { $eq: department }, 'data.isoncredit': { $eq: oncredit }, 'data.isowing': { $eq: owing }, 'data.iscomplete': { $eq: complete }, 'data.expensetype': { $eq: expensetype }, 'data.vendorid': { $eq: vendorid }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Go to begin of page; */
    PouchService.prototype.paginateBySaleStart = function (type, id, department, oncredit, owing, complete, patientid) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department }, $or: [{ 'data.isoncredit': oncredit }, { 'data.isowing': owing }], 'data.iscomplete': { $eq: complete }, 'data.patientid': { $eq: patientid }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: _this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(function (res) {
                return _this.db.rel.parseRelDocs(type, res.docs).then(function (result) {
                    var paginatedtypes = result[type + "s"] ? result[type + "s"] : [];
                    return paginatedtypes;
                }).catch(function (err) {
                    console.log(err);
                });
            });
        });
    };
    /* Query method, it is expensive to use (memory wise). Allows for more complex operations */
    /*  paginateByBranch(type?, id?): Promise<any> {
         var localStorageItem;
         localStorageItem = JSON.parse(localStorage.getItem('user'));
         return this.getStaff(localStorageItem).then(staff => {
             return this.db.query(function (doc, emit) {
                 //console.log(doc);
                 var firstIndex = doc._id.indexOf('_');
                 var docType = doc._id.substring(0, firstIndex);
 
                 if (docType === type) {
                     if (doc.data.branch === staff.branch) {
                         emit(doc._id);
                     }
                 }
             }, {
                 startkey: type + '_2_' + id, limit: this.limitRange, include_docs: true
             }).then(function (result) {
 
                 var docs = [];
                 var data = [];
                 result.rows.map(row => {
                     docs.push(row.doc);
                     var index = row.doc._id.lastIndexOf('_');
                     var id = row.doc._id.substring(index + 1);
 
                     row.doc.data['id'] = id;
                     row.doc.data['rev'] = row.doc._rev;
                 });
 
                 docs.map(doc => {
                     data.push(doc.data);
                 })
                 return data
                 // found docs with name === 'foo'
             }).catch(function (err) {
                 console.log(err);
                 // handle any errors
             });
         });
     } */
    /*  paginateByBranch3(type?, id?): Promise<any> {
         var localStorageItem;
         localStorageItem = JSON.parse(localStorage.getItem('user'));
         return this.getStaff(localStorageItem).then(staff => {
             return this.db.allDocs({ startkey: type, include_docs: true }).then(response => {
                 console.log(response);
             }).catch((err) => {
                 console.log(err);
             });
         });
     } */
    /* Query method, it is expensive to use (memory wise). Allows for more complex operations */
    /* paginateByBranchPrev(type?, id?): Promise<any> {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.query(function (doc, emit) {
                //console.log(doc);
                var firstIndex = doc._id.indexOf('_');
                var docType = doc._id.substring(0, firstIndex);
                if (docType === type) {
                    if (doc.data.branch === staff.branch) {
                        emit(doc._id);
                    }
                }
            }, {
                startkey: type + '_2_' + id, limit: this.limitRange, descending: true, include_docs: true
            }).then(function (result) {

                var docs = [];
                var data = [];
                result.rows.map(row => {
                    docs.push(row.doc);
                    var index = row.doc._id.lastIndexOf('_');
                    var id = row.doc._id.substring(index + 1);

                    row.doc.data['id'] = id;
                    row.doc.data['rev'] = row.doc._rev;
                });
                docs.map(doc => {
                    data.push(doc.data);
                })
                return data
                // found docs with name === 'foo'
            }).catch(function (err) {
                console.log(err);
                // handle any errors
            });
        });
    } */
    //Paginate by Department;
    PouchService.prototype.paginateByDepartment = function (type, id) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.query(function (doc, emit) {
                //console.log(doc);
                var firstIndex = doc._id.indexOf('_');
                var docType = doc._id.substring(0, firstIndex);
                if (docType === type) {
                    if (doc.data.branch === staff.branch) {
                        if (doc.data.department === staff.department) {
                            emit(doc._id);
                        }
                    }
                }
            }, {
                startkey: type + '_2_' + id, limit: _this.limitRange, include_docs: true
            }).then(function (result) {
                var docs = [];
                var data = [];
                result.rows.map(function (row) {
                    docs.push(row.doc);
                    var index = row.doc._id.lastIndexOf('_');
                    var id = row.doc._id.substring(index + 1);
                    row.doc.data['id'] = id;
                    row.doc.data['rev'] = row.doc._rev;
                });
                docs.map(function (doc) {
                    data.push(doc.data);
                });
                return data;
                // found docs with name === 'foo'
            }).catch(function (err) {
                console.log(err);
                // handle any errors
            });
        });
    };
    PouchService.prototype.paginateByDepartmentPrev = function (type, id) {
        var _this = this;
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return _this.db.query(function (doc, emit) {
                //console.log(doc);
                var firstIndex = doc._id.indexOf('_');
                var docType = doc._id.substring(0, firstIndex);
                if (docType === type) {
                    if (doc.data.branch === staff.branch) {
                        if (doc.data.department === staff.department) {
                            emit(doc._id);
                        }
                    }
                }
            }, {
                startkey: type + '_2_' + id, limit: _this.limitRange, descending: true, include_docs: true
            }).then(function (result) {
                var docs = [];
                var data = [];
                result.rows.map(function (row) {
                    docs.push(row.doc);
                    var index = row.doc._id.lastIndexOf('_');
                    var id = row.doc._id.substring(index + 1);
                    row.doc.data['id'] = id;
                    row.doc.data['rev'] = row.doc._rev;
                });
                docs.map(function (doc) {
                    data.push(doc.data);
                });
                return data;
                // found docs with name === 'foo'
            }).catch(function (err) {
                console.log(err);
                // handle any errors
            });
        });
    };
    /**
    * Return all the staffs
    *
    * @return Promise<Array<Staff>>
    */
    PouchService.prototype.getStaffs = function () {
        return this.db.rel.find('staff').then(function (data) {
            var staffs = data.staffs ? data.staffs : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    staffs.sort(function (a, b) {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    });
                    break;
                case 'DESC':
                    staffs.sort(function (a, b) {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return staffs;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Read a Staff
    * @param {staff} staff
    *
    * @return Promise<Staff>
    */
    PouchService.prototype.getStaff = function (id) {
        return this.db.rel.find('staff', id).then(function (data) {
            return data && data.staffs ? data.staffs[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a Staff
    * @param {staff} staff
    *
    * @return Promise<staff>
    */
    PouchService.prototype.updateStaff = function (staff) {
        return this.db.rel.save('staff', staff).then(function (data) {
            if (data && data.staffs && data.staffs[0]) {
                return data.staffs[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Remove a Staff
    * @param {staff} staff
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deleteStaff = function (staff) {
        return this.db.rel.del('staff', staff).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Department
    **********/
    /**
     * Save a department
     * @param {department} department
     *
     * @return Promise<department>
     */
    PouchService.prototype.saveDepartment = function (department) {
        //department.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('department', department).then(function (data) {
            if (data && data.departments && data.departments[0]) {
                return data.departments[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Return all the departments
     *
     * @return Promise<Array<Department>>
     */
    PouchService.prototype.getDepartments = function () {
        return this.db.rel.find('department').then(function (data) {
            var departments = data.departments ? data.departments : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    departments.sort(function (a, b) {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    });
                    break;
                case 'DESC':
                    departments.sort(function (a, b) {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return departments;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Read a Department
     * @param {department} department
     *
     * @return Promise<Department>
     */
    PouchService.prototype.getDepartment = function (id) {
        return this.db.rel.find('department', id).then(function (data) {
            return data && data.departments ? data.departments[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a Department
    * @param {department} department
    *
    * @return Promise<department>
    */
    PouchService.prototype.updateDepartment = function (department) {
        return this.db.rel.save('department', department).then(function (data) {
            if (data && data.departments && data.departments[0]) {
                return data.departments[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Remove a Department
    * @param {department} department
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deleteDepartment = function (department) {
        return this.db.rel.del('department', department).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    *Sale
    **********/
    /**
     * Save a sale
     * @param {sale} sale
     *
     * @return Promise<sale>
     */
    PouchService.prototype.saveSale = function (sale) {
        sale.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('sale', sale).then(function (data) {
            if (data && data.sales && data.sales[0]) {
                return data.sales[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Return all the sales
    *
    * @return Promise<Array<Sales>>
    */
    PouchService.prototype.getSales = function () {
        return this.db.rel.find('sale').then(function (data) {
            var sales = data.sales ? data.sales : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    sales.sort(function (a, b) {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    });
                    break;
                case 'DESC':
                    sales.sort(function (a, b) {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    });
                    break;
                default:
                    break;
            }
            return sales;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Read a Sale
    * @param {sale} sale
    *
    * @return Promise<Sale>
    */
    PouchService.prototype.getSale = function (id) {
        return this.db.rel.find('sale', id).then(function (data) {
            return data && data.sales ? data.sales[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a Sale
    * @param {sale} sale
    *
    * @return Promise<sale>
    */
    PouchService.prototype.updateSale = function (sale) {
        return this.db.rel.save('sale', sale).then(function (data) {
            if (data && data.sales && data.sales[0]) {
                return data.sales[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Remove a Sale
     * @param {sale} sale
     *
     * @return Promise<boolean>
     */
    PouchService.prototype.deleteSale = function (sale) {
        return this.db.rel.del('sale', sale).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Expense
    **********/
    /**
     * Save a expense
     * @param {expense} expense
     *
     * @return Promise<expense>
     */
    PouchService.prototype.saveExpense = function (expense) {
        expense.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('expense', expense).then(function (data) {
            if (data && data.expenses && data.expenses[0]) {
                return data.expenses[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Return all the expenses
    *
    * @return Promise<Array<Expenses>>
    */
    PouchService.prototype.getExpenses = function () {
        return this.db.rel.find('expense').then(function (data) {
            var expenses = data.expenses ? data.expenses : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    expenses.sort(function (a, b) {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    });
                    break;
                case 'DESC':
                    expenses.sort(function (a, b) {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    });
                    break;
                default:
                    break;
            }
            return expenses;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Read a Expense
    * @param {expense} expense
    *
    * @return Promise<Expenses>
    */
    PouchService.prototype.getExpense = function (id) {
        return this.db.rel.find('expense', id).then(function (data) {
            return data && data.expenses ? data.expenses[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a Expense
    * @param {expense} expense
    *
    * @return Promise<Expenses>
    */
    PouchService.prototype.updateExpense = function (expense) {
        return this.db.rel.save('expense', expense).then(function (data) {
            if (data && data.expenses && data.expenses[0]) {
                return data.expenses[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Remove a Expense
    * @param {expense} expense
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deleteExpense = function (expense) {
        return this.db.rel.del('expense', expense).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Product
    **********/
    /**
     * Save a Product
     * @param {product} product
     *
     * @return Promise<product>
     */
    PouchService.prototype.saveProduct = function (product) {
        product.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('product', product).then(function (data) {
            if (data && data.products && data.products[0]) {
                return data.products[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    //Save Product Image
    PouchService.prototype.saveImage = function (blob, product) {
        return this.db.rel.putAttachment('product', { id: product.id, rev: '' }, 'file', blob, 'image/png').then(function (result) {
        });
    };
    //Get Product Attachments
    PouchService.prototype.getImage = function (id) {
        return this.db.rel.getAttachment('product', id, 'file').then(function (blob) {
            return blob;
        });
    };
    /**
    * Return all the products
    *
    * @return Promise<Array<Products>>
    */
    PouchService.prototype.getProducts = function () {
        return this.db.rel.find('product').then(function (data) {
            var products = data.products ? data.products : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    products.sort(function (a, b) {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.datesupplied).getTime() - new Date(b.datesupplied).getTime();
                    });
                    break;
                case 'DESC':
                    products.sort(function (a, b) {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.datesupplied).getTime() - new Date(a.datesupplied).getTime();
                    });
                    break;
                default:
                    break;
            }
            return products;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Read a Product
     * @param {product} product
     *
     * @return Promise<Products>
     */
    PouchService.prototype.getProduct = function (id) {
        return this.db.rel.find('product', id).then(function (data) {
            return data && data.products ? data.products[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a Product
    * @param {product} product
    *
    * @return Promise<Products>
    */
    PouchService.prototype.updateProduct = function (product) {
        return this.db.rel.save('product', product).then(function (data) {
            if (data && data.products && data.products[0]) {
                return data.products[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
            if (err.name === 'conflict') {
                // conflict!
                //this.upsertProduct(this.globalProduct);
            }
            else {
                // some other error
                console.log('Some other errors');
            }
        });
    };
    //use in case of conflicts in documents
    PouchService.prototype.upsertProduct = function (product) {
        console.log(product);
        return this.db.upsert(product.id, function (doc) {
            console.log(product);
            return product;
        }).then(function (res) {
            console.log(res);
            // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
        }).catch(function (err) {
            // error
            console.log(err);
        });
    };
    /**
    * Remove a Product
    * @param {product} product
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deleteProduct = function (product) {
        return this.db.rel.del('product', product).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Product
    **********/
    /**
     * Save a Dispatched Product
     * @param {dispatchedproduct} dispatchedproduct
     *
     * @return Promise<dispatchedproduct>
     */
    PouchService.prototype.saveDispatchedProduct = function (dispatchedproduct) {
        dispatchedproduct.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('dispatchedproduct', dispatchedproduct).then(function (data) {
            if (data && data.dispatchedproducts && data.dispatchedproducts[0]) {
                console.log(data.dispatchedproducts[0]);
                return data.dispatchedproducts[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Return all the dispatchedproducts
    *
    * @return Promise<Array<DispatchedProducts>>
    */
    PouchService.prototype.getDispatchedProducts = function () {
        return this.db.rel.find('dispatchedproduct').then(function (data) {
            var dispatchedproducts = data.dispatchedproducts ? data.dispatchedproducts : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    dispatchedproducts.sort(function (a, b) {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.datedispatched).getTime() - new Date(b.datedispatched).getTime();
                    });
                    break;
                case 'DESC':
                    dispatchedproducts.sort(function (a, b) {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.datedispatched).getTime() - new Date(a.datedispatched).getTime();
                    });
                    break;
                default:
                    break;
            }
            return dispatchedproducts;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Read a DispatchedProduct
     * @param {dispatchedproduct} dispatchedproduct
     *
     * @return Promise<DispatchedProducts>
     */
    PouchService.prototype.getDispatchedProduct = function (id) {
        return this.db.rel.find('dispatchedproduct', id).then(function (data) {
            return data && data.dispatchedproducts ? data.dispatchedproducts[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a DispatchedProduct
    * @param {dispatchedproduct} dispatchedproduct
    *
    * @return Promise<DispatchedProducts>
    */
    PouchService.prototype.updateDispatchedProduct = function (dispatchedproduct) {
        return this.db.rel.save('dispatchedproduct', dispatchedproduct).then(function (data) {
            if (data && data.dispatchedproducts && data.dispatchedproducts[0]) {
                return data.products[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Remove a DispatchedProduct
    * @param {dispatchedproduct} dispatchedproduct
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deleteDispatchedProduct = function (dispatchedproduct) {
        return this.db.rel.del('dispatchedproduct', dispatchedproduct).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
     * BEC_pharmproduct
     **********/
    /**
     * Save a bec_pharmproduct
     * @param {bec_pharmproduct} bec_pharmproduct
     *
     * @return Promise<bec_pharmproduct>
     */
    PouchService.prototype.saveBec_pharmproduct = function (bec_pharmproduct) {
        bec_pharmproduct.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('bec_pharmproduct', bec_pharmproduct).then(function (data) {
            if (data && data.bec_pharmproducts && data.bec_pharmproducts[0]) {
                return data.bec_pharmproducts[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Return all the bec_pharmproducts
    *
    * @return Promise<Array<BEC_PharmProducts>>
    */
    PouchService.prototype.getBec_pharmproducts = function () {
        return this.db.rel.find('bec_pharmproduct').then(function (data) {
            var bec_pharmproducts = data.bec_pharmproducts ? data.bec_pharmproducts : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    bec_pharmproducts.sort(function (a, b) {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    });
                    break;
                case 'DESC':
                    bec_pharmproducts.sort(function (a, b) {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return bec_pharmproducts;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Read a Bec_pharmproduct
     * @param {bec_pharmproduct} bec_pharmproduct
     *
     * @return Promise<BEC_PharmProducts>
     */
    PouchService.prototype.getBec_pharmproduct = function (id) {
        return this.db.rel.find('bec_pharmproduct', id).then(function (data) {
            return data && data.bec_pharmproducts ? data.bec_pharmproducts[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a Bec_pharmproduct
    * @param {bec_pharmproduct} bec_pharmproduct
    *
    * @return Promise<Bec_pharmproducts>
    */
    PouchService.prototype.updateBec_pharmproduct = function (bec_pharmproduct) {
        return this.db.rel.save('bec_pharmproduct', bec_pharmproduct).then(function (data) {
            if (data && data.bec_pharmproducts && data.bec_pharmproducts[0]) {
                return data.bec_pharmproducts[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Remove a Bec_pharmproduct
     * @param {bec_pharmproduct} bec_pharmproduct
     *
     * @return Promise<boolean>
     */
    PouchService.prototype.deleteBec_pharmproduct = function (bec_pharmproduct) {
        return this.db.rel.del('bec_pharmproduct', bec_pharmproduct).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Gopdproduct
    **********/
    /**
     * Save a Gopdproduct
     * @param {gopdproduct} gopdproduct
     *
     * @return Promise<gopdproduct>
     */
    PouchService.prototype.saveGopdproduct = function (gopdproduct) {
        gopdproduct.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('gopdproduct', gopdproduct).then(function (data) {
            if (data && data.gopdproducts && data.gopdproducts[0]) {
                return data.gopdproducts[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Return all the gopdproducts
     *
     * @return Promise<Array<GOPDProducts>>
     */
    PouchService.prototype.getGopdproducts = function () {
        return this.db.rel.find('gopdproduct').then(function (data) {
            var gopdproducts = data.gopdproducts ? data.gopdproducts : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    gopdproducts.sort(function (a, b) {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    });
                    break;
                case 'DESC':
                    gopdproducts.sort(function (a, b) {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return gopdproducts;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Read a gopdproduct
     * @param {gopdproduct} gopdproduct
     *
     * @return Promise<GOPDProducts>
     */
    PouchService.prototype.getGopdproduct = function (id) {
        return this.db.rel.find('gopdproduct', id).then(function (data) {
            return data && data.gopdproducts ? data.gopdproducts[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a Gopdproduct
    * @param {gopdproduct} gopdproduct
    *
    * @return Promise<GOPDProducts>
    */
    PouchService.prototype.updateGopdproduct = function (gopdproduct) {
        return this.db.rel.save('gopdproduct', gopdproduct).then(function (data) {
            if (data && data.gopdproducts && data.gopdproducts[0]) {
                return data.gopdproducts[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Remove a Gopdproduct
     * @param {gopdproduct} gopdproduct
     *
     * @return Promise<boolean>
     */
    PouchService.prototype.deleteGopdproduct = function (gopdproduct) {
        return this.db.rel.del('gopdproduct', gopdproduct).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Labproduct
    **********/
    /**
     * Save a labproduct
     * @param {labproduct} labproduct
     *
     * @return Promise<LabProducts>
     */
    PouchService.prototype.saveLabproduct = function (labproduct) {
        labproduct.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('labproduct', labproduct).then(function (data) {
            if (data && data.labproducts && data.labproducts[0]) {
                return data.labproducts[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Return all the labproducts
     *
     * @return Promise<Array<LabProducts>>
     */
    PouchService.prototype.getLabproducts = function () {
        return this.db.rel.find('labproduct').then(function (data) {
            var labproducts = data.labproducts ? data.labproducts : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    labproducts.sort(function (a, b) {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    });
                    break;
                case 'DESC':
                    labproducts.sort(function (a, b) {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return labproducts;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Read a labproduct
    * @param {labproduct} labproduct
    *
    * @return Promise<LabProducts>
    */
    PouchService.prototype.getLabproduct = function (id) {
        return this.db.rel.find('labproduct', id).then(function (data) {
            return data && data.labproducts ? data.labproducts[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a LabProduct
    * @param {labproduct} labproduct
    *
    * @return Promise<LabProducts>
    */
    PouchService.prototype.updateLabproduct = function (labproduct) {
        return this.db.rel.save('labproduct', labproduct).then(function (data) {
            if (data && data.labproducts && data.labproducts[0]) {
                return data.labproducts[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Remove a LabProduct
     * @param {labproduct} labproduct
     *
     * @return Promise<boolean>
     */
    PouchService.prototype.deleteLabproduct = function (labproduct) {
        return this.db.rel.del('labproduct', labproduct).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * CounterProduct
    **********/
    /**
     * Save a counterproduct
     * @param {counterproduct} counterproduct
     *
     * @return Promise<CounterProduct>
     */
    PouchService.prototype.saveCounterProduct = function (counterproduct) {
        counterproduct.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('counterproduct', counterproduct).then(function (data) {
            if (data && data.counterproducts && data.counterproducts[0]) {
                return data.counterproducts[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Return all the CounterProducts
     *
     * @return Promise<Array<CounterProducts>>
     */
    PouchService.prototype.getCounterProducts = function () {
        return this.db.rel.find('counterproduct').then(function (data) {
            var counterproducts = data.counterproducts ? data.counterproducts : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    counterproducts.sort(function (a, b) {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.datesupplied).getTime() - new Date(b.datesupplied).getTime();
                    });
                    break;
                case 'DESC':
                    counterproducts.sort(function (a, b) {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.datesupplied).getTime() - new Date(a.datesupplied).getTime();
                    });
                    break;
                default:
                    break;
            }
            return counterproducts;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Read a CounterProduct
     * @param {counterproduct} counterproduct
     *
     * @return Promise<CounterProducts>
     */
    PouchService.prototype.getCounterProduct = function (id) {
        return this.db.rel.find('counterproduct', id).then(function (data) {
            return data && data.counterproducts ? data.counterproducts[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a counterproduct
    * @param {counterproduct} counterproduct
    *
    * @return Promise<CounterProducts>
    */
    PouchService.prototype.updateCounterProduct = function (counterproduct) {
        return this.db.rel.save('counterproduct', counterproduct).then(function (data) {
            if (data && data.counterproducts && data.counterproducts[0]) {
                return data.counterproducts[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Remove a CounterProduct
     * @param {counterproduct} counterproduct
     *
     * @return Promise<boolean>
     */
    PouchService.prototype.deleteCounterProduct = function (counterproduct) {
        return this.db.rel.del('counterproduct', counterproduct).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Radiologyproduct
    **********/
    /**
     * Save a radiologyproduct
     * @param {radiologyproduct} radiologyproduct
     *
     * @return Promise<RadiologyProducts>
     */
    PouchService.prototype.saveRadiologyproduct = function (radiologyproduct) {
        radiologyproduct.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('radiologyproduct', radiologyproduct).then(function (data) {
            if (data && data.radiologyproducts && data.radiologyproducts[0]) {
                return data.radiologyproducts[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Return all the radiologyproducts
     *
     * @return Promise<Array<RadiologyProducts>>
     */
    PouchService.prototype.getRadiologyproducts = function () {
        return this.db.rel.find('radiologyproduct').then(function (data) {
            var radiologyproducts = data.radiologyproducts ? data.radiologyproducts : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    radiologyproducts.sort(function (a, b) {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    });
                    break;
                case 'DESC':
                    radiologyproducts.sort(function (a, b) {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return radiologyproducts;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Read a radiologyproduct
     * @param {radiologyproduct} radiologyproduct
     *
     * @return Promise<RadiologyProducts>
     */
    PouchService.prototype.getRadiologyproduct = function (id) {
        return this.db.rel.find('radiologyproduct', id).then(function (data) {
            return data && data.radiologyproducts ? data.radiologyproducts[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a RadiologyProducts
    * @param {radiologyproduct} radiologyproduct
    *
    * @return Promise<RadiologyProducts>
    */
    PouchService.prototype.updateRadiologyproduct = function (radiologyproduct) {
        return this.db.rel.save('radiologyproduct', radiologyproduct).then(function (data) {
            if (data && data.radiologyproducts && data.radiologyproducts[0]) {
                return data.radiologyproducts[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Remove a RadiologyProduct
     * @param {radiologyproduct} radiologyproduct
     *
     * @return Promise<boolean>
     */
    PouchService.prototype.deleteRadiologyproduct = function (radiologyproduct) {
        return this.db.rel.del('radiologyproduct', radiologyproduct).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Theaterproduct
    **********/
    /**
     * Save a Theaterproduct
     * @param {theaterproduct} theaterproduct
     *
     * @return Promise<theaterproduct>
     */
    PouchService.prototype.saveTheaterproduct = function (theaterproduct) {
        theaterproduct.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('theaterproduct', theaterproduct).then(function (data) {
            if (data && data.theaterproducts && data.theaterproducts[0]) {
                return data.theaterproducts[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Return all the theaterproducts
     *
     * @return Promise<Array<TheaterProducts>>
     */
    PouchService.prototype.getTheaterproducts = function () {
        return this.db.rel.find('theaterproduct').then(function (data) {
            var theaterproducts = data.theaterproducts ? data.theaterproducts : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    theaterproducts.sort(function (a, b) {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    });
                    break;
                case 'DESC':
                    theaterproducts.sort(function (a, b) {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return theaterproducts;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Read a theaterproduct
     * @param {theaterproduct} theaterproduct
     *
     * @return Promise<TheaterProducts>
     */
    PouchService.prototype.getTheaterproduct = function (id) {
        return this.db.rel.find('theaterproduct', id).then(function (data) {
            return data && data.theaterproducts ? data.theaterproducts[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a TheaterProducts
    * @param {radiologyproduct} radiologyproduct
    *
    * @return Promise<RadiologyProducts>
    */
    PouchService.prototype.updateTheaterproduct = function (theaterproduct) {
        return this.db.rel.save('theaterproduct', theaterproduct).then(function (data) {
            if (data && data.theaterproducts && data.theaterproducts[0]) {
                return data.theaterproducts[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Remove a TheaterProduct
    * @param {theaterproduct} theaterproduct
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deleteTheaterproduct = function (theaterproduct) {
        return this.db.rel.del('theaterproduct', theaterproduct).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Productcategory
    **********/
    /**
     * Save a Productcategory
     * @param {productcategory} productcategory
     *
     * @return Promise<Productcategory>
     */
    PouchService.prototype.saveProductcategory = function (productcategory) {
        productcategory.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('productcategory', productcategory).then(function (data) {
            if (data && data.productcategorys && data.productcategorys[0]) {
                return data.productcategorys[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Return all the productcategorys
     *
     * @return Promise<Array<ProductCategory>>
     */
    PouchService.prototype.getProductcategorys = function () {
        return this.db.rel.find('productcategory').then(function (data) {
            var productcategorys = data.productcategorys ? data.productcategorys : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    productcategorys.sort(function (a, b) {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    });
                    break;
                case 'DESC':
                    productcategorys.sort(function (a, b) {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return productcategorys;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Read a productcategory
     * @param {productcategory} productcategory
     *
     * @return Promise<ProductCategory>
     */
    PouchService.prototype.getProductcategory = function (id) {
        return this.db.rel.find('productcategory', id).then(function (data) {
            return data && data.productcategorys ? data.productcategorys[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a productcategory
    * @param {productcategory} productcategory
    *
    * @return Promise<ProductCategory>
    */
    PouchService.prototype.updateProductcategory = function (productcategory) {
        return this.db.rel.save('productcategory', productcategory).then(function (data) {
            if (data && data.productcategorys && data.productcategorys[0]) {
                return data.productcategorys[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Remove a productcategory
    * @param {productcategory} productcategory
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deleteProductcategory = function (productcategory) {
        return this.db.rel.del('productcategory', productcategory).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Service
    **********/
    /**
     * Save a service
     * @param {service} service
     *
     * @return Promise<service>
     */
    PouchService.prototype.saveService = function (service) {
        service.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('service', service).then(function (data) {
            if (data && data.services && data.services[0]) {
                return data.services[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Return all the services
    *
    * @return Promise<Array<Services>>
    */
    PouchService.prototype.getServices = function () {
        return this.db.rel.find('service').then(function (data) {
            var services = data.services ? data.services : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    services.sort(function (a, b) {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    });
                    break;
                case 'DESC':
                    services.sort(function (a, b) {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return services;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Read a service
     * @param {service} service
     *
     * @return Promise<Services>
     */
    PouchService.prototype.getService = function (id) {
        return this.db.rel.find('service', id).then(function (data) {
            return data && data.services ? data.services[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a service
    * @param {service} service
    *
    * @return Promise<Services>
    */
    PouchService.prototype.updateService = function (service) {
        return this.db.rel.save('service', service).then(function (data) {
            if (data && data.services && data.services[0]) {
                return data.services[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Remove a service
     * @param {service} service
     *
     * @return Promise<boolean>
     */
    PouchService.prototype.deleteService = function (service) {
        return this.db.rel.del('service', service).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * RenderService
    **********/
    /**
     * Save a RenderService
     * @param {renderservice} renderservice
     *
     * @return Promise<RenderService>
     */
    PouchService.prototype.saveRenderService = function (renderservice) {
        renderservice.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('renderservice', renderservice).then(function (data) {
            if (data && data.renderservices && data.renderservices[0]) {
                return data.renderservices[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Return all the RenderServices
     *
     * @return Promise<Array<RenderService>>
     */
    PouchService.prototype.getRenderServices = function () {
        return this.db.rel.find('renderservice').then(function (data) {
            var renderservices = data.renderservices ? data.renderservices : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    renderservices.sort(function (a, b) {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    });
                    break;
                case 'DESC':
                    renderservices.sort(function (a, b) {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return renderservices;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Read a renderservice
    * @param {renderservice} renderservice
    *
    * @return Promise<RenderService>
    */
    PouchService.prototype.getRenderService = function (id) {
        return this.db.rel.find('renderservice', id).then(function (data) {
            return data && data.renderservices ? data.renderservices[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a renderservice
    * @param {renderservice} renderservice
    *
    * @return Promise<RenderService>
    */
    PouchService.prototype.updateRenderService = function (renderservice) {
        return this.db.rel.save('renderservice', renderservice).then(function (data) {
            if (data && data.renderservices && data.renderservices[0]) {
                return data.renderservices[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Remove a renderservice
     * @param {renderservice} renderservice
     *
     * @return Promise<boolean>
     */
    PouchService.prototype.deleteRenderService = function (renderservice) {
        return this.db.rel.del('renderservice', renderservice).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Patient
    **********/
    /**
     * Save a patient
     * @param {patient} patient
     *
     * @return Promise<Patient>
     */
    PouchService.prototype.savePatient = function (patient) {
        patient.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('patient', patient).then(function (data) {
            if (data && data.patients && data.patients[0]) {
                return data.patients[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Return all the Patients
    *
    * @return Promise<Array<Patient>>
    */
    PouchService.prototype.getPatients = function () {
        return this.db.rel.find('patient').then(function (data) {
            console.log(data);
            var patients = data.patients ? data.patients : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    patients.sort(function (a, b) {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    });
                    break;
                case 'DESC':
                    patients.sort(function (a, b) {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return patients;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Read a patient
    * @param {patient} patient
    *
    * @return Promise<Patients>
    */
    PouchService.prototype.getPatient = function (id) {
        return this.db.rel.find('patient', id).then(function (data) {
            return data && data.patients ? data.patients[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a patient
    * @param {patient} patient
    *
    * @return Promise<Patient>
    */
    PouchService.prototype.updatePatient = function (patient) {
        return this.db.rel.save('patient', patient).then(function (data) {
            if (data && data.patients && data.patients[0]) {
                return data.patients[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Remove a patient
    * @param {patient} patient
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deletePatient = function (patient) {
        return this.db.rel.del('patient', patient).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Vendor
    **********/
    /**
     * Save a vendor
     * @param {vendor} vendor
     *
     * @return Promise<Vendor>
     */
    PouchService.prototype.saveVendor = function (vendor) {
        vendor.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('vendor', vendor).then(function (data) {
            if (data && data.vendors && data.vendors[0]) {
                return data.vendors[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Return all the Vendors
    *
    * @return Promise<Array<Vendor>>
    */
    PouchService.prototype.getVendors = function () {
        return this.db.rel.find('vendor').then(function (data) {
            var vendors = data.vendors ? data.vendors : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    vendors.sort(function (a, b) {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    });
                    break;
                case 'DESC':
                    vendors.sort(function (a, b) {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return vendors;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Read a vendor
    * @param {vendor} vendor
    *
    * @return Promise<Vendors>
    */
    PouchService.prototype.getVendor = function (id) {
        return this.db.rel.find('vendor', id).then(function (data) {
            return data && data.vendors ? data.vendors[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a vendor
    * @param {vendor} vendor
    *
    * @return Promise<Vendor>
    */
    PouchService.prototype.updateVendor = function (vendor) {
        return this.db.rel.save('vendor', vendor).then(function (data) {
            if (data && data.vendors && data.vendors[0]) {
                return data.vendors[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Remove a vendor
    * @param {vendor} vendor
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deleteVendor = function (vendor) {
        return this.db.rel.del('vendor', vendor).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Evacuated
    **********/
    /**
     * Save an evacuate
     * @param {evacuate} evacuate
     *
     * @return Promise<Evacuate>
     */
    PouchService.prototype.saveEvacuate = function (evacuate) {
        evacuate.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('evacuate', evacuate).then(function (data) {
            if (data && data.evacuates && data.evacuates[0]) {
                return data.evacuates[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Return all the Evacuates
    *
    * @return Promise<Array<Evacuate>>
    */
    PouchService.prototype.getEvacuates = function () {
        return this.db.rel.find('evacuate').then(function (data) {
            var evacuates = data.evacuates ? data.evacuates : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    evacuates.sort(function (a, b) {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    });
                    break;
                case 'DESC':
                    evacuates.sort(function (a, b) {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    });
                    break;
                default:
                    break;
            }
            return evacuates;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Read a evacuate
    * @param {evacuate} evacuate
    *
    * @return Promise<Evacuates>
    */
    PouchService.prototype.getEvacuate = function (id) {
        return this.db.rel.find('Evacuate', id).then(function (data) {
            return data && data.evacuates ? data.evacuates[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a evacuate
    * @param {evacuate} evacuate
    *
    * @return Promise<Evacuate>
    */
    PouchService.prototype.updateEvacuate = function (evacuate) {
        return this.db.rel.save('evacuate', evacuate).then(function (data) {
            if (data && data.evacuates && data.evacuates[0]) {
                return data.evacuates[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Remove a evacuate
    * @param {evacuate} evacuate
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deleteEvacuate = function (evacuate) {
        return this.db.rel.del('evacuate', evacuate).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Individual Sales
    **********/
    /**
     * Save an individualsale
     * @param {individualsale} individualsale
     *
     * @return Promise<IndividualSale>
     */
    PouchService.prototype.saveIndividualSale = function (individualsale) {
        individualsale.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('individualsale', individualsale).then(function (data) {
            if (data && data.individualsales && data.individualsales[0]) {
                return data.individualsales[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Return all the IndividualSales
    *
    * @return Promise<Array<IndividualSale>>
    */
    PouchService.prototype.getIndividualSales = function () {
        return this.db.rel.find('individualsale').then(function (data) {
            var individualsales = data.individualsales ? data.individualsales : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    individualsales.sort(function (a, b) {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.checkindate).getTime() - new Date(b.checkindate).getTime();
                    });
                    break;
                case 'DESC':
                    individualsales.sort(function (a, b) {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.checkindate).getTime() - new Date(a.checkindate).getTime();
                    });
                    break;
                default:
                    break;
            }
            return individualsales;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Read a individualsale
    * @param {individualsale} individualsale
    *
    * @return Promise<IndividualSales>
    */
    PouchService.prototype.getIndividualSale = function (id) {
        return this.db.rel.find('individualsale', id).then(function (data) {
            return data && data.individualsales ? data.individualsales[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a individualsale
    * @param {individualsale} individualsale
    *
    * @return Promise<IndividualSale>
    */
    PouchService.prototype.updateIndividualSale = function (individualsale) {
        return this.db.rel.save('individualsale', individualsale).then(function (data) {
            if (data && data.individualsales && data.individualsales[0]) {
                return data.individualsales[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Remove a individualsale
    * @param {individualsale} individualsale
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deleteIndividualSale = function (individualsale) {
        return this.db.rel.del('individualsale', individualsale).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Damaged Product
    **********/
    /**
     * Save an damagedproduct
     * @param {damagedproduct} damagedproduct
     *
     * @return Promise<Damagedproduct>
     */
    PouchService.prototype.saveDamagedproduct = function (damagedproduct) {
        damagedproduct.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('damagedproduct', damagedproduct).then(function (data) {
            if (data && data.damagedproducts && data.damagedproducts[0]) {
                return data.damagedproducts[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Return all the Damagedproducts
    *
    * @return Promise<Array<Damagedproduct>>
    */
    PouchService.prototype.getDamagedproducts = function () {
        return this.db.rel.find('damagedproduct').then(function (data) {
            var damagedproducts = data.damagedproducts ? data.damagedproducts : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    damagedproducts.sort(function (a, b) {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.checkindate).getTime() - new Date(b.checkindate).getTime();
                    });
                    break;
                case 'DESC':
                    damagedproducts.sort(function (a, b) {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.checkindate).getTime() - new Date(a.checkindate).getTime();
                    });
                    break;
                default:
                    break;
            }
            return damagedproducts;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Read a damagedproduct
    * @param {damagedproduct} damagedproduct
    *
    * @return Promise<Damagedproducts>
    */
    PouchService.prototype.getDamagedproduct = function (id) {
        return this.db.rel.find('damagedproduct', id).then(function (data) {
            return data && data.damagedproducts ? data.damagedproducts[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a damagedproduct
    * @param {damagedproduct} damagedproduct
    *
    * @return Promise<Damagedproduct>
    */
    PouchService.prototype.updateDamagedproduct = function (damagedproduct) {
        return this.db.rel.save('damagedproduct', damagedproduct).then(function (data) {
            if (data && data.damagedproducts && data.damagedproducts[0]) {
                return data.damagedproducts[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Remove a damagedproduct
    * @param {damagedproduct} damagedproduct
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deleteDamagedproduct = function (damagedproduct) {
        return this.db.rel.del('damagedproduct', damagedproduct).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Gross Profit
    **********/
    /**
     * Save an grossprofit
     * @param {grossprofit} grossprofit
     *
     * @return Promise<Grossprofit>
     */
    PouchService.prototype.saveGrossprofit = function (grossprofit) {
        grossprofit.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('grossprofit', grossprofit).then(function (data) {
            if (data && data.grossprofits && data.grossprofits[0]) {
                return data.grossprofits[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Return all the Grossprofits
    *
    * @return Promise<Array<Grossprofit>>
    */
    PouchService.prototype.getGrossprofits = function () {
        return this.db.rel.find('grossprofit').then(function (data) {
            var grossprofits = data.grossprofits ? data.grossprofits : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    grossprofits.sort(function (a, b) {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    });
                    break;
                case 'DESC':
                    grossprofits.sort(function (a, b) {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    });
                    break;
                default:
                    break;
            }
            return grossprofits;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Read a grossprofit
    * @param {grossprofit} grossprofit
    *
    * @return Promise<Grossprofits>
    */
    PouchService.prototype.getGrossprofit = function (id) {
        return this.db.rel.find('grossprofit', id).then(function (data) {
            return data && data.grossprofits ? data.grossprofits[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a grossprofit
    * @param {grossprofit} grossprofit
    *
    * @return Promise<Grossprofit>
    */
    PouchService.prototype.updateGrossprofit = function (grossprofit) {
        return this.db.rel.save('grossprofit', grossprofit).then(function (data) {
            if (data && data.grossprofits && data.grossprofits[0]) {
                return data.grossprofits[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Remove a grossprofit
    * @param {grossprofit} grossprofit
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deleteGrossprofit = function (grossprofit) {
        return this.db.rel.del('grossprofit', grossprofit).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Net Profit
    **********/
    /**
     * Save an netprofit
     * @param {netprofit} netprofit
     *
     * @return Promise<Netprofit>
     */
    PouchService.prototype.saveNetprofit = function (netprofit) {
        netprofit.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('netprofit', netprofit).then(function (data) {
            if (data && data.netprofits && data.netprofits[0]) {
                return data.netprofits[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Return all the Netprofits
    *
    * @return Promise<Array<Netprofit>>
    */
    PouchService.prototype.getNetprofits = function () {
        return this.db.rel.find('netprofit').then(function (data) {
            var netprofits = data.netprofits ? data.netprofits : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    netprofits.sort(function (a, b) {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    });
                    break;
                case 'DESC':
                    netprofits.sort(function (a, b) {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.netdate).getTime() - new Date(a.netdate).getTime();
                    });
                    break;
                default:
                    break;
            }
            return netprofits;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Read a netprofit
    * @param {netprofit} netprofit
    *
    * @return Promise<Netprofits>
    */
    PouchService.prototype.getNetprofit = function (id) {
        return this.db.rel.find('netprofit', id).then(function (data) {
            return data && data.netprofits ? data.netprofits[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a netprofit
    * @param {netprofit} netprofit
    *
    * @return Promise<Netprofit>
    */
    PouchService.prototype.updateNetprofit = function (netprofit) {
        return this.db.rel.save('netprofit', netprofit).then(function (data) {
            if (data && data.netprofits && data.netprofits[0]) {
                return data.netprofits[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Remove a netprofit
    * @param {netprofit} netprofit
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deleteNetprofit = function (netprofit) {
        return this.db.rel.del('netprofit', netprofit).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /***********
    * Department Dispatch
    **********/
    /**
     * Save a department dispatch
     * @param {departmentdispatch} departmentdispatch
     *
     * @return Promise<departmentdispatch>
     */
    PouchService.prototype.saveDepartmentDispatch = function (departmentdispatch) {
        //departmentdispatch.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('departmentdispatch', departmentdispatch).then(function (data) {
            if (data && data.departmentdispatchs && data.departmentdispatchs[0]) {
                return data.departmentdispatchs[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Return all the departmentdispatchs
     *
     * @return Promise<Array<DepartmentDispatch>>
     */
    PouchService.prototype.getDepartmentDispatchs = function () {
        return this.db.rel.find('departmentdispatch').then(function (data) {
            var departmentdispatchs = data.departmentdispatchs ? data.departmentdispatchs : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    departmentdispatchs.sort(function (a, b) {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    });
                    break;
                case 'DESC':
                    departmentdispatchs.sort(function (a, b) {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return departmentdispatchs;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Read a DepartmentDispatch
     * @param {departmentdispatch} departmentdispatch
     *
     * @return Promise<DepartmentDispatch>
     */
    PouchService.prototype.getDepartmentDispatch = function (id) {
        return this.db.rel.find('departmentdispatch', id).then(function (data) {
            return data && data.departmentdispatchs ? data.departmentdispatchs[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a DepartmentDispatch
    * @param {departmentdispatch} departmentdispatch
    *
    * @return Promise<departmentdispatch>
    */
    PouchService.prototype.updateDepartmentDispatch = function (departmentdispatch) {
        return this.db.rel.save('departmentdispatch', departmentdispatch).then(function (data) {
            if (data && data.departmentdispatchs && data.departmentdispatchs[0]) {
                return data.departmentdispatchs[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Remove a DepartmentDispatch
    * @param {departmentdispatch} departmentdispatch
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deleteDepartmentDispatch = function (departmentdispatch) {
        return this.db.rel.del('departmentdispatch', departmentdispatch).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    //Stock
    /***********
       * Department Stock
       **********/
    /**
     * Save a Stock
     * @param {stock} stock
     *
     * @return Promise<stock>
     */
    PouchService.prototype.saveStock = function (stock) {
        //departmentdispatch.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('stock', stock).then(function (data) {
            if (data && data.stocks && data.stocks[0]) {
                return data.stocks[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Return all the stocks
     *
     * @return Promise<Array<Stock>>
     */
    PouchService.prototype.getStocks = function () {
        return this.db.rel.find('stock').then(function (data) {
            var stocks = data.stocks ? data.stocks : [];
            var sortBy = 'DESC';
            switch (sortBy) {
                case 'ASC':
                    stocks.sort(function (a, b) {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    });
                    break;
                case 'DESC':
                    stocks.sort(function (a, b) {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return stocks;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
     * Read a Stock
     * @param {stock} stock
     *
     * @return Promise<stock>
     */
    PouchService.prototype.getStock = function (id) {
        return this.db.rel.find('stock', id).then(function (data) {
            return data && data.stocks ? data.stocks[0] : null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Update a Stock
    * @param {stock} stock
    *
    * @return Promise<stock>
    */
    PouchService.prototype.updateStock = function (stock) {
        return this.db.rel.save('stock', stock).then(function (data) {
            if (data && data.stocks && data.stocks[0]) {
                return data.stocks[0];
            }
            return null;
        }).catch(function (err) {
            console.log(err);
        });
    };
    /**
    * Remove a Stock
    * @param {stock} stock
    *
    * @return Promise<boolean>
    */
    PouchService.prototype.deleteStock = function (stock) {
        return this.db.rel.del('stock', stock).then(function (data) {
            return data && data.deleted ? data.deleted : false;
        }).catch(function (err) {
            console.log(err);
        });
    };
    PouchService.prototype.userPermission = function () {
        var localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(function (staff) {
            return staff;
        }).catch(function (err) {
            console.log(err);
        });
    };
    PouchService.ctorParameters = function () { return [
        { type: ngx_spinner__WEBPACK_IMPORTED_MODULE_4__["NgxSpinnerService"] }
    ]; };
    PouchService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [ngx_spinner__WEBPACK_IMPORTED_MODULE_4__["NgxSpinnerService"]])
    ], PouchService);
    return PouchService;
}());



/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\IRORO\Desktop\angularprojects\iuthApp\src\main.ts */"./src/main.ts");


/***/ }),

/***/ 1:
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 2:
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map