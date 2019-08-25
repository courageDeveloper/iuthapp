import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGopdPharmacyServiceComponent } from './add-gopd-pharmacy-service.component'

describe('AddGopdPharmacyServiceComponent', () => {
  let component: AddGopdPharmacyServiceComponent;
  let fixture: ComponentFixture<AddGopdPharmacyServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGopdPharmacyServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGopdPharmacyServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
