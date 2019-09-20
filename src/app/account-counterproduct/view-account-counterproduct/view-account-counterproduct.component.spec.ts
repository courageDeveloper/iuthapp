import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccountCounterProductComponent } from './view-account-counterproduct.component';

describe('ViewAccountCounterProductComponent', () => {
  let component: ViewAccountCounterProductComponent;
  let fixture: ComponentFixture<ViewAccountCounterProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAccountCounterProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAccountCounterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
