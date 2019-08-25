import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavService } from '../services/nav.service';
import { PouchService } from '../../providers/pouch-service';
import { ToastrService } from 'ngx-toastr';
import { Products } from '../../model/product';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css']
})
export class ImageviewerComponent implements OnInit {
  products: any[];
  index: any;
  productImages: any[];
  base64data;
  branch: any;
  department: any;

  constructor(public pouchService: PouchService, private data: DataService, private activatedRoute: ActivatedRoute, public _DomSanitizer: DomSanitizer) {
    this.index = this.activatedRoute.snapshot.params['index'];
  }

  ngOnInit() {
    this.data.currentBranch.subscribe(branch => this.branch = branch);
    this.data.currentDepartment.subscribe(department => this.department = department)

    var myThis = this;
    this.products = [];
    this.productImages = [];
    this.pouchService.getProducts().then(items => {
      items = items.filter(data => data.branch == this.branch && data.store == this.department);
      this.products = items;
      this.products.forEach(product => {
        if (product.productimage == "") {
          product.productimage = 'assets/img/image_placeholder.png';
        }
        myThis.productImages.push(product.productimage);
        console.log(myThis.productImages);
      });
    });
  }


}
