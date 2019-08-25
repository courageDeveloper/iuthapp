import { Component, OnInit } from '@angular/core';
import { PouchService } from './../providers/pouch-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public pouchService: PouchService) {
    this.pouchService.initDB();
  }

  ngOnInit() {
  
  }

}
