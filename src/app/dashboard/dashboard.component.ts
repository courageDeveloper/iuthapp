import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Chartist from 'chartist';
import { NavService } from '../services/nav.service';
import { PouchService } from '../../providers/pouch-service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  sales: any;
  expenses: any;
  evacuates: any;
  all_salses_filtered_by_date;
  all_expenses_filtered_by_date;
  staffs: any;
  branch;
  patients;
  totalSales: any;
  totalExpenses: any;
  totalEvacuates: any;
  calculateTotalSales = 0;
  calculateTotalExpenses = 0;
  calculateTotalProfits = 0;
  calculateTotalEvacuates = 0;
  dateFrom: any;
  dateTo: any;
  evacuatedateFrom: any;
  evacuatedateTo: any;
  chart = []; // This will hold our chart info
  selectedYear = new Date().getFullYear();
  years: any[];

  constructor(public pouchService: PouchService, public navservice: NavService) {
    console.log(this.navservice);
    this.navservice.show();
  }

  getYears() {
    this.years = [];
    var currentYear = new Date().getFullYear();

    for (var i = 1980; i <= currentYear; i++) {

      this.years.push(i);
    }
  }

  selectYear(year) {
      this.selectedYear = year;
      this.sumChartData();
  }

  showChart(sales, expenses) {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            data: sales,
            borderColor: "#004d00",
            fill: true,
            backgroundColor: "#003300",
            label: "Sales"
          },
          {
            data: expenses,
            borderColor: "#1a0000",
            fill: true,
            backgroundColor: "#800000",
            label: "Expenses"
          },
        ]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }

  sumChartData() {
    var sales: any;
    var expenses: any;
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var monthlySaleArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var monthlyExpenseArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(data => {
        sales = data.filter(data => data.branch == staff.branch);
        sales = sales.filter(data => data.iscomplete == true || data.isowing == true);
        sales = sales.filter(data => data.isoncredit == false);
        sales = sales.filter(data => data.isreconciled == true);
        sales = sales.filter(data => new Date(data.date).getFullYear() == this.selectedYear);
        sales.map(sale => {
          for (var i = 0; i < months.length; i++) {
            if (new Date(sale.date).getMonth() == i) {
              monthlySaleArray[i] = monthlySaleArray[i] + sale.amount;
            }
          }
        });
        this.pouchService.getExpenses().then(data => {
          expenses = data.filter(data => data.branch == staff.branch);
          expenses = expenses.filter(data => data.iscomplete == true || data.isowing == true);
          expenses = expenses.filter(data => data.isoncredit == false);
          expenses = expenses.filter(data => data.isreconciled == true);
          expenses = expenses.filter(data => new Date(data.date).getFullYear() == this.selectedYear);
          expenses.map(expense => {
            for (var i = 0; i < months.length; i++) {
              if (new Date(expense.date).getMonth() == i) {
                monthlyExpenseArray[i] = monthlyExpenseArray[i] + expense.amount;
              }
            }
          });
          this.showChart(monthlySaleArray, monthlyExpenseArray)
        })
      });
    });

  }

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };
  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  };

  totalStaff() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.branch = staff.branch;
      this.pouchService.getStaffs().then(staffs => {
        this.staffs = staffs.filter(data => data.branch == staff.branch);
        this.staffs = this.staffs.length;
      });
    });
  }

  totalPatients() {
    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getPatients().then(patients => {
        this.patients = patients.filter(data => data.branch == staff.branch);
        this.patients = this.patients.length;
      });
    });
  }

  calculateProfit() {
    var saleArray = [];
    var expenseArray = [];

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(data => {
        this.totalSales = data.filter(data => data.branch == staff.branch);
        this.totalSales = this.totalSales.filter(data => data.iscomplete == true || data.isowing == true);
        this.totalSales = this.totalSales.filter(data => data.isoncredit == false);
        this.totalSales = this.totalSales.filter(data => data.isreconciled == true);
        this.totalSales.forEach(sale => {
          saleArray.push(sale.amount);
        });

        this.pouchService.getExpenses().then(data => {
          this.totalExpenses = data.filter(data => data.branch == staff.branch);
          this.totalExpenses = this.totalExpenses.filter(data => data.iscomplete == true || data.isowing == true);
          this.totalExpenses = this.totalExpenses.filter(data => data.isoncredit == false);
          this.totalExpenses = this.totalExpenses.filter(data => data.isreconciled == true);
          this.totalExpenses.forEach(expense => {
            expenseArray.push(expense.amount);
          });
          this.calculateTotalExpenses = expenseArray.reduce((a, b) => a + b, 0);
          this.calculateTotalSales = saleArray.reduce((a, b) => a + b, 0);
          this.calculateTotalProfits = this.calculateTotalSales - this.calculateTotalExpenses;
        });
      });
    });
  }

  calculateEvacuatedSales() {
    var evacuateArray = [];

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getEvacuates().then(data => {
        this.totalEvacuates = data;
        this.totalEvacuates = this.totalEvacuates.filter(data => data.branch == staff.branch);

        this.totalEvacuates.forEach(evacuate => {
          evacuateArray.push(evacuate.totalamount);
        });
        this.calculateTotalEvacuates = evacuateArray.reduce((a, b) => a + b, 0);
      });
    });
  }

  filterDate() {
    var saleArray = [];
    var expenseArray = [];

    this.dateFrom = new Date(this.dateFrom).getTime();
    this.dateTo = new Date(this.dateTo).getTime();

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getSales().then(sales => {
        sales = sales.filter(data => data.branch == staff.branch);
        sales = sales.filter(data => data.iscomplete == true || data.isowing == true);
        sales = sales.filter(data => data.isoncredit == false);
        sales = sales.filter(data => data.isreconciled == true);

        sales.map(sale => {
          sale['timestamp'] = new Date(sale.date).toLocaleString("en-US", { timeZone: "GMT" });
          sale['timestamp'] = new Date(sale['timestamp']).setSeconds(0);
          sale['timestamp'] = new Date(sale['timestamp']).setMinutes(0);
          sale['timestamp'] = new Date(sale['timestamp']).setHours(0);

        });
        sales = sales.filter(data => this.dateFrom <= data['timestamp']);
        sales = sales.filter(data => this.dateTo >= data['timestamp']);
        this.sales = sales;
        this.sales.forEach(sale => {
          saleArray.push(sale.amount);
        });

        this.pouchService.getExpenses().then(expenses => {
          expenses = expenses.filter(data => data.branch == staff.branch);
          expenses = expenses.filter(data => data.iscomplete == true || data.isowing == true);
          expenses = expenses.filter(data => data.isoncredit == false);
          expenses = expenses.filter(data => data.isreconciled == true);

          expenses.map(expense => {
            expense['timestamp'] = new Date(expense.date).toLocaleString("en-US", { timeZone: "GMT" });
            expense['timestamp'] = new Date(expense['timestamp']).setSeconds(0);
            expense['timestamp'] = new Date(expense['timestamp']).setMinutes(0);
            expense['timestamp'] = new Date(expense['timestamp']).setHours(0);

          });
          expenses = expenses.filter(data => this.dateFrom <= data['timestamp']);
          expenses = expenses.filter(data => this.dateTo >= data['timestamp']);
          this.expenses = expenses;
          this.expenses.forEach(expense => {
            expenseArray.push(expense.amount);
          });
          this.calculateTotalSales = saleArray.reduce((a, b) => a + b, 0);
          this.calculateTotalExpenses = expenseArray.reduce((a, b) => a + b, 0);
          this.calculateTotalProfits = this.calculateTotalSales - this.calculateTotalExpenses;
        });
      });
    });
  }

  evacuateFilterDate() {
    var evacuateArray = [];
    this.evacuatedateFrom = new Date(this.evacuatedateFrom).getTime();
    this.evacuatedateTo = new Date(this.evacuatedateTo).getTime();

    var localStorageItem = JSON.parse(localStorage.getItem('user'));
    this.pouchService.getStaff(localStorageItem).then(staff => {
      this.pouchService.getEvacuates().then(evacuates => {
        evacuates = evacuates.filter(data => data.branch == staff.branch);

        evacuates.map(evacuate => {
          evacuate['timestamp'] = new Date(evacuate.date).toLocaleString("en-US", { timeZone: "GMT" });
          evacuate['timestamp'] = new Date(evacuate['timestamp']).setSeconds(0);
          evacuate['timestamp'] = new Date(evacuate['timestamp']).setMinutes(0);
          evacuate['timestamp'] = new Date(evacuate['timestamp']).setHours(0);

        });
        evacuates = evacuates.filter(data => this.evacuatedateFrom <= data['timestamp']);
        evacuates = evacuates.filter(data => this.evacuatedateTo >= data['timestamp']);
        this.evacuates = evacuates;
        this.evacuates.forEach(evacuate => {
          evacuateArray.push(evacuate.totalamount);
        });
        this.calculateTotalEvacuates = evacuateArray.reduce((a, b) => a + b, 0);
      });
    });
  }

  ngAfterViewInit() {
    //Implementing Chart.js;
    this.sumChartData();
  }

  ngOnInit() {
    this.totalStaff();
    this.totalPatients();
    this.calculateProfit();
    this.calculateEvacuatedSales();
    this.getYears();

    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

    const dataDailySalesChart: any = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      series: [
        [12, 17, 7, 17, 23, 18, 38]
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    }

    var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);


    /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

    const dataCompletedTasksChart: any = {
      labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
      series: [
        [230, 750, 450, 300, 280, 240, 200, 190]
      ]
    };

    const optionsCompletedTasksChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    }

    var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

    // start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(completedTasksChart);



    /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

    var datawebsiteViewsChart = {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      series: [
        [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

      ]
    };
    var optionswebsiteViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 1000,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
    };
    var responsiveOptions: any[] = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

    //start animation for the Emails Subscription Chart
    this.startAnimationForBarChart(websiteViewsChart);
  }

}
