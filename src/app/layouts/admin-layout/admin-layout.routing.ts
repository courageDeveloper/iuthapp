import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { AddVendorComponent } from '../../add-vendor/add-vendor.component';
import { EditUserProfileComponent } from '../../edit-user-profile/edit-user-profile.component';
import { EditVendorComponent } from '../../edit-vendor/edit-vendor.component';
import { AddPatientComponent } from '../../add-patient/add-patient.component';
import { LoginComponent } from '../../login/login.component';
import { ViewStaffComponent } from '../../view-staff/view-staff.component';
import { ViewVendorComponent } from '../../view-vendor/view-vendor.component';
import { NotAuthorisedComponent } from '../../not-authorised/not-authorised.component';
import { EditPatientComponent } from '../../edit-patient/edit-patient.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { MainPharmacyPosComponent } from '../../main-pharmacy-pos/main-pharmacy-pos.component';
import { ViewPatientComponent } from '../../view-patient/view-patient.component';
import { RevenuePosComponent } from '../../revenue-pos/revenue-pos.component';
import { AccountPosComponent } from '../../account-pos/account-pos.component';
import { ViewPayrollComponent } from '../../payroll/view-payroll/view-payroll.component';
import { ViewSalesComponent } from '../../sales/view-sales/view-sales.component';
import { ViewExpensesComponent } from '../../expenses/view-expenses/view-expenses.component';
import { ViewPharmacyStoreCategoryComponent } from '../../pharmacystorecategory/view-pharmacystorecategory/view-pharmacystorecategory.component';
import { ViewPharmacyStoreComponent } from '../../pharmacystore/view-pharmacystore/view-pharmacystore.component';
import { ViewMainPharmacyServiceComponent } from '../../main-pharmacy-service/view-main-pharmacy-service/view-main-pharmacy-service.component';
import { ViewPharmacyServiceComponent } from '../../pharmacyservice/view-pharmacyservice/view-pharmacyservice.component';
import { ViewCentralStoreCategoryComponent } from '../../centralstorecategory/view-centralstorecategory/view-centralstorecategory.component';
import { ViewCentralStoreCategoryBcComponent } from '../../centralstorecategory_bc/view-centralstorecategory_bc/view-centralstorecategory_bc.component';
import { ImageviewerComponent } from '../../image-viewer/image-viewer.component';
import { ViewDispatchComponent } from '../../pharmacystore/view-dispatch/view-dispatch.component';
import { ViewCentralStoreComponent } from '../../centralstore/view-centralstore/view-centralstore.component';
import { ViewDispatchCentralStoreComponent } from '../../centralstore/view-dispatch-centralstore/view-dispatch-centralstore.component';
import { ViewCentralStoreBcComponent } from '../../centralstore_bc/view-centralstore_bc/view-centralstore_bc.component';
import { ViewDispatchCentralStoreBcComponent } from '../../centralstore_bc/view-dispatch-centralstore_bc/view-dispatch-centralstore_bc.component';
import { ViewGopdPharmacyServiceComponent } from '../../gopd-pharmacy-service/view-gopd-pharmacy-service/view-gopd-pharmacy-service.component';
import { ViewLaboratoryServiceComponent } from '../../laboratory-service/view-laboratory-service/view-laboratory-service.component';
import { ViewRadiologyServiceComponent } from '../../radiology-service/view-radiology-service/view-radiology-service.component';
import { ViewTheatreServiceComponent } from '../../theatre-service/view-theatre-service/view-theatre-service.component';
import { ViewMainPharmacyServiceBcComponent } from '../../main-pharmacy-service_bc/view-main-pharmacy-service_bc/view-main-pharmacy-service_bc.component';
import { ViewMainPharmacyCounterProductComponent } from '../../main-pharmacy-counterproduct/view-main-pharmacy-counterproduct/view-main-pharmacy-counterproduct.component';
import { ImageviewerCounterProductComponent } from '../../image-viewer-counterproduct/image-viewer-counterproduct.component';
import { GopdPharmacyPosComponent } from '../../gopd-pharmacy-pos/gopd-pharmacy-pos.component';
import { ViewGopdPharmacyCounterProductComponent } from '../../gopd-pharmacy-counterproduct/view-gopd-pharmacy-counterproduct/view-gopd-pharmacy-counterproduct.component';
import { LaboratoryPosComponent } from '../../laboratory-pos/laboratory-pos.component';
import { ViewLaboratoryCounterProductComponent } from '../../laboratory-counterproduct/view-laboratory-counterproduct/view-laboratory-counterproduct.component';
import { RadiologyPosComponent } from '../../radiology-pos/radiology-pos.component';
import { ViewRadiologyCounterProductComponent } from '../../radiology-counterproduct/view-radiology-counterproduct/view-radiology-counterproduct.component';
import { MainPharmacyPosBcComponent } from '../../main-pharmacy-pos_bc/main-pharmacy-pos_bc.component';
import { ViewMainPharmacyCounterProductBcComponent } from '../../main-pharmacy-counterproduct_bc/view-main-pharmacy-counterproduct_bc/view-main-pharmacy-counterproduct_bc.component';
import { ViewRevenueCounterProductComponent } from '../../revenue-counterproduct/view-revenue-counterproduct/view-revenue-counterproduct.component';
import { ViewDepartmentComponent } from '../../view-department/view-department.component';
import { ViewAccountCounterProductComponent } from '../../account-counterproduct/view-account-counterproduct/view-account-counterproduct.component';
import { ViewEvacuatedComponent } from '../../view-evacuated/view-evacuated.component';
import { ViewLoansComponent } from '../../sales/view-loans/view-loans.component';
import { ViewBorrowsComponent } from '../../expenses/view-borrows/view-borrows.component';
import { ViewHistoryStaffComponent } from '../../view-staff/view-history-staff/view-history-staff.component';
import { ViewHistoryPatientComponent } from '../../view-patient/view-history-patient/view-history-patient.component';
import { ViewHistoryDepartmentComponent } from '../../view-department/view-history-department/view-history-department.component';
import { AuthGuardService } from '../../guards/auth-guard.service';
import { RoleGuardService } from '../../guards/role-guard.service';
import { ViewHistoryVendorComponent } from '../../view-vendor/view-history-vendor/view-history-vendor.component';
import { ViewGeneralServiceComponent } from '../../general-service/view-general-service/view-general-service.component';
import { ViewIndividualsalesComponent } from '../../view-individualsales/view-individualsales.component';
import { DrugNotificationsComponent } from '../../drugnotifications/drugnotifications.component';
import { DrugquantityNotificationsComponent } from '../../drugquantitynotifications/drugquantitynotifications.component';
import { ViewDamagedproductsComponent } from '../../damagedproducts/view-damagedproducts/view-damagedproducts.component';
import { OrderedItemsComponent } from '../../departmentsales/ordereditems/ordereditems.component';
import { CreditOrderedItemsComponent } from '../../departmentsales/creditordereditems/creditordereditems.component';
import { DepartmentExpensesComponent } from '../../departmentexpenses/department-expenses/department-expenses.component';
import { DepartmentLiabilityComponent } from '../../departmentexpenses/department-liability/department-liability.component';
import { ViewGrossProfitComponent } from '../../grossprofit/view-grossprofit/view-grossprofit.component';
import { ViewGeneralCounterProductComponent } from '../../general-counterproduct/view-general-counterproduct/view-general-counterproduct.component';
import { ViewNetProfitComponent } from '../../netprofit/view-netprofit/view-netprofit.component';
import { CashBookComponent} from '../../cash-book/cash-book.component';
import { ViewstockComponent } from '../../stock/viewstock/viewstock.component';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
    { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Admin' }] },
    { path: 'add-vendor', component: AddVendorComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Admin' }] },
    { path: 'edit-user-profile/:id', component: EditUserProfileComponent, canActivate: [AuthGuardService] },
    { path: 'edit-vendor/:id', component: EditVendorComponent, canActivate: [AuthGuardService] },
    { path: 'add-patient', component: AddPatientComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Admin' }] },
    { path: 'edit-patient/:id', component: EditPatientComponent, canActivate: [AuthGuardService] },
    { path: 'view-history-staff/:id', component: ViewHistoryStaffComponent, canActivate: [AuthGuardService] },
    { path: 'view-history-vendor/:id', component: ViewHistoryVendorComponent, canActivate: [AuthGuardService] },
    { path: 'view-history-patient/:id', component: ViewHistoryPatientComponent, canActivate: [AuthGuardService] },
    { path: 'view-history-department/:id', component: ViewHistoryDepartmentComponent, canActivate: [AuthGuardService] },
    { path: 'viewstaff', component: ViewStaffComponent, canActivate: [AuthGuardService] },
    { path: 'view-individualsale', component: ViewIndividualsalesComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Revenue' }, { department: 'Account' }] },
    { path: 'view-vendor', component: ViewVendorComponent, canActivate: [AuthGuardService] },
    { path: 'view-grossprofit', component: ViewGrossProfitComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Main Pharmacy' }, { department: 'GOPD Pharmacy' }, { department: 'Laboratory' }, { department: 'Radiology' }, { department: 'Pharmacy Store' }, { department: 'Central Store' }, { department: 'Revenue' }, { department: 'Account' }, { department: 'Audit' }] },
    { path: 'not-authorised', component: NotAuthorisedComponent, canActivate: [AuthGuardService] },
    { path: 'icons', component: IconsComponent, canActivate: [AuthGuardService] },
    { path: 'maps', component: MapsComponent, canActivate: [AuthGuardService] },
    { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuardService] },
    { path: 'drug-notifications', component: DrugNotificationsComponent, canActivate: [AuthGuardService]},
    { path: 'view-damagedproducts', component: ViewDamagedproductsComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Main Pharmacy' }, { department: 'GOPD Pharmacy' }, { department: 'Laboratory' }, { department: 'Radiology' }, { department: 'Pharmacy Store' }, { department: 'Central Store' }, { department: 'Revenue' }, { department: 'Account' }, { department: 'Audit' }] },
    { path: 'drug-quantity-notifications', component: DrugquantityNotificationsComponent, canActivate: [AuthGuardService]},
    { path: 'upgrade', component: UpgradeComponent, canActivate: [AuthGuardService] },
    { path: 'login', component: LoginComponent },
    { path: 'view-patient', component: ViewPatientComponent, canActivate: [AuthGuardService] },
    { path: 'main-pharmacy-pos', component: MainPharmacyPosComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Main Pharmacy' }] },
    { path: 'department-sales', component: OrderedItemsComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Main Pharmacy' }, { department: 'GOPD Pharmacy' }, { department: 'Laboratory' }, { department: 'Radiology' }] },
    { path: 'department-sales-credit', component: CreditOrderedItemsComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Main Pharmacy' }, { department: 'GOPD Pharmacy' }, { department: 'Laboratory' }, { department: 'Radiology' }] },
    { path: 'department-expenses', component: DepartmentExpensesComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Main Pharmacy' }, { department: 'GOPD Pharmacy' }, { department: 'Laboratory' }, { department: 'Radiology' }, { department: 'Pharmacy Store' }, { department: 'Central Store' }] },
    { path: 'department-liability', component: DepartmentLiabilityComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Main Pharmacy' }, { department: 'GOPD Pharmacy' }, { department: 'Laboratory' }, { department: 'Radiology' }, { department: 'Pharmacy Store' }, { department: 'Central Store' }] },
    { path: 'revenue-pos', component: RevenuePosComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Revenue' }] },
    { path: 'account-pos', component: AccountPosComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Account' }] },
    { path: 'image-viewer/:index', component: ImageviewerComponent, canActivate: [AuthGuardService] },
    { path: 'pay-roll', component: ViewPayrollComponent, canActivate: [AuthGuardService] },
    { path: 'sales', component: ViewSalesComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Revenue' }, { department: 'Account' }, { department: 'Audit' }, { department: 'Admin' }] },
    { path: 'view-net-profit', component: ViewNetProfitComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Revenue' }, { department: 'Account' }, { department: 'Audit' }]},
    { path: 'general-counter-product', component: ViewGeneralCounterProductComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Revenue' }, { department: 'Account' }, { department: 'Audit' }, { department: 'Admin' }] },
    { path: 'cash-book', component: CashBookComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Revenue' }, { department: 'Account' }, { department: 'Audit' }] },
    { path: 'loans', component: ViewLoansComponent, canActivate: [AuthGuardService] },
    { path: 'expenses', component: ViewExpensesComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Account' }, { department: 'Audit' }, { department: 'Admin' }] },
    { path: 'pharmacy-store-category', component: ViewPharmacyStoreCategoryComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Pharmacy Store' }, { department: 'Central Store' }, { department: 'Main Pharmacy' }, { department: 'GOPD Pharmacy' }, { department: 'Laboratory' }, { department: 'Radiology' }, { department: 'Theatre' }, { department: 'Admin' }] },
    { path: 'pharmacy-store', component: ViewPharmacyStoreComponent, canActivate: [AuthGuardService] },
    { path: 'main-pharmacy-services', component: ViewMainPharmacyServiceComponent, canActivate: [AuthGuardService] },
    { path: 'gopd-pharmacy-services', component: ViewGopdPharmacyServiceComponent, canActivate: [AuthGuardService] },
    { path: 'pharmacy-service', component: ViewPharmacyServiceComponent, canActivate: [AuthGuardService] },
    { path: 'central-store-category', component: ViewCentralStoreCategoryComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Pharmacy Store' }, { department: 'Central Store' }, { department: 'Main Pharmacy' }, { department: 'GOPD Pharmacy' }, { department: 'Laboratory' }, { department: 'Radiology' }, { department: 'Theatre' }, { department: 'Admin' }] },
    { path: 'central-store-bc-category', component: ViewCentralStoreCategoryBcComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Central Store' }, { department: 'Main Pharmacy' }, { department: 'Admin' }] },
    { path: 'dispatched-products', component: ViewDispatchComponent, canActivate: [AuthGuardService] },
    { path: 'central-store', component: ViewCentralStoreComponent, canActivate: [AuthGuardService] },
    { path: 'central-store-dispatched-products', component: ViewDispatchCentralStoreComponent, canActivate: [AuthGuardService] },
    { path: 'central-store-bc', component: ViewCentralStoreBcComponent, canActivate: [AuthGuardService] },
    { path: 'central-store-bc-dispatched-products', component: ViewDispatchCentralStoreBcComponent, canActivate: [AuthGuardService] },
    { path: 'laboratory-services', component: ViewLaboratoryServiceComponent, canActivate: [AuthGuardService] },
    { path: 'radiology-services', component: ViewRadiologyServiceComponent, canActivate: [AuthGuardService] },
    { path: 'theater-services', component: ViewTheatreServiceComponent, canActivate: [AuthGuardService] },
    { path: 'general-services', component: ViewGeneralServiceComponent, canActivate: [AuthGuardService] },
    { path: 'main-pharmacy-services-bc', component: ViewMainPharmacyServiceBcComponent, canActivate: [AuthGuardService] },
    { path: 'view-main-pharmacy-counterproduct', component: ViewMainPharmacyCounterProductComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Main Pharmacy' }] },
    { path: 'image-viewer-counterproduct/:index', component: ImageviewerCounterProductComponent, canActivate: [AuthGuardService] },
    { path: 'gopd-pharmacy-pos', component: GopdPharmacyPosComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'GOPD Pharmacy' }] },
    { path: 'view-gopd-pharmacy-counterproduct', component: ViewGopdPharmacyCounterProductComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'GOPD Pharmacy' }] },
    { path: 'laboratory-pos', component: LaboratoryPosComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Laboratory' }] },
    { path: 'view-laboratory-counterproduct', component: ViewLaboratoryCounterProductComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Laboratory' }] },
    { path: 'radiology-pos', component: RadiologyPosComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Radiology' }] },
    { path: 'view-radiology-counterproduct', component: ViewRadiologyCounterProductComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Radiology' }] },
    { path: 'main-pharmacy-pos-bc', component: MainPharmacyPosBcComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Main Pharmacy' }] },
    { path: 'view-main-pharmacy-counterproduct_bc', component: ViewMainPharmacyCounterProductBcComponent, canActivate: [AuthGuardService, RoleGuardService], data: [{ department: 'Main Pharmacy' }] },
    { path: 'view-revenue-counterproduct', component: ViewRevenueCounterProductComponent, canActivate: [AuthGuardService] },
    { path: 'view-account-counterproduct', component: ViewAccountCounterProductComponent, canActivate: [AuthGuardService] },
    { path: 'view-departments', component: ViewDepartmentComponent, canActivate: [AuthGuardService] },
    { path: 'view-evacuated-sales', component: ViewEvacuatedComponent, canActivate: [AuthGuardService] },
    { path: 'borrows', component: ViewBorrowsComponent, canActivate: [AuthGuardService] },
    { path: 'view-stock', component: ViewstockComponent, canActivate: [AuthGuardService] }
];
