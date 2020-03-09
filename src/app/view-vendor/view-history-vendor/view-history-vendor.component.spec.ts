import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHistoryVendorComponent } from './view-history-vendor.component';

describe('ViewHistoryVendorComponent', () => {
  let component: ViewHistoryVendorComponent;
  let fixture: ComponentFixture<ViewHistoryVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHistoryVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHistoryVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
