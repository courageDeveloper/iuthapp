import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRevenueCounterProductComponent } from './add-revenue-counterproduct.component'

describe('AddRevenueCounterProductComponent', () => {
  let component: AddRevenueCounterProductComponent;
  let fixture: ComponentFixture<AddRevenueCounterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRevenueCounterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRevenueCounterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
