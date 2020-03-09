import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHistoryDepartmentComponent } from './view-history-department.component';

describe('ViewHistoryDepartmentComponent', () => {
  let component: ViewHistoryDepartmentComponent;
  let fixture: ComponentFixture<ViewHistoryDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHistoryDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHistoryDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
