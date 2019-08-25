import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTheatreServiceComponent } from './add-theatre-service.component'

describe('AddTheatreServiceComponent', () => {
  let component: AddTheatreServiceComponent;
  let fixture: ComponentFixture<AddTheatreServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTheatreServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTheatreServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
