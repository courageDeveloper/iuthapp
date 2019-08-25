import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPharmacyServiceComponent } from './add-pharmacyservice.component'

describe('AddPharmacyServiceComponent', () => {
  let component: AddPharmacyServiceComponent;
  let fixture: ComponentFixture<AddPharmacyServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPharmacyServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPharmacyServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
