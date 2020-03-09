/**
 * Service provider for PouchDB
 * @name pouch-service.ts
 * @author Agbonaye Osaru - osaru@sarutech.com
 */
import { Injectable } from '@angular/core';
declare var require: any;
import PouchDB from 'pouchdb';
PouchDB.plugin(require('pouchdb-find').default);
PouchDB.plugin(require('relational-pouch'));
PouchDB.plugin(require('pouchdb-upsert'));
require('pouchdb-all-dbs')(PouchDB);
//PouchDB.plugin(require('pouchdb-adapter-websql'));
import 'rxjs/add/operator/map';
/**
 * Models
 */
import { BEC_PharmProducts } from '../model/bedcpharmproduct';
import { Department } from '../model/department';
import { DepartmentDispatch } from '../model/departmentdispatch';
import { Expenses } from '../model/expense';
import { GOPDProducts } from '../model/gopdpharmproduct';
import { LabProducts } from '../model/labproduct';
import { CounterProducts } from '../model/counterproduct';
import { Patient } from '../model/patient';
import { Products } from '../model/product';
import { Evacuate } from '../model/evacuate';
import { ProductCategory } from '../model/productcategory';
import { RadiologyProducts } from '../model/radiologyproduct';
import { Sales } from '../model/sales';
import { Stock } from '../model/stock';
import { Vendor } from '../model/vendor';
import { Services } from '../model/service';
import { RenderService } from '../model/renderservice';
import { Staff } from '../model/staff';
import { TheaterProducts } from '../model/theaterproduct';
import { IndividualSale } from '../model/individualsales';
import { Damagedproduct } from '../model/damagedproduct';
import { Grossprofit } from '../model/grossprofit';
import { Netprofit } from '../model/netprofit';
import { DispatchedProducts } from '../model/dispatchedproduct';
import { Schema } from '../model/relational-schema';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable()
export class PouchService {
    private db;
    remote: any;
    finishSync: any;
    paginationId = null;
    limitRange: number = 31;

    /**
    * Constructor
    */
    constructor(private spinner: NgxSpinnerService) {
        console.log('constructor');
    }

    /**
    * Initialize PouchDB database
    */

    initDB() {
        this.db = new PouchDB('iuth', { adapter: 'websql' });
        this.db.setSchema(Schema);

        this.enableSyncing();
        //this.checkRemoteSync();


        this.db.createIndex({
            index: {
                fields: ['data.branch','data.store', 'data.sourcedepartment', 'data.department', 'data.departmentname',
                 'data.isoncredit', 'data.isowing', 'data.iscomplete', 'data.isnoticed', 'data.isquantitynoticed', 'data.year',
                'data.notification', 'data.expensetype', 'data.isexpired', 'data.patientid', 'data.vendorid']
            }
        });
    }

    enableSyncing() {
        let options = {
            Auth: {
                username: 'iuth',
                password: 'iuth'
            },
            live: true,
            retry: true,
            continuous: true
        };

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

    }

    checkRemoteSync(): Promise<any> {
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

    }


    /***********
      * staff
      **********/
    /**
     * Save a staff
     * @param {staff} staff
     *
     * @return Promise<staff>
     */
    saveStaff(staff: Staff): Promise<Staff> {
        staff.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('staff', staff).then((data: any) => {
            if (data && data.staffs && data.staffs[0]) {
                return data.staffs[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }


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
    paginateByBranchRemoveItem(type?, id?, year?, expired?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.year': {$eq: year}, 'data.isexpired': {$eq: expired}, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

    paginateByCentralStoreRemoveItem(type?, id?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: 'Central Store' }, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

     paginateByStoreRemoveItem(type?, id?, store?, isnoticed?, isquantitynoticed?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: store }, 'data.isnoticed': {$eq: isnoticed},  'data.isquantitynoticed': {$eq: isquantitynoticed}, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

     paginateByDispatchedProductRemoveItem(type?, id?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: 'Central Store' }, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

     paginateByGeneralDispatchedProductRemoveItem(type?, id?, sourcedepartment?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: sourcedepartment }, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

    paginateByDepartmentRemoveItem(type?, id?, department?, isnoticed?, isquantitynoticed?, year?, expired?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department }, 'data.isnoticed': {$eq: isnoticed}, 'data.isquantitynoticed': {$eq: isquantitynoticed}, 'data.year': {$eq: year}, 'data.isexpired': {$eq: expired}, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

    paginateByExpenseRemoveItem(type?, id?, department?, oncredit?, owing?, complete?, expensetype?, vendorid?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.departmentname': { $eq: department }, 'data.isoncredit' : {$eq: oncredit}, 'data.isowing': {$eq: owing},'data.iscomplete': {$eq: complete}, 'data.expensetype':{$eq: expensetype}, 'data.vendorid': { $eq: vendorid}, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

    paginateBySaleRemoveItem(type?, id?, department?, oncredit?, owing?, complete?, patientid?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department }, $or: [{'data.isoncredit': oncredit}, {'data.isowing': owing}], 'data.iscomplete': { $eq: complete}, 'data.patientid': { $eq: patientid}, _id: { $eq: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }


    /* Faster choice than using the query method; */
    paginateByBranch2(type?, id?, year?, expired?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.year': {$eq: year}, 'data.isexpired': {$eq: expired}, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];
                    
                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

     /* Faster choice than using the query method; */
     paginateByNotification(type?, id?, year?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.notification' : {$all: ['Pharmacy Store']}, _id: { $eq: type + '_2_' + staff.id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }


     /* Faster choice than using the query method; */
     paginateByCentralStore(type?, id?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: 'Central Store' }, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];                    
                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

     /* Faster choice than using the query method; */
     paginateByStore(type?, id?, store?, isnoticed?, isquantitynoticed?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: store },  'data.isnoticed': {$eq: isnoticed}, 'data.isquantitynoticed': {$eq: isquantitynoticed}, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : []; 
                    
                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

      /* Faster choice than using the query method; */
      paginateByDispatchedProduct(type?, id?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: 'Central Store' }, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];
                    
                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

      /* Faster choice than using the query method; */
      paginateByGeneralDispatchedProduct(type?, id?, sourcedepartment?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: sourcedepartment }, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];
                    
                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

    /* Faster choice than using the query method; */
      paginateByDepartment2(type?, id?, department?, isnoticed?, isquantitynoticed?, year?, expired?) {          
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department }, 'data.isnoticed': {$eq: isnoticed}, 'data.isquantitynoticed': {$eq: isquantitynoticed}, 'data.year': {$eq: year}, 'data.isexpired': {$eq: expired}, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];
                    
                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

     /* Faster choice than using the query method; */
     paginateByExpense(type?, id?, department?, oncredit?, owing?, complete?, expensetype?, vendorid?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.departmentname': { $eq: department }, 'data.isoncredit' : {$eq: oncredit}, 'data.isowing': {$eq: owing},'data.iscomplete':{$eq: complete}, 'data.expensetype':{$eq: expensetype}, 'data.vendorid': { $eq: vendorid}, _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];
                    
                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

       /* Faster choice than using the query method; */
       paginateBySale(type?, id?, department?, oncredit?, owing?, complete?, patientid?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department },$or: [{'data.isoncredit': oncredit}, {'data.isowing': owing}], 'data.iscomplete': { $eq: complete}, 'data.patientid': { $eq: patientid},  _id: { $lte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];
                    console.log(paginatedtypes);
                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }


    /* Faster choice than using the query method; */
    paginateByBranchPrev2(type?, id?, year?, expired?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.year': {$eq: year}, 'data.isexpired': {$eq: expired}, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

     /* Faster choice than using the query method; */
     paginateByCentralStorePrev(type?, id?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: 'Central Store' }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

      /* Faster choice than using the query method; */
     paginateByStorePrev(type?, id?, store?, isnoticed?, isquantitynoticed?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: store },  'data.isnoticed': {$eq: isnoticed}, 'data.isquantitynoticed': {$eq: isquantitynoticed}, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

     /* Faster choice than using the query method; */
     paginateByDispatchedProductPrev(type?, id?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: 'Central Store' }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }


      /* Faster choice than using the query method; */
      paginateByGeneralDispatchedProductPrev(type?, id?, sourcedepartment?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: sourcedepartment }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }


       /* Faster choice than using the query method; */
       paginateByDepartmentPrev2(type?, id?, department?, isnoticed?, isquantitynoticed?, year?, expired?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department }, 'data.isnoticed': {$eq: isnoticed}, 'data.isquantitynoticed': {$eq: isquantitynoticed}, 'data.year': {$eq: year}, 'data.isexpired': {$eq: expired}, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

       /* Faster choice than using the query method; */
       paginateByExpensePrev(type?, id?, department?, oncredit?, owing?, complete?, expensetype?, vendorid?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.departmentname': { $eq: department }, 'data.isoncredit' : {$eq: oncredit}, 'data.isowing': {$eq: owing},'data.iscomplete': {$eq: complete} , 'data.expensetype':{$eq: expensetype}, 'data.vendorid': { $eq: vendorid}, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

     /* Faster choice than using the query method; */
     paginateBySalePrev(type?, id?, department?, oncredit?, owing?, complete?, patientid?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department }, $or: [{'data.isoncredit': oncredit}, {'data.isowing': owing}], 'data.iscomplete': { $eq: complete}, 'data.patientid': { $eq: patientid},  _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'asc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }


    /* Go to begin of page; */
    paginateByBranchStart(type?, id?, year?, expired?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.year': {$eq: year}, 'data.isexpired': {$eq: expired}, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

     /* Go to begin of page; */
     paginateByCentralStoreStart(type?, id?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: 'Central Store' }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

     /* Go to begin of page; */
     paginateByStoreStart(type?, id?, store?, isnoticed?, isquantitynoticed?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.store': { $eq: store },  'data.isnoticed': {$eq: isnoticed}, 'data.isquantitynoticed': {$eq: isquantitynoticed}, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

     /* Go to begin of page; */
     paginateByDispatchedProductStart(type?, id?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: 'Central Store' }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

     /* Go to begin of page; */
     paginateByGeneralDispatchedProductStart(type?, id?, sourcedepartment?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.sourcedepartment': { $eq: sourcedepartment }, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

     /* Go to begin of page; */
     paginateByDepartmentStart(type?, id?, department?, isnoticed?, isquantitynoticed?, year?, expired?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department },'data.isnoticed': {$eq: isnoticed}, 'data.isquantitynoticed': {$eq: isquantitynoticed}, 'data.year': {$eq: year}, 'data.isexpired': {$eq: expired}, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }
    

     /* Go to begin of page; */
     paginateByExpenseStart(type?, id?, department?, oncredit?, owing?, complete?, expensetype?, vendorid?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.departmentname': { $eq: department }, 'data.isoncredit' : {$eq: oncredit}, 'data.isowing': {$eq: owing}, 'data.iscomplete': {$eq: complete}, 'data.expensetype':{$eq: expensetype}, 'data.vendorid': { $eq: vendorid}, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

     /* Go to begin of page; */
     paginateBySaleStart(type?, id?, department?, oncredit?, owing?, complete?, patientid?) {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.find({
                selector: { 'data.branch': { $eq: staff.branch }, 'data.department': { $eq: department }, $or: [{'data.isoncredit': oncredit}, {'data.isowing': owing}], 'data.iscomplete': { $eq: complete},'data.patientid': { $eq: patientid}, _id: { $gte: type + '_2_' + id, $regex: new RegExp(type) } },
                limit: this.limitRange,
                sort: [{ _id: 'desc' }]
            }).then(res => {
                return this.db.rel.parseRelDocs(type, res.docs).then(result => {

                    let paginatedtypes = result[`${type}s`] ? result[`${type}s`] : [];

                    return paginatedtypes;
                }).catch((err: any) => {
                    console.log(err);
                });
            })
        });
    }

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
    paginateByDepartment(type?, id?): Promise<any> {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.query(function (doc, emit) {
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
    }

    paginateByDepartmentPrev(type?, id?): Promise<any> {
        var localStorageItem;
        localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return this.db.query(function (doc, emit) {
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
    }

    /**
    * Return all the staffs
    *
    * @return Promise<Array<Staff>>
    */
    getStaffs(): Promise<Array<Staff>> {

        return this.db.rel.find('staff').then((data: any) => {
            let staffs = data.staffs ? data.staffs : [];
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
            return staffs;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
    * Read a Staff
    * @param {staff} staff
    *
    * @return Promise<Staff>
    */
    getStaff(id): Promise<Staff> {
        return this.db.rel.find('staff', id).then((data: any) => {
            return data && data.staffs ? data.staffs[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a Staff
    * @param {staff} staff
    *
    * @return Promise<staff>
    */
    updateStaff(staff: Staff): Promise<Staff> {
        return this.db.rel.save('staff', staff).then((data: any) => {
            if (data && data.staffs && data.staffs[0]) {
                return data.staffs[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Remove a Staff
    * @param {staff} staff
    *
    * @return Promise<boolean>
    */
    deleteStaff(staff: Staff): Promise<boolean> {
        return this.db.rel.del('staff', staff).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * Department
    **********/
    /**
     * Save a department
     * @param {department} department
     *
     * @return Promise<department>
     */
    saveDepartment(department: Department): Promise<Department> {
        //department.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('department', department).then((data: any) => {
            if (data && data.departments && data.departments[0]) {
                return data.departments[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Return all the departments
     *
     * @return Promise<Array<Department>>
     */
    getDepartments(): Promise<Array<Department>> {
        return this.db.rel.find('department').then((data: any) => {
            let departments = data.departments ? data.departments : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    departments.sort((a: any, b: any) => {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    departments.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return departments;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
     * Read a Department
     * @param {department} department
     *
     * @return Promise<Department>
     */
    getDepartment(id): Promise<Department> {
        return this.db.rel.find('department', id).then((data: any) => {
            return data && data.departments ? data.departments[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a Department
    * @param {department} department
    *
    * @return Promise<department>
    */
    updateDepartment(department: Department): Promise<Department> {
        return this.db.rel.save('department', department).then((data: any) => {
            if (data && data.departments && data.departments[0]) {
                return data.departments[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Remove a Department
    * @param {department} department
    *
    * @return Promise<boolean>
    */
    deleteDepartment(department: Department): Promise<boolean> {
        return this.db.rel.del('department', department).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    *Sale
    **********/
    /**
     * Save a sale
     * @param {sale} sale
     *
     * @return Promise<sale>
     */
    saveSale(sale: Sales): Promise<Sales> {
        sale.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('sale', sale).then((data: any) => {
            if (data && data.sales && data.sales[0]) {
                return data.sales[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Return all the sales
    *
    * @return Promise<Array<Sales>>
    */
    getSales(): Promise<Array<Sales>> {
        return this.db.rel.find('sale').then((data: any) => {
            let sales = data.sales ? data.sales : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    sales.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    })
                    break;
                case 'DESC':
                    sales.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    });
                    break;
                default:
                    break;
            }
            return sales;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
    * Read a Sale
    * @param {sale} sale
    *
    * @return Promise<Sale>
    */
    getSale(id): Promise<Sales> {
        return this.db.rel.find('sale', id).then((data: any) => {
            return data && data.sales ? data.sales[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a Sale
    * @param {sale} sale
    *
    * @return Promise<sale>
    */
    updateSale(sale: Sales): Promise<Sales> {
        return this.db.rel.save('sale', sale).then((data: any) => {
            if (data && data.sales && data.sales[0]) {
                return data.sales[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Remove a Sale
     * @param {sale} sale
     *
     * @return Promise<boolean>
     */
    deleteSale(sale: Sales): Promise<boolean> {
        return this.db.rel.del('sale', sale).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * Expense
    **********/
    /**
     * Save a expense
     * @param {expense} expense
     *
     * @return Promise<expense>
     */
    saveExpense(expense: Expenses): Promise<Expenses> {
        expense.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('expense', expense).then((data: any) => {
            if (data && data.expenses && data.expenses[0]) {
                return data.expenses[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Return all the expenses
    *
    * @return Promise<Array<Expenses>>
    */
    getExpenses(): Promise<Array<Expenses>> {
        return this.db.rel.find('expense').then((data: any) => {
            let expenses = data.expenses ? data.expenses : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    expenses.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    })
                    break;
                case 'DESC':
                    expenses.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    });
                    break;
                default:
                    break;
            }
            return expenses;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
    * Read a Expense
    * @param {expense} expense
    *
    * @return Promise<Expenses>
    */
    getExpense(id): Promise<Expenses> {
        return this.db.rel.find('expense', id).then((data: any) => {
            return data && data.expenses ? data.expenses[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a Expense
    * @param {expense} expense
    *
    * @return Promise<Expenses>
    */
    updateExpense(expense: Expenses): Promise<Expenses> {
        return this.db.rel.save('expense', expense).then((data: any) => {
            if (data && data.expenses && data.expenses[0]) {
                return data.expenses[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Remove a Expense
    * @param {expense} expense
    *
    * @return Promise<boolean>
    */
    deleteExpense(expense: Expenses): Promise<boolean> {
        return this.db.rel.del('expense', expense).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }


    /***********
    * Product
    **********/
    /**
     * Save a Product
     * @param {product} product
     *
     * @return Promise<product>
     */
    saveProduct(product: Products): Promise<Products> {
        product.id = Math.floor(Date.now()).toString();

        return this.db.rel.save('product', product).then((data: any) => {
            if (data && data.products && data.products[0]) {
                return data.products[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        });

    }

    //Save Product Image
    saveImage(blob: any, product: Products): Promise<Products> {
        return this.db.rel.putAttachment('product', { id: product.id, rev: '' }, 'file', blob, 'image/png').then(result => {
        });
    }

    //Get Product Attachments
    getImage(id): Promise<Products> {
        return this.db.rel.getAttachment('product', id, 'file').then(blob => {
            return blob;
        });
    }

    /**
    * Return all the products
    *
    * @return Promise<Array<Products>>
    */
    getProducts(): Promise<Array<Products>> {
        return this.db.rel.find('product').then((data: any) => {
            let products = data.products ? data.products : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    products.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.datesupplied).getTime() - new Date(b.datesupplied).getTime();
                    })
                    break;
                case 'DESC':
                    products.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.datesupplied).getTime() - new Date(a.datesupplied).getTime();
                    });
                    break;
                default:
                    break;
            }
            return products;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
     * Read a Product
     * @param {product} product
     *
     * @return Promise<Products>
     */
    getProduct(id): Promise<Products> {
        return this.db.rel.find('product', id).then((data: any) => {
            return data && data.products ? data.products[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a Product
    * @param {product} product
    *
    * @return Promise<Products>
    */
    updateProduct(product: Products): Promise<Products> {
        return this.db.rel.save('product', product).then((data: any) => {
            if (data && data.products && data.products[0]) {
                return data.products[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
            if (err.name === 'conflict') {
                // conflict!
                //this.upsertProduct(this.globalProduct);
            } else {
                // some other error
                console.log('Some other errors');
            }
        })
    }

    //use in case of conflicts in documents
    upsertProduct(product: Products): Promise<Products> {
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
    }


    /**
    * Remove a Product
    * @param {product} product
    *
    * @return Promise<boolean>
    */
    deleteProduct(product: Products): Promise<boolean> {
        return this.db.rel.del('product', product).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * Product
    **********/
    /**
     * Save a Dispatched Product
     * @param {dispatchedproduct} dispatchedproduct
     *
     * @return Promise<dispatchedproduct>
     */
    saveDispatchedProduct(dispatchedproduct: DispatchedProducts): Promise<DispatchedProducts> {
        dispatchedproduct.id = Math.floor(Date.now()).toString();

        return this.db.rel.save('dispatchedproduct', dispatchedproduct).then((data: any) => {
            if (data && data.dispatchedproducts && data.dispatchedproducts[0]) {
                console.log(data.dispatchedproducts[0]);
                return data.dispatchedproducts[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        });

    }

    /**
    * Return all the dispatchedproducts
    *
    * @return Promise<Array<DispatchedProducts>>
    */
    getDispatchedProducts(): Promise<Array<DispatchedProducts>> {
        return this.db.rel.find('dispatchedproduct').then((data: any) => {
            let dispatchedproducts = data.dispatchedproducts ? data.dispatchedproducts : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    dispatchedproducts.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.datedispatched).getTime() - new Date(b.datedispatched).getTime();
                    })
                    break;
                case 'DESC':
                    dispatchedproducts.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.datedispatched).getTime() - new Date(a.datedispatched).getTime();
                    });
                    break;
                default:
                    break;
            }
            return dispatchedproducts;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
     * Read a DispatchedProduct
     * @param {dispatchedproduct} dispatchedproduct
     *
     * @return Promise<DispatchedProducts>
     */
    getDispatchedProduct(id): Promise<DispatchedProducts> {
        return this.db.rel.find('dispatchedproduct', id).then((data: any) => {
            return data && data.dispatchedproducts ? data.dispatchedproducts[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a DispatchedProduct
    * @param {dispatchedproduct} dispatchedproduct
    *
    * @return Promise<DispatchedProducts>
    */
    updateDispatchedProduct(dispatchedproduct: DispatchedProducts): Promise<DispatchedProducts> {
        return this.db.rel.save('dispatchedproduct', dispatchedproduct).then((data: any) => {
            if (data && data.dispatchedproducts && data.dispatchedproducts[0]) {
                return data.products[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Remove a DispatchedProduct
    * @param {dispatchedproduct} dispatchedproduct
    *
    * @return Promise<boolean>
    */
    deleteDispatchedProduct(dispatchedproduct: DispatchedProducts): Promise<boolean> {
        return this.db.rel.del('dispatchedproduct', dispatchedproduct).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
     * BEC_pharmproduct
     **********/
    /**
     * Save a bec_pharmproduct
     * @param {bec_pharmproduct} bec_pharmproduct
     *
     * @return Promise<bec_pharmproduct>
     */
    saveBec_pharmproduct(bec_pharmproduct: BEC_PharmProducts): Promise<BEC_PharmProducts> {
        bec_pharmproduct.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('bec_pharmproduct', bec_pharmproduct).then((data: any) => {
            if (data && data.bec_pharmproducts && data.bec_pharmproducts[0]) {
                return data.bec_pharmproducts[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Return all the bec_pharmproducts
    *
    * @return Promise<Array<BEC_PharmProducts>>
    */
    getBec_pharmproducts(): Promise<Array<BEC_PharmProducts>> {
        return this.db.rel.find('bec_pharmproduct').then((data: any) => {
            let bec_pharmproducts = data.bec_pharmproducts ? data.bec_pharmproducts : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    bec_pharmproducts.sort((a: any, b: any) => {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    bec_pharmproducts.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return bec_pharmproducts;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
     * Read a Bec_pharmproduct
     * @param {bec_pharmproduct} bec_pharmproduct
     *
     * @return Promise<BEC_PharmProducts>
     */
    getBec_pharmproduct(id): Promise<BEC_PharmProducts> {
        return this.db.rel.find('bec_pharmproduct', id).then((data: any) => {
            return data && data.bec_pharmproducts ? data.bec_pharmproducts[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a Bec_pharmproduct
    * @param {bec_pharmproduct} bec_pharmproduct
    *
    * @return Promise<Bec_pharmproducts>
    */
    updateBec_pharmproduct(bec_pharmproduct: BEC_PharmProducts): Promise<BEC_PharmProducts> {
        return this.db.rel.save('bec_pharmproduct', bec_pharmproduct).then((data: any) => {
            if (data && data.bec_pharmproducts && data.bec_pharmproducts[0]) {
                return data.bec_pharmproducts[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Remove a Bec_pharmproduct
     * @param {bec_pharmproduct} bec_pharmproduct
     *
     * @return Promise<boolean>
     */
    deleteBec_pharmproduct(bec_pharmproduct: BEC_PharmProducts): Promise<boolean> {
        return this.db.rel.del('bec_pharmproduct', bec_pharmproduct).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * Gopdproduct
    **********/
    /**
     * Save a Gopdproduct
     * @param {gopdproduct} gopdproduct
     *
     * @return Promise<gopdproduct>
     */
    saveGopdproduct(gopdproduct: GOPDProducts): Promise<GOPDProducts> {
        gopdproduct.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('gopdproduct', gopdproduct).then((data: any) => {
            if (data && data.gopdproducts && data.gopdproducts[0]) {
                return data.gopdproducts[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Return all the gopdproducts
     *
     * @return Promise<Array<GOPDProducts>>
     */
    getGopdproducts(): Promise<Array<GOPDProducts>> {
        return this.db.rel.find('gopdproduct').then((data: any) => {
            let gopdproducts = data.gopdproducts ? data.gopdproducts : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    gopdproducts.sort((a: any, b: any) => {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    gopdproducts.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return gopdproducts;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
     * Read a gopdproduct
     * @param {gopdproduct} gopdproduct
     *
     * @return Promise<GOPDProducts>
     */
    getGopdproduct(id): Promise<GOPDProducts> {
        return this.db.rel.find('gopdproduct', id).then((data: any) => {
            return data && data.gopdproducts ? data.gopdproducts[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a Gopdproduct
    * @param {gopdproduct} gopdproduct
    *
    * @return Promise<GOPDProducts>
    */
    updateGopdproduct(gopdproduct: GOPDProducts): Promise<GOPDProducts> {
        return this.db.rel.save('gopdproduct', gopdproduct).then((data: any) => {
            if (data && data.gopdproducts && data.gopdproducts[0]) {
                return data.gopdproducts[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Remove a Gopdproduct
     * @param {gopdproduct} gopdproduct
     *
     * @return Promise<boolean>
     */
    deleteGopdproduct(gopdproduct: GOPDProducts): Promise<boolean> {
        return this.db.rel.del('gopdproduct', gopdproduct).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * Labproduct
    **********/
    /**
     * Save a labproduct
     * @param {labproduct} labproduct
     *
     * @return Promise<LabProducts>
     */
    saveLabproduct(labproduct: LabProducts): Promise<LabProducts> {
        labproduct.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('labproduct', labproduct).then((data: any) => {
            if (data && data.labproducts && data.labproducts[0]) {
                return data.labproducts[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Return all the labproducts
     *
     * @return Promise<Array<LabProducts>>
     */
    getLabproducts(): Promise<Array<LabProducts>> {
        return this.db.rel.find('labproduct').then((data: any) => {
            let labproducts = data.labproducts ? data.labproducts : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    labproducts.sort((a: any, b: any) => {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    labproducts.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return labproducts;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
    * Read a labproduct
    * @param {labproduct} labproduct
    *
    * @return Promise<LabProducts>
    */
    getLabproduct(id): Promise<LabProducts> {
        return this.db.rel.find('labproduct', id).then((data: any) => {
            return data && data.labproducts ? data.labproducts[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a LabProduct
    * @param {labproduct} labproduct
    *
    * @return Promise<LabProducts>
    */
    updateLabproduct(labproduct: LabProducts): Promise<LabProducts> {
        return this.db.rel.save('labproduct', labproduct).then((data: any) => {
            if (data && data.labproducts && data.labproducts[0]) {
                return data.labproducts[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }


    /**
     * Remove a LabProduct
     * @param {labproduct} labproduct
     *
     * @return Promise<boolean>
     */
    deleteLabproduct(labproduct: LabProducts): Promise<boolean> {
        return this.db.rel.del('labproduct', labproduct).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * CounterProduct
    **********/
    /**
     * Save a counterproduct
     * @param {counterproduct} counterproduct
     *
     * @return Promise<CounterProduct>
     */
    saveCounterProduct(counterproduct: CounterProducts): Promise<CounterProducts> {
        counterproduct.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('counterproduct', counterproduct).then((data: any) => {
            if (data && data.counterproducts && data.counterproducts[0]) {
                return data.counterproducts[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Return all the CounterProducts
     *
     * @return Promise<Array<CounterProducts>>
     */
    getCounterProducts(): Promise<Array<CounterProducts>> {
        return this.db.rel.find('counterproduct').then((data: any) => {
            let counterproducts = data.counterproducts ? data.counterproducts : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    counterproducts.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.datesupplied).getTime() - new Date(b.datesupplied).getTime();
                    })
                    break;
                case 'DESC':
                    counterproducts.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.datesupplied).getTime() - new Date(a.datesupplied).getTime();
                    });
                    break;
                default:
                    break;
            }
            return counterproducts;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
     * Read a CounterProduct
     * @param {counterproduct} counterproduct
     *
     * @return Promise<CounterProducts>
     */
    getCounterProduct(id): Promise<CounterProducts> {
        return this.db.rel.find('counterproduct', id).then((data: any) => {
            return data && data.counterproducts ? data.counterproducts[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a counterproduct
    * @param {counterproduct} counterproduct
    *
    * @return Promise<CounterProducts>
    */
    updateCounterProduct(counterproduct: CounterProducts): Promise<CounterProducts> {
        return this.db.rel.save('counterproduct', counterproduct).then((data: any) => {
            if (data && data.counterproducts && data.counterproducts[0]) {
                return data.counterproducts[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Remove a CounterProduct
     * @param {counterproduct} counterproduct
     *
     * @return Promise<boolean>
     */
    deleteCounterProduct(counterproduct: CounterProducts): Promise<boolean> {
        return this.db.rel.del('counterproduct', counterproduct).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * Radiologyproduct
    **********/
    /**
     * Save a radiologyproduct
     * @param {radiologyproduct} radiologyproduct
     *
     * @return Promise<RadiologyProducts>
     */
    saveRadiologyproduct(radiologyproduct: RadiologyProducts): Promise<RadiologyProducts> {
        radiologyproduct.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('radiologyproduct', radiologyproduct).then((data: any) => {
            if (data && data.radiologyproducts && data.radiologyproducts[0]) {
                return data.radiologyproducts[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Return all the radiologyproducts
     *
     * @return Promise<Array<RadiologyProducts>>
     */
    getRadiologyproducts(): Promise<Array<RadiologyProducts>> {
        return this.db.rel.find('radiologyproduct').then((data: any) => {
            let radiologyproducts = data.radiologyproducts ? data.radiologyproducts : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    radiologyproducts.sort((a: any, b: any) => {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    radiologyproducts.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return radiologyproducts;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
     * Read a radiologyproduct
     * @param {radiologyproduct} radiologyproduct
     *
     * @return Promise<RadiologyProducts>
     */
    getRadiologyproduct(id): Promise<RadiologyProducts> {
        return this.db.rel.find('radiologyproduct', id).then((data: any) => {
            return data && data.radiologyproducts ? data.radiologyproducts[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a RadiologyProducts
    * @param {radiologyproduct} radiologyproduct
    *
    * @return Promise<RadiologyProducts>
    */
    updateRadiologyproduct(radiologyproduct: RadiologyProducts): Promise<RadiologyProducts> {
        return this.db.rel.save('radiologyproduct', radiologyproduct).then((data: any) => {
            if (data && data.radiologyproducts && data.radiologyproducts[0]) {
                return data.radiologyproducts[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Remove a RadiologyProduct
     * @param {radiologyproduct} radiologyproduct
     *
     * @return Promise<boolean>
     */
    deleteRadiologyproduct(radiologyproduct: RadiologyProducts): Promise<boolean> {
        return this.db.rel.del('radiologyproduct', radiologyproduct).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * Theaterproduct
    **********/
    /**
     * Save a Theaterproduct
     * @param {theaterproduct} theaterproduct
     *
     * @return Promise<theaterproduct>
     */
    saveTheaterproduct(theaterproduct: TheaterProducts): Promise<TheaterProducts> {
        theaterproduct.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('theaterproduct', theaterproduct).then((data: any) => {
            if (data && data.theaterproducts && data.theaterproducts[0]) {
                return data.theaterproducts[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Return all the theaterproducts
     *
     * @return Promise<Array<TheaterProducts>>
     */
    getTheaterproducts(): Promise<Array<TheaterProducts>> {
        return this.db.rel.find('theaterproduct').then((data: any) => {
            let theaterproducts = data.theaterproducts ? data.theaterproducts : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    theaterproducts.sort((a: any, b: any) => {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    theaterproducts.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return theaterproducts;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
     * Read a theaterproduct
     * @param {theaterproduct} theaterproduct
     *
     * @return Promise<TheaterProducts>
     */
    getTheaterproduct(id): Promise<TheaterProducts> {
        return this.db.rel.find('theaterproduct', id).then((data: any) => {
            return data && data.theaterproducts ? data.theaterproducts[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a TheaterProducts
    * @param {radiologyproduct} radiologyproduct
    *
    * @return Promise<RadiologyProducts>
    */
    updateTheaterproduct(theaterproduct: TheaterProducts): Promise<TheaterProducts> {
        return this.db.rel.save('theaterproduct', theaterproduct).then((data: any) => {
            if (data && data.theaterproducts && data.theaterproducts[0]) {
                return data.theaterproducts[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Remove a TheaterProduct
    * @param {theaterproduct} theaterproduct
    *
    * @return Promise<boolean>
    */
    deleteTheaterproduct(theaterproduct: TheaterProducts): Promise<boolean> {
        return this.db.rel.del('theaterproduct', theaterproduct).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }


    /***********
    * Productcategory
    **********/
    /**
     * Save a Productcategory
     * @param {productcategory} productcategory
     *
     * @return Promise<Productcategory>
     */
    saveProductcategory(productcategory: ProductCategory): Promise<ProductCategory> {
        productcategory.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('productcategory', productcategory).then((data: any) => {
            if (data && data.productcategorys && data.productcategorys[0]) {
                return data.productcategorys[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Return all the productcategorys
     *
     * @return Promise<Array<ProductCategory>>
     */
    getProductcategorys(): Promise<Array<ProductCategory>> {
        return this.db.rel.find('productcategory').then((data: any) => {
            let productcategorys = data.productcategorys ? data.productcategorys : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    productcategorys.sort((a: any, b: any) => {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    productcategorys.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return productcategorys;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
     * Read a productcategory
     * @param {productcategory} productcategory
     *
     * @return Promise<ProductCategory>
     */
    getProductcategory(id): Promise<ProductCategory> {
        return this.db.rel.find('productcategory', id).then((data: any) => {
            return data && data.productcategorys ? data.productcategorys[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a productcategory
    * @param {productcategory} productcategory
    *
    * @return Promise<ProductCategory>
    */
    updateProductcategory(productcategory: ProductCategory): Promise<ProductCategory> {
        return this.db.rel.save('productcategory', productcategory).then((data: any) => {
            if (data && data.productcategorys && data.productcategorys[0]) {
                return data.productcategorys[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Remove a productcategory
    * @param {productcategory} productcategory
    *
    * @return Promise<boolean>
    */
    deleteProductcategory(productcategory: ProductCategory): Promise<boolean> {
        return this.db.rel.del('productcategory', productcategory).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * Service
    **********/
    /**
     * Save a service
     * @param {service} service
     *
     * @return Promise<service>
     */
    saveService(service: Services): Promise<Services> {
        service.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('service', service).then((data: any) => {
            if (data && data.services && data.services[0]) {
                return data.services[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Return all the services
    *
    * @return Promise<Array<Services>>
    */
    getServices(): Promise<Array<Services>> {
        return this.db.rel.find('service').then((data: any) => {
            let services = data.services ? data.services : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    services.sort((a: any, b: any) => {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    services.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return services;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
     * Read a service
     * @param {service} service
     *
     * @return Promise<Services>
     */
    getService(id): Promise<Services> {
        return this.db.rel.find('service', id).then((data: any) => {
            return data && data.services ? data.services[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a service
    * @param {service} service
    *
    * @return Promise<Services>
    */
    updateService(service: Services): Promise<Services> {
        return this.db.rel.save('service', service).then((data: any) => {
            if (data && data.services && data.services[0]) {
                return data.services[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Remove a service
     * @param {service} service
     *
     * @return Promise<boolean>
     */
    deleteService(service: Services): Promise<boolean> {
        return this.db.rel.del('service', service).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * RenderService
    **********/
    /**
     * Save a RenderService
     * @param {renderservice} renderservice
     *
     * @return Promise<RenderService>
     */
    saveRenderService(renderservice: RenderService): Promise<RenderService> {
        renderservice.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('renderservice', renderservice).then((data: any) => {
            if (data && data.renderservices && data.renderservices[0]) {
                return data.renderservices[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Return all the RenderServices
     *
     * @return Promise<Array<RenderService>>
     */
    getRenderServices(): Promise<Array<RenderService>> {
        return this.db.rel.find('renderservice').then((data: any) => {
            let renderservices = data.renderservices ? data.renderservices : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    renderservices.sort((a: any, b: any) => {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    renderservices.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return renderservices;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
    * Read a renderservice
    * @param {renderservice} renderservice
    *
    * @return Promise<RenderService>
    */
    getRenderService(id): Promise<RenderService> {
        return this.db.rel.find('renderservice', id).then((data: any) => {
            return data && data.renderservices ? data.renderservices[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a renderservice
    * @param {renderservice} renderservice
    *
    * @return Promise<RenderService>
    */
    updateRenderService(renderservice: RenderService): Promise<RenderService> {
        return this.db.rel.save('renderservice', renderservice).then((data: any) => {
            if (data && data.renderservices && data.renderservices[0]) {
                return data.renderservices[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Remove a renderservice
     * @param {renderservice} renderservice
     *
     * @return Promise<boolean>
     */
    deleteRenderService(renderservice: RenderService): Promise<boolean> {
        return this.db.rel.del('renderservice', renderservice).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * Patient
    **********/
    /**
     * Save a patient
     * @param {patient} patient
     *
     * @return Promise<Patient>
     */
    savePatient(patient: Patient): Promise<Patient> {
        patient.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('patient', patient).then((data: any) => {
            if (data && data.patients && data.patients[0]) {
                return data.patients[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Return all the Patients
    *
    * @return Promise<Array<Patient>>
    */
    getPatients(): Promise<Array<Patient>> {
        return this.db.rel.find('patient').then((data: any) => {
            console.log(data);
            let patients = data.patients ? data.patients : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    patients.sort((a: any, b: any) => {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    patients.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return patients;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
    * Read a patient
    * @param {patient} patient
    *
    * @return Promise<Patients>
    */
    getPatient(id): Promise<Patient> {
        return this.db.rel.find('patient', id).then((data: any) => {
            return data && data.patients ? data.patients[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a patient
    * @param {patient} patient
    *
    * @return Promise<Patient>
    */
    updatePatient(patient: Patient): Promise<Patient> {
        return this.db.rel.save('patient', patient).then((data: any) => {
            if (data && data.patients && data.patients[0]) {
                return data.patients[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Remove a patient
    * @param {patient} patient
    *
    * @return Promise<boolean>
    */
    deletePatient(patient: Patient): Promise<boolean> {
        return this.db.rel.del('patient', patient).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * Vendor
    **********/
    /**
     * Save a vendor
     * @param {vendor} vendor
     *
     * @return Promise<Vendor>
     */
    saveVendor(vendor: Vendor): Promise<Vendor> {
        vendor.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('vendor', vendor).then((data: any) => {
            if (data && data.vendors && data.vendors[0]) {
                return data.vendors[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Return all the Vendors
    *
    * @return Promise<Array<Vendor>>
    */
    getVendors(): Promise<Array<Vendor>> {
        return this.db.rel.find('vendor').then((data: any) => {
            let vendors = data.vendors ? data.vendors : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    vendors.sort((a: any, b: any) => {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    vendors.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return vendors;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
    * Read a vendor
    * @param {vendor} vendor
    *
    * @return Promise<Vendors>
    */
    getVendor(id): Promise<Vendor> {
        return this.db.rel.find('vendor', id).then((data: any) => {
            return data && data.vendors ? data.vendors[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a vendor
    * @param {vendor} vendor
    *
    * @return Promise<Vendor>
    */
    updateVendor(vendor: Vendor): Promise<Vendor> {
        return this.db.rel.save('vendor', vendor).then((data: any) => {
            if (data && data.vendors && data.vendors[0]) {
                return data.vendors[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Remove a vendor
    * @param {vendor} vendor
    *
    * @return Promise<boolean>
    */
    deleteVendor(vendor: Vendor): Promise<boolean> {
        return this.db.rel.del('vendor', vendor).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * Evacuated
    **********/
    /**
     * Save an evacuate
     * @param {evacuate} evacuate
     *
     * @return Promise<Evacuate>
     */
    saveEvacuate(evacuate: Evacuate): Promise<Evacuate> {
        evacuate.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('evacuate', evacuate).then((data: any) => {
            if (data && data.evacuates && data.evacuates[0]) {
                return data.evacuates[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Return all the Evacuates
    *
    * @return Promise<Array<Evacuate>>
    */
    getEvacuates(): Promise<Array<Evacuate>> {
        return this.db.rel.find('evacuate').then((data: any) => {
            let evacuates = data.evacuates ? data.evacuates : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    evacuates.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    })
                    break;
                case 'DESC':
                    evacuates.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    });
                    break;
                default:
                    break;
            }
            return evacuates;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
    * Read a evacuate
    * @param {evacuate} evacuate
    *
    * @return Promise<Evacuates>
    */
    getEvacuate(id): Promise<Evacuate> {
        return this.db.rel.find('Evacuate', id).then((data: any) => {
            return data && data.evacuates ? data.evacuates[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a evacuate
    * @param {evacuate} evacuate
    *
    * @return Promise<Evacuate>
    */
    updateEvacuate(evacuate: Evacuate): Promise<Evacuate> {
        return this.db.rel.save('evacuate', evacuate).then((data: any) => {
            if (data && data.evacuates && data.evacuates[0]) {
                return data.evacuates[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Remove a evacuate
    * @param {evacuate} evacuate
    *
    * @return Promise<boolean>
    */
    deleteEvacuate(evacuate: Evacuate): Promise<boolean> {
        return this.db.rel.del('evacuate', evacuate).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }


    /***********
    * Individual Sales
    **********/
    /**
     * Save an individualsale
     * @param {individualsale} individualsale
     *
     * @return Promise<IndividualSale>
     */
    saveIndividualSale(individualsale: IndividualSale): Promise<IndividualSale> {
        individualsale.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('individualsale', individualsale).then((data: any) => {
            if (data && data.individualsales && data.individualsales[0]) {
                return data.individualsales[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Return all the IndividualSales
    *
    * @return Promise<Array<IndividualSale>>
    */
    getIndividualSales(): Promise<Array<IndividualSale>> {
        return this.db.rel.find('individualsale').then((data: any) => {
            let individualsales = data.individualsales ? data.individualsales : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    individualsales.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.checkindate).getTime() - new Date(b.checkindate).getTime();
                    })
                    break;
                case 'DESC':
                    individualsales.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.checkindate).getTime() - new Date(a.checkindate).getTime();
                    });
                    break;
                default:
                    break;
            }
            return individualsales;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
    * Read a individualsale
    * @param {individualsale} individualsale
    *
    * @return Promise<IndividualSales>
    */
    getIndividualSale(id): Promise<IndividualSale> {
        return this.db.rel.find('individualsale', id).then((data: any) => {
            return data && data.individualsales ? data.individualsales[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a individualsale
    * @param {individualsale} individualsale
    *
    * @return Promise<IndividualSale>
    */
    updateIndividualSale(individualsale: IndividualSale): Promise<IndividualSale> {
        return this.db.rel.save('individualsale', individualsale).then((data: any) => {
            if (data && data.individualsales && data.individualsales[0]) {
                return data.individualsales[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Remove a individualsale
    * @param {individualsale} individualsale
    *
    * @return Promise<boolean>
    */
    deleteIndividualSale(individualsale: IndividualSale): Promise<boolean> {
        return this.db.rel.del('individualsale', individualsale).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * Damaged Product
    **********/
    /**
     * Save an damagedproduct
     * @param {damagedproduct} damagedproduct
     *
     * @return Promise<Damagedproduct>
     */
    saveDamagedproduct(damagedproduct: Damagedproduct): Promise<Damagedproduct> {
        damagedproduct.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('damagedproduct', damagedproduct).then((data: any) => {
            if (data && data.damagedproducts && data.damagedproducts[0]) {
                return data.damagedproducts[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Return all the Damagedproducts
    *
    * @return Promise<Array<Damagedproduct>>
    */
    getDamagedproducts(): Promise<Array<Damagedproduct>> {
        return this.db.rel.find('damagedproduct').then((data: any) => {
            let damagedproducts = data.damagedproducts ? data.damagedproducts : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    damagedproducts.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.checkindate).getTime() - new Date(b.checkindate).getTime();
                    })
                    break;
                case 'DESC':
                    damagedproducts.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.checkindate).getTime() - new Date(a.checkindate).getTime();
                    });
                    break;
                default:
                    break;
            }
            return damagedproducts;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
    * Read a damagedproduct
    * @param {damagedproduct} damagedproduct
    *
    * @return Promise<Damagedproducts>
    */
    getDamagedproduct(id): Promise<Damagedproduct> {
        return this.db.rel.find('damagedproduct', id).then((data: any) => {
            return data && data.damagedproducts ? data.damagedproducts[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a damagedproduct
    * @param {damagedproduct} damagedproduct
    *
    * @return Promise<Damagedproduct>
    */
    updateDamagedproduct(damagedproduct: Damagedproduct): Promise<Damagedproduct> {
        return this.db.rel.save('damagedproduct', damagedproduct).then((data: any) => {
            if (data && data.damagedproducts && data.damagedproducts[0]) {
                return data.damagedproducts[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Remove a damagedproduct
    * @param {damagedproduct} damagedproduct
    *
    * @return Promise<boolean>
    */
    deleteDamagedproduct(damagedproduct: Damagedproduct): Promise<boolean> {
        return this.db.rel.del('damagedproduct', damagedproduct).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * Gross Profit
    **********/
    /**
     * Save an grossprofit
     * @param {grossprofit} grossprofit
     *
     * @return Promise<Grossprofit>
     */
    saveGrossprofit(grossprofit: Grossprofit): Promise<Grossprofit> {
        grossprofit.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('grossprofit', grossprofit).then((data: any) => {
            if (data && data.grossprofits && data.grossprofits[0]) {
                return data.grossprofits[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Return all the Grossprofits
    *
    * @return Promise<Array<Grossprofit>>
    */
    getGrossprofits(): Promise<Array<Grossprofit>> {
        return this.db.rel.find('grossprofit').then((data: any) => {
            let grossprofits = data.grossprofits ? data.grossprofits : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    grossprofits.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    })
                    break;
                case 'DESC':
                    grossprofits.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    });
                    break;
                default:
                    break;
            }
            return grossprofits;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
    * Read a grossprofit
    * @param {grossprofit} grossprofit
    *
    * @return Promise<Grossprofits>
    */
    getGrossprofit(id): Promise<Grossprofit> {
        return this.db.rel.find('grossprofit', id).then((data: any) => {
            return data && data.grossprofits ? data.grossprofits[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a grossprofit
    * @param {grossprofit} grossprofit
    *
    * @return Promise<Grossprofit>
    */
    updateGrossprofit(grossprofit: Grossprofit): Promise<Grossprofit> {
        return this.db.rel.save('grossprofit', grossprofit).then((data: any) => {
            if (data && data.grossprofits && data.grossprofits[0]) {
                return data.grossprofits[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Remove a grossprofit
    * @param {grossprofit} grossprofit
    *
    * @return Promise<boolean>
    */
    deleteGrossprofit(grossprofit: Grossprofit): Promise<boolean> {
        return this.db.rel.del('grossprofit', grossprofit).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * Net Profit
    **********/
    /**
     * Save an netprofit
     * @param {netprofit} netprofit
     *
     * @return Promise<Netprofit>
     */
    saveNetprofit(netprofit: Netprofit): Promise<Netprofit> {
        netprofit.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('netprofit', netprofit).then((data: any) => {
            if (data && data.netprofits && data.netprofits[0]) {
                return data.netprofits[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Return all the Netprofits
    *
    * @return Promise<Array<Netprofit>>
    */
    getNetprofits(): Promise<Array<Netprofit>> {
        return this.db.rel.find('netprofit').then((data: any) => {
            let netprofits = data.netprofits ? data.netprofits : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    netprofits.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    })
                    break;
                case 'DESC':
                    netprofits.sort((a: any, b: any) => {
                        //return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                        return new Date(b.netdate).getTime() - new Date(a.netdate).getTime();
                    });
                    break;
                default:
                    break;
            }
            return netprofits;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
    * Read a netprofit
    * @param {netprofit} netprofit
    *
    * @return Promise<Netprofits>
    */
    getNetprofit(id): Promise<Netprofit> {
        return this.db.rel.find('netprofit', id).then((data: any) => {
            return data && data.netprofits ? data.netprofits[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a netprofit
    * @param {netprofit} netprofit
    *
    * @return Promise<Netprofit>
    */
    updateNetprofit(netprofit: Netprofit): Promise<Netprofit> {
        return this.db.rel.save('netprofit', netprofit).then((data: any) => {
            if (data && data.netprofits && data.netprofits[0]) {
                return data.netprofits[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Remove a netprofit
    * @param {netprofit} netprofit
    *
    * @return Promise<boolean>
    */
    deleteNetprofit(netprofit: Netprofit): Promise<boolean> {
        return this.db.rel.del('netprofit', netprofit).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    /***********
    * Department Dispatch
    **********/
    /**
     * Save a department dispatch
     * @param {departmentdispatch} departmentdispatch
     *
     * @return Promise<departmentdispatch>
     */
    saveDepartmentDispatch(departmentdispatch: DepartmentDispatch): Promise<DepartmentDispatch> {
        //departmentdispatch.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('departmentdispatch', departmentdispatch).then((data: any) => {
            if (data && data.departmentdispatchs && data.departmentdispatchs[0]) {
                return data.departmentdispatchs[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Return all the departmentdispatchs
     *
     * @return Promise<Array<DepartmentDispatch>>
     */
    getDepartmentDispatchs(): Promise<Array<DepartmentDispatch>> {
        return this.db.rel.find('departmentdispatch').then((data: any) => {
            let departmentdispatchs = data.departmentdispatchs ? data.departmentdispatchs : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    departmentdispatchs.sort((a: any, b: any) => {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    departmentdispatchs.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return departmentdispatchs;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
     * Read a DepartmentDispatch
     * @param {departmentdispatch} departmentdispatch
     *
     * @return Promise<DepartmentDispatch>
     */
    getDepartmentDispatch(id): Promise<DepartmentDispatch> {
        return this.db.rel.find('departmentdispatch', id).then((data: any) => {
            return data && data.departmentdispatchs ? data.departmentdispatchs[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a DepartmentDispatch
    * @param {departmentdispatch} departmentdispatch
    *
    * @return Promise<departmentdispatch>
    */
    updateDepartmentDispatch(departmentdispatch: DepartmentDispatch): Promise<DepartmentDispatch> {
        return this.db.rel.save('departmentdispatch', departmentdispatch).then((data: any) => {
            if (data && data.departmentdispatchs && data.departmentdispatchs[0]) {
                return data.departmentdispatchs[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Remove a DepartmentDispatch
    * @param {departmentdispatch} departmentdispatch
    *
    * @return Promise<boolean>
    */
    deleteDepartmentDispatch(departmentdispatch: DepartmentDispatch): Promise<boolean> {
        return this.db.rel.del('departmentdispatch', departmentdispatch).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

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
    saveStock(stock: Stock): Promise<Stock> {
        //departmentdispatch.id = Math.floor(Date.now()).toString();
        return this.db.rel.save('stock', stock).then((data: any) => {
            if (data && data.stocks && data.stocks[0]) {
                return data.stocks[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
     * Return all the stocks
     *
     * @return Promise<Array<Stock>>
     */
    getStocks(): Promise<Array<Stock>> {
        return this.db.rel.find('stock').then((data: any) => {
            let stocks = data.stocks ? data.stocks : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    stocks.sort((a: any, b: any) => {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    stocks.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
                    });
                    break;
                default:
                    break;
            }
            return stocks;
        }).catch((err: any) => {
            console.log(err);
        });
    }

    /**
     * Read a Stock
     * @param {stock} stock
     *
     * @return Promise<stock>
     */
    getStock(id): Promise<Stock> {
        return this.db.rel.find('stock', id).then((data: any) => {
            return data && data.stocks ? data.stocks[0] : null
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Update a Stock
    * @param {stock} stock
    *
    * @return Promise<stock>
    */
    updateStock(stock: Stock): Promise<Stock> {
        return this.db.rel.save('stock', stock).then((data: any) => {
            if (data && data.stocks && data.stocks[0]) {
                return data.stocks[0];
            }
            return null;
        }).catch((err: any) => {
            console.log(err);
        })
    }

    /**
    * Remove a Stock
    * @param {stock} stock
    *
    * @return Promise<boolean>
    */
    deleteStock(stock: Stock): Promise<boolean> {
        return this.db.rel.del('stock', stock).then((data: any) => {
            return data && data.deleted ? data.deleted : false
        }).catch((err: any) => {
            console.log(err)
        })
    }

    userPermission(): Promise<any> {
        var localStorageItem = JSON.parse(localStorage.getItem('user'));
        return this.getStaff(localStorageItem).then(staff => {
            return staff;
        }).catch((err: Error) => {
            console.log(err);
        });
    }

}