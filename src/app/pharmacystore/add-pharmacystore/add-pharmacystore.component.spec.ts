import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPharmacyStoreComponent } from './add-pharmacystore.component'

describe('AddPharmacyStoreComponent', () => {
  let component: AddPharmacyStoreComponent;
  let fixture: ComponentFixture<AddPharmacyStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPharmacyStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPharmacyStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
