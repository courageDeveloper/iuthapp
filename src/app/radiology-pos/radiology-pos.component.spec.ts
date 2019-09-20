import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyPosComponent } from './radiology-pos.component';

describe('RadiologyPosComponent', () => {
  let component: RadiologyPosComponent;
  let fixture: ComponentFixture<RadiologyPosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyPosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
