import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMainPharmacyServiceBcComponent } from './view-main-pharmacy-service_bc.component';

describe('ViewMainPharmacyServiceBcComponent', () => {
  let component: ViewMainPharmacyServiceBcComponent;
  let fixture: ComponentFixture<ViewMainPharmacyServiceBcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMainPharmacyServiceBcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMainPharmacyServiceBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
