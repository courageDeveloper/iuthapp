import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRadiologyServiceComponent } from './add-radiology-service.component'

describe('AddRadiologyServiceComponent', () => {
  let component: AddRadiologyServiceComponent;
  let fixture: ComponentFixture<AddRadiologyServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRadiologyServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRadiologyServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
