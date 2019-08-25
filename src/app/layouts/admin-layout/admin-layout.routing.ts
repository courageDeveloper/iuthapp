import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { EditUserProfileComponent } from '../../edit-user-profile/edit-user-profile.component';
import { AddPatientComponent } from '../../add-patient/add-patient.component';
import { LoginComponent } from '../../login/login.component';
import { ViewStaffComponent } from '../../view-staff/view-staff.component';
import { TypographyComponent } from '../../typography/typography.component';
import { EditPatientComponent } from '../../edit-patient/edit-patient.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import {MainPharmacyPosComponent} from '../../main-pharmacy-pos/main-pharmacy-pos.component';
import {ViewPatientComponent} from '../../view-patient/view-patient.component';
import {RevenuePosComponent} from '../../revenue-pos/revenue-pos.component';
import {ViewPayrollComponent} from '../../payroll/view-payroll/view-payroll.component';
import {ViewSalesComponent} from '../../sales/view-sales/view-sales.component';
import {ViewExpensesComponent} from '../../expenses/view-expenses/view-expenses.component';
import {ViewPharmacyStoreCategoryComponent} from '../../pharmacystorecategory/view-pharmacystorecategory/view-pharmacystorecategory.component';
import {ViewPharmacyStoreComponent} from '../../pharmacystore/view-pharmacystore/view-pharmacystore.component';
import {ViewMainPharmacyServiceComponent} from '../../main-pharmacy-service/view-main-pharmacy-service/view-main-pharmacy-service.component';
import {ViewPharmacyServiceComponent} from '../../pharmacyservice/view-pharmacyservice/view-pharmacyservice.component';
import {ViewCentralStoreCategoryComponent} from '../../centralstorecategory/view-centralstorecategory/view-centralstorecategory.component';
import {ViewCentralStoreCategoryBcComponent} from '../../centralstorecategory_bc/view-centralstorecategory_bc/view-centralstorecategory_bc.component';
import {ImageviewerComponent} from '../../image-viewer/image-viewer.component';
import {ViewDispatchComponent} from '../../pharmacystore/view-dispatch/view-dispatch.component';
import { ViewCentralStoreComponent } from '../../centralstore/view-centralstore/view-centralstore.component';
import { ViewDispatchCentralStoreComponent } from '../../centralstore/view-dispatch-centralstore/view-dispatch-centralstore.component';
import { ViewCentralStoreBcComponent } from '../../centralstore_bc/view-centralstore_bc/view-centralstore_bc.component';
import { ViewDispatchCentralStoreBcComponent } from '../../centralstore_bc/view-dispatch-centralstore_bc/view-dispatch-centralstore_bc.component';
import { ViewGopdPharmacyServiceComponent } from '../../gopd-pharmacy-service/view-gopd-pharmacy-service/view-gopd-pharmacy-service.component';
import { ViewLaboratoryServiceComponent } from '../../laboratory-service/view-laboratory-service/view-laboratory-service.component';
import { ViewRadiologyServiceComponent } from '../../radiology-service/view-radiology-service/view-radiology-service.component';
import { ViewTheatreServiceComponent } from '../../theatre-service/view-theatre-service/view-theatre-service.component';
import { ViewMainPharmacyServiceBcComponent } from '../../main-pharmacy-service_bc/view-main-pharmacy-service_bc/view-main-pharmacy-service_bc.component';

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
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'edit-user-profile/:id',   component: EditUserProfileComponent },
    { path: 'add-patient',    component: AddPatientComponent },
    { path: 'edit-patient/:id',    component: EditPatientComponent },
    { path: 'viewstaff',      component: ViewStaffComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'login',          component: LoginComponent },
    { path: 'view-patient',   component: ViewPatientComponent },
    { path: 'main-pharmacy-pos',   component: MainPharmacyPosComponent },
    { path: 'revenue-pos',   component: RevenuePosComponent },
    { path: 'image-viewer/:index',   component: ImageviewerComponent },
    { path: 'pay-roll',   component: ViewPayrollComponent },
    { path: 'sales',   component: ViewSalesComponent },
    { path: 'expenses',   component: ViewExpensesComponent },
    { path: 'pharmacy-store-category',   component: ViewPharmacyStoreCategoryComponent },
    { path: 'pharmacy-store',   component: ViewPharmacyStoreComponent },
    { path: 'main-pharmacy-services',   component: ViewMainPharmacyServiceComponent },
    { path: 'gopd-pharmacy-services',   component: ViewGopdPharmacyServiceComponent },
    { path: 'pharmacy-service',   component: ViewPharmacyServiceComponent },
    { path: 'central-store-category',   component: ViewCentralStoreCategoryComponent },
    { path: 'central-store-bc-category',   component: ViewCentralStoreCategoryBcComponent },
    { path: 'dispatched-products',   component: ViewDispatchComponent },
    { path: 'central-store',   component: ViewCentralStoreComponent },
    { path: 'central-store-dispatched-products',   component: ViewDispatchCentralStoreComponent },
    { path: 'central-store-bc',   component: ViewCentralStoreBcComponent },
    { path: 'central-store-bc-dispatched-products',   component: ViewDispatchCentralStoreBcComponent },
    { path: 'laboratory-services',   component: ViewLaboratoryServiceComponent },
    { path: 'radiology-services',   component: ViewRadiologyServiceComponent },
    { path: 'theater-services',   component: ViewTheatreServiceComponent },
    { path: 'main-pharmacy-services-bc',   component: ViewMainPharmacyServiceBcComponent },
];
