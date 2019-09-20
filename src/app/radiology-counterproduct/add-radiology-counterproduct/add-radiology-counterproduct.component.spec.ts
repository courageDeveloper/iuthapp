import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRadiologyCounterProductComponent } from './add-radiology-counterproduct.component'

describe('AddRadiologyCounterProductComponent', () => {
  let component: AddRadiologyCounterProductComponent;
  let fixture: ComponentFixture<AddRadiologyCounterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRadiologyCounterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRadiologyCounterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
