import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';
import { PouchService } from '../providers/pouch-service';



import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DrugpromptComponent } from './drugprompt/drugprompt.component';
import {
  MatDialogModule
} from '@angular/material';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgxSpinnerModule,
    MatDialogModule,
    ComponentsModule,
    RouterModule,
    CommonModule,
    BrowserModule,
    ToastrModule.forRoot(), // ToastrModule added
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    DrugpromptComponent
  ],
  providers: [PouchService],
  bootstrap: [AppComponent],
  entryComponents: [DrugpromptComponent]
})
export class AppModule { }
