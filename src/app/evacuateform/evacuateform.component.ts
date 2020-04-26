import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material'
import { PouchService } from '../../providers/pouch-service'
import { EvacuateerrorComponent } from '../evacuateerror/evacuateerror.component'
import { Router } from '@angular/router'
import { __core_private_testing_placeholder__ } from '@angular/core/testing'

@Component({
  selector: 'app-evacuateform',
  templateUrl: './evacuateform.component.html',
  styleUrls: ['./evacuateform.component.css'],
})
export class EvacuateformComponent implements OnInit {
  dateFrom: any
  dateTo: any
  timeFrom: any
  timeTo: any
  errorMessage: any
  evacuated
  myPromise

  constructor(
    public pouchService: PouchService,
    private router: Router,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<EvacuateformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.evacuated = {
      id: Math.round(new Date().getTime()).toString(),
      rev: '',
      noofitems: 0,
      date: new Date().toString(),
      name: '',
      totalamount: 0,
      branch: '',
      evacuateditemarray: [],
    }
  }

  ngOnInit() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'))

    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getEvacuates().then(evacuates => {
        evacuates = evacuates.filter(data => data.branch == staff.branch);
        
        if (evacuates.length != 0) {
          this.dateFrom = evacuates[0].evacuateditemarray[0].date.split('T')[0];
          this.timeFrom = evacuates[0].evacuateditemarray[0].date.split('T')[1];
          this.timeFrom = this.timeFrom.split('.')[0];

        }
      })
    })
  }

  onNoClick() {
    this.dialogRef.close()
  }

  checkError() {
    if (
      this.dateFrom == undefined ||
      this.timeFrom == undefined ||
      this.dateTo == undefined ||
      this.timeTo == undefined
    ) {
      this.errorMessage = 'Fill in all the fields'
    }
  }

  evacuateSales() {
    this.checkError()

    var inputTimeArray = this.timeFrom.split(':')
    var hours = inputTimeArray[0]
    var minutes = inputTimeArray[1]
    var millisecondsHour = hours * 3600000
    var millisecondsMinute = minutes * 60000
    var dateFromMilliseconds = new Date(this.dateFrom).getTime()
    var totalMilliseconds =
      millisecondsHour + millisecondsMinute + dateFromMilliseconds
    var newDateFrom = new Date().setTime(totalMilliseconds)

    var inputTimeArrayTo = this.timeTo.split(':')
    var hoursTo = inputTimeArrayTo[0]
    var minutesTo = inputTimeArrayTo[1]
    var millisecondsHourTo = hoursTo * 3600000
    var millisecondsMinuteTo = minutesTo * 60000
    var dateToMilliseconds = new Date(this.dateTo).getTime()
    var totalMillisecondsTo =
      millisecondsHourTo + millisecondsMinuteTo + dateToMilliseconds
    var newDateTo = new Date().setTime(totalMillisecondsTo)

    var localStorageItem = JSON.parse(localStorage.getItem('user'))

    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(sales => {
        sales = sales.filter(
          data => data.iscomplete == true || data.isowing == true,
        )
        sales = sales.filter(data => data.branch == staff.branch)
        sales = sales.filter(data => data.isreconciled == true)

        let p = sales.map(async sale => {
          var newSaleDate

          newSaleDate = new Date(sale.date);
          newSaleDate = new Date(newSaleDate).setMilliseconds(0);
          newSaleDate = new Date(newSaleDate).setSeconds(0);

          var saleDateMillisecond = new Date(newSaleDate).getTime()
          if (
            newDateFrom <= saleDateMillisecond &&
            newDateTo >= saleDateMillisecond
          ) {
            /*  sale.evacuatedmessage = "";
                sale.isevacuated = false;
                this.pouchService.updateSale(sale); */
            if (sale.isevacuated) {
              let dialogRef = this.dialog.open(EvacuateerrorComponent, {
                data: {
                  content: sale,
                },
              })
              dialogRef.afterClosed().subscribe(result => {
                if (!result) {
                  return
                }
                console.log(result)
                this.router.navigate(['sales'])
              })
              return false
            } else {
              sale.evacuatedmessage = 'Evacuated'
              sale.isevacuated = true
              await this.pouchService.updateSale(sale).then(response => {
                this.evacuated.evacuateditemarray.push(sale)
              })
            }
          }
        })
        Promise.all(p).then(res => {
          this.sendEvacuated()
        })
        this.dialogRef.close(true)
      })
    })
  }

  sendEvacuated() {
    this.evacuated.noofitems = this.evacuated.evacuateditemarray.length
    this.evacuated.date = new Date(this.evacuated.date).toString()
    this.evacuated.name = `Items evacuated on the ${this.evacuated.date}`
    var evacuatedArray = []
    this.evacuated.evacuateditemarray.forEach(sale => {
      evacuatedArray.push(sale.amount)
    })
    this.evacuated.totalamount = evacuatedArray.reduce((a, b) => a + b, 0)
    var localStorageItem = JSON.parse(localStorage.getItem('user'))
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.evacuated.branch = staff.branch
      this.pouchService.saveEvacuate(this.evacuated).then(result => {
        if (result.branch == 'IUTH(Okada)') {
          this.sendNotification(result.branch)
        } else if (result.branch == 'Benin Centre') {
          this.sendNotificationBenin(result.branch)
        }
      })
    })
  }

  sendNotification(branch) {
    var notification = {
      id: Math.round(new Date().getTime()).toString(),
      rev: '',
      name: `${this.evacuated.name} Dispatch Notification`,
      department: 'Revenue',
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${this.evacuated.noofitems} ${this.evacuated.name} has been evacuated`,
      sourceid: this.evacuated.id,
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch)
      staffs = staffs.filter(
        data =>
          data.department == 'Revenue' ||
          data.department == 'Account' ||
          data.department == 'Audit',
      )
      staffs.forEach(staff => {
        staff.notification.push(notification)
        this.pouchService.updateStaff(staff).then(result => {})
      })
    })
  }

  sendNotificationBenin(branch) {
    var notification = {
      id: Math.round(new Date().getTime()).toString(),
      rev: '',
      name: `${this.evacuated.name} Dispatch Notification`,
      department: 'Account',
      branch: branch,
      date: new Date(),
      url: this.router.url,
      viewed: false,
      message: `${this.evacuated.noofitems} ${this.evacuated.name} has been evacuated`,
      sourceid: this.evacuated.id,
    }

    this.pouchService.getStaffs().then(staffs => {
      staffs = staffs.filter(data => data.branch == notification.branch)
      staffs = staffs.filter(
        data => data.department == 'Admin' || data.department == 'Account',
      )
      staffs.forEach(staff => {
        staff.notification.push(notification)
        this.pouchService.updateStaff(staff).then(result => {})
      })
    })
  }
}
