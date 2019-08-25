import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMainPharmacyServiceComponent } from './view-main-pharmacy-service.component';

describe('ViewMainPharmacyServiceComponent', () => {
  let component: ViewMainPharmacyServiceComponent;
  let fixture: ComponentFixture<ViewMainPharmacyServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMainPharmacyServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMainPharmacyServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
