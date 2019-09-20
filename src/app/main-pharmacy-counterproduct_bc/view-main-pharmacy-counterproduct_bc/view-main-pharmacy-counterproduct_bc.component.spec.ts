import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMainPharmacyCounterProductBcComponent } from './view-main-pharmacy-counterproduct_bc.component';

describe('ViewMainPharmacyCounterProductBcComponent', () => {
  let component: ViewMainPharmacyCounterProductBcComponent;
  let fixture: ComponentFixture<ViewMainPharmacyCounterProductBcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMainPharmacyCounterProductBcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMainPharmacyCounterProductBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
