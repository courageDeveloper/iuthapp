import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPharmacyStoreCategoryComponent } from './view-pharmacystorecategory.component';

describe('ViewPharmacyStoreCategoryComponent', () => {
  let component: ViewPharmacyStoreCategoryComponent;
  let fixture: ComponentFixture<ViewPharmacyStoreCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPharmacyStoreCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPharmacyStoreCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
