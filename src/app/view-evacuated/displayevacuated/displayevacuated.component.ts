import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash'; // to help loop over files more succinctly
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PouchService } from '../../../providers/pouch-service';
import { Evacuate } from '../../../model/evacuate';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-displayevacuated',
  templateUrl: './displayevacuated.component.html',
  styleUrls: ['./displayevacuated.component.css']
})
export class DisplayevacuatedComponent implements OnInit {
  title;
  public evacuate: any;

  constructor(private router: Router, private dataService: DataService, public dialogRef: MatDialogRef<DisplayevacuatedComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public toastr: ToastrService, public _DomSanitizer: DomSanitizer, public pouchService: PouchService, private formBuilder: FormBuilder) {

    if (this.data.action == 'evacuate') {
      this.title = 'View';
      this.evacuate = data.evacuate;
    }
  }

  ngOnInit() {
       
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
