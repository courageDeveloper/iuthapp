import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPharmacyServiceComponent } from './view-pharmacyservice.component';

describe('ViewPharmacyServiceComponent', () => {
  let component: ViewPharmacyServiceComponent;
  let fixture: ComponentFixture<ViewPharmacyServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPharmacyServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPharmacyServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
