import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMainPharmacyCounterProductBcComponent } from './add-main-pharmacy-counterproduct_bc.component'

describe('AddMainPharmacyCounterProductBcComponent', () => {
  let component: AddMainPharmacyCounterProductBcComponent;
  let fixture: ComponentFixture<AddMainPharmacyCounterProductBcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMainPharmacyCounterProductBcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMainPharmacyCounterProductBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
