import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPharmacyStoreComponent } from './view-pharmacystore.component';

describe('ViewPharmacyStoreComponent', () => {
  let component: ViewPharmacyStoreComponent;
  let fixture: ComponentFixture<ViewPharmacyStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPharmacyStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPharmacyStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
