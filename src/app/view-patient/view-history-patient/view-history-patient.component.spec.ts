import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHistoryPatientComponent } from './view-history-patient.component';

describe('ViewHistoryPatientComponent', () => {
  let component: ViewHistoryPatientComponent;
  let fixture: ComponentFixture<ViewHistoryPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHistoryPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHistoryPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
