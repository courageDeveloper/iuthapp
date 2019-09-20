import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptAccountComponent } from './receipt-account.component';

describe('ReceiptAccountComponent', () => {
  let component: ReceiptAccountComponent;
  let fixture: ComponentFixture<ReceiptAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
