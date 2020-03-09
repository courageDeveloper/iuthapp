import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugquantityNotificationsComponent } from './drugquantitynotifications.component';

describe('DrugquantityNotificationsComponent', () => {
  let component: DrugquantityNotificationsComponent;
  let fixture: ComponentFixture<DrugquantityNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugquantityNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugquantityNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
