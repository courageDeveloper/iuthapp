import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGopdPharmacyServiceComponent } from './view-gopd-pharmacy-service.component';

describe('ViewGopdPharmacyServiceComponent', () => {
  let component: ViewGopdPharmacyServiceComponent;
  let fixture: ComponentFixture<ViewGopdPharmacyServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGopdPharmacyServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGopdPharmacyServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
