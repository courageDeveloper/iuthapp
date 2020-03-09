import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentExpensesComponent } from './department-expenses.component';

describe('DepartmentExpensesComponent', () => {
  let component: DepartmentExpensesComponent;
  let fixture: ComponentFixture<DepartmentExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
