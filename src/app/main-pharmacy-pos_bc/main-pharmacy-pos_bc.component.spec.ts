import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPharmacyPosBcComponent } from './main-pharmacy-pos_bc.component';

describe('MainPharmacyPosBcComponent', () => {
  let component: MainPharmacyPosBcComponent;
  let fixture: ComponentFixture<MainPharmacyPosBcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainPharmacyPosBcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPharmacyPosBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
