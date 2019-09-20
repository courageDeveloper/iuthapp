import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGopdPharmacyCounterProductComponent } from './view-gopd-pharmacy-counterproduct.component';

describe('ViewGopdPharmacyCounterProductComponent', () => {
  let component: ViewGopdPharmacyCounterProductComponent;
  let fixture: ComponentFixture<ViewGopdPharmacyCounterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGopdPharmacyCounterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGopdPharmacyCounterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
