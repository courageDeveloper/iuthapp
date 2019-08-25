import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchFormPharmacyStoreComponent } from './dispatch-form-pharmacystore.component'

describe('DispatchFormPharmacyStoreComponent', () => {
  let component: DispatchFormPharmacyStoreComponent;
  let fixture: ComponentFixture<DispatchFormPharmacyStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchFormPharmacyStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchFormPharmacyStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
