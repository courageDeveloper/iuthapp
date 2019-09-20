import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReceiptAccountComponent } from './view-receipt-account.component';

describe('ViewReceiptAccountComponent', () => {
  let component: ViewReceiptAccountComponent;
  let fixture: ComponentFixture<ViewReceiptAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReceiptAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReceiptAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
