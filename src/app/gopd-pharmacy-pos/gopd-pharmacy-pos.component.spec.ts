import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GopdPharmacyPosComponent } from './gopd-pharmacy-pos.component';

describe('GopdPharmacyPosComponent', () => {
  let component: GopdPharmacyPosComponent;
  let fixture: ComponentFixture<GopdPharmacyPosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GopdPharmacyPosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GopdPharmacyPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
