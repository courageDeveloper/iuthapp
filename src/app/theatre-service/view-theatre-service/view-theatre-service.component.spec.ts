import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTheatreServiceComponent } from './view-theatre-service.component';

describe('ViewTheatreServiceComponent', () => {
  let component: ViewTheatreServiceComponent;
  let fixture: ComponentFixture<ViewTheatreServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTheatreServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTheatreServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
