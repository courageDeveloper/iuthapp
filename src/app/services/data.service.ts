import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private messageSourceBranch = new BehaviorSubject('default message');
  private messageSourceDepartment = new BehaviorSubject('default message');
  currentBranch = this.messageSourceBranch.asObservable();
  currentDepartment = this.messageSourceDepartment.asObservable();

  constructor() { }

  changeDepartment(department: string) {
    this.messageSourceDepartment.next(department);
  }

  changeBranch(branch: string) {
    this.messageSourceBranch.next(branch);
  }
}
