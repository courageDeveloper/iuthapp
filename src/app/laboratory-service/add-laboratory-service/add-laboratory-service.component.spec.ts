import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLaboratoryServiceComponent } from './add-laboratory-service.component'

describe('AddLaboratoryServiceComponent', () => {
  let component: AddLaboratoryServiceComponent;
  let fixture: ComponentFixture<AddLaboratoryServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLaboratoryServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLaboratoryServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
