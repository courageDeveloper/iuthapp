import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLaboratoryCounterProductComponent } from './add-laboratory-counterproduct.component'

describe('AddLaboratoryCounterProductComponent', () => {
  let component: AddLaboratoryCounterProductComponent;
  let fixture: ComponentFixture<AddLaboratoryCounterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLaboratoryCounterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLaboratoryCounterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
