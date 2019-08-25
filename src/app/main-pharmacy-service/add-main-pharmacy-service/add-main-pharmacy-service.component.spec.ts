import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMainPharmacyServiceComponent } from './add-main-pharmacy-service.component'

describe('AddMainPharmacyServiceComponent', () => {
  let component: AddMainPharmacyServiceComponent;
  let fixture: ComponentFixture<AddMainPharmacyServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMainPharmacyServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMainPharmacyServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
