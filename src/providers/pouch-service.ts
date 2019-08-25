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
import { Expenses } from '../model/expense';
import { GOPDProducts } from '../model/gopdpharmproduct';
import { LabProducts } from '../model/labproduct';
import { CounterProducts } from '../model/counterproduct';
import { Patient } from '../model/patient';
import { Products } from '../model/product';
import { ProductCategory } from '../model/productcategory';
import { RadiologyProducts } from '../model/radiologyproduct';
import { Sales } from '../model/sales';
import { Services } from '../model/service';
import { RenderService } from '../model/renderservice';
import { Staff } from '../model/staff';
import { TheaterProducts } from '../model/theaterproduct';
import { DispatchedProducts } from '../model/dispatchedproduct';
import { Schema } from '../model/relational-schema';


@Injectable()
export class PouchService {
    private db;
    remote: any;
    finishSync: any;

    /**
    * Constructor
    */
    constructor() {
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
                fields: ['data.product', '_id']
            }
        });
    }

    enableSyncing() {
        let options = {
            Auth: {
                username: 'sarutech',
                password: 'Sarutobi2014'
            },
            live: true,
            retry: true,
            continuous: true
        };

        this.remote = 'http://sarutech.com:5984/iuth';

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

    /* checkRemoteSync() {
        this.remote = 'http://sarutech.com:5984/iuth';

        let loading
        if (this.finishSync == undefined) {
            loading = this.load.create({
                content: 'Syncing, Please wait...'
            });
            loading.present();

            this.db.sync(this.remote).on('complete', function (info) {
                this.finishSync = info;
                console.log(this.finishSync.pull.status);
                if (this.finishSync.pull.status == 'complete') {
                    loading.dismiss();
                }
                console.log('complete', info);
            }).on('error', function (err) {
                console.log('offline');
                loading.dismiss();
            });
        }

    }
 */

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
        department.id = Math.floor(Date.now()).toString();
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
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    sales.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
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
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    expenses.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
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
            console.log(data);
            let products = data.products ? data.products : [];
            let sortBy = 'DESC';

            switch (sortBy) {
                case 'ASC':
                    products.sort((a: any, b: any) => {
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    products.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
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
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    dispatchedproducts.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
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
                        return (a.id > b.id) ? 1 : ((a.id > b.id) ? -1 : 0);
                    })
                    break;
                case 'DESC':
                    counterproducts.sort((a: any, b: any) => {
                        return (a.id > b.id) ? -1 : ((a.id > b.id) ? 1 : 0);
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


}