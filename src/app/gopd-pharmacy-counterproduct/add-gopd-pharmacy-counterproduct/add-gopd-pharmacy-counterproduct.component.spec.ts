import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGopdPharmacyCounterProductComponent } from './add-gopd-pharmacy-counterproduct.component'

describe('AddGopdPharmacyCounterProductComponent', () => {
  let component: AddGopdPharmacyCounterProductComponent;
  let fixture: ComponentFixture<AddGopdPharmacyCounterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGopdPharmacyCounterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGopdPharmacyCounterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
