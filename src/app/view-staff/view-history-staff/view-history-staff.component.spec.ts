import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHistoryStaffComponent } from './view-history-staff.component';

describe('ViewHistoryStaffComponent', () => {
  let component: ViewHistoryStaffComponent;
  let fixture: ComponentFixture<ViewHistoryStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHistoryStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHistoryStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
