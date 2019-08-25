import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakepaymentFormPharmacyStoreComponent } from './makepayment-form-pharmacystore.component'

describe('MakepaymentFormPharmacyStoreComponent', () => {
  let component: MakepaymentFormPharmacyStoreComponent;
  let fixture: ComponentFixture<MakepaymentFormPharmacyStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakepaymentFormPharmacyStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakepaymentFormPharmacyStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
