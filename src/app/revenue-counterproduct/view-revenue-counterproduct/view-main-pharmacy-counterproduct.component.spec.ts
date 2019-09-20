import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMainPharmacyCounterProductComponent } from './view-revenue-counterproduct.component';

describe('ViewMainPharmacyCounterProductComponent', () => {
  let component: ViewMainPharmacyCounterProductComponent;
  let fixture: ComponentFixture<ViewMainPharmacyCounterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMainPharmacyCounterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMainPharmacyCounterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
