import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../../providers/pouch-service';
import { RenderService } from '../../../model/renderservice';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-main-pharmacy-service_bc',
  templateUrl: './add-main-pharmacy-service_bc.component.html',
  styleUrls: ['./add-main-pharmacy-service_bc.component.css']
})
export class AddMainPharmacyServiceBcComponent implements OnInit {
  title;
  isChecked = false;
  isCheckedPacket = false;
  public renderservice: RenderService ;
  renderServiceForm = new FormGroup({
    id: new FormControl(),
    rev: new FormControl(),
    servicename: new FormControl(),
    cost: new FormControl(),
    branch: new FormControl(),
    department: new FormControl(),
    sales: new FormControl()
  });

  constructor(public dialogRef: MatDialogRef<AddMainPharmacyServiceBcComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, public toastr: ToastrService, public pouchService: PouchService) { 
    
    this.renderservice = {
      id: Math.round((new Date()).getTime()).toString(),
      rev: '',
      servicename: '',
      branch: '',
      cost: 0,
      department: 'Main Pharmacy',
      sales: []
    }
  }

  ngOnInit() {
    if (this.data.action == 'add') {
      this.title = 'Add';
    }
    else {
      this.title = 'Edit';
      this.renderservice = this.data.renderService;
    }

    this.renderServiceForm = this.formBuilder.group({
      id: [this.renderservice.id],
      rev: [this.renderservice.rev],
      servicename: [this.renderservice.servicename],
      cost: [this.renderservice.cost],
      branch: [this.renderservice.branch],
      department: [this.renderservice.department],
      sales: [this.renderservice.sales]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      this.renderservice.branch = item.branch;
      this.pouchService.saveRenderService(this.renderservice).then(res => {
        this.toastr.success('Service has been added');
        this.dialogRef.close(true);
      });
    });
  }

  edit() {

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(item => {
      this.renderservice.branch = item.branch;
      this.pouchService.updateRenderService(this.renderservice).then(res => {
        this.toastr.success('Service has been updated');
        this.dialogRef.close(true);
      });
    })
  }

}
