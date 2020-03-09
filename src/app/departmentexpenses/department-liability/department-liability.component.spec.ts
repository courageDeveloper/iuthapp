import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentLiabilityComponent } from './department-liability.component';

describe('DepartmentLiabilityComponent', () => {
  let component: DepartmentLiabilityComponent;
  let fixture: ComponentFixture<DepartmentLiabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentLiabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentLiabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
