import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountCounterProductComponent } from './add-account-counterproduct.component'

describe('AddAccountCounterProductComponent', () => {
  let component: AddAccountCounterProductComponent;
  let fixture: ComponentFixture<AddAccountCounterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAccountCounterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccountCounterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
