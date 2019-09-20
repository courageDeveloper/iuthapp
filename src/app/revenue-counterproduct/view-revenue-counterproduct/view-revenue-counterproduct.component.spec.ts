import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRevenueCounterProductComponent } from './view-revenue-counterproduct.component';

describe('ViewRevenueCounterProductComponent', () => {
  let component: ViewRevenueCounterProductComponent;
  let fixture: ComponentFixture<ViewRevenueCounterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRevenueCounterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRevenueCounterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
