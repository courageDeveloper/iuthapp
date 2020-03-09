import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugNotificationsComponent } from './drugnotifications.component';

describe('DrugNotificationsComponent', () => {
  let component: DrugNotificationsComponent;
  let fixture: ComponentFixture<DrugNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
