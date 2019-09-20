import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { EditUserProfileComponent } from '../../edit-user-profile/edit-user-profile.component';
import { AddPatientComponent } from '../../add-patient/add-patient.component';
import { AddPatientDialogComponent } from '../../add-patient-dialog/add-patient-dialog.component';
import { EditPatientComponent } from '../../edit-patient/edit-patient.component';
import { ViewStaffComponent } from '../../view-staff/view-staff.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { LoginComponent } from '../../login/login.component';
import { ViewPatientComponent } from '../../view-patient/view-patient.component';
import { MainPharmacyPosComponent } from '../../main-pharmacy-pos/main-pharmacy-pos.component';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { RevenuePosComponent } from '../../revenue-pos/revenue-pos.component';
import { AccountPosComponent } from '../../account-pos/account-pos.component';
import { ViewPayrollComponent } from '../../payroll/view-payroll/view-payroll.component';
import { AddPayrollComponent } from '../../payroll/add-payroll/add-payroll.component';
import { ViewSalesComponent } from '../../sales/view-sales/view-sales.component';
import { ViewLoansComponent } from '../../sales/view-loans/view-loans.component';
import { AddSalesComponent } from '../../sales/add-sales/add-sales.component';
import { AddPayloanComponent } from '../../sales/pay-loan/pay-loan.component';
import { ViewExpensesComponent } from '../../expenses/view-expenses/view-expenses.component';
import { AddExpensesComponent } from '../../expenses/add-expenses/add-expenses.component';
import { AddPharmacyStoreCategoryComponent } from '../../pharmacystorecategory/add-pharmacystorecategory/add-pharmacystorecategory.component';
import { ViewPharmacyStoreCategoryComponent } from '../../pharmacystorecategory/view-pharmacystorecategory/view-pharmacystorecategory.component';
import { AddCentralStoreCategoryComponent } from '../../centralstorecategory/add-centralstorecategory/add-centralstorecategory.component';
import { ViewCentralStoreCategoryComponent } from '../../centralstorecategory/view-centralstorecategory/view-centralstorecategory.component';
import { AddCentralStoreCategoryBcComponent } from '../../centralstorecategory_bc/add-centralstorecategory_bc/add-centralstorecategory_bc.component';
import { ViewCentralStoreCategoryBcComponent } from '../../centralstorecategory_bc/view-centralstorecategory_bc/view-centralstorecategory_bc.component';
import { AddPharmacyStoreComponent } from '../../pharmacystore/add-pharmacystore/add-pharmacystore.component';
import { ViewPharmacyStoreComponent } from '../../pharmacystore/view-pharmacystore/view-pharmacystore.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DispatchFormPharmacyStoreComponent } from '../../pharmacystore/dispatch-form-pharmacystore/dispatch-form-pharmacystore.component';
import { MakepaymentFormPharmacyStoreComponent } from '../../pharmacystore/makepayment-form-pharmacystore/makepayment-form-pharmacystore.component';
import { ViewMainPharmacyServiceComponent } from '../../main-pharmacy-service/view-main-pharmacy-service/view-main-pharmacy-service.component';
import { AddMainPharmacyServiceComponent } from '../../main-pharmacy-service/add-main-pharmacy-service/add-main-pharmacy-service.component';
import { ViewPharmacyServiceComponent } from '../../pharmacyservice/view-pharmacyservice/view-pharmacyservice.component';
import { AddPharmacyServiceComponent } from '../../pharmacyservice/add-pharmacyservice/add-pharmacyservice.component';
import { ConfirmdialogmessageComponent } from '../../confirmdialogmessage/confirmdialogmessage.component';
import { ExpensedialogmessageComponent } from '../../expensedialogmessage/expensedialogmessage.component';
import { ToastrModule } from 'ngx-toastr';
import { Angular4PaystackModule } from 'angular4-paystack';
import { ImageViewerModule } from "ngx-image-viewer";
import { ImageviewerComponent } from '../../image-viewer/image-viewer.component';
import { ViewDispatchComponent } from '../../pharmacystore/view-dispatch/view-dispatch.component';
import { AddCentralStoreComponent } from '../../centralstore/add-centralstore/add-centralstore.component';
import { ViewCentralStoreComponent } from '../../centralstore/view-centralstore/view-centralstore.component';
import { MakepaymentFormCentralStoreComponent } from '../../centralstore/makepayment-form-centralstore/makepayment-form-centralstore.component';
import { DispatchFormCentralStoreComponent } from '../../centralstore/dispatch-form-centralstore/dispatch-form-centralstore.component';
import { ViewDispatchCentralStoreComponent } from '../../centralstore/view-dispatch-centralstore/view-dispatch-centralstore.component';
import { AddCentralStoreBcComponent } from '../../centralstore_bc/add-centralstore_bc/add-centralstore_bc.component';
import { ViewCentralStoreBcComponent } from '../../centralstore_bc/view-centralstore_bc/view-centralstore_bc.component';
import { MakepaymentFormCentralStoreBcComponent } from '../../centralstore_bc/makepayment-form-centralstore_bc/makepayment-form-centralstore_bc.component';
import { DispatchFormCentralStoreBcComponent } from '../../centralstore_bc/dispatch-form-centralstore_bc/dispatch-form-centralstore_bc.component';
import { ViewDispatchCentralStoreBcComponent } from '../../centralstore_bc/view-dispatch-centralstore_bc/view-dispatch-centralstore_bc.component';
import { ViewGopdPharmacyServiceComponent } from '../../gopd-pharmacy-service/view-gopd-pharmacy-service/view-gopd-pharmacy-service.component';
import { AddGopdPharmacyServiceComponent } from '../../gopd-pharmacy-service/add-gopd-pharmacy-service/add-gopd-pharmacy-service.component';
import { ViewLaboratoryServiceComponent } from '../../laboratory-service/view-laboratory-service/view-laboratory-service.component';
import { AddLaboratoryServiceComponent } from '../../laboratory-service/add-laboratory-service/add-laboratory-service.component';
import { ViewRadiologyServiceComponent } from '../../radiology-service/view-radiology-service/view-radiology-service.component';
import { AddRadiologyServiceComponent } from '../../radiology-service/add-radiology-service/add-radiology-service.component';
import { ViewTheatreServiceComponent } from '../../theatre-service/view-theatre-service/view-theatre-service.component';
import { AddTheatreServiceComponent } from '../../theatre-service/add-theatre-service/add-theatre-service.component';
import { ViewMainPharmacyServiceBcComponent } from '../../main-pharmacy-service_bc/view-main-pharmacy-service_bc/view-main-pharmacy-service_bc.component';
import { AddMainPharmacyServiceBcComponent } from '../../main-pharmacy-service_bc/add-main-pharmacy-service_bc/add-main-pharmacy-service_bc.component';
import { ViewMainPharmacyCounterProductComponent } from '../../main-pharmacy-counterproduct/view-main-pharmacy-counterproduct/view-main-pharmacy-counterproduct.component';
import { AddMainPharmacyCounterProductComponent } from '../../main-pharmacy-counterproduct/add-main-pharmacy-counterproduct/add-main-pharmacy-counterproduct.component';
import { ImageviewerCounterProductComponent } from '../../image-viewer-counterproduct/image-viewer-counterproduct.component';
import { ReceiptComponent } from '../../receipt/receipt.component';
import { ReceiptAccountComponent } from '../../receipt-account/receipt-account.component';
import { ViewReceiptComponent } from '../../view-receipt/view-receipt.component';
import { ViewReceiptAccountComponent } from '../../view-receipt-account/view-receipt-account.component';
import { GopdPharmacyPosComponent } from '../../gopd-pharmacy-pos/gopd-pharmacy-pos.component';
import { ViewGopdPharmacyCounterProductComponent } from '../../gopd-pharmacy-counterproduct/view-gopd-pharmacy-counterproduct/view-gopd-pharmacy-counterproduct.component';
import { AddGopdPharmacyCounterProductComponent } from '../../gopd-pharmacy-counterproduct/add-gopd-pharmacy-counterproduct/add-gopd-pharmacy-counterproduct.component';
import { LaboratoryPosComponent } from '../../laboratory-pos/laboratory-pos.component';
import { ViewLaboratoryCounterProductComponent } from '../../laboratory-counterproduct/view-laboratory-counterproduct/view-laboratory-counterproduct.component';
import { AddLaboratoryCounterProductComponent } from '../../laboratory-counterproduct/add-laboratory-counterproduct/add-laboratory-counterproduct.component';
import { RadiologyPosComponent } from '../../radiology-pos/radiology-pos.component';
import { ViewRadiologyCounterProductComponent } from '../../radiology-counterproduct/view-radiology-counterproduct/view-radiology-counterproduct.component';
import { AddRadiologyCounterProductComponent } from '../../radiology-counterproduct/add-radiology-counterproduct/add-radiology-counterproduct.component';
import { MainPharmacyPosBcComponent } from '../../main-pharmacy-pos_bc/main-pharmacy-pos_bc.component';
import { ViewMainPharmacyCounterProductBcComponent } from '../../main-pharmacy-counterproduct_bc/view-main-pharmacy-counterproduct_bc/view-main-pharmacy-counterproduct_bc.component';
import { AddMainPharmacyCounterProductBcComponent } from '../../main-pharmacy-counterproduct_bc/add-main-pharmacy-counterproduct_bc/add-main-pharmacy-counterproduct_bc.component';
import { ViewRevenueCounterProductComponent } from '../../revenue-counterproduct/view-revenue-counterproduct/view-revenue-counterproduct.component';
import { AddRevenueCounterProductComponent } from '../../revenue-counterproduct/add-revenue-counterproduct/add-revenue-counterproduct.component';
import { AddAccountCounterProductComponent } from '../../account-counterproduct/add-account-counterproduct/add-account-counterproduct.component';
import { ViewAccountCounterProductComponent } from '../../account-counterproduct/view-account-counterproduct/view-account-counterproduct.component';
import { ViewDepartmentComponent } from '../../view-department/view-department.component';
import { ViewEvacuatedComponent } from '../../view-evacuated/view-evacuated.component';
import { EvacuateformComponent } from '../../evacuateform/evacuateform.component';
import { EvacuateerrorComponent } from '../../evacuateerror/evacuateerror.component';
import { DisplayevacuatedComponent } from '../../view-evacuated/displayevacuated/displayevacuated.component';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatOptionModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatBadgeModule,
  MatCheckboxModule,
  MatDialogModule,
  MatRadioModule,
  MatCardModule
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatBadgeModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatOptionModule,
    Angular4PaystackModule,
    MatCheckboxModule,
    MatDialogModule,
    MatCardModule,
    ScrollingModule,
    MatRadioModule,
    ToastrModule.forRoot(), // ToastrModule added
    ImageViewerModule.forRoot(),
    Ng2AutoCompleteModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    EditUserProfileComponent,
    ViewStaffComponent,
    TypographyComponent,
    AddPatientComponent,
    AddPatientDialogComponent,
    IconsComponent,
    MapsComponent,
    ViewPatientComponent,
    NotificationsComponent,
    ViewPayrollComponent,
    ImageviewerComponent,
    UpgradeComponent,
    RevenuePosComponent,
    AccountPosComponent,
    AddPayrollComponent,
    ConfirmdialogmessageComponent,
    ExpensedialogmessageComponent,
    ViewSalesComponent,
    ViewLoansComponent,
    MainPharmacyPosComponent,
    AddSalesComponent,
    AddPayloanComponent,
    EditPatientComponent,
    ViewExpensesComponent,
    AddExpensesComponent,
    AddPharmacyStoreCategoryComponent,
    ViewPharmacyStoreCategoryComponent,
    AddCentralStoreCategoryBcComponent,
    ViewCentralStoreCategoryBcComponent,
    AddPharmacyStoreComponent,
    ViewPharmacyStoreComponent,
    AddCentralStoreCategoryComponent,
    ViewCentralStoreCategoryComponent,
    DispatchFormPharmacyStoreComponent,
    MakepaymentFormPharmacyStoreComponent,
    ViewMainPharmacyServiceComponent,
    AddMainPharmacyServiceComponent,
    ViewPharmacyServiceComponent,
    AddPharmacyServiceComponent,
    ViewDispatchComponent,
    LoginComponent,
    AddCentralStoreComponent,
    ViewCentralStoreComponent,
    MakepaymentFormCentralStoreComponent,
    DispatchFormCentralStoreComponent,
    ViewDispatchCentralStoreComponent,
    AddCentralStoreBcComponent,
    ViewCentralStoreBcComponent,
    MakepaymentFormCentralStoreBcComponent,
    DispatchFormCentralStoreBcComponent,
    ViewDispatchCentralStoreBcComponent,
    ViewGopdPharmacyServiceComponent,
    AddGopdPharmacyServiceComponent,
    ViewLaboratoryServiceComponent,
    AddLaboratoryServiceComponent,
    ViewRadiologyServiceComponent,
    AddRadiologyServiceComponent,
    ViewTheatreServiceComponent,
    AddTheatreServiceComponent,
    ViewMainPharmacyServiceBcComponent,
    AddMainPharmacyServiceBcComponent,
    ViewMainPharmacyCounterProductComponent,
    AddMainPharmacyCounterProductComponent,
    ImageviewerCounterProductComponent,
    ReceiptComponent,
    ReceiptAccountComponent,
    GopdPharmacyPosComponent,
    ViewGopdPharmacyCounterProductComponent,
    AddGopdPharmacyCounterProductComponent,
    LaboratoryPosComponent,
    ViewLaboratoryCounterProductComponent,
    AddLaboratoryCounterProductComponent,
    RadiologyPosComponent,
    ViewRadiologyCounterProductComponent,
    AddRadiologyCounterProductComponent,
    MainPharmacyPosBcComponent,
    ViewMainPharmacyCounterProductBcComponent,
    AddMainPharmacyCounterProductBcComponent,
    ViewRevenueCounterProductComponent,
    AddRevenueCounterProductComponent,
    ViewDepartmentComponent,
    AddAccountCounterProductComponent,
    ViewAccountCounterProductComponent,
    EvacuateformComponent,
    EvacuateerrorComponent,
    ViewEvacuatedComponent,
    DisplayevacuatedComponent,
    ViewReceiptComponent,
    ViewReceiptAccountComponent
  ],
  entryComponents: [ConfirmdialogmessageComponent, ExpensedialogmessageComponent, AddPayloanComponent, ViewReceiptAccountComponent, ViewReceiptComponent, DisplayevacuatedComponent, EvacuateerrorComponent, EvacuateformComponent, AddAccountCounterProductComponent, ReceiptAccountComponent, AddRevenueCounterProductComponent, AddMainPharmacyCounterProductBcComponent, AddRadiologyCounterProductComponent, AddLaboratoryCounterProductComponent, AddGopdPharmacyCounterProductComponent, ReceiptComponent, AddPatientDialogComponent, AddMainPharmacyCounterProductComponent, AddMainPharmacyServiceBcComponent, AddTheatreServiceComponent, AddRadiologyServiceComponent, AddLaboratoryServiceComponent, AddGopdPharmacyServiceComponent, AddCentralStoreBcComponent, MakepaymentFormCentralStoreBcComponent, DispatchFormCentralStoreBcComponent, AddCentralStoreComponent, MakepaymentFormCentralStoreComponent, DispatchFormCentralStoreComponent, MakepaymentFormPharmacyStoreComponent, AddCentralStoreCategoryBcComponent, AddPayrollComponent, AddCentralStoreCategoryComponent, AddPharmacyServiceComponent, AddMainPharmacyServiceComponent, DispatchFormPharmacyStoreComponent, AddSalesComponent, AddExpensesComponent, AddPharmacyStoreCategoryComponent, AddPharmacyStoreComponent]
})

export class AdminLayoutModule { }
