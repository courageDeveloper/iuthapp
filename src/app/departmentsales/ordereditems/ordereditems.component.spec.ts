import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderedItemsComponent } from './ordereditems.component';

describe('OrderedItemsComponent', () => {
  let component: OrderedItemsComponent;
  let fixture: ComponentFixture<OrderedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderedItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
