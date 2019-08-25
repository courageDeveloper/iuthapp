import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPharmacyPosComponent } from './main-pharmacy-pos.component';

describe('MainPharmacyPosComponent', () => {
  let component: MainPharmacyPosComponent;
  let fixture: ComponentFixture<MainPharmacyPosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainPharmacyPosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPharmacyPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
