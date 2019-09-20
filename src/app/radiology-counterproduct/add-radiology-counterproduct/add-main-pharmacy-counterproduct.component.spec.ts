import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMainPharmacyCounterProductComponent } from './add-radiology-counterproduct.component'

describe('AddMainPharmacyCounterProductComponent', () => {
  let component: AddMainPharmacyCounterProductComponent;
  let fixture: ComponentFixture<AddMainPharmacyCounterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMainPharmacyCounterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMainPharmacyCounterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
