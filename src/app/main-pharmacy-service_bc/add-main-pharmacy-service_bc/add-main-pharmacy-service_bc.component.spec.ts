import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMainPharmacyServiceBcComponent } from './add-main-pharmacy-service_bc.component'

describe('AddMainPharmacyServiceBcComponent', () => {
  let component: AddMainPharmacyServiceBcComponent;
  let fixture: ComponentFixture<AddMainPharmacyServiceBcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMainPharmacyServiceBcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMainPharmacyServiceBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
