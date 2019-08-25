import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchFormCentralStoreBcComponent } from './dispatch-form-centralstore_bc.component'

describe('DispatchFormPharmacyStoreComponent', () => {
  let component: DispatchFormCentralStoreBcComponent;
  let fixture: ComponentFixture<DispatchFormCentralStoreBcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchFormCentralStoreBcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchFormCentralStoreBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
