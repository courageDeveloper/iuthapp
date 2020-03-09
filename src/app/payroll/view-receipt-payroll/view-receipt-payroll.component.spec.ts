import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReceiptPayrollComponent } from './view-receipt-payroll.component';

describe('ViewReceiptPayrollComponent', () => {
  let component: ViewReceiptPayrollComponent;
  let fixture: ComponentFixture<ViewReceiptPayrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReceiptPayrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReceiptPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
