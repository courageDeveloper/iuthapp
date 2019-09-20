import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryPosComponent } from './laboratory-pos.component';

describe('LaboratoryPosComponent', () => {
  let component: LaboratoryPosComponent;
  let fixture: ComponentFixture<LaboratoryPosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaboratoryPosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaboratoryPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
