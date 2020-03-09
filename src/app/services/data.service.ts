import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';


@Pipe({
  name: 'numberToWords'
})

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private messageSourceBranch = new BehaviorSubject('default message');
  private messageSourceDepartment = new BehaviorSubject('default message');
  private messageSourceReceipt = new BehaviorSubject('default message');
  private productHistory: any = new BehaviorSubject('default message');
  currentBranch = this.messageSourceBranch.asObservable();
  currentDepartment = this.messageSourceDepartment.asObservable();
  receiptSource = this.messageSourceReceipt.asObservable();
  currentProductHistory = this.productHistory.asObservable();
  /*  a = [
     '',
     'one ',
     'two ',
     'three ',
     'four ',
     'five ',
     'six ',
     'seven ',
     'eight ',
     'nine ',
     'ten ',
     'eleven ',
     'twelve ',
     'thirteen ',
     'fourteen ',
     'fifteen ',
     'sixteen ',
     'seventeen ',
     'eighteen ',
     'nineteen '];
 
   b = [
     '',
     '',
     'twenty',
     'thirty',
     'forty',
     'fifty',
     'sixty',
     'seventy',
     'eighty',
     'ninety'];
  */
  constructor() { }

  changeDepartment(department: string) {
    this.messageSourceDepartment.next(department);
  }

  changeBranch(branch: string) {
    this.messageSourceBranch.next(branch);
  }

  changeReceiptSource(receiptsource: string) {
    this.messageSourceReceipt.next(receiptsource);
  }

  changeProductHistory(producthistory: any) {
    this.productHistory.next(producthistory);
  }

  /* numberConverter(value: any, args?: any) {
    if (value) {
      let num: any = Number(value);
      if (num) {
        if ((num = num.toString()).length > 9) { return new BehaviorSubject('Overflow'); }
        const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        console.log(('000000000' + num).substr(-9));
        console.log(n);
        if (!n) { return new BehaviorSubject(''); }
        let str = '';
        console.log(Number(n[4]));
        console.log(this.a[Number(n[4])]);
        console.log(this.b[n[4][0]]);
        console.log(this.a[n[4][1]]);
        console.log(n[2][1]);
        str += (Number(n[1]) !== 0) ? (this.a[Number(n[1])] || this.b[n[1][0]] + ' ' + this.a[n[1][1]]) + 'crore ' : '';
        str += (Number(n[2]) !== 0) ? (this.a[Number(n[2])] || this.b[n[2][0]] + ' ' + this.a[n[2][1]]) + 'lakh ' : '';
        str += (Number(n[3]) !== 0) ? (this.a[Number(n[3])] || this.b[n[3][0]] + ' ' + this.a[n[3][1]]) + 'thousand ' : '';
        str += (Number(n[4]) !== 0) ? (this.a[Number(n[4])] || this.b[n[4][0]] + ' ' + this.a[n[4][1]]) + 'hundred ' : '';
        str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') +
          (this.a[Number(n[5])] || this.b[n[5][0]] + ' ' +
            this.a[n[5][1]]) + 'naira only' : '';

        return new BehaviorSubject(str);
      }
      else {
        return new BehaviorSubject('');
      }
    }
    else {
      return new BehaviorSubject('');
    }

  }
 */

}
